"""Pure, versioned projections. No live entity reads belong in a frozen projection."""

from collections import Counter
from types import SimpleNamespace
from typing import Any

from ..tables.view_common import _facets, _filter, _page, latest_timestamp
from ..tables.view_package_relationships import resolve_relationships
from ..tables.view_package_summary import package_collection_summary, package_summary
from .detail_models import package_model, repository_model

VERSION = "1"
ALIASES = {
    "catalog_repositories",
    "catalog_packages",
    "catalog_technologies",
    "catalog_repository",
    "catalog_package",
    "package_relationships",
    "contributors",
    "contributor_detail",
}


def valid_read_models(models):
    return (
        isinstance(models, dict)
        and models.get("version") == VERSION
        and all(
            isinstance(models.get(key), list)
            for key in ("repositories", "packages", "technologies", "contributors")
        )
        and isinstance(models.get("details"), dict)
        and isinstance(models.get("collections"), dict)
        and all(
            key in models["collections"] for key in ("repositories", "packages", "technologies")
        )
    )


def collection_model(values, kind, params):
    # Keep aggregate and filter semantics identical for static and HTTP consumers.
    from ..tables.views_resources import _collection_aggregates

    values = _filter(values, params)
    selected, page, size, pages = _page(values, params)
    if kind == "package" and params.get("projection") == "summary":
        selected = [package_collection_summary(item) for item in selected]
    return {
        "kind": f"catalog_{kind}_collection",
        "resource_kind": kind,
        "count": len(values),
        "page": page,
        "page_size": size,
        "page_count": pages,
        "facets": _facets(values),
        "aggregates": _collection_aggregates(values, kind),
        "generated_at": latest_timestamp(item.get("observed_at") for item in values),
        "records": selected,
    }


def build_read_models(repositories, packages, technologies, contributors):
    models = {
        "version": VERSION,
        "repositories": [],
        "packages": [],
        "technologies": technologies,
        "contributors": contributors,
        "details": {},
    }
    index = {
        item["id"]: SimpleNamespace(
            **{key: item.get(key) for key in ("id", "ecosystem", "publication_status", "published")}
        )
        for item in packages
    }
    for raw in repositories:
        detail = repository_model(raw)
        item = dict(detail["item"])
        item["package_summary"] = package_summary(raw.get("package_ids", []), index)
        item["package_count"] = item["package_summary"]["total"]
        item["resource_count"] = len(detail["implementation"]["resources"])
        item["release_count"] = len(detail["implementation"]["releases"])
        item["ssot_governed"] = bool(detail["governance"].get("governed"))
        item.pop("package_ids", None)
        models["repositories"].append(item)
        models["details"][raw["route"].rstrip("/")] = detail
    for raw in packages:
        detail = package_model(raw)
        # A collection needs summaries, never the full requirement/release arrays.
        models["packages"].append(
            {**detail["item"], "repositories": detail["implementation"]["repositories"]}
        )
        models["details"][raw["route"].rstrip("/")] = detail
    models["collections"] = {
        key: project(models, f"catalog_{key}", {"page": 1, "page_size": 50, "sort": "recent"})
        for key in ("repositories", "packages", "technologies")
    }
    return models


def project(models: dict[str, Any], alias: str, params: dict[str, Any]):
    if alias in {"catalog_repositories", "catalog_packages", "catalog_technologies"}:
        dataset = alias.removeprefix("catalog_")
        kind = {"repositories": "repository", "packages": "package", "technologies": "technology"}[
            dataset
        ]
        return collection_model(models[dataset], kind, params)
    if alias in {"contributors", "contributor_detail"}:
        from ..tables.view_contributors import contributor_page

        result = contributor_page(
            models["contributors"], params, detail=alias == "contributor_detail"
        )
        if (
            alias == "contributor_detail"
            and params.get("activity") in {"1", "timeline"}
            and "item" in result
        ):
            from .contributor_activity import activity_projection

            person = result["item"]
            activity = models.get("contributor_activity", {}).get(person["id"])
            return activity_projection(person, result["repositories"], activity, params)
        return result
    if alias == "catalog_repository":
        route = f"/catalog/repositories/{params.get('owner')}/{params.get('repository')}"
        return models["details"].get(route, {"detail": "Repository not found"})
    key = str(params.get("route_key") or "")
    detail = next(
        (
            value
            for route, value in models["details"].items()
            if route.startswith("/catalog/packages/") and route.rsplit("/", 1)[-1] == key
        ),
        None,
    )
    if detail is None:
        return {"detail": "Package not found"}
    if alias == "catalog_package":
        return detail
    item = {**detail["item"], **detail["implementation"]}
    identities = [
        SimpleNamespace(
            **{key: row.get(key) for key in ("id", "name", "ecosystem", "route_key", "repository")}
        )
        for row in models["packages"]
    ]
    direction = "dependent" if params.get("direction") == "dependent" else "dependency"
    return relationship_page(item, resolve_relationships(item, identities, direction), params)


def relationship_page(item, values, params):
    facets = {key: dict(Counter(edge[key] for edge in values)) for key in ("scope", "resolution")}
    search = str(params.get("q") or "").strip().casefold()
    for field in ("scope", "resolution"):
        if params.get(field):
            values = [edge for edge in values if edge[field] == params[field]]
    if params.get("optional") in {"true", "false"}:
        values = [edge for edge in values if edge["optional"] == (params["optional"] == "true")]
    if search:
        values = [
            edge
            for edge in values
            if search in f"{edge['name']} {edge.get('requirement') or ''}".casefold()
        ]
    if params.get("sort") == "ownership":
        values.sort(key=_relationship_ownership_key)
    else:
        values.sort(key=lambda edge: (edge["name"].casefold(), edge["scope"], edge["id"]))
    selected, page, size, pages = _page(values, params)
    return {
        "kind": "package_relationship_collection",
        "direction": "dependent" if params.get("direction") == "dependent" else "dependency",
        "count": len(values),
        "page": page,
        "page_size": size,
        "page_count": pages,
        "facets": facets,
        "dependency_count": len(item["dependencies"]),
        "dependent_count": len(item["dependents"]),
        "coverage": "Direct relationships within the current catalog; not global dependent counts.",
        "records": selected,
    }


def _relationship_ownership_key(edge):
    ownership = {"resolved": 0, "ambiguous": 1, "unresolved": 2, "external": 3}
    scope = edge["scope"].casefold()
    if "dev" in scope or "test" in scope or scope.startswith("dependency-groups."):
        rank = 4
    elif "build" in scope:
        rank = 3
    elif "peer" in scope:
        rank = 2
    elif edge["optional"]:
        rank = 1
    else:
        rank = 0
    return ownership[edge["resolution"]], rank, scope, edge["name"].casefold(), edge["id"]
