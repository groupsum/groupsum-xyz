from __future__ import annotations

from .view_common import *  # noqa: F403


def _collection_aggregates(values: list[dict], resource_kind: str) -> dict[str, int]:
    if resource_kind == "repository":
        return {
            "stars": sum(int((item.get("metrics") or {}).get("stars") or 0) for item in values),
            "ssot_governed": sum(
                bool(item.get("ssot_governed") or (item.get("governance") or {}).get("governed"))
                for item in values
            ),
            "contained_packages": sum(int(item.get("package_count") or 0) for item in values),
        }
    if resource_kind == "package":
        published = sum(
            bool(item.get("published") or item.get("publication_status") == "published")
            for item in values
        )
        return {
            "published": published,
            "unpublished": len(values) - published,
            "ecosystems": len({str(item["ecosystem"]) for item in values if item.get("ecosystem")}),
        }
    if resource_kind == "resource":
        resource_types = [str(item.get("resource_type") or "").casefold() for item in values]
        return {
            "websites_and_docs": sum(
                value in {"website", "documentation", "interface.website"}
                or value.startswith("documentation.")
                for value in resource_types
            ),
            "apis_and_endpoints": sum(
                "api" in value or value.endswith(".endpoint") for value in resource_types
            ),
            "demos_and_showcases": sum(
                value.rsplit(".", 1)[-1] in {"demo", "example", "showcase"}
                for value in resource_types
            ),
        }
    if resource_kind == "technology":
        return {
            "categories": len({str(item["category"]) for item in values if item.get("category")}),
        }
    return {}


