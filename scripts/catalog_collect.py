#!/usr/bin/env python3
"""Collect and normalize the public Groupsum ecosystem catalog.

Only primary APIs and repository manifests are treated as observed evidence.
Missing APIs, pagination caps, truncated trees, and registry lookup failures are
recorded in the output rather than converted into negative claims.
"""

from __future__ import annotations

import argparse
import concurrent.futures
import dataclasses
import datetime as dt
import hashlib
import json
import os
import re
import subprocess
import sys
import threading
import time
import tomllib
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any, Iterable

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CONFIG = ROOT / "catalog" / "catalog.config.json"
DEFAULT_OUTPUT = ROOT / "catalog" / "generated" / "catalog.json"
DEFAULT_SUMMARY = ROOT / "catalog" / "generated" / "summary.json"
DEFAULT_TYPESCRIPT = ROOT / "src" / "data" / "catalog.generated.ts"
USER_AGENT = "groupsum-xyz-catalog/1.0 (+https://groupsum.xyz)"
ISO_NOW = lambda: dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


@dataclasses.dataclass
class Observation:
    source: str
    status: str
    observed_at: str
    detail: str | None = None
    url: str | None = None

    def as_dict(self) -> dict[str, Any]:
        return {key: value for key, value in dataclasses.asdict(self).items() if value is not None}


class ApiClient:
    def __init__(self, config: dict[str, Any], cache_dir: Path, refresh: bool = False) -> None:
        self.timeout = int(config.get("request_timeout_seconds", 30))
        self.ttl = dt.timedelta(hours=float(config.get("cache_ttl_hours", 6)))
        self.cache_dir = cache_dir
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        self.refresh = refresh
        self.token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN") or self._gh_token()
        self._write_lock = threading.Lock()

    @staticmethod
    def _gh_token() -> str | None:
        try:
            result = subprocess.run(
                ["gh", "auth", "token"], capture_output=True, text=True, timeout=10, check=False
            )
        except (FileNotFoundError, subprocess.SubprocessError):
            return None
        return result.stdout.strip() if result.returncode == 0 and result.stdout.strip() else None

    def _cache_path(self, url: str) -> Path:
        return self.cache_dir / f"{hashlib.sha256(url.encode()).hexdigest()}.json"

    def _read_cache(self, url: str) -> tuple[Any, dict[str, str]] | None:
        path = self._cache_path(url)
        if self.refresh or not path.exists():
            return None
        try:
            payload = json.loads(path.read_text(encoding="utf-8"))
            fetched = dt.datetime.fromisoformat(payload["fetched_at"].replace("Z", "+00:00"))
            if dt.datetime.now(dt.timezone.utc) - fetched > self.ttl:
                return None
            return payload["body"], payload.get("headers", {})
        except (KeyError, ValueError, OSError, json.JSONDecodeError):
            return None

    def _write_cache(self, url: str, body: Any, headers: dict[str, str]) -> None:
        payload = {"fetched_at": ISO_NOW(), "url": url, "headers": headers, "body": body}
        with self._write_lock:
            self._cache_path(url).write_text(json.dumps(payload, sort_keys=True), encoding="utf-8")

    def request_json(
        self,
        url: str,
        *,
        github: bool = False,
        allow_404: bool = False,
        use_cache: bool = True,
        retries: int = 3,
    ) -> tuple[Any | None, dict[str, str], Observation]:
        cached = self._read_cache(url) if use_cache else None
        if cached:
            body, headers = cached
            return body, headers, Observation(url, "cached", ISO_NOW(), url=url)

        headers = {"Accept": "application/json", "User-Agent": USER_AGENT}
        if github:
            headers["Accept"] = "application/vnd.github+json"
            headers["X-GitHub-Api-Version"] = "2022-11-28"
            if self.token:
                headers["Authorization"] = f"Bearer {self.token}"
        request = urllib.request.Request(url, headers=headers)
        for attempt in range(retries):
            try:
                with urllib.request.urlopen(request, timeout=self.timeout) as response:
                    response_headers = {key.lower(): value for key, value in response.headers.items()}
                    body = json.loads(response.read().decode("utf-8"))
                    if use_cache:
                        self._write_cache(url, body, response_headers)
                    return body, response_headers, Observation(url, "observed", ISO_NOW(), url=url)
            except urllib.error.HTTPError as exc:
                if exc.code == 404 and allow_404:
                    return None, {}, Observation(url, "not_found", ISO_NOW(), url=url)
                if exc.code in {403, 429} and attempt + 1 < retries:
                    retry_after = int(exc.headers.get("Retry-After", "2"))
                    time.sleep(min(retry_after * (attempt + 1), 20))
                    continue
                return None, {}, Observation(url, "error", ISO_NOW(), f"HTTP {exc.code}", url)
            except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
                if attempt + 1 < retries:
                    time.sleep(2**attempt)
                    continue
                return None, {}, Observation(url, "error", ISO_NOW(), str(exc), url)
        return None, {}, Observation(url, "error", ISO_NOW(), "retry budget exhausted", url)

    def request_text(self, url: str, *, use_cache: bool = True) -> tuple[str | None, Observation]:
        cached = self._read_cache(url) if use_cache else None
        if cached and isinstance(cached[0], str):
            return cached[0], Observation(url, "cached", ISO_NOW(), url=url)
        request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        try:
            with urllib.request.urlopen(request, timeout=self.timeout) as response:
                headers = {key.lower(): value for key, value in response.headers.items()}
                body = response.read().decode("utf-8", errors="replace")
                if use_cache:
                    self._write_cache(url, body, headers)
                return body, Observation(url, "observed", ISO_NOW(), url=url)
        except (urllib.error.URLError, TimeoutError, OSError) as exc:
            return None, Observation(url, "error", ISO_NOW(), str(exc), url)

    def github_pages(self, path: str) -> tuple[list[Any], list[Observation]]:
        url = f"https://api.github.com/{path.lstrip('/')}"
        items: list[Any] = []
        observations: list[Observation] = []
        while url:
            body, headers, observation = self.request_json(url, github=True)
            observations.append(observation)
            if not isinstance(body, list):
                break
            items.extend(body)
            url = parse_next_link(headers.get("link"))
        return items, observations


