from __future__ import annotations

from collections import Counter, defaultdict
from typing import Any

from .common import *  # noqa: F403

def compile_repositories(catalog: dict[str, Any], generated_at: str, overrides: dict[str, Any], relationship_counts: dict[str, Counter[str]], package_records: list[dict[str, Any]], packages_by_repo: dict[str, list[str]]) -> tuple[list[dict[str, Any]], dict[str, set[str]], Counter[str]]:
    repository_records: list[dict[str, Any]] = []
    technology_repositories: dict[str, set[str]] = defaultdict(set)
    technology_bytes: Counter[str] = Counter()
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
        repository_legal_evidence = [
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
            if not item.get("path") or "/" not in str(item.get("path"))
        ]
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
            "legal_evidence": repository_legal_evidence,
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
            "language_bytes": {
                language: int(byte_count or 0)
                for language, byte_count in sorted(languages.items())
            },
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
                    "latest_version": package.get("latest_version"),
                    "release_count": package.get("release_count", 0),
                    "release_activity": release_activity(package.get("releases") or []),
                    "last_published_at": next(
                        (
                            release.get("published_at")
                            for release in package.get("releases") or []
                            if release.get("published_at")
                        ),
                        None,
                    ),
                    "license_expression": package.get("license_expression"),
                    "license_status": package.get("license_status"),
                    "license_url": next(
                        (
                            item.get("url")
                            for item in package.get("legal_evidence") or []
                            if item.get("kind") == "license-file" and item.get("url")
                        ),
                        None,
                    ),
                    "notice_count": sum(
                        1
                        for item in package.get("legal_evidence") or []
                        if item.get("kind") == "notice-file"
                    ),
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

    return repository_records, technology_repositories, technology_bytes
