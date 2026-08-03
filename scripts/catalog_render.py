#!/usr/bin/env python3
"""Compile the normalized public catalog into deterministic website datasets."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from collections import Counter, defaultdict
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


def compile_catalog(catalog: dict[str, Any], editorial: dict[str, Any]) -> dict[str, list[dict[str, Any]]]:
    generated_at = catalog["generated_at"]
    overrides = editorial.get("entities", {})
    packages_by_repo: dict[str, list[str]] = defaultdict(list)
    repository_records: list[dict[str, Any]] = []
    package_records: list[dict[str, Any]] = []
    release_records: list[dict[str, Any]] = []
    deployment_records: list[dict[str, Any]] = []
    surface_records: list[dict[str, Any]] = []
    relationship_records: list[dict[str, Any]] = []
    technology_repositories: dict[str, set[str]] = defaultdict(set)
    technology_bytes: Counter[str] = Counter()

    for package in catalog.get("packages", []):
        ecosystem = str(package.get("ecosystem") or "unknown")
        name = str(package.get("name") or "unnamed")
        repository = package.get("repository")
        package_identity = f"{ecosystem}:{name}:{repository or package.get('owner') or 'registry'}:{package.get('manifest_path') or 'package'}"
        package_id = f"package:{package_identity}"
        package_slug = f"{slug(name)}-{stable_hash(package_id, 8)}"
        checked_at = package.get("updated_at") or observed_at(package, generated_at)
        override = overrides.get(package_id, {})
        registry_url = package.get("registry_url") or package.get("url")
        source_url = f"https://github.com/{repository}/blob/HEAD/{package.get('manifest_path')}" if repository and package.get("manifest_path") else None
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
            "repository": repository,
            "manifest_path": package.get("manifest_path"),
            "private": bool(package.get("private")),
            "published": package.get("published") is True,
            "publication_status": package.get("publication_status") or ("published" if package.get("published") else "not-confirmed"),
            "latest_version": package.get("latest_version") or package.get("version_declared"),
            "version_declared": package.get("version_declared"),
            "release_count": len(package.get("releases") or package.get("versions") or []),
            "dependency_count": len(package.get("dependencies") or []),
            "downstream_count": len(package.get("downstream") or []),
            "downstream_completeness": package.get("downstream_completeness") or "not-observed",
            "downloads": package.get("downloads"),
            "registry_url": registry_url,
            "source_url": source_url,
            "observed_at": checked_at,
            "evidence": evidence("registry" if registry_url else "source", registry_url or source_url, checked_at),
            "claim_boundary": override.get("claim_boundary") or "Publication is reported only when confirmed by the named public registry.",
        }
        package_records.append(record)
        if repository:
            packages_by_repo[repository].append(package_id)
        for version in package.get("releases") or []:
            release_records.append({
                "id": f"release:{package_id}:{version}",
                "kind": "registry-release",
                "name": str(version),
                "package_id": package_id,
                "repository": repository,
                "ecosystem": ecosystem,
                "url": registry_url,
                "observed_at": checked_at,
            })
        for version in package.get("versions") or []:
            version_name = version.get("name") or version.get("id")
            release_records.append({
                "id": f"release:{package_id}:{version.get('id') or version_name}",
                "kind": "github-package-release",
                "name": str(version_name),
                "package_id": package_id,
                "repository": repository,
                "ecosystem": ecosystem,
                "published_at": version.get("created_at"),
                "url": version.get("url") or registry_url,
                "observed_at": checked_at,
            })

    for repo in catalog.get("repositories", []):
        full_name = str(repo["full_name"])
        repo_id = f"repository:{full_name}"
        checked_at = observed_at(repo, generated_at)
        override = overrides.get(repo_id, {})
        activity = repo.get("activity") or {}
        metrics = repo.get("metrics") or {}
        languages = (repo.get("technologies") or {}).get("languages_bytes") or {}
        surface_counts = Counter(item.get("kind", "unknown") for item in repo.get("surfaces") or [])
        latest_release = next(iter(repo.get("github_releases") or []), None)
        latest_deployment = next(iter(repo.get("deployments") or []), None)
        latest_status = next(iter((latest_deployment or {}).get("statuses") or []), None)
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
                "surfaces": len(repo.get("surfaces") or []),
                "packages": len(packages_by_repo.get(full_name, [])),
            },
            "technologies": sorted(languages),
            "surface_counts": dict(sorted(surface_counts.items())),
            "package_ids": sorted(packages_by_repo.get(full_name, [])),
            "latest_commit": activity.get("latest_commit"),
            "latest_release": latest_release,
            "latest_deployment": {
                "environment": (latest_deployment or {}).get("environment"),
                "state": (latest_status or {}).get("state"),
                "environment_url": (latest_status or {}).get("environment_url"),
                "log_url": (latest_status or {}).get("log_url"),
                "updated_at": (latest_status or {}).get("updated_at"),
            } if latest_deployment else None,
            "evidence": evidence("source", repo.get("url"), checked_at),
            "claim_boundary": override.get("claim_boundary") or "Repository, release, deployment, and live-service states are reported separately.",
        }
        repository_records.append(record)
        for language, byte_count in languages.items():
            technology_repositories[language].add(full_name)
            technology_bytes[language] += int(byte_count or 0)
        for item in repo.get("github_releases") or []:
            release_records.append({
                "id": f"release:github:{full_name}:{item.get('tag')}",
                "kind": "github-release",
                "name": item.get("name") or item.get("tag"),
                "tag": item.get("tag"),
                "repository": full_name,
                "published_at": item.get("published_at"),
                "prerelease": bool(item.get("prerelease")),
                "draft": bool(item.get("draft")),
                "asset_count": len(item.get("assets") or []),
                "url": item.get("url"),
                "observed_at": checked_at,
            })
        for item in repo.get("deployments") or []:
            status = next(iter(item.get("statuses") or []), None)
            deployment_records.append({
                "id": f"deployment:{full_name}:{item.get('id')}",
                "kind": "github-deployment",
                "repository": full_name,
                "environment": item.get("environment"),
                "ref": item.get("ref"),
                "sha": item.get("sha"),
                "state": (status or {}).get("state"),
                "environment_url": (status or {}).get("environment_url"),
                "log_url": (status or {}).get("log_url"),
                "created_at": item.get("created_at"),
                "updated_at": (status or {}).get("updated_at") or item.get("updated_at"),
                "observed_at": checked_at,
                "claim_boundary": "A deployment record is not proof that a public service is currently reachable.",
            })
        for item in repo.get("surfaces") or []:
            identity = f"{full_name}:{item.get('kind')}:{item.get('name')}"
            surface_records.append({
                "id": f"surface:{stable_hash(identity)}",
                "kind": item.get("kind"),
                "name": item.get("name"),
                "repository": full_name,
                "url": item.get("url"),
                "evidence_type": item.get("evidence"),
                "observed_at": checked_at,
            })

    for item in catalog.get("relationships") or []:
        identity = f"{item.get('kind')}:{item.get('source')}:{item.get('target')}"
        relationship_records.append({
            "id": f"relationship:{stable_hash(identity)}",
            "kind": item.get("kind"),
            "source": item.get("source"),
            "target": item.get("target"),
            "requirement": item.get("requirement"),
            "evidence": item.get("evidence"),
            "observed_at": generated_at,
        })

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
        package_count = sum(item["metrics"]["packages"] for item in repos)
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
            "technologies": sorted({technology for item in repos for technology in item["technologies"]}),
            "featured_repositories": [{"id": item["id"], "name": item["display_name"], "route": item["route"], "description": item["description"], "metrics": item["metrics"]} for item in selected],
            "observed_at": generated_at,
            "evidence": evidence("organization", f"https://github.com/{login}", generated_at),
        })

    deduplicated_surfaces = {item["id"]: item for item in surface_records}
    result = {
        "organizations": organization_records,
        "repositories": repository_records,
        "packages": package_records,
        "releases": release_records,
        "deployments": deployment_records,
        "technologies": technology_records,
        "surfaces": list(deduplicated_surfaces.values()),
        "relationships": relationship_records,
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


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--catalog", type=Path, default=ROOT / "catalog" / "generated" / "catalog.json")
    parser.add_argument("--summary", type=Path, default=ROOT / "catalog" / "generated" / "summary.json")
    parser.add_argument("--site-dir", type=Path, default=ROOT / "catalog" / "generated" / "site")
    parser.add_argument("--editorial", type=Path, default=ROOT / "catalog" / "content" / "editorial.json")
    parser.add_argument("--typescript", type=Path, default=ROOT / "src" / "data" / "catalog.generated.ts")
    args = parser.parse_args()
    catalog = json.loads(args.catalog.read_text(encoding="utf-8"))
    editorial = load_editorial(args.editorial)
    summary = summarize(catalog)
    datasets = compile_catalog(catalog, editorial)
    args.summary.parent.mkdir(parents=True, exist_ok=True)
    args.typescript.parent.mkdir(parents=True, exist_ok=True)
    args.site_dir.mkdir(parents=True, exist_ok=True)
    write_json(args.summary, summary)
    files = []
    for name, records in datasets.items():
        files.append({"dataset": name, **write_json(args.site_dir / f"{name}.json", records)})
    manifest = {
        "schema_version": "1.0.0",
        "generated_at": catalog["generated_at"],
        "source": "/catalog/catalog.json",
        "files": sorted(files, key=lambda item: item["dataset"]),
        "counts": {name: len(records) for name, records in sorted(datasets.items())},
        "completeness": catalog.get("completeness", {}),
    }
    write_json(args.site_dir / "manifest.json", manifest)
    args.typescript.write_text(typescript_summary(summary, datasets, manifest), encoding="utf-8")
    print(json.dumps({"generated_at": catalog["generated_at"], "counts": manifest["counts"]}, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
