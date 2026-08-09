from __future__ import annotations

import math
from collections import Counter
from collections.abc import Callable
from typing import Any


def payload(ctx: Any) -> dict[str, Any]:
    return ctx.get("payload", {}) if hasattr(ctx, "get") else ctx.payload


def query_params(ctx: Any) -> Any:
    request = payload(ctx).get("request")
    return request.query_params if request is not None else {}


def with_session(table, callback: Callable[[Any], Any]):
    session, release = table.acquire(op_alias="list")
    try:
        return callback(session)
    finally:
        release()


def row_dict(row) -> dict[str, Any]:
    return {column.name: getattr(row, column.name) for column in row.__table__.columns}


def source_record(row) -> dict[str, Any]:
    source = getattr(row, "source_payload", None)
    return dict(source) if isinstance(source, dict) else row_dict(row)


def _entity_type(kind: str) -> str:
    return "typed_resource" if kind == "resource" else kind


def _edge_dict(edge) -> dict[str, Any]:
    return row_dict(edge)


def _entity_edges(session, entity_type: str, entity_id: str):
    from .association import Association

    outgoing = (
        session.query(Association)
        .filter(Association.source_type == entity_type, Association.source_id == entity_id)
        .order_by(Association.sort_order, Association.relationship_type)
        .all()
    )
    incoming = (
        session.query(Association)
        .filter(Association.target_type == entity_type, Association.target_id == entity_id)
        .order_by(Association.sort_order, Association.relationship_type)
        .all()
    )
    return outgoing, incoming


def _page(
    values: list[dict], params: Any, *, default_size: int = 50
) -> tuple[list[dict], int, int, int]:
    try:
        page = max(1, int(params.get("page", 1)))
        page_size = min(250, max(1, int(params.get("page_size", default_size))))
    except (TypeError, ValueError):
        page, page_size = 1, default_size
    count = len(values)
    page_count = max(1, math.ceil(count / page_size))
    page = min(page, page_count)
    start = (page - 1) * page_size
    return values[start : start + page_size], page, page_size, page_count


def _filter(values: list[dict], params: Any) -> list[dict]:
    term = str(params.get("q", "")).strip().casefold()
    filtered = []
    for item in values:
        searchable = " ".join(
            str(item.get(key) or "") for key in ("name", "title", "description", "summary", "owner")
        )
        if term and term not in searchable.casefold():
            continue
        tests = {
            "owner": item.get("owner", item.get("repository_owner")),
            "repository_owner": item.get("repository_owner"),
            "ecosystem": item.get("ecosystem"),
            "publication_status": item.get("publication_status"),
            "resource_type": item.get("resource_type"),
        }
        if any(
            params.get(key) and str(params[key]) != str(value or "") for key, value in tests.items()
        ):
            continue
        filtered.append(item)
    sort = str(params.get("sort", "name"))
    if sort == "recent":
        filtered.sort(key=lambda item: str(item.get("observed_at") or ""), reverse=True)
    elif sort == "activity":
        filtered.sort(key=lambda item: sum((item.get("metrics") or {}).values()), reverse=True)
    else:
        filtered.sort(key=lambda item: str(item.get("name") or item.get("title") or "").casefold())
    return filtered


def _facets(values: list[dict]) -> dict[str, dict[str, int]]:
    result = {}
    for key in ("owner", "repository_owner", "ecosystem", "publication_status", "resource_type"):
        counts = Counter(str(item[key]) for item in values if item.get(key))
        result[key] = dict(sorted(counts.items()))
    return result


def catalog_overview(table, _ctx):
    from .package import Package
    from .portfolio import Portfolio
    from .product import Product
    from .repository import Repository
    from .technology import Technology
    from .typed_resource import TypedResource

    def build(session):
        counts = {
            "products": session.query(Product).filter(Product.visibility == "public").count(),
            "portfolio": session.query(Portfolio).filter(Portfolio.visibility == "public").count(),
            "repositories": session.query(Repository).count(),
            "packages": session.query(Package).count(),
            "resources": session.query(TypedResource).count(),
            "technologies": session.query(Technology).count(),
        }
        observed = [
            row[0]
            for model in (Repository, Package, TypedResource, Technology)
            for row in session.query(model.observed_at).all()
            if row[0]
        ]
        return {
            "kind": "catalog_overview",
            "generated_at": max(observed, default=None),
            "counts": counts,
        }

    return with_session(table, build)


