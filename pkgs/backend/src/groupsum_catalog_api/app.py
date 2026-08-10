from __future__ import annotations

from dataclasses import replace
from pathlib import Path

from tigrbl import TigrblApp
from tigrbl.engine import resolver as engine_resolver
from tigrbl.factories.app import defineAppSpec
from tigrbl_core._spec import AppSpec, EngineSpec

from .config import Settings
from .internal_api import INTERNAL_API_ROUTER
from .public_api import PUBLIC_API_ROUTER, analytics_readiness
from .tables.registry import ALL_TABLES

APP_TITLE = "Groupsum Catalog API"
APP_VERSION = "0.4.0"
APP_DESCRIPTION = "Tigrbl catalog API with curated public reads and internal append-only writes."


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
            routers=(PUBLIC_API_ROUTER, INTERNAL_API_ROUTER),
        )
    )
    catalog_app.initialize()
    catalog_app.mount_openapi(path="/openapi.json")

    async def catalog_healthz():
        from tigrbl import JSONResponse

        try:
            analytics_status = await analytics_readiness()
        except Exception as exc:  # pragma: no cover - deployment readiness boundary
            return JSONResponse(
                {
                    "status": "starting",
                    "database": database_kind,
                    "analytics": {"status": "starting", "detail": str(exc)},
                    "schema_tables": len(ALL_TABLES),
                },
                status_code=503,
                headers={"Cache-Control": "no-store"},
            )
        return JSONResponse(
            {
                "status": "ok",
                "database": database_kind,
                "analytics": analytics_status,
                "schema_tables": len(ALL_TABLES),
            },
            headers={"Cache-Control": "no-store"},
        )

    catalog_app.add_route(
        "/healthz",
        catalog_healthz,
        methods=["GET"],
        summary="Catalog API health",
    )

    return catalog_app


app = build_app()