def parse_next_link(link: str | None) -> str | None:
    if not link:
        return None
    for part in link.split(","):
        match = re.match(r'\s*<([^>]+)>;\s*rel="([^"]+)"', part)
        if match and match.group(2) == "next":
            return match.group(1)
    return None


def last_page_count(headers: dict[str, str], current_items: int) -> int | None:
    link = headers.get("link", "")
    for part in link.split(","):
        match = re.match(r'\s*<([^>]+)>;\s*rel="last"', part)
        if match:
            query = urllib.parse.parse_qs(urllib.parse.urlparse(match.group(1)).query)
            try:
                return int(query["page"][0])
            except (KeyError, ValueError, IndexError):
                pass
    return current_items if current_items < 100 else None


def filter_repositories(repositories: Iterable[dict[str, Any]], config: dict[str, Any]) -> list[dict[str, Any]]:
    """Apply configured repository scope before any expensive collection work."""
    excluded_names = {str(name).casefold() for name in config.get("excluded_repository_names", [])}
    result = [repo for repo in repositories if str(repo.get("name") or "").casefold() not in excluded_names]
    if not config.get("include_archived_repositories", True):
        result = [repo for repo in result if not repo.get("archived")]
    if not config.get("include_forks", True):
        result = [repo for repo in result if not repo.get("fork")]
    return result


