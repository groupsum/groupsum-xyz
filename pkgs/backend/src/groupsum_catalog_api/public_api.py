from __future__ import annotations

import inspect
from collections.abc import Callable
from dataclasses import replace
from typing import Any
from urllib.parse import parse_qsl

from pydantic import RootModel
from tigrbl import JSONResponse, get, hook_ctx
from tigrbl.factories.router import defineRouterSpec
from tigrbl_core._spec import PathSpec, RouterSpec, TableSpec

from .route_parameters import decode_path_parameters
from .tables import views_analytics, views_catalog, views_records, views_resources
from .tables.association import Association
from .tables.catalog_snapshot import CatalogSnapshot
from .tables.metric_observation import MetricObservation
from .tables.observation import CatalogObservation
from .tables.organization import Organization
from .tables.package import Package
from .tables.portfolio import Portfolio
from .tables.product import Product
from .tables.registry import ALL_TABLES
from .tables.repository import Repository
from .tables.resources.party.person import PartyPerson
from .tables.technology import Technology

Operation = Callable[[type, dict[str, Any]], Any]


class PublicResponse(RootModel[Any]):
    pass


def _operation_context(ctx: dict[str, Any], fixed: dict[str, Any]) -> dict[str, Any]:
    if not fixed:
        return ctx
    scoped = dict(ctx)
    scoped["payload"] = {**dict(ctx.get("payload") or {}), **fixed}
    return scoped


def _not_found(result: Any) -> Any:
    if isinstance(result, dict) and set(result) == {"detail"}:
        return JSONResponse(result, status_code=404)
    return result


def _parameters(ctx: dict[str, Any]) -> dict[str, Any]:
    params = dict(ctx.get("payload") or {})
    request = getattr(ctx, "request", None) or ctx.get("request")
    if request is not None:
        params.update(request.query_params)
        params.update(request.path_params)
        params.update(request.scope.get("path_params", {}))
    params.update(ctx.get("query_params") or {})
    params.update(ctx.get("path_params") or {})
    params.update(getattr(ctx, "path_params", None) or {})
    temp = ctx.get("temp") or {}
    for namespace in (temp.get("route"), temp.get("dispatch")):
        if isinstance(namespace, dict):
            params.update(namespace.get("path_params") or {})
    hot = temp.get("hot_ctx")
    if hot is not None:
        params.update(getattr(hot, "path_params", None) or {})
        params.update(getattr(hot, "route_path_params", None) or {})
        scope = getattr(hot, "raw_scope", None) or {}
        params.update(scope.get("path_params") or {})
        query_string = scope.get("query_string", b"")
        if isinstance(query_string, bytes):
            query_string = query_string.decode("utf-8")
        params.update(parse_qsl(str(query_string)))
    return params


def _binding_parameters(ctx: dict[str, Any], template: str) -> dict[str, Any]:
    params = _parameters(ctx)
    hot = (ctx.get("temp") or {}).get("hot_ctx")
    scope = getattr(hot, "raw_scope", None) or {}
    actual = str(scope.get("path") or "")
    expected_parts = template.strip("/").split("/")
    actual_parts = actual.strip("/").split("/")
    if len(expected_parts) == len(actual_parts):
        for expected, value in zip(expected_parts, actual_parts, strict=True):
            if expected.startswith("{") and expected.endswith("}"):
                params.setdefault(expected[1:-1], value)
    return decode_path_parameters(params, expected_parts)


