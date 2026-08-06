from __future__ import annotations

from collections import Counter, defaultdict
from typing import Any

from .common import evidence, package_key, stable_hash, slug
from .packages import compile_packages
from .repositories import compile_repositories


def _relationships(catalog: dict[str, Any]):
    counts: dict[str, Counter[str]] = defaultdict(Counter)
    repositories = {
        str(item.get("full_name")): item for item in catalog.get("repositories", [])
        if item.get("full_name")
    }
    for relationship in catalog.get("relationships") or []:
        kind = str(relationship.get("kind") or "related")
        identities = {
            str(relationship.get("source") or ""), str(relationship.get("target") or "")
        } - {""}
        for identity in identities:
            counts[identity][kind] += 1
    known = {
        package_key(str(item.get("ecosystem") or "unknown"), str(item.get("name") or ""))
        for item in catalog.get("packages", []) if item.get("name")
    }
    dependents: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for package in catalog.get("packages", []):
        ecosystem = str(package.get("ecosystem") or "unknown")
        name = str(package.get("name") or "unnamed")
        source_key = package_key(ecosystem, name)
        for dependency in package.get("dependencies") or []:
            target_key = package_key(ecosystem, str(dependency.get("name") or "unknown"))
            if target_key in known:
                dependents[target_key].append({
                    "name": name, "ecosystem": ecosystem, "package_key": source_key,
                    "requirement": dependency.get("requirement"),
                    "scope": dependency.get("scope"), "evidence": "repository.manifest",
                    "completeness": "catalog-observed",
                })
        for downstream in package.get("downstream") or []:
            dependents[source_key].append({
                "name": str(downstream), "ecosystem": ecosystem,
                "package_key": package_key(ecosystem, str(downstream)),
                "requirement": None, "scope": "registry-dependent",
                "evidence": f"{ecosystem}.reverse_dependencies",
                "completeness": package.get("downstream_completeness")
                or "bounded-registry-observation",
            })
    return repositories, counts, dependents, known


def _finalize(
    catalog: dict[str, Any], editorial: dict[str, Any], generated_at: str,
    repositories: list[dict[str, Any]], packages: list[dict[str, Any]],
    technology_repositories: dict[str, set[str]], technology_bytes: Counter[str],
) -> dict[str, list[dict[str, Any]]]:
    resources = list({resource["id"]: {
        **resource,
        "kind": "resource",
        "resource_type": resource["kind"],
        "display_name": resource.get("name") or resource["kind"],
        "description": f"Observed {resource['kind']} resource from {resource['repository']}.",
        "description_source": "generated-factual",
        "evidence": evidence(resource.get("evidence_type") or "source", resource.get("url"), resource["observed_at"]),
        "claim_boundary": "The catalog confirms a public source location; runtime availability and completeness are not inferred.",
    } for repository in repositories for resource in repository.get("related_resources", [])}.values())
    technologies = [{
        "id": f"technology:{slug(name)}:{stable_hash(name, 8)}", "kind": "technology",
        "name": name, "route": f"/catalog/technologies/{slug(name)}-{stable_hash(name, 8)}",
        "repository_count": len(technology_repositories[name]), "bytes": technology_bytes[name],
        "repositories": sorted(technology_repositories[name]), "observed_at": generated_at,
        "evidence": [{"kind": "github-languages", "observed_at": generated_at}],
    } for name in sorted(technology_repositories)]
    definitions = catalog.get("scope", {}).get("owner_definitions") or [
        {"login": owner, "role": "ecosystem"} for owner in catalog.get("scope", {}).get("owners", [])
    ]
    by_owner: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for repository in repositories:
        by_owner[str(repository["owner"])].append(repository)
    organizations = []
    overrides = editorial.get("organizations", {})
    for definition in definitions:
        login = definition["login"]
        owned_repositories = by_owner.get(login, [])
        names = {item["full_name"] for item in owned_repositories}
        owned_packages = [item for item in packages if item.get("owner") == login or item.get("repository") in names]
        selected = sorted(owned_repositories, key=lambda item: (-item["metrics"]["stars"], -item["metrics"]["commits"], item["full_name"]))[:8]
        override = overrides.get(login, {})
        organizations.append({
            "id": f"organization:{login}", "kind": "organization", "login": login,
            "display_name": override.get("display_name") or login.title(),
            "description": override.get("description") or f"Public ecosystem inventory for the {login} GitHub organization.",
            "role": definition.get("role"),
            "route": f"/products/{login}" if login in {"groupsum", "tigrbl", "swarmauri"} else "/catalog",
            "repository_count": len(owned_repositories), "package_count": len(owned_packages),
            "stars": sum(item["metrics"]["stars"] for item in owned_repositories),
            "watchers": sum(item["metrics"]["watchers"] for item in owned_repositories),
            "forks": sum(item["metrics"]["forks"] for item in owned_repositories),
            "commits": sum(item["metrics"]["commits"] for item in owned_repositories),
            "contributors": len({contributor.get("login") for repo in catalog.get("repositories", []) if repo.get("owner") == login for contributor in (repo.get("activity") or {}).get("contributors", []) if contributor.get("login")}),
            "github_releases": sum(item["metrics"]["github_releases"] for item in owned_repositories),
            "package_releases": sum(int(item.get("release_count") or 0) for item in owned_packages),
            "deployments": sum(item["metrics"]["deployments"] for item in owned_repositories),
            "relationships": sum(
                sum(int(count) for count in item.get("relationship_counts", {}).values())
                for item in owned_repositories
            ),
            "technologies": sorted({tech for item in owned_repositories for tech in item["technologies"]}),
            "featured_repositories": [{"id": item["id"], "name": item["display_name"], "route": item["route"], "description": item["description"], "metrics": item["metrics"]} for item in selected],
            "observed_at": generated_at, "evidence": evidence("organization", f"https://github.com/{login}", generated_at),
        })
    result = {"organizations": organizations, "repositories": repositories, "packages": packages, "resources": resources, "technologies": technologies}
    for records in result.values():
        records.sort(key=lambda item: (str(item.get("name") or item.get("display_name") or "").lower(), item["id"]))
    return result


def compile_catalog(catalog: dict[str, Any], editorial: dict[str, Any]):
    generated_at = catalog["generated_at"]
    source_repositories, relationship_counts, dependents, known_packages = _relationships(catalog)
    packages, packages_by_repo = compile_packages(
        catalog, generated_at, editorial.get("entities", {}), source_repositories,
        relationship_counts, dependents, known_packages,
    )
    repositories, technology_repositories, technology_bytes = compile_repositories(
        catalog, generated_at, editorial.get("entities", {}), relationship_counts,
        packages, packages_by_repo,
    )
    return _finalize(
        catalog, editorial, generated_at, repositories, packages,
        technology_repositories, technology_bytes,
    )