def catalog_collection(table, ctx, resource_kind: str):
    params = query_params(ctx)

    def build(session):
        values = []
        for row in session.query(table).all():
            item = source_record(row)
            if resource_kind == "repository":
                item = repository_resource(item) | {
                    "route": f"/catalog/repositories/{row.owner}/{row.name}",
                    "package_count": len(item.get("package_ids", [])),
                    "resource_count": len(item.get("related_resources", [])),
                    "release_count": len(item.get("github_releases", [])),
                }
            elif resource_kind == "package":
                item = package_resource(item) | {
                    "route_key": row.route_key,
                    "route": item.get("route")
                    or f"/catalog/packages/{row.ecosystem}/{row.route_key}",
                    "dependency_count": len(item.get("dependencies", [])),
                    "dependent_count": len(item.get("dependents", [])),
                    "release_count": len(item.get("releases", [])),
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
        observed = latest_timestamp(item.get("observed_at") for item in values)
        return {
            "kind": f"catalog_{resource_kind}_collection",
            "resource_kind": resource_kind,
            "count": len(values),
            "page": page,
            "page_size": page_size,
            "page_count": page_count,
            "facets": facets,
            "aggregates": _collection_aggregates(values, resource_kind),
            "generated_at": observed,
            "records": page_values,
        }

    return build(ctx["db"])


def contributor_collection(table, ctx):
    params = query_params(ctx)

    def build(session):
        from .association import Association

        values = []
        for row in session.query(table).all():
            contributions = session.query(Association).filter(
                Association.target_type == table.ENTITY_TYPE,
                Association.target_id == row.id,
                Association.relationship_type == "contributed_by",
            ).all()
            item = row_dict(row) | {
                "url": row.profile_url or row.source_url,
                "repository_count": len(contributions),
                "contributions": sum(
                    int((edge.attributes or {}).get("contributions") or 0)
                    for edge in contributions
                ),
                "route": f"/contributors/{row.provider or 'unknown'}/{row.login or row.id}",
            }
            values.append(item)
        values = _filter(values, params)
        page_values, page, page_size, page_count = _page(values, params)
        return {
            "kind": "contributor_collection",
            "resource_kind": "contributor",
            "count": len(values),
            "page": page,
            "page_size": page_size,
            "page_count": page_count,
            "generated_at": latest_timestamp(item.get("observed_at") for item in values),
            "records": page_values,
        }

    return build(ctx["db"])


def contributor_detail(table, ctx):
    data = payload(ctx)
    provider = str(data.get("provider", ""))
    login = str(data.get("login", ""))

    def build(session):
        from .association import Association
        from .repository import Repository

        row = session.query(table).filter(table.provider == provider, table.login == login).first()
        if row is None:
            return {"detail": "Contributor not found"}
        edges = session.query(Association).filter(
            Association.target_type == table.ENTITY_TYPE,
            Association.target_id == row.id,
            Association.relationship_type == "contributed_by",
        ).all()
        repositories = []
        for edge in edges:
            repository = session.get(Repository, edge.source_id)
            if repository is not None:
                repositories.append({
                    "id": repository.id,
                    "name": f"{repository.owner}/{repository.name}",
                    "route": f"/catalog/repositories/{repository.owner}/{repository.name}",
                    "contributions": int((edge.attributes or {}).get("contributions") or 0),
                })
        return {
            "kind": "contributor_record",
            "item": row_dict(row) | {"url": row.profile_url or row.source_url},
            "repositories": sorted(
                repositories,
                key=lambda item: (-item["contributions"], item["name"]),
            ),
        }

    return build(ctx["db"])


def repository_detail(table, ctx):
    owner, name = str(payload(ctx).get("owner", "")), str(payload(ctx).get("repository", ""))

    def build(session):
        row = session.query(table).filter(table.owner == owner, table.name == name).first()
        if row is None:
            return {"detail": "Repository not found"}
        item = repository_resource(source_record(row))
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

    return build(ctx["db"])


def repository_metrics(table, ctx):
    owner = str(query_params(ctx).get("owner", ""))

    def build(session):
        rows = (
            session.query(table).filter(table.owner == owner).all()
            if owner
            else session.query(table).all()
        )
        records = [
            repository_resource(source_record(row))
            | {"route": f"/catalog/repositories/{row.owner}/{row.name}"}
            for row in rows
        ]
        return {
            "kind": "repository_metric_snapshot",
            "owner": owner or None,
            "generated_at": latest_timestamp(item.get("observed_at") for item in records),
            "count": len(records),
            "repositories": records,
        }

    return build(ctx["db"])


def package_detail(table, ctx):
    route_key = str(payload(ctx).get("route_key", ""))

    def build(session):
        row = session.query(table).filter(table.route_key == route_key).first()
        if row is None:
            return {"detail": "Package not found"}
        item = package_resource(source_record(row))
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

    return build(ctx["db"])


def resource_collection(table, ctx):
    params = query_params(ctx)

    def build(session):
        from .registry import RESOURCE_TABLES

        requested_type = str(params.get("resource_type") or "")
        values = []
        for entity_type, model in RESOURCE_TABLES.items():
            if requested_type and entity_type != requested_type:
                continue
            for row in session.query(model).all():
                item = source_record(row)
                canonical_path = getattr(row, "canonical_path", None)
                item |= {
                    "id": row.id,
                    "resource_type": entity_type,
                    "title": getattr(row, "title", None)
                    or getattr(row, "name", None)
                    or getattr(row, "source_key", row.id),
                    "route": canonical_path,
                    "route_key": str(canonical_path or row.id).rsplit("/", 1)[-1],
                    "observed_at": getattr(row, "observed_at", None),
                }
                values.append(item)
        values = _filter(values, params)
        facets = _facets(values)
        page_values, page, page_size, page_count = _page(values, params)
        return {
            "kind": "catalog_resource_collection",
            "resource_kind": "resource",
            "count": len(values),
            "page": page,
            "page_size": page_size,
            "page_count": page_count,
            "facets": facets,
            "aggregates": _collection_aggregates(values, "resource"),
            "generated_at": latest_timestamp(item.get("observed_at") for item in values),
            "records": page_values,
        }

    return build(ctx["db"])


def resource_detail(table, ctx):
    data = payload(ctx)
    route_key = str(data.get("route_key", ""))
    kind = str(data.get("kind", "resource"))
    entity_type = str(data.get("entity_type", ""))
    if kind == "release":
        return release_detail(table, ctx)

    def build(session):
        from .registry import RESOURCE_TABLES

        model = RESOURCE_TABLES.get(entity_type)
        if model is None:
            return {"detail": "Resource type not found"}
        query = session.query(model)
        if "canonical_path" in model.__table__.columns:
            row = query.filter(model.canonical_path.like(f"%/{route_key}")).first()
        else:
            row = session.get(model, route_key)
        if row is None:
            return {"detail": "Resource not found"}
        item = source_record(row) | {
            "resource_type": entity_type,
            "title": getattr(row, "title", None) or getattr(row, "name", None),
        }
        outgoing, _incoming = _entity_edges(session, entity_type, row.id)
        repository_edge = next(
            (edge for edge in outgoing if edge.target_type == "source.repository"), None
        )
        return {
            "kind": "catalog_resource_record",
            "resource_type": entity_type,
            "item": item,
            "graph": None,
            "linked_sections": [],
            "parent": {"repository_id": repository_edge.target_id if repository_edge else None},
            "implementation": {},
            "legal": {"status": "not-observed", "observations": []},
        }

    return build(ctx["db"])


def release_detail(table, ctx):
    from .package import Package
    from .repository import Repository

    route_key = str(payload(ctx).get("route_key", ""))

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

    return build(ctx["db"])


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

    return build(ctx["db"])
