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
from .domain import import_ops as _import_ops  # noqa: F401
from .domain import read_ops as _read_ops  # noqa: F401
from .domain.organizations.tables import Organization
from .domain.packages.tables import Package
from .domain.records.tables import Record
from .domain.registry import ALL_TABLES
from .domain.repositories.tables import Repository
from .domain.resources.tables import CatalogEntity, Resource, ResourceType
from .migrations import migrate
from .schemas.catalog import CatalogCollection, CatalogMember, CatalogOverview


class CatalogAppSpec(
    defineAppSpec(
        title="Groupsum Catalog API",
        version="0.2.0",
        description=("PostgreSQL system of record and DuckDB analytical metrics for groupsum.xyz."),
    ),
    TigrblApp,
):
    pass


def _register_duckdb_compat() -> None:
    """Register DuckDB across the current Tigrbl plugin/core API boundary."""
    try:
        register_duckdb_engine()
    except TypeError:
        from tigrbl.engine.registry import register_engine
        from tigrbl_engine_duckdb.duck_builder import (
            duckdb_capabilities,
            duckdb_engine,
        )

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
        database: str | Path = (
            Path(database_path)
            if database_path is not None
            else Path(settings.database_url.removeprefix("sqlite:///"))
        )
        Path(database).parent.mkdir(parents=True, exist_ok=True)
        catalog_app = TigrblApp(
            title="Groupsum Catalog API",
            version="0.2.0",
            description="SQLite test fixture with DuckDB analytical metrics.",
            engine=sqlitef(str(database), async_=False),
            mount_system=False,
        )
        database_kind = "sqlite-test"
    else:
        register_postgres_engine()
        _register_duckdb_compat()
        database = settings.database_url
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
    if isinstance(database, Path):
        migrate(database)
    catalog_app.mount_openapi(path="/openapi.json")

    async def invoke(table, operation: str, request: Request, **payload):
        handler = getattr(table.handlers, operation)
        return await handler.invoke(
            {"payload": {"database": database, "request": request, **payload}}
        )

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

    @catalog_app.get("/api/v1/products", summary="Product collection resource representation")
    async def products(request: Request):
        return await invoke(Record, "record_collection", request, record_type="product")

    @catalog_app.get("/api/v1/products/{slug}", summary="Product record resource representation")
    async def product(request: Request, slug: str):
        return await invoke(Record, "record_detail", request, slug=slug, record_type="product")

    @catalog_app.get("/api/v1/portfolio", summary="Portfolio collection resource representation")
    async def portfolio(request: Request):
        return await invoke(Record, "record_collection", request, record_type="portfolio")

    @catalog_app.get("/api/v1/portfolio/{slug}", summary="Portfolio record resource representation")
    async def portfolio_record(request: Request, slug: str):
        return await invoke(Record, "record_detail", request, slug=slug, record_type="portfolio")

    @catalog_app.get("/api/v1/solutions", summary="Solution collection resource representation")
    async def solutions(request: Request):
        return await invoke(Record, "record_collection", request, record_type="solution")

    @catalog_app.get("/api/v1/solutions/{slug}", summary="Solution record resource representation")
    async def solution(request: Request, slug: str):
        return await invoke(Record, "record_detail", request, slug=slug, record_type="solution")

    @catalog_app.get("/api/v1/services", summary="Service collection resource representation")
    async def services(request: Request):
        return await invoke(Record, "record_collection", request, record_type="service")

    @catalog_app.get("/api/v1/services/{slug}", summary="Service record resource representation")
    async def service(request: Request, slug: str):
        return await invoke(Record, "record_detail", request, slug=slug, record_type="service")

    @catalog_app.get("/api/v1/insights", summary="Insight collection resource representation")
    async def insights(request: Request, q: str = "", page: int = 1, page_size: int = 20):
        return await invoke(Record, "insight_collection", request)

    @catalog_app.get("/api/v1/insights/{slug}", summary="Insight record resource representation")
    async def insight(request: Request, slug: str):
        return await invoke(Record, "record_detail", request, slug=slug, record_type="insight")

    @catalog_app.get(
        "/api/v1/organizations/{slug}", summary="Organization record resource representation"
    )
    async def organization(request: Request, slug: str):
        return await invoke(Organization, "organization_detail", request, slug=slug)

    @catalog_app.get("/api/v1/entities", summary="Canonical catalog entity collection")
    async def entities(
        request: Request,
        entity_type: str = "",
        q: str = "",
        page: int = 1,
        page_size: int = 50,
    ):
        return await invoke(CatalogEntity, "entity_collection", request)

    @catalog_app.get("/api/v1/entities/{entity_id}", summary="Canonical catalog entity graph")
    async def entity(request: Request, entity_id: str):
        return await invoke(CatalogEntity, "entity_detail", request, entity_id=entity_id)

    @catalog_app.get(
        "/api/v1/repository-metrics",
        summary="Persisted repository metric histories",
    )
    async def repository_metrics(request: Request, owner: str = ""):
        return await invoke(Repository, "repository_metrics", request)

    @catalog_app.get(
        "/api/v1/catalog",
        summary="Catalog overview resource representation",
        response_model=CatalogOverview,
    )
    async def catalog(request: Request):
        return await invoke(CatalogEntity, "catalog_overview", request)

    @catalog_app.get(
        "/api/v1/catalog/repositories",
        summary="Repository catalog collection",
        response_model=CatalogCollection,
    )
    async def catalog_repositories(
        request: Request,
        page: int = 1,
        page_size: int = 50,
        q: str = "",
        owner: str = "",
        sort: str = "name",
    ):
        return await invoke(Repository, "repository_collection", request)

    @catalog_app.get(
        "/api/v1/catalog/repositories/{owner}/{repository}",
        summary="Repository catalog member record",
        response_model=CatalogMember,
    )
    async def catalog_repository(request: Request, owner: str, repository: str):
        return await invoke(
            Repository, "repository_detail", request, owner=owner, repository=repository
        )

    @catalog_app.get(
        "/api/v1/catalog/packages",
        summary="Package catalog collection",
        response_model=CatalogCollection,
    )
    async def catalog_packages(
        request: Request,
        page: int = 1,
        page_size: int = 50,
        q: str = "",
        ecosystem: str = "",
        publication_status: str = "",
        sort: str = "name",
    ):
        return await invoke(Package, "package_collection", request)

    @catalog_app.get(
        "/api/v1/catalog/packages/{route_key}",
        summary="Package catalog resource record",
        response_model=CatalogMember,
    )
    async def catalog_package(request: Request, route_key: str):
        return await invoke(Package, "package_detail", request, route_key=route_key)

    @catalog_app.get(
        "/api/v1/catalog/releases/{route_key}",
        summary="Release catalog resource record",
        response_model=CatalogMember,
    )
    async def catalog_release(request: Request, route_key: str):
        return await invoke(
            Resource, "resource_detail", request, kind="release", route_key=route_key
        )

    @catalog_app.get(
        "/api/v1/catalog/resources",
        summary="Typed resource catalog collection",
        response_model=CatalogCollection,
    )
    async def catalog_resources(
        request: Request,
        page: int = 1,
        page_size: int = 50,
        q: str = "",
        resource_type: str = "",
        repository_owner: str = "",
        sort: str = "name",
    ):
        return await invoke(Resource, "resource_collection", request)

    @catalog_app.get(
        "/api/v1/catalog/resources/{resource_type}/{route_key}",
        summary="Typed catalog resource record",
        response_model=CatalogMember,
    )
    async def typed_catalog_resource(request: Request, resource_type: str, route_key: str):
        return await invoke(
            Resource, "resource_detail", request, route_key=route_key, entity_type=resource_type
        )

    @catalog_app.get(
        "/api/v1/catalog/resources/{route_key}",
        summary="Legacy typed catalog resource record route",
        response_model=CatalogMember,
    )
    async def catalog_resource(request: Request, route_key: str):
        return await invoke(Resource, "resource_detail", request, route_key=route_key)

    @catalog_app.get(
        "/api/v1/catalog/technologies",
        summary="Technology catalog collection",
        response_model=CatalogCollection,
    )
    async def catalog_technologies(
        request: Request,
        page: int = 1,
        page_size: int = 50,
        q: str = "",
        sort: str = "name",
    ):
        return await invoke(ResourceType, "technology_collection", request)

    @catalog_app.get(
        "/api/v1/catalog/technologies/{slug}",
        summary="Technology catalog member record",
        response_model=CatalogMember,
    )
    async def catalog_technology(request: Request, slug: str):
        return await invoke(ResourceType, "technology_detail", request, slug=slug)

    return catalog_app


app = build_app()
