from __future__ import annotations

from .view_common import *  # noqa: F403


def record_collection(table, ctx):
    from ..domain.resources.ontology import RECORD_RESOURCE_TYPES
    from .association import Association
    from .organization import Organization
    from .registry import ENTITY_TABLES, RESOURCE_TABLES

    record_type = str(payload(ctx).get("record_type", table.__name__.lower()))
    entity_type = RECORD_RESOURCE_TYPES.get(record_type, getattr(table, "ENTITY_TYPE", ""))
    model = ENTITY_TABLES[entity_type]
    resource_table_types = set(RESOURCE_TABLES)

    def build(session):
        rows = (
            session.query(model)
            .filter(model.visibility == "public")
            .order_by(model.featured.desc(), model.name)
            .all()
        )
        organizations = {row.id: row.name for row in session.query(Organization).all()}
        edges_by_source: dict[str, list] = {}
        for edge in session.query(Association).filter(Association.source_type == entity_type).all():
            edges_by_source.setdefault(edge.source_id, []).append(edge)

        def ownership(row_id: str):
            return next(
                (
                    edge.target_id
                    for edge in edges_by_source.get(row_id, [])
                    if edge.relationship_type == "owned_by"
                    and edge.target_type == Organization.ENTITY_TYPE
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
                    edge.target_type == "distribution.package"
                    for edge in edges_by_source.get(row.id, [])
                ),
                "repository_count": sum(
                    edge.target_type == "source.repository"
                    for edge in edges_by_source.get(row.id, [])
                ),
                "resource_count": sum(
                    edge.target_type in resource_table_types
                    for edge in edges_by_source.get(row.id, [])
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

    return build(ctx["db"])


def record_detail(table, ctx):
    from ..domain.resources.ontology import RECORD_RESOURCE_TYPES
    from .registry import ENTITY_TABLES

    slug = str(payload(ctx).get("slug", ""))
    record_type = str(payload(ctx).get("record_type", table.__name__.lower()))
    entity_type = RECORD_RESOURCE_TYPES.get(record_type, getattr(table, "ENTITY_TYPE", ""))
    model = ENTITY_TABLES[entity_type]

    def build(session):
        row = session.query(model).filter(model.slug == slug).first()
        if row is None:
            return {"detail": f"{record_type.title()} not found"}
        bundle = row.source_payload or {}
        repository = bundle.get("repository") or {}
        repository_rows = repository.get("attached_repositories") or (
            [repository] if repository else []
        )
        repositories = [repository_resource(item) for item in repository_rows]
        packages = [package_resource(item) for item in bundle.get("packages") or []]
        record = row_dict(row) | {"title": row.name, "record_type": record_type}
        outgoing, incoming = _entity_edges(session, entity_type, row.id)
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

    return build(ctx["db"])


def organization_detail(table, ctx):
    from ..domain.resources.ontology import RECORD_RESOURCE_TYPES
    from .association import Association
    from .organization import Organization
    from .registry import ENTITY_TABLES

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
                Association.target_type == Organization.ENTITY_TYPE,
                Association.target_id == organization.id,
            )
            .all()
        }
        records = []
        for kind in ("product", "portfolio", "solution", "service"):
            entity_type = RECORD_RESOURCE_TYPES[kind]
            model = ENTITY_TABLES[entity_type]
            records.extend(
                row_dict(row) | {"record_type": kind, "title": row.name}
                for row in session.query(model).filter(model.visibility == "public").all()
                if (entity_type, row.id) in owned
            )
        return {
            "kind": "organization_record",
            "generated_at": organization.observed_at,
            "organization": row_dict(organization),
            "records": records,
        }

    return build(ctx["db"])