def entity_collection(table, ctx):
    params = query_params(ctx)

    def build(session):
        from .association import Association

        query = session.query(table).filter(table.visibility == "public")
        if params.get("entity_type"):
            query = query.filter(table.kind == params["entity_type"])
        relationship_counts = Counter()
        for edge in session.query(Association).all():
            relationship_counts[(edge.source_type, edge.source_id)] += 1
            relationship_counts[(edge.target_type, edge.target_id)] += 1
        values = []
        for row in query.all():
            entity_type = _entity_type(row.kind)
            values.append(
                row_dict(row)
                | {
                    "entity_type_id": entity_type,
                    "type_label": row.kind,
                    "semantic_class": row.kind,
                    "relationship_count": relationship_counts[(entity_type, row.source_id)],
                }
            )
        values = _filter(values, params)
        page_values, page, page_size, page_count = _page(values, params)
        return {
            "kind": "entity_collection",
            "entity_type": params.get("entity_type") or None,
            "query": params.get("q", ""),
            "page": page,
            "page_size": page_size,
            "total": len(values),
            "page_count": page_count,
            "entities": page_values,
        }

    return with_session(table, build)


def entity_detail(table, ctx):
    identifier = str(payload(ctx).get("entity_id", ""))

    def build(session):
        row = (
            session.get(table, identifier)
            or session.query(table).filter(table.source_id == identifier).first()
        )
        if row is None:
            return {"detail": "Entity not found"}
        entity = row_dict(row) | {
            "entity_type_id": _entity_type(row.kind),
            "type_label": row.kind,
            "semantic_class": row.kind,
        }
        entity_type = _entity_type(row.kind)
        outgoing, incoming = _entity_edges(session, entity_type, row.source_id)
        owner_edge = next((edge for edge in outgoing if edge.relationship_type == "owned_by"), None)
        owner = None
        if owner_edge is not None:
            from .registry import ENTITY_TABLES

            owner_table = ENTITY_TABLES.get(owner_edge.target_type)
            owner_row = session.get(owner_table, owner_edge.target_id) if owner_table else None
            owner = row_dict(owner_row) if owner_row is not None else None
        return {
            "kind": "entity_record",
            "graph": {
                "entity": entity,
                "owner": owner,
                "urls": [],
                "relationships": [_edge_dict(edge) for edge in outgoing + incoming],
                "outgoing": [_edge_dict(edge) for edge in outgoing],
                "incoming": [_edge_dict(edge) for edge in incoming],
            },
        }

    return with_session(table, build)


def record_collection(table, ctx):
    from .association import Association
    from .organization import Organization

    record_type = str(payload(ctx).get("record_type", table.__name__.lower()))

    def build(session):
        rows = (
            session.query(table)
            .filter(table.visibility == "public")
            .order_by(table.featured.desc(), table.name)
            .all()
        )
        organizations = {row.id: row.name for row in session.query(Organization).all()}
        edges_by_source: dict[str, list] = {}
        for edge in (
            session.query(Association)
            .filter(Association.source_type == record_type)
            .all()
        ):
            edges_by_source.setdefault(edge.source_id, []).append(edge)
        def ownership(row_id: str):
            return next(
                (
                    edge.target_id
                    for edge in edges_by_source.get(row_id, [])
                    if edge.relationship_type == "owned_by"
                    and edge.target_type == "organization"
                ),
                None,
            )

        records = [
            {
                "id": row.id,
                "slug": row.slug,
                "record_type": record_type,
                "title": row.name,
                "eyebrow": row.eyebrow,
                "summary": row.summary,
                "maturity": row.maturity,
                "featured": bool(row.featured),
                "canonical_url": row.canonical_url,
                "organization_id": ownership(row.id),
                "organization_name": organizations.get(ownership(row.id), ownership(row.id)),
                "package_count": sum(
                    edge.target_type == "package" for edge in edges_by_source.get(row.id, [])
                ),
                "repository_count": sum(
                    edge.target_type == "repository" for edge in edges_by_source.get(row.id, [])
                ),
                "resource_count": sum(
                    edge.target_type == "typed_resource" for edge in edges_by_source.get(row.id, [])
                ),
                "technologies": [],
            }
            for row in rows
        ]
        return {
            "kind": f"{record_type}_collection",
            "generated_at": max((row.updated_at for row in rows if row.updated_at), default=None),
            "count": len(records),
            "records": records,
        }

    return with_session(table, build)


