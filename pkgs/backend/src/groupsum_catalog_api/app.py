from __future__ import annotations

from dataclasses import replace
from pathlib import Path

from tigrbl import JSONResponse, Request, TigrblApp
from tigrbl.factories.app import defineAppSpec
from tigrbl.factories.engine import sqlitef
from tigrbl_core._spec import AppSpec, EngineSpec
from tigrbl_engine_duckdb.plugin import register as register_duckdb_engine
from tigrbl_engine_postgres.plugin import register as register_postgres_engine

from .config import Settings
from .tables.association import Association
from .tables.organization import Organization
from .tables.package import Package
from .tables.portfolio import Portfolio
from .tables.product import Product
from .tables.registry import ALL_TABLES
from .tables.repository import Repository
from .tables.technology import Technology


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

    async def invoke(table, operation: str, request: Request, **values):
        result = await getattr(table.handlers, operation).invoke(
            {"payload": {"request": request, **values}}
        )
        if isinstance(result, dict) and set(result) == {"detail"}:
            return JSONResponse(result, status_code=404)
        return result

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

    @catalog_app.get("/api/v1/products")
    async def products(request: Request):
        return await invoke(Product, "record_collection", request, record_type="product")

    @catalog_app.get("/api/v1/products/{slug}")
    async def product(request: Request, slug: str):
        return await invoke(Product, "record_detail", request, slug=slug, record_type="product")

    @catalog_app.get("/api/v1/portfolio")
    async def portfolios(request: Request):
        return await invoke(Portfolio, "record_collection", request, record_type="portfolio")

    @catalog_app.get("/api/v1/portfolio/{slug}")
    async def portfolio(request: Request, slug: str):
        return await invoke(Portfolio, "record_detail", request, slug=slug, record_type="portfolio")

    @catalog_app.get("/api/v1/solutions")
    async def solutions(request: Request):
        return await invoke(Product, "record_collection", request, record_type="solution")

    @catalog_app.get("/api/v1/solutions/{slug}")
    async def solution(request: Request, slug: str):
        return await invoke(Product, "record_detail", request, slug=slug, record_type="solution")

    @catalog_app.get("/api/v1/services")
    async def services(request: Request):
        return await invoke(Product, "record_collection", request, record_type="service")

    @catalog_app.get("/api/v1/services/{slug}")
    async def service(request: Request, slug: str):
        return await invoke(Product, "record_detail", request, slug=slug, record_type="service")

    @catalog_app.get("/api/v1/insights")
    async def insights(request: Request):
        return await invoke(Association, "insight_collection", request)

    @catalog_app.get("/api/v1/organizations/{slug}")
    async def organization(request: Request, slug: str):
        return await invoke(Organization, "organization_detail", request, slug=slug)

    @catalog_app.get("/api/v1/entities")
    async def entities(request: Request):
        return await invoke(Association, "entity_collection", request)

    @catalog_app.get("/api/v1/entities/{entity_type}/{entity_id}")
    async def entity(request: Request, entity_type: str, entity_id: str):
        return await invoke(
            Association,
            "entity_detail",
            request,
            entity_type=entity_type,
            entity_id=entity_id,
        )

    @catalog_app.get("/api/v1/repository-metrics")
    async def repository_metrics(request: Request):
        return await invoke(Repository, "repository_metrics", request)

    @catalog_app.get("/api/v1/catalog")
    async def catalog(request: Request):
        return await invoke(Association, "catalog_overview", request)

    @catalog_app.get("/api/v1/catalog/repositories")
    async def catalog_repositories(request: Request):
        return await invoke(Repository, "repository_collection", request)

    @catalog_app.get("/api/v1/catalog/repositories/{owner}/{repository}")
    async def catalog_repository(request: Request, owner: str, repository: str):
        return await invoke(
            Repository, "repository_detail", request, owner=owner, repository=repository
        )

    @catalog_app.get("/api/v1/catalog/packages")
    async def catalog_packages(request: Request):
        return await invoke(Package, "package_collection", request)

    @catalog_app.get("/api/v1/catalog/packages/{route_key}")
    async def catalog_package(request: Request, route_key: str):
        return await invoke(Package, "package_detail", request, route_key=route_key)

    @catalog_app.get("/api/v1/catalog/releases/{route_key}")
    async def catalog_release(request: Request, route_key: str):
        return await invoke(
            Association, "resource_detail", request, kind="release", route_key=route_key
        )

    @catalog_app.get("/api/v1/catalog/resources")
    async def catalog_resources(request: Request):
        return await invoke(Association, "resource_collection", request)

    @catalog_app.get("/api/v1/catalog/resources/{resource_type}/{route_key}")
    async def catalog_resource(request: Request, resource_type: str, route_key: str):
        return await invoke(
            Association,
            "resource_detail",
            request,
            entity_type=resource_type,
            route_key=route_key,
        )

    @catalog_app.get("/api/v1/catalog/technologies")
    async def catalog_technologies(request: Request):
        return await invoke(Technology, "technology_collection", request)

    @catalog_app.get("/api/v1/catalog/technologies/{slug}")
    async def catalog_technology(request: Request, slug: str):
        return await invoke(Technology, "technology_detail", request, slug=slug)

    return catalog_app


app = build_app()