def discover_related_resources(
    repo: dict[str, Any], paths: Iterable[str], markers: set[str], limit: int = 200
) -> list[dict[str, Any]]:
    """Find source-backed child resources without promoting them to standalone catalog entities."""
    resources: dict[tuple[str, str], dict[str, Any]] = {}
    homepage = str(repo.get("homepage") or "").strip()
    if homepage:
        resources[("website", homepage)] = {
            "kind": "website", "name": repo["name"], "url": homepage,
            "evidence": "repository.homepage",
        }
    kind_by_marker = {
        "api": "api", "apis": "api", "demo": "demo", "demos": "demo",
        "docs": "documentation", "example": "example", "examples": "example",
        "showcase": "showcase", "showcases": "showcase", "ui": "ui", "uis": "ui",
        "website": "website", "websites": "website",
    }
    for path in sorted(paths):
        path_parts = list(Path(path).parts)
        lower_parts = [part.lower() for part in path_parts]
        filename = Path(path).name.lower()
        if any(token in filename for token in ("openapi", "openrpc", "asyncapi")) or Path(path).suffix.lower() == ".proto":
            resources[("api", path)] = {
                "kind": "api", "name": path, "path": path,
                "url": f"{repo['html_url']}/blob/{repo['default_branch']}/{path}",
                "evidence": "repository.contract_file",
            }
        matching_indexes = [index for index, part in enumerate(lower_parts) if part in markers]
        if not matching_indexes:
            continue
        index = matching_indexes[0]
        marker = lower_parts[index]
        root = "/".join(path_parts[: min(index + 2, len(path_parts))])
        kind = kind_by_marker.get(marker, marker)
        route_kind = "blob" if Path(root).suffix else "tree"
        resources[(kind, root)] = {
            "kind": kind, "name": root, "path": root,
            "url": f"{repo['html_url']}/{route_kind}/{repo['default_branch']}/{root}",
            "evidence": f"repository.{route_kind}",
        }
        if len(resources) >= limit:
            break
    return sorted(resources.values(), key=lambda item: (item["kind"], item["name"]))[:limit]


def normalize_license_expression(value: Any) -> str | None:
    """Keep concise license identifiers/expressions without copying license text."""
    if isinstance(value, dict):
        value = value.get("type") or value.get("name")
    if isinstance(value, list):
        values = [normalize_license_expression(item) for item in value]
        return " OR ".join(item for item in values if item) or None
    if not isinstance(value, str):
        return None
    candidate = value.strip()
    if not candidate or len(candidate) > 200 or "\n" in candidate or "\r" in candidate:
        return None
    return candidate


def repository_legal_evidence(
    repo: dict[str, Any], paths: Iterable[str]
) -> list[dict[str, Any]]:
    """Describe public license and notice evidence without embedding legal text."""
    evidence: list[dict[str, Any]] = []
    expression = normalize_license_expression((repo.get("license") or {}).get("spdx_id"))
    if expression and expression != "NOASSERTION":
        evidence.append(
            {
                "kind": "license-expression",
                "name": "GitHub detected license",
                "expression": expression,
                "url": repo.get("html_url"),
                "evidence": "github.repository.license",
            }
        )
    for path in sorted(paths):
        filename = Path(path).name.casefold()
        normalized = re.sub(r"[^a-z0-9]+", "_", filename).strip("_")
        if normalized == "license" or normalized.startswith("license_") or normalized == "copying" or normalized.startswith("copying_"):
            kind = "license-file"
        elif normalized == "notice" or normalized.startswith("notice_") or normalized.startswith("third_party_notice"):
            kind = "notice-file"
        else:
            continue
        evidence.append(
            {
                "kind": kind,
                "name": Path(path).name,
                "path": path,
                "url": f"{repo['html_url']}/blob/{repo['default_branch']}/{path}",
                "evidence": "repository.tree",
            }
        )
    return evidence[:100]