def _bind_get(
    path: str,
    *,
    table: type,
    alias: str,
    target: str,
    operation: Operation,
    fixed: dict[str, Any] | None = None,
) -> None:
    params_key = f"public_params:{alias}"

    def capture_params(_cls: type, ctx: dict[str, Any]) -> None:
        ctx.setdefault("temp", {})[params_key] = _binding_parameters(ctx, path)
    capture_params.__name__ = f"capture_{alias}_params"
    capture_params.__qualname__ = capture_params.__name__
    setattr(
        table,
        capture_params.__name__,
        hook_ctx(ops=alias, phase="PRE_HANDLER")(capture_params),
    )

    async def project(cls: type, ctx: dict[str, Any]) -> Any:
        scoped = dict(ctx)
        params = dict(ctx.get("temp", {}).get(params_key) or {})
        params.update(_binding_parameters(ctx, path))
        if "resource_type" in params:
            params.setdefault("entity_type", params["resource_type"])
        scoped["payload"] = params
        scoped["query_params"] = params
        scoped["path_params"] = params
        result = operation(cls, _operation_context(scoped, fixed or {}))
        if inspect.isawaitable(result):
            result = await result
        result = _not_found(result)
        ctx["result"] = result
        response = getattr(ctx, "response", None)
        if response is not None:
            response.result = result
        return result

    project.__name__ = f"project_{alias}"
    project.__qualname__ = project.__name__
    setattr(
        table,
        project.__name__,
        hook_ctx(ops=alias, phase="POST_RESPONSE")(project),
    )

    async def endpoint(_cls: type, _ctx: dict[str, Any]) -> None:
        return None

    endpoint.__name__ = alias
    endpoint.__qualname__ = alias
    get(
        path,
        bind=table,
        alias=alias,
        target=target,
        arity="collection" if target == "list" else "member",
        persist="skip",
        response_schema=PublicResponse,
    )(endpoint)


analytics_readiness = views_analytics.analytics_readiness

_bind_get(
    "/api/v1/contributors",
    table=PartyPerson,
    alias="contributors",
    target="list",
    operation=views_resources.contributor_collection,
)
_bind_get(
    "/api/v1/contributors/{provider}/{login}",
    table=PartyPerson,
    alias="contributor_detail",
    target="read",
    operation=views_resources.contributor_detail,
)


for path, alias, table, record_type in (
    ("/api/v1/products", "products", Product, "product"),
    ("/api/v1/portfolio", "portfolios", Portfolio, "portfolio"),
    ("/api/v1/solutions", "solutions", Product, "solution"),
    ("/api/v1/services", "services", Product, "service"),
):
    _bind_get(
        path,
        table=table,
        alias=alias,
        target="list",
        operation=views_records.record_collection,
        fixed={"record_type": record_type},
    )
    _bind_get(
        f"{path}/{{slug}}",
        table=table,
        alias=record_type,
        target="list",
        operation=views_records.record_detail,
        fixed={"record_type": record_type},
    )

for path, alias, table, operation in (
    ("/api/v1/insights", "insights", Association, views_catalog.insight_collection),
    ("/api/v1/entities", "entities", Association, views_catalog.entity_collection),
    (
        "/api/v1/repository-metrics",
        "repository_metrics",
        Repository,
        views_resources.repository_metrics,
    ),
    ("/api/v1/catalog", "catalog", Association, views_catalog.catalog_overview),
    (
        "/api/v1/catalog/repositories",
        "catalog_repositories",
        Repository,
        lambda table, ctx: views_resources.catalog_collection(table, ctx, "repository"),
    ),
    (
        "/api/v1/catalog/packages",
        "catalog_packages",
        Package,
        lambda table, ctx: views_resources.catalog_collection(table, ctx, "package"),
    ),
    (
        "/api/v1/catalog/resources",
        "catalog_resources",
        Association,
        views_resources.resource_collection,
    ),
    (
        "/api/v1/catalog/technologies",
        "catalog_technologies",
        Technology,
        lambda table, ctx: views_resources.catalog_collection(table, ctx, "technology"),
    ),
):
    _bind_get(path, table=table, alias=alias, target="list", operation=operation)

