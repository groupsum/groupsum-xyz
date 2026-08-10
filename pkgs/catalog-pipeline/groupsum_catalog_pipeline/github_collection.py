from __future__ import annotations

import re
import time
import urllib.error
import urllib.parse
from pathlib import Path
from typing import Any

from .collector_common import *
from .package_collection import *
from .resource_discovery import *


def collect_repository(client: ApiClient, repo: dict[str, Any], config: dict[str, Any]) -> dict[str, Any]:
    full_name = repo["full_name"]
    observations: list[Observation] = []
    repo_detail, _, repo_obs = client.request_json(f"https://api.github.com/repos/{full_name}", github=True)
    observations.append(repo_obs)
    if isinstance(repo_detail, dict):
        repo = repo_detail
    languages, _, obs = client.request_json(f"https://api.github.com/repos/{full_name}/languages", github=True)
    observations.append(obs)
    contributors, contributor_obs = client.github_pages(f"repos/{full_name}/contributors?per_page=100&anon=1")
    observations.extend(contributor_obs)
    releases, release_obs = client.github_pages(f"repos/{full_name}/releases?per_page=100")
    observations.extend(release_obs)
    deployments: list[dict[str, Any]] = []
    environments: list[dict[str, Any]] = []
    if config.get("include_deployments", True):
        deployment_limit = max(
            0, int(config.get("max_deployments_per_repository", 30))
        )
        status_limit = max(
            0, int(config.get("max_deployment_statuses_per_deployment", 20))
        )
        raw_deployments, deployment_obs = client.github_pages(
            f"repos/{full_name}/deployments?per_page=100", limit=deployment_limit
        )
        observations.extend(deployment_obs)
        for item in raw_deployments:
            statuses, status_obs = client.github_pages(
                f"repos/{full_name}/deployments/{item.get('id')}/statuses?per_page=100",
                limit=status_limit,
            )
            observations.extend(status_obs)
            deployments.append({
                "id": str(item.get("id")), "environment": item.get("environment"),
                "ref": item.get("ref"), "sha": item.get("sha"), "task": item.get("task"),
                "created_at": item.get("created_at"), "updated_at": item.get("updated_at"),
                "statuses_url": item.get("statuses_url"),
                "statuses": [
                    {"id": str(status.get("id")), "state": status.get("state"), "environment": status.get("environment"),
                     "environment_url": status.get("environment_url"), "log_url": status.get("log_url"),
                     "created_at": status.get("created_at"), "updated_at": status.get("updated_at")}
                    for status in statuses
                ],
            })
        environment_body, _, environment_obs = client.request_json(
            f"https://api.github.com/repos/{full_name}/environments?per_page=100", github=True, allow_404=True
        )
        observations.append(environment_obs)
        environments = [
            {"name": item.get("name"), "url": item.get("html_url"), "created_at": item.get("created_at"), "updated_at": item.get("updated_at")}
            for item in (environment_body or {}).get("environments", [])
        ]
    commits: list[dict[str, Any]] = []
    commit_count: int | None = None
    latest_commit: dict[str, Any] | None = None
    if config.get("include_commit_history", True):
        raw_commits, commit_obs = client.github_pages(f"repos/{full_name}/commits?per_page=100")
        observations.extend(commit_obs)
        for commit in raw_commits:
            normalized = {
                "sha": commit.get("sha"), "url": commit.get("html_url"),
                "authored_at": commit.get("commit", {}).get("author", {}).get("date"),
                "committed_at": commit.get("commit", {}).get("committer", {}).get("date"),
                "author": (commit.get("author") or {}).get("login") or commit.get("commit", {}).get("author", {}).get("name"),
                "committer": (commit.get("committer") or {}).get("login") or commit.get("commit", {}).get("committer", {}).get("name"),
                "message": (commit.get("commit", {}).get("message") or "").splitlines()[0],
            }
            commits.append(normalized)
        commit_count = len(commits)
        latest_commit = commits[0] if commits else None
    else:
        body, headers, commit_obs = client.request_json(f"https://api.github.com/repos/{full_name}/commits?per_page=1", github=True)
        observations.append(commit_obs)
        commit_count = last_page_count(headers, len(body or []))
        if body:
            latest_commit = {"sha": body[0].get("sha"), "url": body[0].get("html_url"), "committed_at": body[0].get("commit", {}).get("committer", {}).get("date")}

    tree, _, tree_obs = client.request_json(
        f"https://api.github.com/repos/{full_name}/git/trees/{urllib.parse.quote(repo['default_branch'], safe='')}?recursive=1",
        github=True,
    )
    observations.append(tree_obs)
    tree_items = (tree or {}).get("tree", []) if isinstance(tree, dict) else []
    all_paths = [item["path"] for item in tree_items if item.get("type") == "blob" and item.get("path")]
    manifest_names = set(config.get("manifest_names", []))
    manifest_paths = [path for path in all_paths if Path(path).name in manifest_names]
    manifest_limit = int(config.get("max_manifests_per_repository", 500))
    manifest_paths = manifest_paths[:manifest_limit]
    resource_markers = {str(item).lower() for item in config.get("related_resource_path_markers", [])}
    related_resources = discover_related_resources(
        repo, all_paths, resource_markers,
        int(config.get("max_related_resources_per_repository", 200)),
    )
    legal_evidence = repository_legal_evidence(repo, all_paths)
    ssot_governance, ssot_observation = collect_ssot_governance(client, repo)
    observations.append(ssot_observation)
    manifests: list[dict[str, Any]] = []
    packages: list[dict[str, Any]] = []
    dependencies: list[dict[str, str]] = []
    ghcr_images: set[str] = set()
    metadata_paths = [
        path for path in all_paths
        if (
            path.lower().startswith(".github/workflows/")
            or "deploy" in path.lower()
            or Path(path).name.lower().startswith("docker-compose")
            or Path(path).name.lower() in {"dockerfile", "compose.yaml", "compose.yml"}
        )
        and Path(path).suffix.lower() in {".json", ".toml", ".yaml", ".yml", ""}
    ][:100]
    for path in sorted(set(manifest_paths + metadata_paths)):
        try:
            text, text_obs = client.request_text(raw_url(repo, path))
            observations.append(text_obs)
            if text is None:
                raise OSError(text_obs.detail or "manifest fetch failed")
            if path in manifest_paths:
                package, parsed_dependencies = manifest_package(path, text, repo)
                manifests.append({"path": path, "kind": Path(path).name, "parsed": package is not None})
                if package:
                    packages.append(package)
                dependencies.extend(parsed_dependencies)
            for image in re.findall(r"ghcr\.io/[A-Za-z0-9_.-]+/[A-Za-z0-9_./-]+", text, flags=re.IGNORECASE):
                ghcr_images.add(image.rstrip("'\" ,}"))
        except (urllib.error.URLError, TimeoutError, OSError):
            if path in manifest_paths:
                manifests.append({"path": path, "kind": Path(path).name, "parsed": False})

    contributor_rows = [
        {
            "id": str(item.get("id")) if item.get("id") is not None else None,
            "login": item.get("login"),
            "name": item.get("name"),
            "contributions": int(item.get("contributions") or 0),
            "url": item.get("html_url"),
            "avatar_url": item.get("avatar_url"),
            "account_type": item.get("type"),
            "anonymous": item.get("login") is None,
        }
        for item in contributors
        if item.get("login") or item.get("name")
    ]
    github_releases = [
        {
            "tag": release.get("tag_name"), "name": release.get("name"), "url": release.get("html_url"),
            "published_at": release.get("published_at"), "draft": bool(release.get("draft")),
            "prerelease": bool(release.get("prerelease")),
            "assets": [{"name": asset.get("name"), "url": asset.get("browser_download_url"), "downloads": asset.get("download_count")} for asset in release.get("assets", [])],
        }
        for release in releases
    ]
    return {
        "id": str(repo["id"]), "owner": repo["owner"]["login"], "name": repo["name"], "full_name": full_name,
        "url": repo["html_url"], "description": repo.get("description"), "homepage": repo.get("homepage") or None,
        "visibility": repo.get("visibility", "public"), "archived": bool(repo.get("archived")), "disabled": bool(repo.get("disabled")),
        "fork": bool(repo.get("fork")), "template": bool(repo.get("is_template")), "default_branch": repo.get("default_branch"),
        "created_at": repo.get("created_at"), "updated_at": repo.get("updated_at"), "pushed_at": repo.get("pushed_at"),
        "license": (repo.get("license") or {}).get("spdx_id"), "topics": sorted(repo.get("topics") or []),
        "metrics": {"stars": repo.get("stargazers_count", 0), "watchers": repo.get("subscribers_count", 0), "forks": repo.get("forks_count", 0), "open_issues": repo.get("open_issues_count", 0), "size_kb": repo.get("size", 0)},
        "activity": {"commit_count": commit_count, "commit_history": commits, "latest_commit": latest_commit, "contributors": contributor_rows, "contributor_count": len(contributor_rows), "contributor_commit_total": sum(row["contributions"] for row in contributor_rows)},
        "technologies": {"languages_bytes": languages or {}, "verified_from": "github.languages"},
        "manifests": manifests, "packages_discovered": packages, "dependencies_discovered": dependencies,
        "github_releases": github_releases, "ghcr_images_discovered": sorted(ghcr_images),
        "deployments": deployments, "environments": environments,
        "related_resources": related_resources,
        "legal_evidence": legal_evidence,
        "ssot_governance": ssot_governance,
        "tree": {"truncated": bool((tree or {}).get("truncated")) if isinstance(tree, dict) else None, "blob_count": len(all_paths), "manifest_count": len(manifest_paths), "manifest_limit_reached": len([path for path in all_paths if Path(path).name in manifest_names]) > manifest_limit},
        "observations": [item.as_dict() for item in observations],
    }