def manifest_package(path: str, text: str, repo: dict[str, Any]) -> tuple[dict[str, Any] | None, list[dict[str, str]]]:
    dependencies: list[dict[str, str]] = []
    package: dict[str, Any] | None = None
    try:
        if path.endswith("package.json"):
            data = json.loads(text)
            for group in ("dependencies", "devDependencies", "peerDependencies", "optionalDependencies"):
                for name, requirement in (data.get(group) or {}).items():
                    dependencies.append({"name": name, "requirement": str(requirement), "scope": group})
            for name in data.get("bundledDependencies") or data.get("bundleDependencies") or []:
                dependencies.append({"name": str(name), "requirement": "bundled", "scope": "bundledDependencies"})
            if data.get("name"):
                package = {"ecosystem": "npm", "name": data["name"], "version_declared": data.get("version"), "private": bool(data.get("private", False)), "license_expression": normalize_license_expression(data.get("license"))}
        elif path.endswith("pyproject.toml"):
            data = tomllib.loads(text)
            project = data.get("project", {})
            poetry = data.get("tool", {}).get("poetry", {})
            name = project.get("name") or poetry.get("name")
            raw_dependencies = project.get("dependencies", [])
            for value in raw_dependencies:
                match = re.match(r"\s*([A-Za-z0-9_.-]+)(.*)", str(value))
                if match:
                    dependencies.append({"name": match.group(1), "requirement": match.group(2).strip() or "*", "scope": "dependencies"})
            for group, values in (project.get("optional-dependencies") or {}).items():
                for value in values:
                    match = re.match(r"\s*([A-Za-z0-9_.-]+)(.*)", str(value))
                    if match:
                        dependencies.append({"name": match.group(1), "requirement": match.group(2).strip() or "*", "scope": f"optional-dependencies.{group}"})
            for value in (data.get("build-system", {}).get("requires") or []):
                match = re.match(r"\s*([A-Za-z0-9_.-]+)(.*)", str(value))
                if match:
                    dependencies.append({"name": match.group(1), "requirement": match.group(2).strip() or "*", "scope": "build-system.requires"})
            for group, values in (data.get("dependency-groups") or {}).items():
                for value in values:
                    if not isinstance(value, str):
                        continue
                    match = re.match(r"\s*([A-Za-z0-9_.-]+)(.*)", value)
                    if match:
                        dependencies.append({"name": match.group(1), "requirement": match.group(2).strip() or "*", "scope": f"dependency-groups.{group}"})
            for dep_name, requirement in (poetry.get("dependencies") or {}).items():
                if dep_name.lower() != "python":
                    dependencies.append({"name": dep_name, "requirement": str(requirement), "scope": "dependencies"})
            for group, group_data in (poetry.get("group") or {}).items():
                for dep_name, requirement in (group_data.get("dependencies") or {}).items():
                    dependencies.append({"name": dep_name, "requirement": str(requirement), "scope": f"tool.poetry.group.{group}.dependencies"})
            for value in (data.get("tool", {}).get("uv", {}).get("dev-dependencies") or []):
                match = re.match(r"\s*([A-Za-z0-9_.-]+)(.*)", str(value))
                if match:
                    dependencies.append({"name": match.group(1), "requirement": match.group(2).strip() or "*", "scope": "tool.uv.dev-dependencies"})
            if name:
                project_license = project.get("license")
                license_file = project_license.get("file") if isinstance(project_license, dict) else None
                package = {"ecosystem": "pypi", "name": name, "version_declared": project.get("version") or poetry.get("version"), "private": False, "license_expression": normalize_license_expression(project.get("license-expression") or project_license or poetry.get("license")), "license_file": license_file}
        elif path.endswith("Cargo.toml"):
            data = tomllib.loads(text)
            cargo_package = data.get("package", {})
            def collect_cargo_dependencies(value: Any, prefix: str = "") -> None:
                if not isinstance(value, dict):
                    return
                for key, nested in value.items():
                    scope = f"{prefix}.{key}".strip(".")
                    if key in {"dependencies", "dev-dependencies", "build-dependencies"} and isinstance(nested, dict):
                        for name, requirement in nested.items():
                            dependencies.append({"name": name, "requirement": str(requirement), "scope": scope})
                    elif key in {"workspace", "target"} and isinstance(nested, dict):
                        collect_cargo_dependencies(nested, scope)
            collect_cargo_dependencies(data)
            if cargo_package.get("name"):
                package = {"ecosystem": "crates", "name": cargo_package["name"], "version_declared": cargo_package.get("version"), "private": bool(cargo_package.get("publish") is False), "license_expression": normalize_license_expression(cargo_package.get("license")), "license_file": cargo_package.get("license-file")}
    except (json.JSONDecodeError, tomllib.TOMLDecodeError, TypeError):
        return None, dependencies
    if package:
        package.update({"repository": repo["full_name"], "manifest_path": path, "dependencies": dependencies})
    return package, dependencies


