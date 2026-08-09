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

from .collector_common import *  # noqa: F403
from .github_collection import *  # noqa: F403
from .normalization import *  # noqa: F403
from .package_collection import *  # noqa: F403
from .resource_discovery import *  # noqa: F403
from .snapshots import publish_snapshot


def _write_outputs(args, catalog: dict[str, Any], summary: dict[str, Any]) -> dict[str, Any]:
    for path in (args.output, args.summary, args.typescript):
        path.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(catalog, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    manifest = publish_snapshot(catalog, args.output)
    summary["snapshot_id"] = manifest["snapshot_id"]
    args.summary.write_text(json.dumps(summary, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    args.typescript.write_text(typescript_summary(summary), encoding="utf-8")
    return manifest

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", type=Path, default=DEFAULT_CONFIG)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--summary", type=Path, default=DEFAULT_SUMMARY)
    parser.add_argument("--typescript", type=Path, default=DEFAULT_TYPESCRIPT)
    parser.add_argument("--cache-dir", type=Path, default=ROOT / ".catalog-cache")
    parser.add_argument("--refresh", action="store_true")
    parser.add_argument(
        "--ssot-only",
        action="store_true",
        help="refresh SSOT registry evidence on the existing catalog without recollecting registries",
    )
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
        _write_outputs(args, current, summary)
        print(json.dumps({"recovered_repositories": sorted(failed), **summary}, indent=2))
        return 0

    config = json.loads(args.config.read_text(encoding="utf-8"))
    if args.discover_downstream:
        config.setdefault("downstream_discovery", {})["github_code_search"] = True
    owners = [item["login"] for item in config["owners"]]
    if args.owners:
        owners = [item.strip() for item in args.owners.split(",") if item.strip()]
    client = ApiClient(config, args.cache_dir, refresh=args.refresh)
    if args.ssot_only:
        if not previous_catalogs:
            raise SystemExit("SSOT-only refresh requires an existing catalog output")
        current = previous_catalogs[0]
        repositories = current.get("repositories", [])
        observations: list[Observation] = []
        workers = int(config.get("request_concurrency", 8))
        with concurrent.futures.ThreadPoolExecutor(max_workers=workers) as executor:
            futures = {
                executor.submit(collect_ssot_governance, client, repository): repository
                for repository in repositories
            }
            for index, future in enumerate(concurrent.futures.as_completed(futures), 1):
                repository = futures[future]
                governance, observation = future.result()
                repository["ssot_governance"] = governance
                observations.append(observation)
                print(
                    f"[{index}/{len(futures)}] SSOT {repository['full_name']}: "
                    f"{observation.status}",
                    file=sys.stderr,
                )
        github_package_ownership: dict[tuple[str, str, str], str] = {}
        if config.get("include_github_packages", True):
            with concurrent.futures.ThreadPoolExecutor(
                max_workers=min(workers, len(owners) or 1)
            ) as executor:
                package_futures = [
                    executor.submit(collect_owner_packages, client, owner)
                    for owner in owners
                ]
                for package_future in concurrent.futures.as_completed(package_futures):
                    package_rows, package_observations = package_future.result()
                    observations.extend(package_observations)
                    for package in package_rows:
                        repository = package.get("repository")
                        if repository:
                            github_package_ownership[
                                (
                                    str(package.get("owner") or ""),
                                    str(package.get("ecosystem") or ""),
                                    str(package.get("name") or ""),
                                )
                            ] = str(repository)
        ownership_links = 0
        for package in current.get("packages", []):
            repository = github_package_ownership.get(
                (
                    str(package.get("owner") or ""),
                    str(package.get("ecosystem") or ""),
                    str(package.get("name") or ""),
                )
            )
            if repository and package.get("repository") != repository:
                package["repository"] = repository
                ownership_links += 1
        ssot_sources = {item.source for item in observations}
        current["observations"] = [
            item for item in current.get("observations", [])
            if item.get("source") not in ssot_sources
        ] + [item.as_dict() for item in observations]
        current["relationships"] = relation_rows(
            current.get("repositories", []), current.get("packages", [])
        )
        current["ssot_observed_at"] = ISO_NOW()
        summary = summarize(current)
        _write_outputs(args, current, summary)
        governed = sum(
            bool(item.get("ssot_governance", {}).get("governed"))
            for item in repositories
        )
        print(json.dumps({
            "ssot_governed_repositories": governed,
            "github_package_ownership_links": ownership_links,
            **summary,
        }, indent=2))
        return 0
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
    _write_outputs(args, catalog, summary)
    print(json.dumps(summary, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