def collect_owner_packages(client: ApiClient, owner: str) -> tuple[list[dict[str, Any]], list[Observation]]:
    packages: list[dict[str, Any]] = []
    observations: list[Observation] = []
    for package_type in ("container", "npm"):
        rows, obs = client.github_pages(f"orgs/{owner}/packages?package_type={package_type}&visibility=public&per_page=100")
        observations.extend(obs)
        for row in rows:
            package_name = row.get("name")
            encoded_name = urllib.parse.quote(package_name or "", safe="")
            versions, version_obs = client.github_pages(
                f"orgs/{owner}/packages/{package_type}/{encoded_name}/versions?per_page=100"
            )
            observations.extend(version_obs)
            packages.append({
                "ecosystem": "ghcr" if package_type == "container" else "github-npm",
                "name": package_name, "url": row.get("html_url"), "created_at": row.get("created_at"),
                "updated_at": row.get("updated_at"), "owner": owner, "published": True,
                "repository": (row.get("repository") or {}).get("full_name"),
                "versions": [
                    {"id": str(version.get("id")), "name": version.get("name"), "url": version.get("html_url"),
                     "created_at": version.get("created_at"), "updated_at": version.get("updated_at"),
                     "metadata": version.get("metadata")}
                    for version in versions
                ],
                "evidence": "github.packages_api",
            })
    return packages, observations