def record_detail(table, ctx):
    slug = str(payload(ctx).get("slug", ""))
    record_type = str(payload(ctx).get("record_type", table.__name__.lower()))

    def build(session):
        row = session.query(table).filter(table.slug == slug).first()
        if row is None:
            return {"detail": f"{record_type.title()} not found"}
        bundle = row.source_payload or {}
        repository = bundle.get("repository") or {}
        repositories = repository.get("attached_repositories") or (
            [repository] if repository else []
        )
        packages = bundle.get("packages") or []
        record = row_dict(row) | {"title": row.name, "record_type": record_type}
        outgoing, incoming = _entity_edges(session, record_type, row.id)
        owner_edge = next((edge for edge in outgoing if edge.relationship_type == "owned_by"), None)
        record["organization_id"] = owner_edge.target_id if owner_edge else None
        governance = [
            {
                "repository_id": item.get("id"),
                "repository": item.get("full_name"),
                "role": "implementation",
                "governed": bool((item.get("ssot_governance") or {}).get("governed")),
                "summary": item.get("ssot_governance") or {},
            }
            for item in repositories
        ]
        return {
            "kind": f"{record_type}_record",
            "generated_at": bundle.get("generated_at") or row.updated_at,
            "record": record,
            "taxonomies": {},
            "implementation": {
                "repositories": repositories,
                "packages": packages,
                "resources": repository.get("related_resources", []),
                "deployments": [],
            },
            "relations": [_edge_dict(edge) for edge in outgoing + incoming],
            "editorial": {
                "observations": [],
                "limitations": [],
                "ssot_claim_rooting": {"status": "repository-scoped"},
            },
            "governance": {"repositories": governance},
            "graph": None,
            "linked_sections": [],
        }

    return with_session(table, build)


def insight_collection(table, ctx):
    params = query_params(ctx)

    def build(session):
        values = [
            row_dict(row)
            for row in session.query(table)
            .filter(table.kind == "insight", table.visibility == "public")
            .all()
        ]
        values = _filter(values, params)
        page_values, page, page_size, page_count = _page(values, params, default_size=20)
        return {
            "kind": "insight_collection",
            "query": params.get("q", ""),
            "page": page,
            "page_size": page_size,
            "total": len(values),
            "page_count": page_count,
            "records": page_values,
        }

    return with_session(table, build)


def organization_detail(table, ctx):
    from .association import Association
    from .portfolio import Portfolio
    from .product import Product

    slug = str(payload(ctx).get("slug", ""))

    def build(session):
        organization = session.query(table).filter(table.slug == slug).first()
        if organization is None:
            return {"detail": "Organization not found"}
        owned = {
            (edge.source_type, edge.source_id)
            for edge in session.query(Association)
            .filter(
                Association.relationship_type == "owned_by",
                Association.target_type == "organization",
                Association.target_id == organization.id,
            )
            .all()
        }
        records = []
        for model, kind in ((Product, "product"), (Portfolio, "portfolio")):
            records.extend(
                row_dict(row) | {"record_type": kind, "title": row.name}
                for row in session.query(model)
                .filter(model.visibility == "public")
                .all()
                if (kind, row.id) in owned
            )
        return {
            "kind": "organization_record",
            "generated_at": organization.observed_at,
            "organization": row_dict(organization),
            "records": records,
        }

    return with_session(table, build)


def catalog_collection(table, ctx, resource_kind: str):
    params = query_params(ctx)

    def build(session):
        values = []
        for row in session.query(table).all():
            item = source_record(row)
            if resource_kind == "repository":
                item |= {
                    "route": f"/catalog/repositories/{row.owner}/{row.name}",
                    "package_count": len(item.get("package_ids", [])),
                    "resource_count": len(item.get("related_resources", [])),
                    "release_count": len(item.get("github_releases", [])),
                }
            elif resource_kind == "package":
                item |= {
                    "route_key": row.route_key,
                    "route": item.get("route")
                    or f"/catalog/packages/{row.ecosystem}/{row.route_key}",
                    "dependency_count": len(item.get("dependencies", [])),
                    "dependent_count": len(item.get("dependents", [])),
                    "release_count": len(item.get("releases", [])),
                }
            elif resource_kind == "resource":
                item |= {
                    "resource_type": row.resource_type,
                    "route_key": str(row.canonical_path or "").rsplit("/", 1)[-1],
                    "title": row.title,
                    "route": row.canonical_path,
                    "repository_owner": str(item.get("repository", "")).split("/", 1)[0] or None,
                }
            else:
                item |= {
                    "slug": row.slug,
                    "route": item.get("route") or f"/catalog/technologies/{row.slug}",
                    "record_count": len(item.get("repositories", [])),
                }
            values.append(item)
        values = _filter(values, params)
        facets = _facets(values)
        page_values, page, page_size, page_count = _page(values, params)
        observed = max(
            (item.get("observed_at") for item in values if item.get("observed_at")), default=None
        )
        return {
            "kind": f"catalog_{resource_kind}_collection",
            "resource_kind": resource_kind,
            "count": len(values),
            "page": page,
            "page_size": page_size,
            "page_count": page_count,
            "facets": facets,
            "generated_at": observed,
            "records": page_values,
        }

    return with_session(table, build)


