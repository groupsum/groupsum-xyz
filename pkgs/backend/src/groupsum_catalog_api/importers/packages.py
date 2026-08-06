from __future__ import annotations

from typing import Any

from ..analytics import upsert_metric
from ..database import Connection
from ..dependency_requirements import stored_requirement
from .common import *  # noqa: F403


def import_packages(
    connection: Connection,
    analytics: Any,
    site_packages: list[dict[str, Any]],
    repository_ids: dict[str, str],
    generated_records: dict[str, str],
    generated_at: str,
    counts: dict[str, int],
) -> None:
    package_ids_by_key: dict[str, list[str]] = {}
    for package in site_packages:
        ecosystem = package["ecosystem"]
        name = package["name"]
        route_key = package.get("route", "").rstrip("/").split("/")[-1] or None
        package_id = canonical_package_id(connection, package["id"], ecosystem, name, route_key)
        natural_key = package_key(ecosystem, name)
        package_ids_by_key.setdefault(natural_key, []).append(package_id)
        package_url = package.get("registry_url") or package.get("source_url")
        if not package_url:
            continue
        upsert(
            connection,
            "packages",
            {
                "id": package_id,
                "ecosystem": ecosystem,
                "name": name,
                "registry_url": package_url,
                "source_url": package.get("source_url"),
                "manifest_path": package.get("manifest_path"),
                "package_kind": package.get("package_kind") or "package-candidate",
                "private": bool(package.get("private")),
                "description": package.get("description"),
                "latest_version": package.get("latest_version"),
                "published": (
                    bool(package.get("published")) if package.get("published") is not None else None
                ),
                "publication_status": package.get("publication_status"),
                "route_key": route_key,
                "license_expression": package.get("license_expression"),
                "license_status": package.get("license_status"),
                "published_at": None,
                "observed_at": package.get("observed_at") or generated_at,
            },
        )
        import_legal_observations(
            connection,
            "package",
            package_id,
            package.get("legal_evidence", []),
            package.get("observed_at") or generated_at,
        )
        repository_name = package.get("repository")
        repository_id = repository_ids.get(repository_name)
        if repository_id:
            upsert(
                connection,
                "package_repositories",
                {
                    "id": stable_id(
                        "package-repository",
                        package_id,
                        repository_id,
                        package.get("manifest_path") or "",
                    ),
                    "package_id": package_id,
                    "repository_id": repository_id,
                    "path": package.get("manifest_path"),
                },
            )
            generated_record_id = generated_records.get(repository_name)
            if generated_record_id:
                upsert(
                    connection,
                    "record_packages",
                    {
                        "id": stable_id("record-package", generated_record_id, package_id),
                        "record_id": generated_record_id,
                        "package_id": package_id,
                        "role": "repository-package",
                    },
                )
        for release in package.get("releases", []):
            version = str(release["version"])
            release_id = stable_id("release", package_id, ecosystem, version)
            upsert(
                connection,
                "releases",
                {
                    "id": release_id,
                    "package_id": package_id,
                    "repository_id": None,
                    "release_kind": release.get("release_kind") or ecosystem,
                    "version": version,
                    "route_key": release.get("route", "").rstrip("/").split("/")[-1] or None,
                    "url": release["url"],
                    "published_at": release.get("published_at"),
                    "downloads": release.get("downloads"),
                    "prerelease": bool(release.get("prerelease", False)),
                    "draft": bool(release.get("draft", False)),
                    "observed_at": release.get("observed_at") or generated_at,
                },
            )
            counts["releases"] += 1
        for dependency in package.get("dependencies", []):
            target_key = dependency["package_key"]
            upsert(
                connection,
                "dependencies",
                {
                    "id": stable_id(
                        "dependency",
                        package_id,
                        target_key,
                        str(dependency.get("scope") or "dependencies"),
                    ),
                    "source_kind": "package",
                    "source_id": package_id,
                    "target_kind": (
                        "package" if dependency.get("internal") else "external-package"
                    ),
                    "target_id": target_key,
                    "requirement": stored_requirement(dependency.get("requirement")),
                    "scope": dependency.get("scope"),
                    "evidence_type": dependency.get("evidence") or "repository.manifest",
                    "origin_kind": dependency.get("evidence") or "repository.manifest",
                    "source_url": package.get("source_url"),
                    "completeness": "catalog-observed",
                    "observed_at": package.get("observed_at") or generated_at,
                },
            )
            counts["dependencies"] += 1
        for dependent in package.get("dependents", []):
            if dependent.get("evidence") == "repository.manifest":
                continue
            upsert(
                connection,
                "dependencies",
                {
                    "id": stable_id(
                        "registry-dependent",
                        dependent["package_key"],
                        natural_key,
                    ),
                    "source_kind": "observed-dependent",
                    "source_id": dependent["package_key"],
                    "target_kind": "package",
                    "target_id": natural_key,
                    "requirement": stored_requirement(dependent.get("requirement")),
                    "scope": dependent.get("scope") or "registry-dependent",
                    "evidence_type": (dependent.get("evidence") or "registry.reverse_dependencies"),
                    "origin_kind": (dependent.get("evidence") or "registry.reverse_dependencies"),
                    "source_url": package.get("registry_url"),
                    "completeness": (
                        dependent.get("completeness") or "bounded-registry-observation"
                    ),
                    "observed_at": package.get("observed_at") or generated_at,
                },
            )
            counts["dependencies"] += 1
        if isinstance(package.get("downloads"), int | float):
            observed = package.get("observed_at") or generated_at
            upsert_metric(
                analytics,
                {
                    "id": stable_id("metric", package_id, "downloads", observed),
                    "subject_kind": "package",
                    "subject_id": package_id,
                    "metric": "downloads",
                    "value": package["downloads"],
                    "unit": "count",
                    "period_start": None,
                    "period_end": None,
                    "source_url": package_url,
                    "observed_at": observed,
                },
            )
        counts["packages"] += 1