def discover_github_downstream(
    client: ApiClient, packages: list[dict[str, Any]], config: dict[str, Any]
) -> tuple[list[dict[str, Any]], list[Observation]]:
    settings = config.get("downstream_discovery", {})
    if not settings.get("github_code_search"):
        return [], []
    max_results = min(int(settings.get("max_results_per_package", 100)), 1000)
    relationships: list[dict[str, Any]] = []
    observations: list[Observation] = []
    filename_by_ecosystem = {"npm": "package.json", "pypi": "pyproject.toml", "crates": "Cargo.toml"}
    seen: set[tuple[str, str, str]] = set()
    unique_packages = {
        (package["ecosystem"], package["name"]): package
        for package in packages
        if package.get("ecosystem") in filename_by_ecosystem and package.get("published") is True
    }
    for (ecosystem, name), package in sorted(unique_packages.items()):
        collected = 0
        for page in range(1, (max_results + 99) // 100 + 1):
            query = urllib.parse.urlencode({"q": f'"{name}" filename:{filename_by_ecosystem[ecosystem]}', "per_page": min(max_results, 100), "page": page})
            body, _, observation = client.request_json(
                f"https://api.github.com/search/code?{query}", github=True, use_cache=True
            )
            observations.append(observation)
            items = (body or {}).get("items", [])
            for item in items:
                downstream_repo = (item.get("repository") or {}).get("full_name")
                if not downstream_repo or downstream_repo == package.get("repository"):
                    continue
                key = (f"{ecosystem}:{name}", downstream_repo, item.get("path") or "")
                if key in seen:
                    continue
                seen.add(key)
                relationships.append({
                    "kind": "package_observed_in_downstream_repository", "source": key[0], "target": downstream_repo,
                    "path": key[2], "url": item.get("html_url"), "evidence": "github.code_search",
                    "completeness": "bounded_public_code_search",
                })
                collected += 1
                if collected >= max_results:
                    break
            if collected >= max_results or len(items) < min(max_results, 100):
                break
            time.sleep(6.5)
    return relationships, observations
