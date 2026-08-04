#!/usr/bin/env python3
"""Compile the normalized public catalog into deterministic website datasets."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
from collections import Counter, defaultdict
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any

from catalog_collect import summarize

ROOT = Path(__file__).resolve().parents[1]


def stable_hash(value: str, size: int = 12) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()[:size]


def slug(value: str) -> str:
    normalized = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return normalized or stable_hash(value)


def observed_at(record: dict[str, Any], fallback: str) -> str:
    observations = record.get("observations") or []
    return next((item.get("observed_at") for item in observations if item.get("observed_at")), fallback)


def daily_commit_activity(
    activity: dict[str, Any], observed: str, days: int = 30
) -> list[dict[str, Any]]:
    """Return a truthful, zero-filled daily commit series ending at observation day."""
    end = datetime.fromisoformat(observed.replace("Z", "+00:00")).date()
    start = end - timedelta(days=days - 1)
    counts: Counter[str] = Counter()
    for commit in activity.get("commit_history") or []:
        timestamp = commit.get("committed_at") or commit.get("authored_at")
        if not timestamp:
            continue
        try:
            day = datetime.fromisoformat(str(timestamp).replace("Z", "+00:00")).date()
        except ValueError:
            continue
        if start <= day <= end:
            counts[day.isoformat()] += 1
    return [
        {"date": (start + timedelta(days=offset)).isoformat(), "count": counts[(start + timedelta(days=offset)).isoformat()]}
        for offset in range(days)
    ]


def related_resource_url(item: dict[str, Any]) -> str | None:
    """Normalize legacy tree links for file-backed resources in cached observations."""
    url = item.get("url")
    resource_path = str(item.get("path") or "")
    if url and resource_path and Path(resource_path).suffix and "/tree/" in url:
        return str(url).replace("/tree/", "/blob/", 1)
    return url


def write_json(path: Path, value: Any) -> dict[str, Any]:
    payload = json.dumps(value, indent=2, sort_keys=True, ensure_ascii=False) + "\n"
    path.parent.mkdir(parents=True, exist_ok=True)
    encoded = payload.encode("utf-8")
    path.write_bytes(encoded)
    return {
        "path": path.name,
        "bytes": len(encoded),
        "sha256": hashlib.sha256(encoded).hexdigest(),
        "records": len(value) if isinstance(value, list) else 1,
    }


def load_editorial(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {"schema_version": "1.0.0", "organizations": {}, "entities": {}, "featured_ids": []}
    value = json.loads(path.read_text(encoding="utf-8"))
    if value.get("schema_version") != "1.0.0":
        raise ValueError("catalog editorial schema_version must be 1.0.0")
    return value


def evidence(kind: str, url: str | None, checked_at: str) -> list[dict[str, str]]:
    if not url:
        return []
    return [{"kind": kind, "url": url, "observed_at": checked_at}]


def canonical_package_name(value: str) -> str:
    return value.casefold().replace("_", "-")


def package_key(ecosystem: str, name: str) -> str:
    return f"{ecosystem}:{canonical_package_name(name)}"


def release_url(ecosystem: str, name: str, version: str, fallback: str | None) -> str:
    if ecosystem == "pypi":
        return f"https://pypi.org/project/{name}/{version}/"
    if ecosystem == "npm":
        return f"https://www.npmjs.com/package/{name}/v/{version}"
    if ecosystem == "crates":
        return f"https://crates.io/crates/{name}/{version}"
    return fallback or "https://github.com"


def normalized_releases(package: dict[str, Any], observed: str) -> list[dict[str, Any]]:
    ecosystem = str(package.get("ecosystem") or "unknown")
    name = str(package.get("name") or "unnamed")
    raw_releases = package.get("releases") or package.get("versions") or []
    releases: list[dict[str, Any]] = []
    for raw in raw_releases:
        if isinstance(raw, str):
            version = raw
            published_at = None
            downloads = None
            url = release_url(ecosystem, name, version, package.get("registry_url") or package.get("url"))
        else:
            version = str(raw.get("version") or raw.get("name") or raw.get("id") or "unknown")
            published_at = raw.get("published_at") or raw.get("created_at") or raw.get("updated_at")
            downloads = raw.get("downloads")
            url = raw.get("url") or release_url(
                ecosystem, name, version, package.get("registry_url") or package.get("url")
            )
        releases.append(
            {
                "release_kind": ecosystem,
                "version": version,
                "url": url,
                "published_at": published_at,
                "downloads": downloads,
                "observed_at": observed,
            }
        )
    return sorted(
        releases,
        key=lambda item: (str(item.get("published_at") or ""), item["version"]),
        reverse=True,
    )


def compile_catalog(catalog: dict[str, Any], editorial: dict[str, Any]) -> dict[str, list[dict[str, Any]]]:
    generated_at = catalog["generated_at"]
    overrides = editorial.get("entities", {})
    packages_by_repo: dict[str, list[str]] = defaultdict(list)
    repository_records: list[dict[str, Any]] = []
    package_records: list[dict[str, Any]] = []
    technology_repositories: dict[str, set[str]] = defaultdict(set)
    technology_bytes: Counter[str] = Counter()
    relationship_counts: dict[str, Counter[str]] = defaultdict(Counter)
    source_repositories = {
        str(repository.get("full_name")): repository
        for repository in catalog.get("repositories", [])
        if repository.get("full_name")
    }
    for relationship in catalog.get("relationships") or []:
        kind = str(relationship.get("kind") or "related")
        for identity in {str(relationship.get("source") or ""), str(relationship.get("target") or "")} - {""}:
            relationship_counts[identity][kind] += 1

    known_package_keys = {
        package_key(str(package.get("ecosystem") or "unknown"), str(package.get("name") or ""))
        for package in catalog.get("packages", [])
        if package.get("name")
    }
    dependents_by_key: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for package in catalog.get("packages", []):
        ecosystem = str(package.get("ecosystem") or "unknown")
        source_name = str(package.get("name") or "unnamed")
        source_key = package_key(ecosystem, source_name)
        for dependency in package.get("dependencies") or []:
            target_name = str(dependency.get("name") or "unknown")
            target_key = package_key(ecosystem, target_name)
            if target_key not in known_package_keys:
                continue
            dependents_by_key[target_key].append(
                {
                    "name": source_name,
                    "ecosystem": ecosystem,
                    "package_key": source_key,
                    "requirement": dependency.get("requirement"),
                    "scope": dependency.get("scope"),
                    "evidence": "repository.manifest",
                    "completeness": "catalog-observed",
                }
            )
        for downstream in package.get("downstream") or []:
            dependents_by_key[source_key].append(
                {
                    "name": str(downstream),
                    "ecosystem": ecosystem,
                    "package_key": package_key(ecosystem, str(downstream)),
                    "requirement": None,
                    "scope": "registry-dependent",
                    "evidence": f"{ecosystem}.reverse_dependencies",
                    "completeness": package.get("downstream_completeness")
                    or "bounded-registry-observation",
                }
            )

    for package in catalog.get("packages", []):
        ecosystem = str(package.get("ecosystem") or "unknown")
        name = str(package.get("name") or "unnamed")
        repository = package.get("repository")
        legal_repository = repository
        if not legal_repository and package.get("owner") and package.get("name"):
            candidate = f"{package['owner']}/{package['name']}"
            if candidate in source_repositories:
                legal_repository = candidate
        package_identity = f"{ecosystem}:{name}:{repository or package.get('owner') or 'registry'}:{package.get('manifest_path') or 'package'}"
        package_id = f"package:{package_identity}"
        package_slug = f"{slug(name)}-{stable_hash(package_id, 8)}"
        checked_at = package.get("updated_at") or observed_at(package, generated_at)
        override = overrides.get(package_id, {})
        registry_url = package.get("registry_url") or package.get("url")
        source_url = f"https://github.com/{repository}/blob/HEAD/{package.get('manifest_path')}" if repository and package.get("manifest_path") else None
        release_records = normalized_releases(package, checked_at)
        for release in release_records:
            release_id = f"release:{stable_hash(f'{package_id}:{release['release_kind']}:{release['version']}', 16)}"
            release["id"] = release_id
            release["route"] = (
                f"/catalog/releases/{release['release_kind']}/"
                f"{slug(name)}-{stable_hash(release_id, 10)}"
            )
        source_repository = source_repositories.get(str(legal_repository), {})
        manifest_directory = str(package.get("manifest_path") or "").rsplit("/", 1)[0]
        license_expression = (
            package.get("license_expression")
            or package.get("registry_license_expression")
            or source_repository.get("license")
        )
        legal_evidence: list[dict[str, Any]] = []
        if package.get("license_expression"):
            legal_evidence.append(
                {
                    "kind": "license-expression",
                    "name": "Package manifest license",
                    "expression": package["license_expression"],
                    "url": source_url,
                    "scope": "direct",
                    "evidence_type": "repository.manifest",
                }
            )
        if package.get("registry_license_expression"):
            legal_evidence.append(
                {
                    "kind": "license-expression",
                    "name": "Registry license metadata",
                    "expression": package["registry_license_expression"],
                    "url": registry_url,
                    "scope": "direct",
                    "evidence_type": f"{ecosystem}.registry",
                }
            )
        if package.get("license_file") and repository:
            license_path = "/".join(
                item for item in (manifest_directory, str(package["license_file"])) if item
            )
            legal_evidence.append(
                {
                    "kind": "license-file",
                    "name": str(package["license_file"]),
                    "path": license_path,
                    "url": f"https://github.com/{repository}/blob/HEAD/{license_path}",
                    "scope": "direct",
                    "evidence_type": "repository.manifest",
                }
            )
        for item in source_repository.get("legal_evidence") or []:
            legal_path = str(item.get("path") or "")
            is_root_evidence = bool(legal_path) and "/" not in legal_path
            is_package_evidence = bool(manifest_directory) and (
                legal_path == manifest_directory
                or legal_path.startswith(f"{manifest_directory}/")
            )
            if legal_path and not (is_root_evidence or is_package_evidence):
                continue
            legal_evidence.append(
                {
                    "kind": item.get("kind"),
                    "name": item.get("name"),
                    "expression": item.get("expression"),
                    "path": item.get("path"),
                    "url": item.get("url"),
                    "scope": "inherited",
                    "evidence_type": item.get("evidence"),
                }
            )
        for release in release_records:
            release["license_expression"] = license_expression
            release["license_status"] = "observed" if license_expression else "not-observed"
            release["legal_evidence"] = []
            release["legal_inherits_from"] = package_id
        dependencies = [
            {
                "name": str(item.get("name") or "unknown"),
                "ecosystem": ecosystem,
                "package_key": package_key(ecosystem, str(item.get("name") or "unknown")),
                "requirement": item.get("requirement"),
                "scope": item.get("scope"),
                "internal": package_key(ecosystem, str(item.get("name") or "unknown"))
                in known_package_keys,
                "evidence": "repository.manifest",
            }
            for item in package.get("dependencies") or []
        ]
        dependent_records = sorted(
            {
                (
                    item["package_key"],
                    str(item.get("scope") or ""),
                    str(item.get("requirement") or ""),
                ): item
                for item in dependents_by_key.get(package_key(ecosystem, name), [])
            }.values(),
            key=lambda item: (item["ecosystem"], item["name"], str(item.get("scope") or "")),
        )
        manifest_path = str(package.get("manifest_path") or "")
        package_directory = manifest_path.rsplit("/", 1)[0] if "/" in manifest_path else ""
        is_package_directory = package_directory.split("/", 1)[0] in {
            "packages",
            "pkgs",
            "libs",
            "crates",
        }
        if package.get("published") is True:
            package_kind = "published-package"
        elif package.get("private") and is_package_directory:
            package_kind = "private-package"
        elif package.get("private") and not package_directory:
            package_kind = "workspace-project"
        else:
            package_kind = "package-candidate"
        record = {
            "id": package_id,
            "kind": "package",
            "route": f"/catalog/packages/{ecosystem}/{package_slug}",
            "name": name,
            "display_name": override.get("display_name") or name,
            "description": override.get("description") or f"Observed {ecosystem} package record for {name}.",
            "description_source": "reviewed-editorial" if override.get("description") else "generated-factual",
            "reviewed": bool(override),
            "ecosystem": ecosystem,
            "owner": package.get("owner") or (str(repository).split("/", 1)[0] if repository else None),
            "repository": repository,
            "legal_repository": legal_repository,
            "manifest_path": package.get("manifest_path"),
            "package_kind": package_kind,
            "private": bool(package.get("private")),
            "published": package.get("published") is True,
            "publication_status": package.get("publication_status") or ("published" if package.get("published") else "not-confirmed"),
            "latest_version": package.get("latest_version") or package.get("version_declared"),
            "version_declared": package.get("version_declared"),
            "release_count": len(release_records),
            "releases": release_records,
            "dependency_count": len(dependencies),
            "dependencies": dependencies,
            "dependent_count": len(dependent_records),
            "dependents": dependent_records,
            "downstream_count": len(package.get("downstream") or []),
            "relationship_count": sum(relationship_counts[f"{ecosystem}:{name}"].values()),
            "relationship_counts": dict(sorted(relationship_counts[f"{ecosystem}:{name}"].items())),
            "downstream_completeness": package.get("downstream_completeness") or "not-observed",
            "downloads": package.get("downloads"),
            "license_expression": license_expression,
            "license_status": "observed" if license_expression else "not-observed",
            "license_classifiers": package.get("license_classifiers") or [],
            "legal_evidence": legal_evidence,
            "registry_url": registry_url,
            "source_url": source_url,
            "observed_at": checked_at,
            "evidence": evidence("registry" if registry_url else "source", registry_url or source_url, checked_at),
            "claim_boundary": override.get("claim_boundary") or "Publication is reported only when confirmed by the named public registry.",
        }
        package_records.append(record)
        if repository:
            packages_by_repo[repository].append(package_id)

    packages_by_id = {record["id"]: record for record in package_records}
    for repo in catalog.get("repositories", []):
        full_name = str(repo["full_name"])
        repo_id = f"repository:{full_name}"
        checked_at = observed_at(repo, generated_at)
        override = overrides.get(repo_id, {})
        activity = repo.get("activity") or {}
        metrics = repo.get("metrics") or {}
        languages = (repo.get("technologies") or {}).get("languages_bytes") or {}
        latest_release = next(iter(repo.get("github_releases") or []), None)
        latest_deployment = next(iter(repo.get("deployments") or []), None)
        latest_status = next(iter((latest_deployment or {}).get("statuses") or []), None)
        ssot_governance = repo.get("ssot_governance") or {
            "present": False, "governed": False, "valid": False, "counts": {},
            "status_counts": {}, "coverage": {},
        }
        related_resources = []
        for item in repo.get("related_resources") or []:
            resource_url = related_resource_url(item)
            if not resource_url:
                continue
            resource_kind = str(item.get("kind") or "resource")
            resource_key = stable_hash(resource_url, 12)
            related_resources.append(
                {
                    "id": f"resource:{resource_key}",
                    "kind": resource_kind,
                    "name": item.get("name"),
                    "url": resource_url,
                    "path": item.get("path"),
                    "route": f"/catalog/resources/{slug(resource_kind)}/{resource_key}",
                    "repository": full_name,
                    "repository_route": (
                        f"/catalog/repositories/{repo.get('owner')}/{repo.get('name')}"
                    ),
                    "evidence_type": item.get("evidence"),
                    "observed_at": checked_at,
                    "legal_evidence": [],
                    "legal_inherits_from": repo_id,
                }
            )
        github_release_records = []
        for item in repo.get("github_releases") or []:
            version = str(item.get("tag") or item.get("name") or "unknown")
            release_id = f"release:{stable_hash(f'{repo_id}:github:{version}', 16)}"
            github_release_records.append(
                {
                    "id": release_id,
                    "route": (
                        f"/catalog/releases/github/{slug(repo.get('name') or 'release')}-"
                        f"{stable_hash(release_id, 10)}"
                    ),
                    "release_kind": "github",
                    "version": version,
                    "url": item.get("url") or repo.get("url"),
                    "published_at": item.get("published_at"),
                    "downloads": sum(
                        int(asset.get("downloads") or 0) for asset in item.get("assets") or []
                    ),
                    "observed_at": checked_at,
                    "prerelease": bool(item.get("prerelease")),
                    "draft": bool(item.get("draft")),
                    "license_expression": repo.get("license"),
                    "license_status": "observed" if repo.get("license") else "not-observed",
                    "legal_evidence": [],
                    "legal_inherits_from": repo_id,
                }
            )
        description = override.get("description") or repo.get("description") or f"Public source repository {full_name}."
        record = {
            "id": repo_id,
            "kind": "repository",
            "route": f"/catalog/repositories/{repo.get('owner')}/{repo.get('name')}",
            "name": repo.get("name"),
            "full_name": full_name,
            "display_name": override.get("display_name") or repo.get("name"),
            "description": description,
            "description_source": "reviewed-editorial" if override.get("description") else ("github-repository" if repo.get("description") else "generated-factual"),
            "reviewed": bool(override),
            "owner": repo.get("owner"),
            "url": repo.get("url"),
            "homepage": repo.get("homepage"),
            "visibility": repo.get("visibility"),
            "archived": bool(repo.get("archived")),
            "fork": bool(repo.get("fork")),
            "template": bool(repo.get("template")),
            "default_branch": repo.get("default_branch"),
            "license": repo.get("license"),
            "ssot_governance": ssot_governance,
            "legal_evidence": [
                {
                    "kind": item.get("kind"),
                    "name": item.get("name"),
                    "expression": item.get("expression"),
                    "path": item.get("path"),
                    "url": item.get("url"),
                    "scope": "direct",
                    "evidence_type": item.get("evidence"),
                }
                for item in repo.get("legal_evidence") or []
            ],
            "topics": sorted(repo.get("topics") or []),
            "created_at": repo.get("created_at"),
            "updated_at": repo.get("updated_at"),
            "pushed_at": repo.get("pushed_at"),
            "observed_at": checked_at,
            "metrics": {
                "stars": int(metrics.get("stars") or 0),
                "watchers": int(metrics.get("watchers") or 0),
                "forks": int(metrics.get("forks") or 0),
                "open_issues": int(metrics.get("open_issues") or 0),
                "size_kb": int(metrics.get("size_kb") or 0),
                "commits": int(activity.get("commit_count") or 0),
                "contributors": int(activity.get("contributor_count") or 0),
                "github_releases": len(repo.get("github_releases") or []),
                "deployments": len(repo.get("deployments") or []),
                "environments": len(repo.get("environments") or []),
                "packages": len(packages_by_repo.get(full_name, [])),
                "relationships": sum(relationship_counts[full_name].values()),
                "related_resources": len(related_resources),
            },
            "contributors": [
                {
                    "login": contributor.get("login"),
                    "contributions": int(contributor.get("contributions") or 0),
                    "url": contributor.get("url"),
                }
                for contributor in activity.get("contributors") or []
                if contributor.get("login")
            ],
            "commit_activity": daily_commit_activity(activity, checked_at),
            "technologies": sorted(languages),
            "relationship_counts": dict(sorted(relationship_counts[full_name].items())),
            "related_resources": related_resources,
            "package_ids": sorted(packages_by_repo.get(full_name, [])),
            "packages": [
                {
                    "id": package["id"],
                    "name": package["name"],
                    "ecosystem": package["ecosystem"],
                    "package_kind": package["package_kind"],
                    "manifest_path": package.get("manifest_path"),
                    "published": package["published"],
                    "publication_status": package["publication_status"],
                    "route": package["route"],
                }
                for package_id in sorted(packages_by_repo.get(full_name, []))
                if (package := packages_by_id.get(package_id)) is not None
            ],
            "latest_commit": activity.get("latest_commit"),
            "latest_release": latest_release,
            "github_releases": github_release_records,
            "latest_deployment": {
                "environment": (latest_deployment or {}).get("environment"),
                "state": (latest_status or {}).get("state"),
                "environment_url": (latest_status or {}).get("environment_url"),
                "log_url": (latest_status or {}).get("log_url"),
                "updated_at": (latest_status or {}).get("updated_at"),
            } if latest_deployment else None,
            "evidence": [
                *(
                    [{
                        "kind": "ssot-registry",
                        "url": ssot_governance.get("registry_url"),
                        "observed_at": ssot_governance.get("observed_at"),
                    }]
                    if ssot_governance.get("present")
                    else []
                ),
                *evidence("source", repo.get("url"), checked_at),
            ],
            "claim_boundary": override.get("claim_boundary") or (
                "SSOT artifact counts and coverage are registry-reported observations; "
                "they do not by themselves prove that every public product claim is supported."
                if ssot_governance.get("present")
                else "No canonical .ssot/registry.json was observed; repository, release, "
                "deployment, and live-service states are reported separately."
            ),
        }
        repository_records.append(record)
        for language, byte_count in languages.items():
            technology_repositories[language].add(full_name)
            technology_bytes[language] += int(byte_count or 0)

    resource_records = list(
        {
            resource["id"]: {
                **resource,
                "kind": "resource",
                "resource_type": resource["kind"],
                "display_name": resource.get("name") or resource["kind"],
                "description": (
                    f"Observed {resource['kind']} resource from {resource['repository']}."
                ),
                "description_source": "generated-factual",
                "evidence": evidence(
                    resource.get("evidence_type") or "source",
                    resource.get("url"),
                    resource["observed_at"],
                ),
                "claim_boundary": (
                    "The catalog confirms a public source location; runtime availability "
                    "and completeness are not inferred."
                ),
            }
            for repository in repository_records
            for resource in repository.get("related_resources", [])
        }.values()
    )

    technology_records = [{
        "id": f"technology:{slug(name)}:{stable_hash(name, 8)}",
        "kind": "technology",
        "name": name,
        "route": f"/catalog/technologies/{slug(name)}-{stable_hash(name, 8)}",
        "repository_count": len(technology_repositories[name]),
        "bytes": technology_bytes[name],
        "repositories": sorted(technology_repositories[name]),
        "observed_at": generated_at,
        "evidence": [{"kind": "github-languages", "observed_at": generated_at}],
    } for name in sorted(technology_repositories)]

    owner_definitions = catalog.get("scope", {}).get("owner_definitions") or [
        {"login": owner, "role": "ecosystem"} for owner in catalog.get("scope", {}).get("owners", [])
    ]
    repo_by_owner: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for record in repository_records:
        repo_by_owner[str(record["owner"])].append(record)
    organization_records: list[dict[str, Any]] = []
    org_overrides = editorial.get("organizations", {})
    for definition in owner_definitions:
        login = definition["login"]
        repos = repo_by_owner.get(login, [])
        repository_names = {item["full_name"] for item in repos}
        organization_packages = [
            item for item in package_records
            if item.get("owner") == login or item.get("repository") in repository_names
        ]
        package_count = len(organization_packages)
        package_names = {
            f"{item.get('ecosystem')}:{item.get('name')}"
            for item in catalog.get("packages", [])
            if item.get("repository") in repository_names
        }
        organization_relationships = sum(
            1 for item in catalog.get("relationships", [])
            if item.get("source") in repository_names | package_names or item.get("target") in repository_names | package_names
        )
        selected = sorted(repos, key=lambda item: (-item["metrics"]["stars"], -item["metrics"]["commits"], item["full_name"]))[:8]
        override = org_overrides.get(login, {})
        organization_records.append({
            "id": f"organization:{login}",
            "kind": "organization",
            "login": login,
            "display_name": override.get("display_name") or login.title(),
            "description": override.get("description") or f"Public ecosystem inventory for the {login} GitHub organization.",
            "role": definition.get("role"),
            "route": f"/products/{login}" if login in {"groupsum", "tigrbl", "swarmauri"} else "/catalog",
            "repository_count": len(repos),
            "package_count": package_count,
            "stars": sum(item["metrics"]["stars"] for item in repos),
            "watchers": sum(item["metrics"]["watchers"] for item in repos),
            "forks": sum(item["metrics"]["forks"] for item in repos),
            "commits": sum(item["metrics"]["commits"] for item in repos),
            "contributors": len({contributor.get("login") for repo in catalog.get("repositories", []) if repo.get("owner") == login for contributor in (repo.get("activity") or {}).get("contributors", []) if contributor.get("login")}),
            "github_releases": sum(item["metrics"]["github_releases"] for item in repos),
            "package_releases": sum(int(item.get("release_count") or 0) for item in organization_packages),
            "deployments": sum(item["metrics"]["deployments"] for item in repos),
            "relationships": organization_relationships,
            "technologies": sorted({technology for item in repos for technology in item["technologies"]}),
            "featured_repositories": [{"id": item["id"], "name": item["display_name"], "route": item["route"], "description": item["description"], "metrics": item["metrics"]} for item in selected],
            "observed_at": generated_at,
            "evidence": evidence("organization", f"https://github.com/{login}", generated_at),
        })

    result = {
        "organizations": organization_records,
        "repositories": repository_records,
        "packages": package_records,
        "resources": resource_records,
        "technologies": technology_records,
    }
    for records in result.values():
        records.sort(key=lambda item: (str(item.get("name") or item.get("display_name") or "").lower(), item["id"]))
    return result


def typescript_summary(summary: dict[str, Any], datasets: dict[str, list[dict[str, Any]]], manifest: dict[str, Any]) -> str:
    repositories = sorted(
        datasets["repositories"],
        key=lambda item: (-item["metrics"]["stars"], -item["metrics"]["commits"], item["full_name"]),
    )[:12]
    featured = [{key: item[key] for key in ("id", "route", "display_name", "description", "owner", "metrics", "technologies", "observed_at")} for item in repositories]
    technologies = sorted(datasets["technologies"], key=lambda item: (-item["repository_count"], -item["bytes"], item["name"]))
    values = {
        "catalogSummary": summary,
        "catalogOrganizations": datasets["organizations"],
        "catalogFeaturedRepositories": featured,
        "catalogTechnologies": technologies,
        "catalogDatasetManifest": manifest,
    }
    lines = ["// Generated by scripts/catalog_render.py. Do not edit manually."]
    for name, value in values.items():
        lines.append(f"export const {name} = {json.dumps(value, indent=2, sort_keys=True, ensure_ascii=False)} as const;")
    return "\n\n".join(lines) + "\n"


def write_product_evidence(
    directory: Path,
    catalog: dict[str, Any],
    datasets: dict[str, list[dict[str, Any]]],
    attachments_path: Path | None = None,
) -> int:
    """Emit small repository-scoped joins for product pages without loading the full package catalog."""
    if directory.exists():
        shutil.rmtree(directory)
    repositories = {record["full_name"]: record for record in datasets["repositories"]}
    packages_by_repository: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for package in datasets["packages"]:
        if package.get("repository"):
            packages_by_repository[str(package["repository"])].append(package)
    for full_name, repository in repositories.items():
        owner, name = full_name.split("/", 1)
        bundle = {
            "schema_version": "1.0.0",
            "generated_at": catalog["generated_at"],
            "repository": repository,
            "packages": sorted(packages_by_repository.get(full_name, []), key=lambda item: (item.get("ecosystem", ""), item.get("name", ""))),
        }
        write_json(directory / owner / f"{name}.json", bundle)

    if attachments_path and attachments_path.exists():
        attachments = json.loads(attachments_path.read_text(encoding="utf-8"))
        for record_key, attachment in attachments.get("records", {}).items():
            repository_names = attachment.get("repositories", [])
            attached_repositories = [repositories[name] for name in repository_names if name in repositories]
            if not attached_repositories:
                continue
            primary_name = attachment.get("primary_repository")
            primary = repositories.get(primary_name, attached_repositories[0])
            resource_terms = [
                str(term).lower() for term in attachment.get("resource_contains", []) if str(term)
            ]
            merged_repository = dict(primary)
            merged_repository["attached_repositories"] = [
                {
                    "id": repository["id"],
                    "full_name": repository["full_name"],
                    "route": repository["route"],
                    "source_url": repository.get("source_url") or repository.get("url"),
                    "description": repository["description"],
                    "default_branch": repository.get("default_branch"),
                    "archived": repository.get("archived", False),
                    "fork": repository.get("fork", False),
                    "metrics": repository.get("metrics", {}),
                    "latest_release": repository.get("latest_release"),
                    "github_releases": repository.get("github_releases", []),
                    "latest_deployment": repository.get("latest_deployment"),
                    "ssot_governance": repository.get("ssot_governance", {}),
                    "attachment_role": attachment.get("repository_roles", {}).get(
                        repository["full_name"], "implementation"
                    ),
                }
                for repository in attached_repositories
            ]
            merged_repository["related_resources"] = sorted(
                ({
                    resource["id"]: resource
                    for repository in attached_repositories
                    for resource in repository.get("related_resources", [])
                    if not resource_terms
                    or any(
                        term
                        in " ".join(
                            str(resource.get(field, "")).lower()
                            for field in ("name", "url", "kind")
                        )
                        for term in resource_terms
                    )
                } | {
                    resource.get("id")
                    or f"resource:{stable_hash(str(resource.get('url') or resource.get('name')))}": {
                        "id": resource.get("id")
                        or f"resource:{stable_hash(str(resource.get('url') or resource.get('name')))}",
                        **resource,
                    }
                    for resource in attachment.get("resources", [])
                }).values(),
                key=lambda item: (item.get("kind", ""), item.get("name", "")),
            )
            merged_packages = sorted(
                {
                    package["id"]: {
                        **package,
                        "attachment_role": attachment.get("package_roles", {}).get(
                            str(package.get("repository")), "distribution"
                        ),
                    }
                    for repository_name in attachment.get("package_repositories", repository_names)
                    for package in packages_by_repository.get(repository_name, [])
                }.values(),
                key=lambda item: (item.get("ecosystem", ""), item.get("name", "")),
            )
            owner, name = record_key.split("/", 1)
            write_json(
                directory / owner / f"{name}.json",
                {
                    "schema_version": "1.0.0",
                    "generated_at": catalog["generated_at"],
                    "repository": merged_repository,
                    "packages": merged_packages,
                },
            )
    return len(list(directory.glob("*/*.json")))


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--catalog", type=Path, default=ROOT / "catalog" / "generated" / "catalog.json")
    parser.add_argument("--summary", type=Path, default=ROOT / "catalog" / "generated" / "summary.json")
    parser.add_argument("--site-dir", type=Path, default=ROOT / "catalog" / "generated" / "site")
    parser.add_argument("--product-evidence-dir", type=Path, default=ROOT / "catalog" / "generated" / "product-evidence")
    parser.add_argument("--editorial", type=Path, default=ROOT / "catalog" / "content" / "editorial.json")
    parser.add_argument(
        "--record-attachments",
        type=Path,
        default=ROOT / "catalog" / "content" / "record-attachments.json",
    )
    parser.add_argument("--typescript", type=Path, default=ROOT / "src" / "data" / "catalog.generated.ts")
    args = parser.parse_args()
    catalog = json.loads(args.catalog.read_text(encoding="utf-8"))
    editorial = load_editorial(args.editorial)
    summary = summarize(catalog)
    datasets = compile_catalog(catalog, editorial)
    args.summary.parent.mkdir(parents=True, exist_ok=True)
    args.typescript.parent.mkdir(parents=True, exist_ok=True)
    args.site_dir.mkdir(parents=True, exist_ok=True)
    for stale_name in ("releases", "deployments", "relationships", "surfaces"):
        (args.site_dir / f"{stale_name}.json").unlink(missing_ok=True)
    write_json(args.summary, summary)
    files = []
    for name, records in datasets.items():
        files.append({"dataset": name, **write_json(args.site_dir / f"{name}.json", records)})
    product_evidence_count = write_product_evidence(
        args.product_evidence_dir,
        catalog,
        datasets,
        args.record_attachments,
    )
    manifest = {
        "schema_version": "1.0.0",
        "generated_at": catalog["generated_at"],
        "source": "/catalog/catalog.json",
        "files": sorted(files, key=lambda item: item["dataset"]),
        "counts": {name: len(records) for name, records in sorted(datasets.items())},
        "source_counts": {
            "releases": summary["github_releases"] + summary["registry_release_versions"] + summary["github_package_versions"],
            "deployments": summary["deployments"],
            "relationships": summary["relationships"],
        },
        "product_evidence": {"path": "/catalog/product-evidence/", "records": product_evidence_count},
        "completeness": catalog.get("completeness", {}),
    }
    write_json(args.site_dir / "manifest.json", manifest)
    args.typescript.write_text(typescript_summary(summary, datasets, manifest), encoding="utf-8")
    print(json.dumps({"generated_at": catalog["generated_at"], "counts": manifest["counts"]}, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
