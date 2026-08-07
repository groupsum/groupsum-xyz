from __future__ import annotations

from dataclasses import replace
from pathlib import Path

from tigrbl import JSONResponse, TigrblApp
from tigrbl.factories.app import defineAppSpec
from tigrbl.factories.engine import sqlitef
from tigrbl_core._spec import AppSpec, EngineSpec
from tigrbl_engine_duckdb.plugin import register as register_duckdb_engine
from tigrbl_engine_postgres.plugin import register as register_postgres_engine

from .config import Settings
from .tables.registry import ALL_TABLES


class CatalogAppSpec(
    defineAppSpec(
        title="Groupsum Catalog API",
        version="0.3.0",
        description="Read-only Tigrbl table API for the Groupsum public catalog.",
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
                return duckdb_engine(mapping=mapping, spec=spec, dsn=dsn)

            def capabilities(self, *, spec, mapping=None):
                return duckdb_capabilities()

        register_engine("duckdb", DuckDBRegistration())


def build_app(
    database_path: str | Path | None = None,
    analytics_path: str | Path | None = None,
) -> TigrblApp:
    settings = Settings.from_environment()
    analytics = Path(analytics_path) if analytics_path else settings.analytics_path
    analytics.parent.mkdir(parents=True, exist_ok=True)

    if database_path is not None or settings.database_url.startswith("sqlite:///"):
        database = (
            Path(database_path)
            if database_path is not None
            else Path(settings.database_url.removeprefix("sqlite:///"))
        )
        database.parent.mkdir(parents=True, exist_ok=True)
        catalog_app = TigrblApp(
            title="Groupsum Catalog API",
            version="0.3.0",
            description="Read-only Tigrbl table API for the Groupsum public catalog.",
            engine=sqlitef(str(database), async_=False),
            mount_system=False,
        )
        database_kind = "sqlite-test"
    else:
        register_postgres_engine()
        _register_duckdb_compat()
        catalog_app = TigrblApp.from_spec(
            replace(
                AppSpec.collect(CatalogAppSpec),
                engine=EngineSpec(
                    kind="postgres",
                    name="postgres",
                    dsn=settings.database_url,
                    mapping={"kind": "postgres", "dsn": settings.database_url, "async": False},
                ),
                engines=(
                    EngineSpec(
                        kind="duckdb",
                        name="analytics",
                        mapping={
                            "kind": "duckdb",
                            "name": "analytics",
                            "path": str(analytics),
                            "mode": "native",
                            "read_only": False,
                        },
                    ),
                ),
            )
        )
        database_kind = "postgres"

    for table in ALL_TABLES:
        catalog_app.include_table(table)
    catalog_app.initialize()
    catalog_app.mount_openapi(path="/openapi.json")

    @catalog_app.get("/healthz", summary="Catalog API health")
    def healthz() -> JSONResponse:
        return JSONResponse(
            {
                "status": "ok",
                "database": database_kind,
                "analytics": "duckdb",
                "schema_tables": len(ALL_TABLES),
            },
            headers={"Cache-Control": "no-store"},
        )

    return catalog_app


app = build_app()