def repository_detail(table, ctx):
    owner, name = str(payload(ctx).get("owner", "")), str(payload(ctx).get("repository", ""))

    def build(session):
        row = session.query(table).filter(table.owner == owner, table.name == name).first()
        if row is None:
            return {"detail": "Repository not found"}
        item = source_record(row)
        governance = item.get("ssot_governance") or row.ssot_summary or {}
        return {
            "kind": "catalog_repository_record",
            "item": item,
            "graph": None,
            "linked_sections": [],
            "implementation": {
                "packages": item.get("packages", []),
                "resources": item.get("related_resources", []),
                "releases": item.get("github_releases", []),
                "languages": [
                    {"name": key, "bytes": value}
                    for key, value in (item.get("language_bytes") or {}).items()
                ],
                "technologies": item.get("technologies", []),
            },
            "governance": governance | {"governed": bool(row.ssot_governed)},
            "legal": {
                "license_expression": row.license_expression,
                "status": "observed"
                if item.get("legal_evidence") or row.license_expression
                else "not-observed",
                "observations": item.get("legal_evidence", []),
            },
        }

    return with_session(table, build)


def repository_metrics(table, ctx):
    owner = str(query_params(ctx).get("owner", ""))

    def build(session):
        rows = (
            session.query(table).filter(table.owner == owner).all()
            if owner
            else session.query(table).all()
        )
        records = [
            source_record(row) | {"route": f"/catalog/repositories/{row.owner}/{row.name}"}
            for row in rows
        ]
        return {
            "kind": "repository_metric_snapshot",
            "owner": owner or None,
            "generated_at": max(
                (item.get("observed_at") for item in records if item.get("observed_at")),
                default=None,
            ),
            "count": len(records),
            "repositories": records,
        }

    return with_session(table, build)


def package_detail(table, ctx):
    route_key = str(payload(ctx).get("route_key", ""))

    def build(session):
        row = session.query(table).filter(table.route_key == route_key).first()
        if row is None:
            return {"detail": "Package not found"}
        item = source_record(row)
        return {
            "kind": "catalog_package_record",
            "item": item,
            "resource_type": "distribution.package",
            "graph": None,
            "linked_sections": [],
            "parent": {"repository": item.get("repository")},
            "implementation": {
                "repositories": [],
                "releases": item.get("releases", []),
                "dependencies": item.get("dependencies", []),
                "dependents": item.get("dependents", []),
                "downloads": {"value": item.get("downloads")},
            },
            "legal": {
                "license_expression": row.license_expression,
                "status": row.license_status,
                "observations": item.get("legal_evidence", []),
            },
        }

    return with_session(table, build)


def resource_detail(table, ctx):
    data = payload(ctx)
    route_key, kind = str(data.get("route_key", "")), str(data.get("kind", "resource"))
    if kind == "release":
        return release_detail(table, route_key)

    def build(session):
        row = session.query(table).filter(table.canonical_path.like(f"%/{route_key}")).first()
        if row is None:
            return {"detail": "Resource not found"}
        item = source_record(row) | {"resource_type": row.resource_type, "title": row.title}
        outgoing, _incoming = _entity_edges(session, "typed_resource", row.id)
        repository_edge = next(
            (edge for edge in outgoing if edge.target_type == "repository"), None
        )
        return {
            "kind": "catalog_resource_record",
            "resource_type": row.resource_type,
            "item": item,
            "graph": None,
            "linked_sections": [],
            "parent": {
                "repository_id": repository_edge.target_id if repository_edge else None
            },
            "implementation": {},
            "legal": {"status": "not-observed", "observations": []},
        }

    return with_session(table, build)


def release_detail(table, route_key: str):
    from .package import Package
    from .repository import Repository

    def build(session):
        for model, key in ((Package, "releases"), (Repository, "github_releases")):
            for owner in session.query(model).all():
                for release in (owner.source_payload or {}).get(key, []):
                    if str(release.get("route", "")).rstrip("/").endswith(f"/{route_key}"):
                        return {
                            "kind": "catalog_release_record",
                            "resource_type": f"release.{release.get('release_kind', 'package')}",
                            "item": release,
                            "parent": source_record(owner),
                            "implementation": {},
                            "legal": {
                                "license_expression": release.get("license_expression"),
                                "status": release.get("license_status"),
                                "observations": release.get("legal_evidence", []),
                            },
                            "graph": None,
                            "linked_sections": [],
                        }
        return {"detail": "Release not found"}

    return with_session(table, build)


def technology_detail(table, ctx):
    slug = str(payload(ctx).get("slug", ""))

    def build(session):
        row = session.query(table).filter(table.slug == slug).first()
        if row is None:
            return {"detail": "Technology not found"}
        return {
            "kind": "catalog_technology_record",
            "item": source_record(row),
            "related_records": [],
        }

    return with_session(table, build)