for path, alias, table, operation, fixed in (
    (
        "/api/v1/organizations/{slug}",
        "organization",
        Organization,
        views_records.organization_detail,
        None,
    ),
    (
        "/api/v1/entities/{entity_type}/{entity_id}",
        "entity",
        Association,
        views_catalog.entity_detail,
        None,
    ),
    (
        "/api/v1/catalog/repositories/{owner}/{repository}",
        "catalog_repository",
        Repository,
        views_resources.repository_detail,
        None,
    ),
    (
        "/api/v1/catalog/packages/{route_key}",
        "catalog_package",
        Package,
        views_resources.package_detail,
        None,
    ),
    (
        "/api/v1/catalog/releases/{route_key}",
        "catalog_release",
        Association,
        views_resources.resource_detail,
        {"kind": "release"},
    ),
    (
        "/api/v1/catalog/resources/{resource_type}/{route_key}",
        "catalog_resource",
        Association,
        views_resources.resource_detail,
        None,
    ),
    (
        "/api/v1/catalog/technologies/{slug}",
        "catalog_technology",
        Technology,
        views_resources.technology_detail,
        None,
    ),
):
    _bind_get(
        path,
        table=table,
        alias=alias,
        target="list",
        operation=operation,
        fixed=fixed,
    )

for path, alias, table, target, operation in (
    (
        "/api/v1/snapshots",
        "catalog_snapshots",
        CatalogSnapshot,
        "list",
        views_analytics.snapshots,
    ),
    (
        "/api/v1/snapshots/{snapshot_id}",
        "catalog_snapshot",
        CatalogSnapshot,
        "list",
        views_analytics.snapshot_detail,
    ),
    (
        "/api/v1/entities/{entity_type}/observations",
        "observations",
        CatalogObservation,
        "list",
        views_analytics.entity_observations,
    ),
    (
        "/api/v1/entities/{entity_type}/metrics/{metric_key}/series",
        "metric_series",
        MetricObservation,
        "list",
        views_analytics.entity_metrics,
    ),
    (
        "/api/v1/entities/{entity_type}/metrics",
        "metrics",
        MetricObservation,
        "list",
        views_analytics.entity_metrics,
    ),
    (
        "/api/v1/analytics/overview",
        "catalog_analytics",
        MetricObservation,
        "list",
        views_analytics.analytics_overview,
    ),
    (
        "/api/v1/analytics/summary",
        "analytics_summary",
        MetricObservation,
        "list",
        views_analytics.analytics_summary,
    ),
):
    _bind_get(path, table=table, alias=alias, target=target, operation=operation)


def _table_spec(table: type, *, ops: tuple[Any, ...] = ()) -> TableSpec:
    return TableSpec(
        model_ref=f"{table.__module__}:{table.__name__}",
        engine_name=getattr(table, "ENGINE_NAME", None),
        ops=ops,
    )


def _public_paths() -> tuple[PathSpec, ...]:
    route_tables = (
        CatalogObservation,
        MetricObservation,
        CatalogSnapshot,
        *(
            table
            for table in ALL_TABLES
            if table not in {CatalogObservation, MetricObservation, CatalogSnapshot}
        ),
    )
    paths = [
        PathSpec(
            path="/",
            kind="resource",
            tables=tuple(_table_spec(table) for table in route_tables),
        )
    ]
    for table in route_tables:
        for operation in tuple(getattr(table, "__tigrbl_ops__", ()) or ()):
            for binding in tuple(getattr(operation, "bindings", ()) or ()):
                if getattr(binding, "proto", None) != "http.rest":
                    continue
                paths.append(
                    PathSpec(
                        path=binding.path,
                        kind="resource",
                        tables=(
                            _table_spec(
                                table,
                                ops=(replace(operation, bindings=(binding,)),),
                            ),
                        ),
                    )
                )
    return tuple(paths)


class PublicApiRouterSpec(defineRouterSpec(name="public-api", paths=_public_paths())):
    pass


PUBLIC_API_ROUTER = RouterSpec.collect(PublicApiRouterSpec)

__all__ = ["PUBLIC_API_ROUTER", "PublicApiRouterSpec", "analytics_readiness"]
