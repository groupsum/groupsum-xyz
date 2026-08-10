from __future__ import annotations

import sys
from dataclasses import replace
from pathlib import Path
from types import ModuleType

from tigrbl import TigrblApp
from tigrbl.engine import resolver as engine_resolver
from tigrbl.factories.app import defineAppSpec
from tigrbl_core._spec import AppSpec, EngineSpec

# The fixed Quack engine uses names from the next aligned Tigrbl release. The
# published packages expose the same contracts under their legacy names.
try:
    from tigrbl_base._base import EngineSessionBase  # noqa: F401
except ImportError:
    import tigrbl_base._base as base_compat
    from tigrbl_base._base import TigrblSessionBase

    base_compat.EngineSessionBase = TigrblSessionBase

try:
    import tigrbl_core._spec.engine_session_spec  # noqa: F401
except ModuleNotFoundError:
    from tigrbl_core._spec.session_spec import SessionSpec

    spec_compat = ModuleType("tigrbl_core._spec.engine_session_spec")
    spec_compat.EngineSessionSpec = SessionSpec
    sys.modules[spec_compat.__name__] = spec_compat

try:
    import tigrbl_concrete._concrete._engine_session  # noqa: F401
except ModuleNotFoundError:
    from tigrbl_concrete._concrete import wrap_sessionmaker

    session_compat = ModuleType("tigrbl_concrete._concrete._engine_session")
    session_compat.wrap_sessionmaker = wrap_sessionmaker
    sys.modules[session_compat.__name__] = session_compat

from tigrbl_engine_duckdb.plugin import register as register_duckdb_engine
from tigrbl_engine_postgres.plugin import register as register_postgres_engine

from .config import Settings
from .routes import mount_public_routes
from .tables.registry import ALL_TABLES

APP_TITLE = "Groupsum Catalog API"
APP_VERSION = "0.3.0"
APP_DESCRIPTION = "Read-only Tigrbl table API for the Groupsum public catalog."


class CatalogAppSpec(
    defineAppSpec(
        title=APP_TITLE,
        version=APP_VERSION,
        description=APP_DESCRIPTION,
    ),
    TigrblApp,
):
    pass


def _register_duckdb_compat() -> None:
    try:
        register_duckdb_engine()
    except TypeError:
        from tigrbl.engine.registry import register_engine
        from tigrbl_engine_duckdb.duck_builder import duckdb_capabilities, duckdb_engine

        class DuckDBRegistration:
            def build(self, *, mapping, spec, dsn):
                config = dict(mapping or {})
                return duckdb_engine(
                    path=config.get("path") or dsn,
                    read_only=bool(config.get("read_only", False)),
                    threads=config.get("threads"),
                    pragmas=config.get("pragmas"),
                    mapping=config,
                    spec=spec,
                    dsn=dsn,
                )

            def capabilities(self, *, spec, mapping=None):
                return duckdb_capabilities()

        register_engine("duckdb", DuckDBRegistration())


def _analytics_engine(
    analytics_dsn: str,
    *,
    token: str | None = None,
    disable_ssl: bool = False,
) -> EngineSpec:
    mapping: dict[str, object] = {"mode": "native"}
    if analytics_dsn.lower().startswith("quack:"):
        mapping.update(
            {
                "catalog": "analytics",
                "disable_ssl": disable_ssl,
            }
        )
        if token:
            mapping["token"] = token
    return EngineSpec(
        kind="duckdb",
        name="analytics",
        dsn=analytics_dsn,
        mapping=mapping,
    )


def _build_sqlite_app(
    database: Path,
    analytics_dsn: str,
    *,
    token: str | None = None,
    disable_ssl: bool = False,
) -> TigrblApp:
    database.parent.mkdir(parents=True, exist_ok=True)
    _register_duckdb_compat()
    return TigrblApp.from_spec(
        replace(
            AppSpec.collect(CatalogAppSpec),
            engine=EngineSpec(
                kind="sqlite",
                name="catalog",
                path=str(database),
                mapping={"kind": "sqlite", "name": "catalog", "path": str(database)},
            ),
            engines=(
                _analytics_engine(
                    analytics_dsn,
                    token=token,
                    disable_ssl=disable_ssl,
                ),
            ),
        )
    )


def _build_postgres_app(settings: Settings) -> TigrblApp:
    register_postgres_engine()
    _register_duckdb_compat()
    return TigrblApp.from_spec(
        replace(
            AppSpec.collect(CatalogAppSpec),
            engine=EngineSpec(
                kind="postgres",
                name="postgres",
                dsn=settings.database_url,
                mapping={"kind": "postgres", "dsn": settings.database_url, "async": False},
            ),
            engines=(
                _analytics_engine(
                    settings.analytics_dsn,
                    token=settings.analytics_token,
                    disable_ssl=settings.analytics_disable_ssl,
                ),
            ),
        )
    )


def build_app(
    database_path: str | Path | None = None,
    analytics_dsn: str | Path | None = None,
) -> TigrblApp:
    # Tigrbl's engine inventory is process-global; app factories replace it.
    engine_resolver.reset()
    settings = Settings.from_environment()
    analytics = str(analytics_dsn) if analytics_dsn is not None else settings.analytics_dsn
    if not analytics.lower().startswith("quack:"):
        Path(analytics).parent.mkdir(parents=True, exist_ok=True)

    if database_path is not None or settings.database_url.startswith("sqlite:///"):
        database = (
            Path(database_path)
            if database_path is not None
            else Path(settings.database_url.removeprefix("sqlite:///"))
        )
        catalog_app = _build_sqlite_app(
            database,
            analytics,
            token=settings.analytics_token,
            disable_ssl=settings.analytics_disable_ssl,
        )
        database_kind = "sqlite-test"
    else:
        catalog_app = _build_postgres_app(settings)
        database_kind = "postgres"

    for table in ALL_TABLES:
        catalog_app.include_table(table)
        engine_name = getattr(table, "ENGINE_NAME", None)
        if engine_name:
            engine_resolver.register_table_engine_name(table, engine_name)
    catalog_app.initialize()
    catalog_app.mount_openapi(path="/openapi.json")
    mount_public_routes(
        catalog_app,
        database_kind=database_kind,
        schema_table_count=len(ALL_TABLES),
    )

    return catalog_app


app = build_app()
