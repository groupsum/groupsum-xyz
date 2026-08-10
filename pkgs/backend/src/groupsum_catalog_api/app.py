from __future__ import annotations

from dataclasses import replace
from pathlib import Path

from tigrbl import TigrblApp
from tigrbl.engine import resolver as engine_resolver
from tigrbl.factories.app import defineAppSpec
from tigrbl_core._spec import AppSpec, EngineSpec

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


def _analytics_engine(
    analytics_dsn: str,
    *,
    token: str | None = None,
    disable_ssl: bool = False,
) -> EngineSpec:
    mapping: dict[str, object] = {}
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
        database.parent.mkdir(parents=True, exist_ok=True)
        catalog_engine = EngineSpec(
            kind="sqlite",
            name="catalog",
            path=str(database),
            mapping={"kind": "sqlite", "name": "catalog", "path": str(database)},
        )
        database_kind = "sqlite-test"
    else:
        catalog_engine = EngineSpec(
            kind="postgres",
            name="postgres",
            dsn=settings.database_url,
            mapping={"kind": "postgres", "dsn": settings.database_url, "async": False},
        )
        database_kind = "postgres"

    catalog_app = TigrblApp.from_spec(
        replace(
            AppSpec.collect(CatalogAppSpec),
            engine=catalog_engine,
            engines=(
                _analytics_engine(
                    analytics,
                    token=settings.analytics_token,
                    disable_ssl=settings.analytics_disable_ssl,
                ),
            ),
        )
    )

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
