from __future__ import annotations

from dataclasses import replace
from pathlib import Path

from tigrbl import TigrblApp
from tigrbl.engine import resolver as engine_resolver
from tigrbl.factories.app import defineAppSpec
from tigrbl_core._spec import AppSpec, EngineSpec
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
                    path=config.get("path"),
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


def _analytics_engine(analytics: Path) -> EngineSpec:
    return EngineSpec(
        kind="duckdb",
        name="analytics",
        mapping={
            "kind": "duckdb",
            "name": "analytics",
            "path": str(analytics),
            "mode": "native",
            "read_only": False,
        },
    )


def _build_sqlite_app(database: Path, analytics: Path) -> TigrblApp:
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
            engines=(_analytics_engine(analytics),),
        )
    )


def _build_postgres_app(settings: Settings, analytics: Path) -> TigrblApp:
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
                _analytics_engine(analytics),
            ),
        )
    )


def build_app(
    database_path: str | Path | None = None,
    analytics_path: str | Path | None = None,
) -> TigrblApp:
    # Tigrbl's engine inventory is process-global; app factories replace it.
    engine_resolver.reset()
    settings = Settings.from_environment()
    analytics = Path(analytics_path) if analytics_path else settings.analytics_path
    analytics.parent.mkdir(parents=True, exist_ok=True)

    if database_path is not None or settings.database_url.startswith("sqlite:///"):
        database = (
            Path(database_path)
            if database_path is not None
            else Path(settings.database_url.removeprefix("sqlite:///"))
        )
        catalog_app = _build_sqlite_app(database, analytics)
        database_kind = "sqlite-test"
    else:
        catalog_app = _build_postgres_app(settings, analytics)
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
