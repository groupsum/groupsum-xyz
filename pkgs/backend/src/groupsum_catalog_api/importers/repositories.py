from __future__ import annotations

import json
from datetime import datetime, timedelta
from typing import Any

from ..analytics import upsert_metric
from ..database import Connection
from .common import *  # noqa: F403


def import_repositories(
    connection: Connection,
    analytics: Any,
    site_repositories: list[dict[str, Any]],
    claimed_repositories: set[str],
    generated_at: str,
    run_id: str,
    counts: dict[str, int],
) -> tuple[dict[str, str], dict[str, str]]:
    connection.execute(
        "UPDATE records SET visibility = 'retired' WHERE id LIKE ?",
        ("catalog-repository:%",),
    )
    generated_records: dict[str, str] = {}
    repository_ids: dict[str, str] = {}
    for repository in site_repositories:
        full_name = repository["full_name"]
        repository_id = repository["id"]
        repository_ids[full_name] = repository_id
        owner, name = full_name.split("/", 1)
        ssot = repository.get("ssot_governance") or {}
        upsert(
            connection,
            "repositories",
            {
                "id": repository_id,
                "organization_id": owner,
                "provider": "github",
                "owner": owner,
                "name": name,
                "url": repository["url"],
                "description": repository.get("description"),
                "default_branch": repository.get("default_branch"),
                "is_archived": bool(repository.get("archived", False)),
                "is_fork": bool(repository.get("fork", False)),
                "license_expression": next(
                    (
                        item.get("expression")
                        for item in repository.get("legal_evidence", [])
                        if item.get("expression")
                    ),
                    None,
                ),
                "ssot_governed": bool(ssot.get("governed")),
                "ssot_registry_url": ssot.get("registry_url"),
                "ssot_registry_sha256": ssot.get("source_sha256"),
                "ssot_schema_version": ssot.get("schema_version"),
                "ssot_summary": json.dumps(ssot, sort_keys=True),
                "ssot_observed_at": ssot.get("observed_at"),
                "observed_at": repository.get("observed_at") or generated_at,
            },
        )
        import_legal_observations(
            connection,
            "repository",
            repository_id,
            repository.get("legal_evidence", []),
            repository.get("observed_at") or generated_at,
        )
        import_repository_ssot(
            connection,
            repository_id,
            ssot,
            repository.get("observed_at") or generated_at,
        )
        counts["repositories"] += 1
        for metric, value in repository.get("metrics", {}).items():
            if not isinstance(value, int | float):
                continue
            upsert_metric(
                analytics,
                {
                    "id": stable_id(
                        "metric",
                        repository_id,
                        metric,
                        repository.get("observed_at") or generated_at,
                    ),
                    "subject_kind": "repository",
                    "subject_id": repository_id,
                    "metric": metric,
                    "value": value,
                    "unit": "count",
                    "period_start": None,
                    "period_end": None,
                    "source_url": repository["url"],
                    "observed_at": repository.get("observed_at") or generated_at,
                },
            )
        for contributor in repository.get("contributors", []):
            login = str(contributor.get("login") or "").strip()
            if not login:
                continue
            upsert(
                connection,
                "repository_contributors",
                {
                    "id": stable_id("repository-contributor", repository_id, login),
                    "repository_id": repository_id,
                    "login": login,
                    "profile_url": contributor.get("url"),
                    "contributions": int(contributor.get("contributions") or 0),
                    "observed_at": repository.get("observed_at") or generated_at,
                },
            )
        for activity in repository.get("commit_activity", []):
            day = str(activity["date"])
            period_start = f"{day}T00:00:00Z"
            period_end = (
                datetime.fromisoformat(period_start.replace("Z", "+00:00")) + timedelta(days=1)
            ).isoformat()
            upsert_metric(
                analytics,
                {
                    "id": stable_id("metric", repository_id, "commits_daily", day),
                    "subject_kind": "repository",
                    "subject_id": repository_id,
                    "metric": "commits_daily",
                    "value": int(activity.get("count") or 0),
                    "unit": "count",
                    "period_start": period_start,
                    "period_end": period_end,
                    "source_url": repository["url"],
                    "observed_at": repository.get("observed_at") or generated_at,
                },
            )
        for release in repository.get("github_releases", []):
            version = str(release["version"])
            release_id = stable_id("release", repository_id, "github", version)
            upsert(
                connection,
                "releases",
                {
                    "id": release_id,
                    "package_id": None,
                    "repository_id": repository_id,
                    "release_kind": "github",
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
        if full_name in claimed_repositories:
            continue
        generated_record_id = stable_id("catalog-repository", full_name)
        generated_records[full_name] = generated_record_id
        generated_slug = record_slug(owner, name)
        summary = repository.get("description") or f"Public source repository {full_name}."
        upsert(
            connection,
            "records",
            {
                "id": generated_record_id,
                "slug": generated_slug,
                "organization_id": owner,
                "record_type": "portfolio",
                "title": repository.get("display_name") or name,
                "eyebrow": "public repository",
                "summary": summary,
                "body_markdown": None,
                "content": json.dumps(
                    {
                        "generated_from": "public-catalog",
                        "full_name": full_name,
                        "reviewed_positioning": False,
                    }
                ),
                "maturity": (
                    "archived" if repository.get("archived") else "observed-public-source"
                ),
                "visibility": "public",
                "featured": False,
                "canonical_url": f"https://groupsum.xyz/portfolio/records/{generated_slug}",
                "source_url": repository["url"],
                "published_at": None,
                "updated_at": repository.get("observed_at") or generated_at,
                "content_revision": 1,
            },
        )
        upsert(
            connection,
            "record_repositories",
            {
                "id": stable_id("record-repository", generated_record_id, repository_id),
                "record_id": generated_record_id,
                "repository_id": repository_id,
                "role": "primary-public-evidence",
            },
        )
        upsert(
            connection,
            "observations",
            {
                "id": stable_id("observation", run_id, generated_record_id, "repository"),
                "collection_run_id": run_id,
                "subject_kind": "record",
                "subject_id": generated_record_id,
                "observation_type": "repository-inventory",
                "evidence_type": None,
                "source_url": repository["url"],
                "payload": json.dumps({"summary": summary}),
                "completeness": "catalog-observed",
                "observed_at": repository.get("observed_at") or generated_at,
            },
        )
        upsert(
            connection,
            "limitations",
            {
                "id": stable_id("limitation", generated_record_id, "generated-record"),
                "record_id": generated_record_id,
                "title": "Editorial status",
                "description": (
                    "Catalog-generated inventory record; product positioning and "
                    "maturity have not been editorially reviewed."
                ),
                "severity": None,
                "evidence_id": None,
                "reviewed_at": None,
            },
        )
        for resource in repository.get("related_resources", []):
            if not resource.get("url"):
                continue
            resource_id = stable_id("resource-url", resource["url"])
            resource_type = resource.get("kind") or "resource"
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
                    "title": resource.get("name") or resource.get("kind") or "Related resource",
                    "url": resource["url"],
                    "summary": None,
                    "source_url": resource["url"],
                    "observed_at": repository.get("observed_at") or generated_at,
                },
            )
            import_resource_repository(
                connection,
                resource_id,
                repository_id,
                resource.get("path"),
                repository.get("observed_at") or generated_at,
            )
            upsert(
                connection,
                "record_resources",
                {
                    "id": stable_id("record-resource", generated_record_id, resource_id),
                    "record_id": generated_record_id,
                    "resource_id": resource_id,
                    "role": resource.get("kind") or "resource",
                    "sort_order": 0,
                },
            )
            import_repository_ssot(
                connection,
                repository_id,
                ssot,
                generated_at,
            )
            counts["resources"] += 1
        counts["records"] += 1
    return generated_records, repository_ids
