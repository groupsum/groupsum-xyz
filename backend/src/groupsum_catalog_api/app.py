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
from .migrations import migrate
from .page_models import (
    catalog_collection,
    catalog_overview,
    catalog_repository_detail,
    catalog_resource_detail,
    catalog_technology_detail,
    entity_collection,
    entity_detail,
    insight_collection,
    organization_detail,
    record_collection,
    record_detail,
    repository_metric_snapshot,
)
from .tables import ALL_TABLES


class CatalogAppSpec(
    defineAppSpec(
        title="Groupsum Catalog API",
        version="0.2.0",
        description=(
            "PostgreSQL system of record and DuckDB analytical metrics for groupsum.xyz."
        ),
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

    @catalog_app.get("/api/v1/products", summary="Product collection page model")
    def products(request: Request):
        return record_collection(database, request, "product")

    @catalog_app.get("/api/v1/products/{slug}", summary="Product record page model")
    def product(request: Request, slug: str):
        return record_detail(database, request, slug, "product")

    @catalog_app.get("/api/v1/portfolio", summary="Portfolio collection page model")
    def portfolio(request: Request):
        return record_collection(database, request, "portfolio")

    @catalog_app.get("/api/v1/portfolio/{slug}", summary="Portfolio record page model")
    def portfolio_record(request: Request, slug: str):
        return record_detail(database, request, slug, "portfolio")

    @catalog_app.get("/api/v1/solutions", summary="Solution collection page model")
    def solutions(request: Request):
        return record_collection(database, request, "solution")

    @catalog_app.get("/api/v1/solutions/{slug}", summary="Solution record page model")
    def solution(request: Request, slug: str):
        return record_detail(database, request, slug, "solution")

    @catalog_app.get("/api/v1/services", summary="Service collection page model")
    def services(request: Request):
        return record_collection(database, request, "service")

    @catalog_app.get("/api/v1/services/{slug}", summary="Service record page model")
    def service(request: Request, slug: str):
        return record_detail(database, request, slug, "service")

    @catalog_app.get("/api/v1/insights", summary="Insight collection page model")
    def insights(request: Request, q: str = "", page: int = 1, page_size: int = 20):
        return insight_collection(database, request, q, page, page_size)

    @catalog_app.get("/api/v1/insights/{slug}", summary="Insight record page model")
    def insight(request: Request, slug: str):
        return record_detail(database, request, slug, "insight")

    @catalog_app.get("/api/v1/organizations/{slug}", summary="Organization record page model")
    def organization(request: Request, slug: str):
        return organization_detail(database, request, slug)

    @catalog_app.get("/api/v1/entities", summary="Canonical catalog entity collection")
    def entities(
        request: Request,
        entity_type: str = "",
        q: str = "",
        page: int = 1,
        page_size: int = 50,
    ):
        requested_type = request.query_params.get("entity_type", entity_type)
        requested_query = request.query_params.get("q", q)
        try:
            requested_page = int(request.query_params.get("page", page))
            requested_page_size = int(request.query_params.get("page_size", page_size))
        except (TypeError, ValueError):
            requested_page, requested_page_size = page, page_size
        return entity_collection(
            database,
            request,
            requested_type,
            requested_query,
            requested_page,
            requested_page_size,
        )

    @catalog_app.get("/api/v1/entities/{entity_id}", summary="Canonical catalog entity graph")
    def entity(request: Request, entity_id: str):
        return entity_detail(database, request, entity_id)

    @catalog_app.get(
        "/api/v1/repository-metrics",
        summary="Persisted repository metric histories",
    )
    def repository_metrics(request: Request, owner: str = ""):
        requested_owner = request.query_params.get("owner", owner)
        return repository_metric_snapshot(database, request, requested_owner)

    @catalog_app.get(
        "/api/v1/catalog", summary="Catalog overview page model"
    )
    def catalog(request: Request):
        return catalog_overview(database, request)

    @catalog_app.get(
        "/api/v1/catalog/repositories", summary="Repository catalog collection"
    )
    def catalog_repositories(request: Request):
        return catalog_collection(database, request, "repository")

    @catalog_app.get(
        "/api/v1/catalog/repositories/{owner}/{repository}",
        summary="Repository catalog member record",
    )
    def catalog_repository(request: Request, owner: str, repository: str):
        return catalog_repository_detail(database, request, owner, repository)

    @catalog_app.get(
        "/api/v1/catalog/packages", summary="Package catalog collection"
    )
    def catalog_packages(request: Request):
        return catalog_collection(database, request, "package")

    @catalog_app.get(
        "/api/v1/catalog/packages/{route_key}", summary="Package catalog resource record"
    )
    def catalog_package(request: Request, route_key: str):
        return catalog_resource_detail(database, request, "package", route_key)

    @catalog_app.get(
        "/api/v1/catalog/releases/{route_key}", summary="Release catalog resource record"
    )
    def catalog_release(request: Request, route_key: str):
        return catalog_resource_detail(database, request, "release", route_key)

    @catalog_app.get(
        "/api/v1/catalog/resources", summary="Typed resource catalog collection"
    )
    def catalog_resources(request: Request):
        return catalog_collection(database, request, "resource")

    @catalog_app.get(
        "/api/v1/catalog/resources/{route_key}", summary="Typed catalog resource record"
    )
    def catalog_resource(request: Request, route_key: str):
        return catalog_resource_detail(database, request, "resource", route_key)

    @catalog_app.get(
        "/api/v1/catalog/technologies", summary="Technology catalog collection"
    )
    def catalog_technologies(request: Request):
        return catalog_collection(database, request, "technology")

    @catalog_app.get(
        "/api/v1/catalog/technologies/{slug}", summary="Technology catalog member record"
    )
    def catalog_technology(request: Request, slug: str):
        return catalog_technology_detail(database, request, slug)

    return catalog_app


app = build_app()
