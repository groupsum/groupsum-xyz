#!/usr/bin/env python3
"""Validate the generated catalog's identity, evidence, and freshness invariants."""

from __future__ import annotations

import argparse
import datetime as dt
import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]


def validate(catalog: dict[str, Any], max_age_hours: int = 48) -> list[str]:
    errors: list[str] = []
    required = {"schema_version", "generated_at", "scope", "completeness", "repositories", "packages", "relationships", "observations"}
    missing = required - catalog.keys()
    if missing:
        errors.append(f"missing root fields: {', '.join(sorted(missing))}")
        return errors
    try:
        generated = dt.datetime.fromisoformat(catalog["generated_at"].replace("Z", "+00:00"))
        age = dt.datetime.now(dt.timezone.utc) - generated
        if age < dt.timedelta(0):
            errors.append("generated_at is in the future")
        if age > dt.timedelta(hours=max_age_hours):
            errors.append(f"catalog is stale: {age.total_seconds() / 3600:.1f} hours old")
    except (TypeError, ValueError):
        errors.append("generated_at is not a valid ISO-8601 timestamp")

    repo_names: set[str] = set()
    package_ids: set[str] = set()
    known_nodes: set[str] = set()
    for repo in catalog["repositories"]:
        name = repo.get("full_name")
        if not name:
            errors.append("repository missing full_name")
            continue
        if name in repo_names:
            errors.append(f"duplicate repository: {name}")
        repo_names.add(name)
        known_nodes.add(name)
        if repo.get("visibility") != "public":
            errors.append(f"non-public repository in public catalog: {name}")
        metrics = repo.get("metrics", {})
        for field in ("stars", "watchers", "forks", "open_issues", "size_kb"):
            if not isinstance(metrics.get(field), int) or metrics[field] < 0:
                errors.append(f"{name} has invalid metric {field}")
        activity = repo.get("activity", {})
        history = activity.get("commit_history", [])
        if activity.get("commit_count") != len(history):
            errors.append(f"{name} commit_count does not match itemized history")
        if activity.get("contributor_count") != len(activity.get("contributors", [])):
            errors.append(f"{name} contributor_count does not match contributors")
        if not repo.get("observations"):
            errors.append(f"{name} has no source observations")

    for package in catalog["packages"]:
        if not package.get("name") or not package.get("ecosystem"):
            errors.append("package missing ecosystem or name")
            continue
        package_id = f"{package['ecosystem']}:{package['name']}"
        known_nodes.add(package_id)
        identity = f"{package_id}@{package.get('repository', package.get('owner', 'registry'))}:{package.get('manifest_path', '')}"
        if identity in package_ids:
            errors.append(f"duplicate package record: {identity}")
        package_ids.add(identity)
        if package.get("published") is True and not package.get("registry_url") and package["ecosystem"] not in {"ghcr", "github-npm"}:
            errors.append(f"published package lacks registry URL: {identity}")

    relation_ids: set[tuple[str, str, str, str]] = set()
    for relation in catalog["relationships"]:
        required_identity = (relation.get("kind", ""), relation.get("source", ""), relation.get("target", ""))
        identity = (*required_identity, relation.get("scope", ""))
        if not all(required_identity):
            errors.append("relationship missing kind, source, or target")
        if identity in relation_ids:
            errors.append(f"duplicate relationship: {identity}")
        relation_ids.add(identity)
        if not relation.get("evidence"):
            errors.append(f"relationship lacks evidence: {identity}")

    owner_definitions = catalog["scope"].get("owner_definitions") or [
        {"login": owner, "expect_public_repositories": True} for owner in catalog["scope"].get("owners", [])
    ]
    scope_owners = {
        item["login"] for item in owner_definitions if item.get("expect_public_repositories", True)
    }
    observed_owners = {repo.get("owner") for repo in catalog["repositories"]}
    missing_owners = scope_owners - observed_owners
    if missing_owners:
        errors.append(f"configured owners returned no repositories: {', '.join(sorted(missing_owners))}")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("catalog", nargs="?", type=Path, default=ROOT / "catalog" / "generated" / "catalog.json")
    parser.add_argument("--max-age-hours", type=int, default=48)
    args = parser.parse_args()
    catalog = json.loads(args.catalog.read_text(encoding="utf-8"))
    errors = validate(catalog, args.max_age_hours)
    if errors:
        for error in errors:
            print(f"catalog validation failed: {error}")
        return 1
    print(f"catalog valid: {len(catalog['repositories'])} repositories, {len(catalog['packages'])} packages, {len(catalog['relationships'])} relationships")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
