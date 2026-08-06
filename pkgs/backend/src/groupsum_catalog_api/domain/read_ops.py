"""Table-bound catalog read operations used by the public API routes."""

from typing import Any

from tigrbl import op_ctx

from ..projections.catalog_details import (
    catalog_repository_detail,
    catalog_technology_detail,
    insight_collection,
    organization_detail,
)
from ..projections.collections import catalog_collection, catalog_overview, record_collection
from ..projections.common import entity_collection, entity_detail
from ..projections.record_details import record_detail
from ..projections.resource_details import catalog_resource_detail
from ..projections.signals import repository_metric_snapshot
from .organizations.tables import Organization
from .packages.tables import Package
from .records.tables import Record
from .repositories.tables import Repository
from .resources.tables import CatalogEntity, Resource, ResourceType


def _payload(ctx: Any) -> dict[str, Any]:
    return ctx.get("payload", {}) if hasattr(ctx, "get") else ctx.payload


def _catalog_collection(payload: dict[str, Any], kind: str):
    request = payload["request"]
    params = request.query_params
    try:
        page = int(params.get("page", 1))
        page_size = int(params.get("page_size", 50))
    except (TypeError, ValueError):
        page, page_size = 1, 50
    return catalog_collection(
        payload["database"],
        request,
        kind,
        page=page,
        page_size=page_size,
        query=params.get("q", ""),
        resource_type=params.get("resource_type", ""),
        owner=params.get("owner", params.get("repository_owner", "")),
        ecosystem=params.get("ecosystem", ""),
        publication_status=params.get("publication_status", ""),
        sort=params.get("sort", "name"),
    )


@op_ctx(alias="catalog_overview", target="custom", arity="collection", persist="skip", rest=False)
def catalog_overview_op(cls, ctx):
    payload = _payload(ctx)
    return catalog_overview(payload["database"], payload["request"])


@op_ctx(alias="entity_collection", target="custom", arity="collection", persist="skip", rest=False)
def entity_collection_op(cls, ctx):
    payload = _payload(ctx)
    request = payload["request"]
    params = request.query_params
    return entity_collection(
        payload["database"],
        request,
        params.get("entity_type", ""),
        params.get("q", ""),
        int(params.get("page", 1)),
        int(params.get("page_size", 50)),
    )


@op_ctx(alias="entity_detail", target="custom", arity="member", persist="skip", rest=False)
def entity_detail_op(cls, ctx):
    payload = _payload(ctx)
    return entity_detail(payload["database"], payload["request"], payload["entity_id"])


@op_ctx(alias="record_collection", target="custom", arity="collection", persist="skip", rest=False)
def record_collection_op(cls, ctx):
    payload = _payload(ctx)
    return record_collection(payload["database"], payload["request"], payload["record_type"])


@op_ctx(alias="record_detail", target="custom", arity="member", persist="skip", rest=False)
def record_detail_op(cls, ctx):
    payload = _payload(ctx)
    return record_detail(
        payload["database"], payload["request"], payload["slug"], payload["record_type"]
    )


@op_ctx(alias="insight_collection", target="custom", arity="collection", persist="skip", rest=False)
def insight_collection_op(cls, ctx):
    payload = _payload(ctx)
    request = payload["request"]
    params = request.query_params
    return insight_collection(
        payload["database"],
        request,
        params.get("q", ""),
        int(params.get("page", 1)),
        int(params.get("page_size", 20)),
    )


@op_ctx(alias="organization_detail", target="custom", arity="member", persist="skip", rest=False)
def organization_detail_op(cls, ctx):
    payload = _payload(ctx)
    return organization_detail(payload["database"], payload["request"], payload["slug"])


@op_ctx(
    alias="repository_collection", target="custom", arity="collection", persist="skip", rest=False
)
def repository_collection_op(cls, ctx):
    return _catalog_collection(_payload(ctx), "repository")


@op_ctx(alias="repository_detail", target="custom", arity="member", persist="skip", rest=False)
def repository_detail_op(cls, ctx):
    payload = _payload(ctx)
    return catalog_repository_detail(
        payload["database"], payload["request"], payload["owner"], payload["repository"]
    )


@op_ctx(alias="repository_metrics", target="custom", arity="collection", persist="skip", rest=False)
def repository_metrics_op(cls, ctx):
    payload = _payload(ctx)
    request = payload["request"]
    return repository_metric_snapshot(
        payload["database"], request, request.query_params.get("owner", "")
    )


@op_ctx(alias="package_collection", target="custom", arity="collection", persist="skip", rest=False)
def package_collection_op(cls, ctx):
    return _catalog_collection(_payload(ctx), "package")


@op_ctx(alias="package_detail", target="custom", arity="member", persist="skip", rest=False)
def package_detail_op(cls, ctx):
    payload = _payload(ctx)
    return catalog_resource_detail(
        payload["database"], payload["request"], "package", payload["route_key"]
    )


@op_ctx(
    alias="resource_collection", target="custom", arity="collection", persist="skip", rest=False
)
def resource_collection_op(cls, ctx):
    return _catalog_collection(_payload(ctx), "resource")


@op_ctx(alias="resource_detail", target="custom", arity="member", persist="skip", rest=False)
def resource_detail_op(cls, ctx):
    payload = _payload(ctx)
    return catalog_resource_detail(
        payload["database"],
        payload["request"],
        payload.get("kind", "resource"),
        payload["route_key"],
        entity_type=payload.get("entity_type"),
    )


@op_ctx(
    alias="technology_collection", target="custom", arity="collection", persist="skip", rest=False
)
def technology_collection_op(cls, ctx):
    return _catalog_collection(_payload(ctx), "technology")


@op_ctx(alias="technology_detail", target="custom", arity="member", persist="skip", rest=False)
def technology_detail_op(cls, ctx):
    payload = _payload(ctx)
    return catalog_technology_detail(payload["database"], payload["request"], payload["slug"])


CatalogEntity.catalog_overview = catalog_overview_op
CatalogEntity.entity_collection = entity_collection_op
CatalogEntity.entity_detail = entity_detail_op
Record.record_collection = record_collection_op
Record.record_detail = record_detail_op
Record.insight_collection = insight_collection_op
Organization.organization_detail = organization_detail_op
Repository.repository_collection = repository_collection_op
Repository.repository_detail = repository_detail_op
Repository.repository_metrics = repository_metrics_op
Package.package_collection = package_collection_op
Package.package_detail = package_detail_op
Resource.resource_collection = resource_collection_op
Resource.resource_detail = resource_detail_op
ResourceType.technology_collection = technology_collection_op
ResourceType.technology_detail = technology_detail_op
