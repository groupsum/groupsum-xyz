from __future__ import annotations

from collections.abc import Callable
from typing import Any

from tigrbl import JSONResponse, Request, TigrblApp

from .api_analytics import (
    analytics_overview,
    entity_metrics,
    entity_observations,
    snapshot_detail,
    snapshots,
)
from .api_analytics import (
    summary as analytics_summary,
)
from .tables.association import Association
from .tables.organization import Organization
from .tables.package import Package
from .tables.portfolio import Portfolio
from .tables.product import Product
from .tables.repository import Repository
from .tables.technology import Technology

Endpoint = Callable[..., Any]


async def _invoke(table: Any, operation: str, request: Request, **values: Any) -> Any:
    result = await getattr(table.handlers, operation).invoke(
        {"payload": {"request": request, **values}}
    )
    if isinstance(result, dict) and set(result) == {"detail"}:
        return JSONResponse(result, status_code=404)
    return result


def _named(endpoint: Endpoint, name: str) -> Endpoint:
    endpoint.__name__ = name
    endpoint.__qualname__ = name
    return endpoint


def _request_endpoint(name: str, table: Any, operation: str, **fixed: Any) -> Endpoint:
    async def endpoint(request: Request):
        return await _invoke(table, operation, request, **fixed)

    return _named(endpoint, name)


def _slug_endpoint(name: str, table: Any, operation: str, **fixed: Any) -> Endpoint:
    async def endpoint(request: Request, slug: str):
        return await _invoke(table, operation, request, slug=slug, **fixed)

    return _named(endpoint, name)


def _route_key_endpoint(name: str, table: Any, operation: str, **fixed: Any) -> Endpoint:
    async def endpoint(request: Request, route_key: str):
        return await _invoke(table, operation, request, route_key=route_key, **fixed)

    return _named(endpoint, name)


def _entity_endpoint() -> Endpoint:
    async def entity(request: Request, entity_type: str, entity_id: str):
        return await _invoke(
            Association,
            "entity_detail",
            request,
            entity_type=entity_type,
            entity_id=entity_id,
        )

    return entity


def _repository_endpoint() -> Endpoint:
    async def catalog_repository(request: Request, owner: str, repository: str):
        return await _invoke(
            Repository,
            "repository_detail",
            request,
            owner=owner,
            repository=repository,
        )

    return catalog_repository


def _resource_endpoint() -> Endpoint:
    async def catalog_resource(request: Request, resource_type: str, route_key: str):
        return await _invoke(
            Association,
            "resource_detail",
            request,
            entity_type=resource_type,
            route_key=route_key,
        )

    return catalog_resource


def _health_endpoint(database_kind: str, schema_table_count: int) -> Endpoint:
    async def catalog_healthz() -> JSONResponse:
        try:
            analytics = await analytics_summary()
        except Exception as exc:  # pragma: no cover - deployment readiness boundary
            return JSONResponse(
                {
                    "status": "starting",
                    "database": database_kind,
                    "analytics": {"status": "starting", "detail": str(exc)},
                    "schema_tables": schema_table_count,
                },
                status_code=503,
                headers={"Cache-Control": "no-store"},
            )
        return JSONResponse(
            {
                "status": "ok",
                "database": database_kind,
                "analytics": analytics,
                "schema_tables": schema_table_count,
            },
            headers={"Cache-Control": "no-store"},
        )

    return catalog_healthz


