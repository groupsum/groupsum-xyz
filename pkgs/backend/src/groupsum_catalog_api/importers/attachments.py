from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from ..database import Connection
from .common import *  # noqa: F403


def import_technologies(
    connection: Connection, site_technologies: list[dict[str, Any]], counts: dict[str, int]
) -> None:
    for technology in site_technologies:
        route_slug = technology.get("route", "").rstrip("/").split("/")[-1]
        if not route_slug:
            continue
        upsert(
            connection,
            "taxonomies",
            {
                "id": technology["id"],
                "taxonomy_type": "language",
                "slug": route_slug,
                "label": technology["name"],
                "category": "observed-source-language",
                "description": (
                    f"Observed through GitHub language byte counts in "
                    f"{technology.get('repository_count', 0)} public repositories."
                ),
            },
        )
        counts["languages"] += 1


def attach_editorial_resources(
    connection: Connection,
    repo_root: Path,
    editorial: dict[str, Any],
    repository_ids: dict[str, str],
) -> None:
    for record in editorial["records"]:
        if record["record_type"] not in {"product", "portfolio"}:
            continue
        bundle_path = (
            repo_root
            / "catalog"
            / "generated"
            / "product-evidence"
            / record["organization_id"]
            / f"{record['source_name']}.json"
        )
        if not bundle_path.exists():
            continue
        bundle = json.loads(bundle_path.read_text())
        repositories = bundle["repository"].get("attached_repositories") or [bundle["repository"]]
        for repository in repositories:
            full_name = (
                repository.get("full_name")
                or f"{record['organization_id']}/{record['source_name']}"
            )
            repository_id = repository.get("id") or stable_id("repository", full_name)
            owner, name = full_name.split("/", 1)
            ssot = repository.get("ssot_governance") or {}
            upsert(
                connection,
                "repositories",
                {
                    "id": repository_id,
                    "organization_id": record["organization_id"],
                    "provider": "github",
                    "owner": owner,
                    "name": name,
                    "url": repository.get("source_url") or repository.get("url"),
                    "description": repository.get("description"),
                    "default_branch": repository.get("default_branch"),
                    "is_archived": bool(repository.get("archived", False)),
                    "is_fork": bool(repository.get("fork", False)),
                    "ssot_governed": bool(ssot.get("governed")),
                    "ssot_registry_url": ssot.get("registry_url"),
                    "ssot_registry_sha256": ssot.get("source_sha256"),
                    "ssot_schema_version": ssot.get("schema_version"),
                    "ssot_summary": json.dumps(ssot, sort_keys=True),
                    "ssot_observed_at": ssot.get("observed_at"),
                    "observed_at": bundle["generated_at"],
                },
            )
            upsert(
                connection,
                "record_repositories",
                {
                    "id": stable_id("record-repository", record["id"], repository_id),
                    "record_id": record["id"],
                    "repository_id": repository_id,
                    "role": repository.get("attachment_role", "implementation"),
                },
            )
            latest_deployment = repository.get("latest_deployment")
            if latest_deployment and latest_deployment.get("log_url"):
                environment = latest_deployment.get("environment") or "unknown"
                upsert(
                    connection,
                    "deployments",
                    {
                        "id": stable_id("deployment", record["id"], repository_id, environment),
                        "record_id": record["id"],
                        "name": environment,
                        "url": latest_deployment.get("environment_url")
                        or latest_deployment["log_url"],
                        "environment": environment,
                        "reachability": "unverified",
                        "observed_at": latest_deployment.get("updated_at")
                        or bundle["generated_at"],
                    },
                )
        for package in bundle["packages"]:
            package_id = canonical_package_id(
                connection,
                package["id"],
                package["ecosystem"],
                package["name"],
            )
            upsert(
                connection,
                "packages",
                {
                    "id": package_id,
                    "ecosystem": package["ecosystem"],
                    "name": package["name"],
                    "registry_url": package.get("registry_url") or package["source_url"],
                    "source_url": package.get("source_url"),
                    "manifest_path": package.get("manifest_path"),
                    "package_kind": package.get("package_kind") or "package-candidate",
                    "private": bool(package.get("private")),
                    "description": package.get("description"),
                    "latest_version": package.get("latest_version"),
                    "published": (
                        bool(package.get("published"))
                        if package.get("published") is not None
                        else None
                    ),
                    "publication_status": package.get("publication_status"),
                    "published_at": None,
                    "observed_at": package.get("observed_at") or bundle["generated_at"],
                },
            )
            upsert(
                connection,
                "record_packages",
                {
                    "id": stable_id("record-package", record["id"], package_id),
                    "record_id": record["id"],
                    "package_id": package_id,
                    "role": package.get("attachment_role") or "distribution",
                },
            )
        for resource in bundle["repository"].get("related_resources", []):
            resource_id = stable_id("resource-url", resource["url"])
            resource_type = resource.get("kind") or "resource"
            repository_id = repository_ids.get(bundle["repository"].get("full_name"))
            import_resource_type(connection, resource_type)
            upsert(
                connection,
                "resources",
                {
                    "id": resource_id,
                    "resource_type": resource_type,
                    "route_key": resource.get("route", "").rstrip("/").split("/")[-1] or None,
                    "repository_id": repository_id,
                    "path": resource.get("path"),
                    "title": resource.get("name") or resource["kind"],
                    "url": resource["url"],
                    "summary": None,
                    "source_url": resource["url"],
                    "observed_at": bundle["generated_at"],
                },
            )
            import_resource_repository(
                connection,
                resource_id,
                repository_id,
                resource.get("path"),
                bundle["generated_at"],
            )
            upsert(
                connection,
                "record_resources",
                {
                    "id": stable_id("record-resource", record["id"], resource_id),
                    "record_id": record["id"],
                    "resource_id": resource_id,
                    "role": resource["kind"],
                    "sort_order": 0,
                },
            )
