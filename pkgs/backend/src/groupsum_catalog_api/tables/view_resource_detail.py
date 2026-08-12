from __future__ import annotations

from .view_common import _entity_edges, source_record


def _resource_route(entity_type: str, row) -> str | None:
    canonical_path = getattr(row, "canonical_path", None)
    if canonical_path:
        return canonical_path
    if entity_type == "source.repository":
        return f"/catalog/repositories/{row.owner}/{row.name}"
    return (
        f"/catalog/resources/{entity_type}/{row.id}"
        if entity_type.startswith("governance.")
        else None
    )


def _resource_links(session, entity_type: str, entity_id: str):
    """Render already-published association edges as navigable public links."""
    from ..domain.resources.ontology import RESOURCE_TYPES
    from .registry import ENTITY_TABLES

    outgoing, incoming = _entity_edges(session, entity_type, entity_id)
    relationships = []
    grouped: dict[tuple[str, str], dict] = {}
    for direction, edges in (("outgoing", outgoing), ("incoming", incoming)):
        for edge in edges:
            related_type = edge.target_type if direction == "outgoing" else edge.source_type
            related_id = edge.target_id if direction == "outgoing" else edge.source_id
            model = ENTITY_TABLES.get(related_type)
            related = session.get(model, related_id) if model is not None else None
            if related is None:
                continue
            definition = RESOURCE_TYPES.get(related_type)
            name = (
                getattr(related, "title", None)
                or getattr(related, "name", None)
                or getattr(related, "source_key", None)
                or related.id
            )
            route = _resource_route(related_type, related)
            member = {
                "id": related.id,
                "name": name,
                "route": route,
                "relationship": edge.relationship_type,
                "role": edge.role,
                "direction": direction,
            }
            relationships.append(
                {
                    "id": edge.id,
                    "relationship_type": edge.relationship_type,
                    "role": edge.role,
                    "origin_kind": "ssot.registry",
                    "confidence": "observed",
                    "status": "observed",
                    "observed_at": edge.observed_at,
                    "entity_id": related.id,
                    "entity_type_id": related_type,
                    "type_label": definition.label if definition else related_type,
                    "semantic_class": (
                        definition.family if definition else related_type.split(".", 1)[0]
                    ),
                    "name": name,
                    "route": route,
                    "direction": direction,
                }
            )
            key = (edge.relationship_type, direction)
            section = grouped.setdefault(
                key,
                {
                    "type_key": related_type,
                    "label": edge.relationship_type.replace("_", " ").title(),
                    "family": (definition.family if definition else related_type.split(".", 1)[0]),
                    "count": 0,
                    "members": [],
                    "direction": direction,
                },
            )
            section["members"].append(member)
            section["count"] += 1
    return outgoing, incoming, relationships, list(grouped.values())


def resource_detail_model(session, entity_type: str, route_key: str) -> dict:
    from .registry import ENTITY_TABLES, RESOURCE_TABLES

    model = (
        ENTITY_TABLES.get(entity_type)
        if entity_type == "governance.registry"
        else RESOURCE_TABLES.get(entity_type)
    )
    if model is None:
        return {"detail": "Resource type not found"}
    query = session.query(model)
    if "canonical_path" in model.__table__.columns:
        row = query.filter(model.canonical_path.like(f"%/{route_key}")).first()
        row = row or session.get(model, route_key)
    else:
        row = session.get(model, route_key)
    if row is None:
        return {"detail": "Resource not found"}
    item = source_record(row) | {
        "resource_type": entity_type,
        "title": getattr(row, "title", None) or getattr(row, "name", None),
    }
    outgoing, incoming, relationships, linked_sections = _resource_links(
        session, entity_type, row.id
    )
    repository_owner = next(
        (
            relationship
            for relationship in relationships
            if relationship["entity_type_id"] == "source.repository"
            and relationship["direction"] == "outgoing"
        ),
        None,
    )
    repository_parent = (
        _repository_parent(session, repository_owner["entity_id"])
        if repository_owner is not None
        else None
    )
    if repository_parent is None and entity_type.startswith("governance."):
        repository_parent = _governance_repository_parent(session, incoming)
    organization_owner = _derived_organization_owner(repository_parent, item.get("observed_at"))
    repository_id = repository_parent["id"] if repository_parent else None
    relationship_integrity = (item.get("payload") or {}).get("relationship_integrity") or {
        "reference_count": 0,
        "resolved_reference_count": 0,
        "unresolved_reference_count": 0,
        "unresolved_references": [],
    }
    return {
        "kind": "catalog_resource_record",
        "resource_type": entity_type,
        "item": item,
        "graph": {
            "entity": {
                "id": row.id,
                "entity_type_id": entity_type,
                "type_label": entity_type.replace("governance.", "").replace("_", " ").title(),
                "semantic_class": entity_type.split(".", 1)[0],
                "slug": str(row.id),
                "name": item["title"] or str(row.id),
                "summary": item.get("statement"),
                "route": _resource_route(entity_type, row),
                "observed_at": item.get("observed_at"),
            },
            "owner": organization_owner,
            "urls": [],
            "relationships": relationships,
            "outgoing": [value for value in relationships if value["direction"] == "outgoing"],
            "incoming": [value for value in relationships if value["direction"] == "incoming"],
        },
        "linked_sections": linked_sections,
        "parent": {"repository_id": repository_id, "repository": repository_parent},
        "relationship_integrity": relationship_integrity,
        "implementation": {
            "repositories": [repository_parent] if repository_parent else [],
            "relationship_count": len(relationships),
            "outgoing_count": len(outgoing),
            "incoming_count": len(incoming),
            "reference_count": relationship_integrity.get("reference_count", 0),
            "resolved_reference_count": relationship_integrity.get("resolved_reference_count", 0),
            "unresolved_reference_count": relationship_integrity.get(
                "unresolved_reference_count", 0
            ),
        },
        "legal": {"status": "not-observed", "observations": []},
    }


def _repository_parent(session, repository_id: str | None) -> dict | None:
    from .repository import Repository

    repository = session.get(Repository, repository_id) if repository_id else None
    if repository is None:
        return None
    return {
        "id": repository.id,
        "name": f"{repository.owner}/{repository.name}",
        "owner": repository.owner,
        "repository": repository.name,
        "route": f"/catalog/repositories/{repository.owner}/{repository.name}",
        "url": repository.url,
    }


def _derived_organization_owner(repository: dict | None, observed_at) -> dict | None:
    if repository is None:
        return None
    return {
        "id": f"derived-owner:{repository['owner']}",
        "relationship_type": "owned_by",
        "role": "repository_owner",
        "origin_kind": "derived.ssot.registry",
        "confidence": "derived",
        "status": "observed",
        "observed_at": observed_at,
        "entity_id": repository["owner"],
        "entity_type_id": "organization",
        "type_label": "Organization",
        "semantic_class": "organization",
        "name": repository["owner"],
        "route": "/catalog",
        "direction": "outgoing",
    }


def _governance_repository_parent(session, incoming) -> dict | None:
    from .association import Association

    registry_edge = next(
        (
            edge
            for edge in incoming
            if edge.source_type == "governance.registry" and edge.relationship_type == "contains"
        ),
        None,
    )
    repository_edge = (
        session.query(Association)
        .filter(
            Association.target_type == "governance.registry",
            Association.target_id == registry_edge.source_id,
            Association.relationship_type == "governed_by",
        )
        .first()
        if registry_edge is not None
        else None
    )
    repository_id = repository_edge.source_id if repository_edge is not None else None
    return _repository_parent(session, repository_id)