def mount_public_routes(
    catalog_app: TigrblApp,
    *,
    database_kind: str,
    schema_table_count: int,
) -> None:
    catalog_app.add_route(
        "/healthz",
        _health_endpoint(database_kind, schema_table_count),
        methods=["GET"],
        summary="Catalog API health",
    )

    record_routes = (
        ("/api/v1/products", "products", "product", Product, "product"),
        ("/api/v1/portfolio", "portfolios", "portfolio", Portfolio, "portfolio"),
        ("/api/v1/solutions", "solutions", "solution", Product, "solution"),
        ("/api/v1/services", "services", "service", Product, "service"),
    )
    for path, collection_name, detail_name, table, record_type in record_routes:
        catalog_app.add_route(
            path,
            _request_endpoint(
                collection_name,
                table,
                "record_collection",
                record_type=record_type,
            ),
            methods=["GET"],
        )
        catalog_app.add_route(
            f"{path}/{{slug}}",
            _slug_endpoint(
                detail_name,
                table,
                "record_detail",
                record_type=record_type,
            ),
            methods=["GET"],
        )

    request_routes = (
        ("/api/v1/insights", "insights", Association, "insight_collection"),
        ("/api/v1/entities", "entities", Association, "entity_collection"),
        (
            "/api/v1/repository-metrics",
            "repository_metrics",
            Repository,
            "repository_metrics",
        ),
        ("/api/v1/catalog", "catalog", Association, "catalog_overview"),
        (
            "/api/v1/catalog/repositories",
            "catalog_repositories",
            Repository,
            "repository_collection",
        ),
        ("/api/v1/catalog/packages", "catalog_packages", Package, "package_collection"),
        (
            "/api/v1/catalog/resources",
            "catalog_resources",
            Association,
            "resource_collection",
        ),
        (
            "/api/v1/catalog/technologies",
            "catalog_technologies",
            Technology,
            "technology_collection",
        ),
    )
    for path, name, table, operation in request_routes:
        catalog_app.add_route(
            path,
            _request_endpoint(name, table, operation),
            methods=["GET"],
        )

    catalog_app.add_route(
        "/api/v1/organizations/{slug}",
        _slug_endpoint("organization", Organization, "organization_detail"),
        methods=["GET"],
    )

    def catalog_snapshots():
        return snapshots()

    def catalog_snapshot(snapshot_id: str):
        result = snapshot_detail(snapshot_id)
        return JSONResponse(result, status_code=404 if set(result) == {"detail"} else 200)

    def observations(request: Request, entity_type: str):
        entity_id = str(request.query_params.get("entity_id") or "")
        return entity_observations(
            entity_type,
            entity_id,
            str(request.query_params.get("snapshot_id") or "") or None,
        )

    async def metrics(request: Request, entity_type: str):
        entity_id = str(request.query_params.get("entity_id") or "")
        result = await entity_metrics(entity_type, entity_id)
        return JSONResponse(result, status_code=404 if set(result) == {"detail"} else 200)

    async def metric_series(request: Request, entity_type: str, metric_key: str):
        entity_id = str(request.query_params.get("entity_id") or "")
        result = await entity_metrics(entity_type, entity_id, metric_key)
        return JSONResponse(result, status_code=404 if set(result) == {"detail"} else 200)

    async def catalog_analytics(request: Request):
        return await analytics_overview(
            str(request.query_params.get("snapshot_id") or "") or None
        )

    catalog_app.add_route("/api/v1/snapshots", catalog_snapshots, methods=["GET"])
    catalog_app.add_route(
        "/api/v1/snapshots/{snapshot_id}", catalog_snapshot, methods=["GET"]
    )
    catalog_app.add_route(
        "/api/v1/entities/{entity_type}/observations",
        observations,
        methods=["GET"],
    )
    catalog_app.add_route(
        "/api/v1/entities/{entity_type}/metrics/{metric_key}/series",
        metric_series,
        methods=["GET"],
    )
    catalog_app.add_route(
        "/api/v1/entities/{entity_type}/metrics", metrics, methods=["GET"]
    )
    catalog_app.add_route(
        "/api/v1/analytics/overview", catalog_analytics, methods=["GET"]
    )
    catalog_app.add_route(
        "/api/v1/analytics/summary", analytics_summary, methods=["GET"]
    )
    catalog_app.add_route(
        "/api/v1/entities/{entity_type}/{entity_id}",
        _entity_endpoint(),
        methods=["GET"],
    )
    catalog_app.add_route(
        "/api/v1/catalog/repositories/{owner}/{repository}",
        _repository_endpoint(),
        methods=["GET"],
    )
    catalog_app.add_route(
        "/api/v1/catalog/packages/{route_key}",
        _route_key_endpoint("catalog_package", Package, "package_detail"),
        methods=["GET"],
    )
    catalog_app.add_route(
        "/api/v1/catalog/releases/{route_key}",
        _route_key_endpoint(
            "catalog_release",
            Association,
            "resource_detail",
            kind="release",
        ),
        methods=["GET"],
    )
    catalog_app.add_route(
        "/api/v1/catalog/resources/{resource_type}/{route_key}",
        _resource_endpoint(),
        methods=["GET"],
    )
    catalog_app.add_route(
        "/api/v1/catalog/technologies/{slug}",
        _slug_endpoint("catalog_technology", Technology, "technology_detail"),
        methods=["GET"],
    )


__all__ = ["mount_public_routes"]