def raw_url(repo: dict[str, Any], path: str) -> str:
    owner, name = repo["full_name"].split("/", 1)
    return f"https://raw.githubusercontent.com/{owner}/{name}/{repo['default_branch']}/{urllib.parse.quote(path)}"


def registry_record(client: ApiClient, package: dict[str, Any]) -> tuple[dict[str, Any], list[Observation]]:
    ecosystem = package["ecosystem"]
    name = package["name"]
    observations: list[Observation] = []
    record = {key: value for key, value in package.items() if key != "dependencies"}
    record["published"] = None
    record["releases"] = []
    if package.get("private"):
        record["published"] = False
        record["publication_status"] = "manifest_private"
        return record, observations
    if ecosystem == "pypi":
        url = f"https://pypi.org/pypi/{urllib.parse.quote(name)}/json"
        body, _, obs = client.request_json(url, allow_404=True)
        observations.append(obs)
        if body:
            info = body.get("info", {})
            record.update({"published": True, "registry_url": f"https://pypi.org/project/{name}/", "latest_version": info.get("version"), "registry_license_expression": normalize_license_expression(info.get("license_expression") or info.get("license")), "license_classifiers": [item for item in info.get("classifiers", []) if str(item).startswith("License ::")]})
            record["releases"] = [
                {
                    "version": version,
                    "published_at": next(
                        (
                            file.get("upload_time_iso_8601") or file.get("upload_time")
                            for file in files
                            if file.get("upload_time_iso_8601") or file.get("upload_time")
                        ),
                        None,
                    ),
                    "url": f"https://pypi.org/project/{name}/{version}/",
                }
                for version, files in sorted((body.get("releases") or {}).items(), reverse=True)
            ]
        elif obs.status == "not_found":
            record.update({"published": False, "publication_status": "registry_not_found"})
    elif ecosystem == "npm":
        encoded = urllib.parse.quote(name, safe="")
        url = f"https://registry.npmjs.org/{encoded}"
        body, _, obs = client.request_json(url, allow_404=True)
        observations.append(obs)
        if body:
            latest_version = (body.get("dist-tags") or {}).get("latest")
            latest_metadata = (body.get("versions") or {}).get(latest_version, {})
            record.update({"published": True, "registry_url": f"https://www.npmjs.com/package/{name}", "latest_version": latest_version, "registry_license_expression": normalize_license_expression(latest_metadata.get("license") or body.get("license"))})
            published_times = body.get("time") or {}
            record["releases"] = [
                {
                    "version": version,
                    "published_at": published_times.get(version),
                    "url": f"https://www.npmjs.com/package/{name}/v/{version}",
                }
                for version in sorted((body.get("versions") or {}).keys(), reverse=True)
            ]
        elif obs.status == "not_found":
            record.update({"published": False, "publication_status": "registry_not_found"})
    elif ecosystem == "crates":
        url = f"https://crates.io/api/v1/crates/{urllib.parse.quote(name)}"
        body, _, obs = client.request_json(url, allow_404=True)
        observations.append(obs)
        if body:
            crate = body.get("crate", {})
            newest_version = crate.get("newest_version")
            newest_metadata = next((item for item in body.get("versions", []) if item.get("num") == newest_version), {})
            record.update({"published": True, "registry_url": f"https://crates.io/crates/{name}", "latest_version": newest_version, "downloads": crate.get("downloads"), "registry_license_expression": normalize_license_expression(newest_metadata.get("license"))})
            record["releases"] = [
                {
                    "version": version.get("num"),
                    "published_at": version.get("created_at") or version.get("updated_at"),
                    "downloads": version.get("downloads"),
                    "url": f"https://crates.io/crates/{name}/{version.get('num')}",
                }
                for version in body.get("versions", [])
                if version.get("num")
            ]
            reverse_url = f"https://crates.io/api/v1/crates/{urllib.parse.quote(name)}/reverse_dependencies?page=1&per_page=100"
            reverse, _, reverse_obs = client.request_json(reverse_url, allow_404=True)
            observations.append(reverse_obs)
            record["downstream"] = [item.get("crate_id") for item in (reverse or {}).get("versions", []) if item.get("crate_id")]
            record["downstream_completeness"] = "first_100_registry_reverse_dependencies"
        elif obs.status == "not_found":
            record.update({"published": False, "publication_status": "registry_not_found"})
    return record, observations


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
        raw_deployments, deployment_obs = client.github_pages(f"repos/{full_name}/deployments?per_page=100")
        observations.extend(deployment_obs)
        for item in raw_deployments:
            statuses, status_obs = client.github_pages(f"repos/{full_name}/deployments/{item.get('id')}/statuses?per_page=100")
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
        {"login": item.get("login") or item.get("name") or "anonymous", "contributions": item.get("contributions", 0), "url": item.get("html_url")}
        for item in contributors
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
            target = f"{resource.get('kind')}:{resource.get('name')}"
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
        "contributors_unique": len({row["login"] for repo in repos for row in repo["activity"]["contributors"]}),
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


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", type=Path, default=DEFAULT_CONFIG)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--summary", type=Path, default=DEFAULT_SUMMARY)
    parser.add_argument("--typescript", type=Path, default=DEFAULT_TYPESCRIPT)
    parser.add_argument("--cache-dir", type=Path, default=ROOT / ".catalog-cache")
    parser.add_argument("--refresh", action="store_true")
    parser.add_argument(
        "--recover-errors",
        action="store_true",
        help="retain explicitly failed repositories from the checked-in complete snapshot",
    )
    parser.add_argument("--owners", help="comma-separated owner override")
    parser.add_argument("--discover-downstream", action="store_true", help="run bounded GitHub public code search for published package dependents")
    args = parser.parse_args()

    previous_catalogs: list[dict[str, Any]] = []
    if args.output.exists():
        try:
            previous_catalogs.append(json.loads(args.output.read_text(encoding="utf-8")))
        except (OSError, json.JSONDecodeError):
            pass
    try:
        baseline = subprocess.run(
            ["git", "show", "HEAD:catalog/generated/catalog.json"],
            cwd=ROOT,
            capture_output=True,
            text=True,
            timeout=30,
            check=False,
        )
        if baseline.returncode == 0:
            previous_catalogs.append(json.loads(baseline.stdout))
    except (OSError, subprocess.SubprocessError, json.JSONDecodeError):
        pass
    previous_repositories = {
        repository["full_name"]: repository
        for catalog in reversed(previous_catalogs)
        for repository in catalog.get("repositories", [])
    }
    previous_packages = [
        package
        for catalog in previous_catalogs
        for package in catalog.get("packages", [])
    ]
    if args.recover_errors:
        if len(previous_catalogs) < 2:
            raise SystemExit("error recovery requires a current output and checked-in baseline")
        current = previous_catalogs[0]
        baseline_catalog = previous_catalogs[-1]
        failed = {
            str(observation.get("source", "")).removeprefix("github.repository:")
            for observation in current.get("observations", [])
            if observation.get("status") == "error"
            and str(observation.get("source", "")).startswith("github.repository:")
        }
        repositories = {item["full_name"]: item for item in current.get("repositories", [])}
        baseline_repositories = {
            item["full_name"]: item for item in baseline_catalog.get("repositories", [])
        }
        for full_name in failed:
            if full_name in repositories or full_name not in baseline_repositories:
                continue
            repositories[full_name] = {
                **baseline_repositories[full_name],
                "collection_status": "retained-after-error",
            }
        packages = {
            (
                item.get("ecosystem"),
                item.get("name"),
                item.get("repository"),
                item.get("manifest_path"),
            ): item
            for item in current.get("packages", [])
        }
        for item in baseline_catalog.get("packages", []):
            if item.get("repository") not in failed:
                continue
            key = (
                item.get("ecosystem"),
                item.get("name"),
                item.get("repository"),
                item.get("manifest_path"),
            )
            packages.setdefault(key, {**item, "collection_status": "retained-after-error"})
        current["repositories"] = sorted(
            repositories.values(), key=lambda item: item["full_name"].casefold()
        )
        current["packages"] = sorted(
            packages.values(),
            key=lambda item: (
                item.get("ecosystem", ""),
                item.get("name", ""),
                item.get("repository", ""),
            ),
        )
        current["relationships"] = relation_rows(current["repositories"], current["packages"])
        summary = summarize(current)
        args.output.write_text(json.dumps(current, indent=2, sort_keys=True), encoding="utf-8")
        args.summary.write_text(json.dumps(summary, indent=2, sort_keys=True), encoding="utf-8")
        args.typescript.write_text(typescript_summary(summary), encoding="utf-8")
        print(json.dumps({"recovered_repositories": sorted(failed), **summary}, indent=2))
        return 0

    config = json.loads(args.config.read_text(encoding="utf-8"))
    if args.discover_downstream:
        config.setdefault("downstream_discovery", {})["github_code_search"] = True
    owners = [item["login"] for item in config["owners"]]
    if args.owners:
        owners = [item.strip() for item in args.owners.split(",") if item.strip()]
    client = ApiClient(config, args.cache_dir, refresh=args.refresh)
    observed_at = ISO_NOW()
    observations: list[Observation] = []
    raw_repos: list[dict[str, Any]] = []
    for owner in owners:
        rows, obs = client.github_pages(f"orgs/{owner}/repos?type=public&per_page=100&sort=full_name")
        observations.extend(obs)
        raw_repos.extend(rows)
    raw_repos = filter_repositories(raw_repos, config)

    repositories: list[dict[str, Any]] = []
    failed_repositories: set[str] = set()
    workers = int(config.get("request_concurrency", 8))
    with concurrent.futures.ThreadPoolExecutor(max_workers=workers) as executor:
        futures = {executor.submit(collect_repository, client, repo, config): repo["full_name"] for repo in raw_repos}
        for index, future in enumerate(concurrent.futures.as_completed(futures), 1):
            full_name = futures[future]
            try:
                repositories.append(future.result())
                print(f"[{index}/{len(futures)}] collected {full_name}", file=sys.stderr)
            except Exception as exc:  # keep collection auditable instead of losing the whole snapshot
                failed_repositories.add(full_name)
                observations.append(Observation(f"github.repository:{full_name}", "error", ISO_NOW(), str(exc)))
                previous = previous_repositories.get(full_name)
                if previous:
                    repositories.append(
                        {
                            **previous,
                            "collection_status": "retained-after-error",
                            "collection_error": str(exc),
                        }
                    )
                print(f"[{index}/{len(futures)}] failed {full_name}: {exc}", file=sys.stderr)
    repositories.sort(key=lambda repo: repo["full_name"].lower())

    discovered_packages = [package for repo in repositories for package in repo.pop("packages_discovered", [])]
    registry_packages: list[dict[str, Any]] = []
    registry_observations: list[Observation] = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=workers) as executor:
        futures = [executor.submit(registry_record, client, package) for package in discovered_packages]
        for future in concurrent.futures.as_completed(futures):
            record, obs = future.result()
            registry_packages.append(record | {"dependencies": next((item["dependencies"] for item in discovered_packages if item["ecosystem"] == record["ecosystem"] and item["name"] == record["name"] and item["repository"] == record["repository"] and item["manifest_path"] == record["manifest_path"]), [])})
            registry_observations.extend(obs)

    github_packages: list[dict[str, Any]] = []
    if config.get("include_github_packages", True):
        with concurrent.futures.ThreadPoolExecutor(max_workers=min(workers, len(owners) or 1)) as executor:
            futures = [executor.submit(collect_owner_packages, client, owner) for owner in owners]
            for future in concurrent.futures.as_completed(futures):
                rows, obs = future.result()
                github_packages.extend(rows)
                registry_observations.extend(obs)
    retained_packages = [
        package
        for package in previous_packages
        if package.get("repository") in failed_repositories
    ]
    packages_by_id = {
        (
            package.get("ecosystem"),
            package.get("name"),
            package.get("repository"),
            package.get("manifest_path"),
        ): package
        for package in [*retained_packages, *registry_packages, *github_packages]
    }
    packages = sorted(
        packages_by_id.values(),
        key=lambda package: (
            package.get("ecosystem", ""),
            package.get("name", ""),
            package.get("repository", ""),
        ),
    )

    relationships = relation_rows(repositories, packages)
    downstream_relationships, downstream_observations = discover_github_downstream(client, packages, config)
    relationships.extend(downstream_relationships)
    relationships.sort(key=lambda row: (row["kind"], row["source"], row["target"]))
    registry_observations.extend(downstream_observations)
    catalog = {
        "schema_version": config["schema_version"], "generated_at": observed_at,
        "scope": {"owners": owners, "owner_definitions": [item for item in config["owners"] if item["login"] in owners], "visibility": "public", "include_archived_repositories": config.get("include_archived_repositories"), "include_forks": config.get("include_forks"), "excluded_repository_names": sorted(config.get("excluded_repository_names", []))},
        "completeness": {
            "repositories": "all public repositories returned by configured GitHub organization APIs after configured name, archive, and fork exclusions",
            "commits": "all default-branch commits returned by GitHub REST pagination" if config.get("include_commit_history") else "count and latest only",
            "contributors": "all contributors returned by GitHub REST, including anonymous rows",
            "github_releases": "all releases returned by GitHub REST",
            "packages": "manifest-discovered packages plus public GitHub packages returned by API",
            "registries": "direct PyPI, npm, crates.io, GitHub Releases, and GitHub Packages observations",
            "technologies": "GitHub language byte counts; no technology is inferred from marketing copy",
            "related_resources": "repository homepages and source paths for APIs, demos, documentation, examples, showcases, UIs, and websites; reachability is not implied",
            "deployments": "GitHub deployment records attached to repositories; live health is not implied",
            "downstream": "crates.io reverse dependencies where available; GitHub code search disabled by default; npm and PyPI have no complete authoritative public dependents API",
        },
        "repositories": repositories, "packages": packages,
        "relationships": relationships,
        "observations": [item.as_dict() for item in observations + registry_observations],
    }
    summary = summarize(catalog)
    for path in (args.output, args.summary, args.typescript):
        path.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(catalog, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    args.summary.write_text(json.dumps(summary, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    args.typescript.write_text(typescript_summary(summary), encoding="utf-8")
    print(json.dumps(summary, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
