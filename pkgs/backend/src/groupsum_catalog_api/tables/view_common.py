from __future__ import annotations

import math
from collections import Counter
from typing import Any


def payload(ctx: Any) -> dict[str, Any]:
    values = dict(ctx.get("payload", {}) or {}) if hasattr(ctx, "get") else dict(ctx.payload)
    if hasattr(ctx, "get"):
        values.update(ctx.get("query_params", {}) or {})
        values.update(ctx.get("path_params", {}) or {})
    return values


def query_params(ctx: Any) -> Any:
    direct = ctx.get("query_params") if hasattr(ctx, "get") else None
    if direct is not None:
        return direct
    request = payload(ctx).get("request")
    return request.query_params if request is not None else {}


def row_dict(row) -> dict[str, Any]:
    return {column.name: getattr(row, column.name) for column in row.__table__.columns}


def source_record(row) -> dict[str, Any]:
    source = getattr(row, "source_payload", None)
    return dict(source) if isinstance(source, dict) else row_dict(row)


def latest_timestamp(values) -> Any:
    candidates = [value for value in values if value]
    return max(candidates, key=lambda value: str(value), default=None)


def repository_resource(value: dict[str, Any]) -> dict[str, Any]:
    item = dict(value)
    full_name = str(item.get("full_name") or "")
    owner, separator, name = full_name.partition("/")
    activity = item.get("activity") or {}
    commit_activity = item.get("commit_activity") or []
    metrics = dict(item.get("metrics") or {})
    metrics |= {
        "stars": metrics.get("stars", item.get("stars") or 0),
        "forks": metrics.get("forks", item.get("forks") or 0),
        "watchers": metrics.get("watchers", item.get("watchers") or 0),
        "contributors": metrics.get("contributors", len(item.get("contributors") or [])),
        "commits": metrics.get(
            "commits",
            activity.get("commit_count", sum(point.get("count", 0) for point in commit_activity)),
        ),
    }
    governance = item.get("governance") or item.get("ssot_governance") or {}
    if "summary" not in governance:
        governance = {
            "governed": bool(governance.get("governed")),
            "registry_url": governance.get("registry_url"),
            "registry_sha256": governance.get("source_sha256"),
            "schema_version": governance.get("schema_version"),
            "observed_at": governance.get("observed_at"),
            "summary": governance,
        }
    releases = item.get("releases") or item.get("github_releases") or []
    item |= {
        "owner": item.get("owner") or (owner if separator else ""),
        "name": item.get("name") or (name if separator else full_name),
        "is_archived": bool(item.get("is_archived", item.get("archived", False))),
        "is_fork": bool(item.get("is_fork", item.get("fork", False))),
        "role": item.get("role") or "implementation",
        "metrics": metrics,
        "history": item.get("history")
        or {key: [] for key in ("stars", "forks", "watchers", "contributors")},
        "commit_activity": commit_activity,
        "releases": releases,
        "release_count": len(releases),
        "governance": governance,
    }
    return item


def package_resource(value: dict[str, Any]) -> dict[str, Any]:
    item = dict(value)
    package_id = str(item.get("id") or "package:unknown")
    dependencies = []
    for index, raw in enumerate(item.get("dependencies") or []):
        dependency = dict(raw)
        target_id = str(
            dependency.get("target_id")
            or dependency.get("package_key")
            or dependency.get("name")
            or "unknown"
        )
        dependency |= {
            "id": dependency.get("id") or f"{package_id}:dependency:{index}:{target_id}",
            "source_id": dependency.get("source_id") or package_id,
            "target_id": target_id,
            "target_kind": dependency.get("target_kind")
            or ("package" if dependency.get("internal") else "external-package"),
            "completeness": dependency.get("completeness") or "catalog-observed",
        }
        dependencies.append(dependency)

    dependents = []
    for index, raw in enumerate(item.get("dependents") or []):
        dependent = dict(raw)
        source_id = str(
            dependent.get("source_id")
            or dependent.get("package_key")
            or dependent.get("name")
            or "unknown"
        )
        dependent |= {
            "id": dependent.get("id") or f"{package_id}:dependent:{index}:{source_id}",
            "source_id": source_id,
            "source_name": dependent.get("source_name") or dependent.get("name") or source_id,
            "target_id": dependent.get("target_id") or package_id,
            "completeness": dependent.get("completeness") or "catalog-observed",
        }
        dependents.append(dependent)

    scope_counts = Counter(str(row.get("scope") or "dependencies") for row in dependencies)
    completeness_counts = Counter(
        str(row.get("completeness") or "catalog-observed") for row in dependents
    )
    repository = str(item.get("repository") or "")
    owner, separator, name = repository.partition("/")
    repositories = item.get("repositories") or []
    if not repositories and separator:
        repositories = [
            {
                "id": f"repository:{repository}",
                "owner": owner,
                "name": name,
                "url": f"https://github.com/{repository}",
                "path": item.get("manifest_path"),
            }
        ]
    route = str(item.get("route") or "")
    item |= {
        "role": item.get("role") or item.get("attachment_role") or "distribution",
        "route_key": item.get("route_key") or route.rstrip("/").rsplit("/", 1)[-1] or None,
        "repositories": repositories,
        "releases": item.get("releases") or [],
        "release_count": len(item.get("releases") or []),
        "dependencies": dependencies,
        "dependents": dependents,
        "dependency_count": len(dependencies),
        "dependent_count": len(dependents),
        "dependency_summary": {
            "edge_count": len(dependencies),
            "unique_target_count": len({row["target_id"] for row in dependencies}),
            "internal_edge_count": sum(row["target_kind"] == "package" for row in dependencies),
            "external_edge_count": sum(
                row["target_kind"] == "external-package" for row in dependencies
            ),
            "by_scope": dict(sorted(scope_counts.items())),
        },
        "dependent_summary": {
            "edge_count": len(dependents),
            "unique_source_count": len({row["source_id"] for row in dependents}),
            "by_completeness": dict(sorted(completeness_counts.items())),
            "coverage": (
                "All reverse edges within this collected catalog; not a complete global count."
            ),
        },
    }
    return item


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


__all__ = [
    "_edge_dict",
    "_entity_edges",
    "_facets",
    "_filter",
    "_page",
    "payload",
    "latest_timestamp",
    "package_resource",
    "query_params",
    "repository_resource",
    "row_dict",
    "source_record",
]
