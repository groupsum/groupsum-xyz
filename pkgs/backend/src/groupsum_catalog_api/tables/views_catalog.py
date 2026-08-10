from __future__ import annotations

from collections import Counter

from .view_common import *  # noqa: F403


def catalog_overview(table, ctx):
    from .package import Package
    from .portfolio import Portfolio
    from .product import Product
    from .registry import RESOURCE_TABLES
    from .repository import Repository
    from .technology import Technology

    def build(session):
        counts = {
            "products": session.query(Product).filter(Product.visibility == "public").count(),
            "portfolio": session.query(Portfolio).filter(Portfolio.visibility == "public").count(),
            "repositories": session.query(Repository).count(),
            "packages": session.query(Package).count(),
            "resources": sum(session.query(model).count() for model in RESOURCE_TABLES.values()),
            "technologies": session.query(Technology).count(),
        }
        observed = [
            row[0]
            for model in (Repository, Package, Technology, *RESOURCE_TABLES.values())
            for row in session.query(model.observed_at).all()
            if row[0]
        ]
        return {
            "kind": "catalog_overview",
            "generated_at": max(observed, default=None),
            "counts": counts,
        }

    return with_session(table, ctx, build)


def entity_collection(table, ctx):
    params = query_params(ctx)

    def build(session):
        from .association import Association
        from .registry import ENTITY_TABLES

        relationship_counts = Counter()
        for edge in session.query(Association).all():
            relationship_counts[(edge.source_type, edge.source_id)] += 1
            relationship_counts[(edge.target_type, edge.target_id)] += 1
        requested_type = str(params.get("entity_type") or "")
        values = []
        for entity_type, model in ENTITY_TABLES.items():
            if requested_type and entity_type != requested_type:
                continue
            query = session.query(model)
            if "visibility" in model.__table__.columns:
                query = query.filter(model.visibility == "public")
            for row in query.all():
                item = row_dict(row)
                item |= {
                    "entity_type_id": entity_type,
                    "type_label": entity_type,
                    "semantic_class": entity_type,
                    "name": item.get("name") or item.get("title") or item.get("source_key"),
                    "summary": item.get("summary") or item.get("description"),
                    "relationship_count": relationship_counts[(entity_type, str(row.id))],
                }
                values.append(item)
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

    return with_session(table, ctx, build)


def entity_detail(table, ctx):
    identifier = str(payload(ctx).get("entity_id", ""))
    entity_type = str(payload(ctx).get("entity_type", ""))

    def build(session):
        from .registry import ENTITY_TABLES

        model = ENTITY_TABLES.get(entity_type)
        row = session.get(model, identifier) if model else None
        if row is None:
            return {"detail": "Entity not found"}
        entity = row_dict(row) | {
            "entity_type_id": entity_type,
            "type_label": entity_type,
            "semantic_class": entity_type,
        }
        outgoing, incoming = _entity_edges(session, entity_type, identifier)
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

    return with_session(table, ctx, build)


def insight_collection(table, ctx):
    params = query_params(ctx)

    def build(session):
        from .registry import RESOURCE_TABLES

        model = RESOURCE_TABLES["content.insight"]
        values = [
            row_dict(row) for row in session.query(model).filter(model.visibility == "public").all()
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

    return with_session(table, ctx, build)
