from __future__ import annotations

import json
from typing import Any


def relation_rows(repositories: list[dict[str, Any]], packages: list[dict[str, Any]]) -> list[dict[str, Any]]:
    relations: dict[tuple[str, ...], dict[str, Any]] = {}
    package_index: dict[str, list[dict[str, Any]]] = {}
    for package in packages:
        for key in {package.get("name", "").lower(), package.get("name", "").lower().replace("_", "-")}:
            if key:
                package_index.setdefault(key, []).append(package)
        if package.get("repository"):
            key = ("repository_contains_package", package["repository"], f"{package['ecosystem']}:{package['name']}")
            relations[key] = {"kind": key[0], "source": key[1], "target": key[2], "evidence": "repository.manifest"}
    for package in packages:
        source = f"{package['ecosystem']}:{package['name']}"
        for dependency in package.get("dependencies", []):
            dep_name = dependency["name"].lower().replace("_", "-")
            candidates = package_index.get(dep_name, [])
            if candidates:
                for target_package in candidates:
                    target = f"{target_package['ecosystem']}:{target_package['name']}"
                    scope = str(dependency.get("scope") or "dependencies")
                    key = ("package_depends_on_package", source, target, scope)
                    relations[key] = {"kind": key[0], "source": source, "target": target, "requirement": dependency.get("requirement"), "scope": scope, "evidence": "repository.manifest"}
            else:
                scope = str(dependency.get("scope") or "dependencies")
                key = ("package_depends_on_external", source, dependency["name"], scope)
                relations[key] = {"kind": key[0], "source": source, "target": dependency["name"], "requirement": dependency.get("requirement"), "scope": scope, "evidence": "repository.manifest"}
        for dependent in package.get("downstream") or []:
            target = f"{package['ecosystem']}:{dependent}"
            key = ("package_has_registry_dependent", source, target)
            relations[key] = {
                "kind": key[0],
                "source": source,
                "target": target,
                "evidence": f"{package['ecosystem']}.reverse_dependencies",
                "completeness": package.get("downstream_completeness") or "bounded-registry-observation",
            }
    for repo in repositories:
        for resource in repo.get("related_resources", []):
            target = f"{resource.get('resource_type')}:{resource.get('name')}"
            key = ("repository_contains_related_resource", repo["full_name"], target)
            relations[key] = {
                "kind": key[0], "source": key[1], "target": key[2],
                "url": resource.get("url"), "evidence": resource.get("evidence"),
            }
    return sorted(relations.values(), key=lambda row: (row["kind"], row["source"], row["target"]))


def summarize(catalog: dict[str, Any]) -> dict[str, Any]:
    repos = catalog["repositories"]
    packages = catalog["packages"]
    observations = catalog["observations"] + [item for repo in repos for item in repo.get("observations", [])]
    observation_statuses = {status: sum(1 for item in observations if item["status"] == status) for status in sorted({item["status"] for item in observations})}
    return {
        "generated_at": catalog["generated_at"], "schema_version": catalog["schema_version"],
        "owners": len(catalog["scope"]["owners"]), "repositories": len(repos),
        "archived_repositories": sum(1 for repo in repos if repo["archived"]),
        "fork_repositories": sum(1 for repo in repos if repo["fork"]),
        "stars": sum(repo["metrics"]["stars"] for repo in repos), "watchers": sum(repo["metrics"]["watchers"] for repo in repos),
        "forks": sum(repo["metrics"]["forks"] for repo in repos), "commits": sum(repo["activity"]["commit_count"] or 0 for repo in repos),
        "contributors_unique": len(
            {
                row.get("login") or row.get("name")
                for repo in repos
                for row in repo["activity"]["contributors"]
                if row.get("login") or row.get("name")
            }
        ),
        "github_releases": sum(len(repo["github_releases"]) for repo in repos),
        "registry_release_versions": sum(len(package.get("releases", [])) for package in packages),
        "github_package_versions": sum(len(package.get("versions", [])) for package in packages if package.get("ecosystem") in {"ghcr", "github-npm"}),
        "deployments": sum(len(repo.get("deployments", [])) for repo in repos),
        "environments": sum(len(repo.get("environments", [])) for repo in repos),
        "packages": len(packages), "published_packages": sum(1 for package in packages if package.get("published") is True),
        "package_ecosystems": {ecosystem: sum(1 for package in packages if package.get("ecosystem") == ecosystem) for ecosystem in sorted({package.get("ecosystem") for package in packages if package.get("ecosystem")})},
        "verified_languages": sorted({language for repo in repos for language in repo.get("technologies", {}).get("languages_bytes", {})}),
        "relationships": len(catalog["relationships"]),
        "observations_by_status": observation_statuses,
        "observations_with_errors": observation_statuses.get("error", 0),
    }


def typescript_summary(summary: dict[str, Any]) -> str:
    payload = json.dumps(summary, indent=2, sort_keys=True)
    return "// Generated by scripts/catalog_collect.py. Do not edit manually.\n" f"export const catalogSummary = {payload} as const;\n"
