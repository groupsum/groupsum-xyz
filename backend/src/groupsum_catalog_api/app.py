from __future__ import annotations

from pathlib import Path

from tigrbl import JSONResponse, Request, TigrblApp
from tigrbl.factories.engine import sqlitef

from .config import Settings
from .migrations import migrate
from .page_models import (
    insight_collection,
    organization_detail,
    record_collection,
    record_detail,
    repository_metric_snapshot,
)
from .tables import ALL_TABLES


def build_app(database_path: str | Path | None = None) -> TigrblApp:
    settings = Settings.from_environment()
    path = Path(database_path) if database_path is not None else settings.database_path
    path.parent.mkdir(parents=True, exist_ok=True)

    catalog_app = TigrblApp(
        title="Groupsum Catalog API",
        version="0.1.0",
        description=(
            "Durable normalized implementation evidence and composed website content "
            "for groupsum.xyz."
        ),
        engine=sqlitef(str(path), async_=False),
        mount_system=False,
    )
    for table in ALL_TABLES:
        catalog_app.include_table(table)
    catalog_app.initialize()
    migrate(path)
    catalog_app.mount_openapi(path="/openapi.json")

    @catalog_app.get("/healthz", summary="Catalog API health")
    def healthz() -> JSONResponse:
        return JSONResponse(
            {"status": "ok", "database": "sqlite", "schema_tables": len(ALL_TABLES)},
            headers={"Cache-Control": "no-store"},
        )

    @catalog_app.get("/api/v1/products", summary="Product collection page model")
    def products(request: Request):
        return record_collection(path, request, "product")

    @catalog_app.get("/api/v1/products/{slug}", summary="Product record page model")
    def product(request: Request, slug: str):
        return record_detail(path, request, slug, "product")

    @catalog_app.get("/api/v1/portfolio", summary="Portfolio collection page model")
    def portfolio(request: Request):
        return record_collection(path, request, "portfolio")

    @catalog_app.get("/api/v1/portfolio/{slug}", summary="Portfolio record page model")
    def portfolio_record(request: Request, slug: str):
        return record_detail(path, request, slug, "portfolio")

    @catalog_app.get("/api/v1/solutions", summary="Solution collection page model")
    def solutions(request: Request):
        return record_collection(path, request, "solution")

    @catalog_app.get("/api/v1/solutions/{slug}", summary="Solution record page model")
    def solution(request: Request, slug: str):
        return record_detail(path, request, slug, "solution")

    @catalog_app.get("/api/v1/services", summary="Service collection page model")
    def services(request: Request):
        return record_collection(path, request, "service")

    @catalog_app.get("/api/v1/services/{slug}", summary="Service record page model")
    def service(request: Request, slug: str):
        return record_detail(path, request, slug, "service")

    @catalog_app.get("/api/v1/insights", summary="Insight collection page model")
    def insights(request: Request, q: str = "", page: int = 1, page_size: int = 20):
        return insight_collection(path, request, q, page, page_size)

    @catalog_app.get("/api/v1/insights/{slug}", summary="Insight record page model")
    def insight(request: Request, slug: str):
        return record_detail(path, request, slug, "insight")

    @catalog_app.get("/api/v1/organizations/{slug}", summary="Organization record page model")
    def organization(request: Request, slug: str):
        return organization_detail(path, request, slug)

    @catalog_app.get(
        "/api/v1/repository-metrics",
        summary="Persisted repository metric histories",
    )
    def repository_metrics(request: Request, owner: str = ""):
        requested_owner = request.query_params.get("owner", owner)
        return repository_metric_snapshot(path, request, requested_owner)

    return catalog_app


app = build_app()
