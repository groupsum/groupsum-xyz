from __future__ import annotations

import hashlib
import json
import sqlite3
from datetime import UTC, datetime
from pathlib import Path
from typing import Any


def stable_id(*parts: str) -> str:
    readable = ":".join(parts)
    if len(readable) <= 300:
        return readable
    return f"sha256:{hashlib.sha256(readable.encode()).hexdigest()}"


def connect(database_path: Path) -> sqlite3.Connection:
    connection = sqlite3.connect(database_path)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys=ON")
    return connection


def upsert(connection: sqlite3.Connection, table: str, values: dict[str, Any]) -> None:
    columns = tuple(values)
    placeholders = ", ".join("?" for _ in columns)
    assignments = ", ".join(f"{column}=excluded.{column}" for column in columns if column != "id")
    connection.execute(
        f"INSERT INTO {table} ({', '.join(columns)}) VALUES ({placeholders}) "
        f"ON CONFLICT(id) DO UPDATE SET {assignments}",
        tuple(values[column] for column in columns),
    )


def import_catalog(database_path: Path, repo_root: Path) -> dict[str, int]:
    editorial = json.loads((repo_root / "catalog" / "content" / "records.json").read_text())
    generated_at = datetime.now(UTC).replace(microsecond=0).isoformat()
    run_id = stable_id("collection-run", "website-editorial", generated_at)
    counts = {
        "organizations": 0,
        "records": 0,
        "insights": 0,
        "packages": 0,
        "resources": 0,
    }

    with connect(database_path) as connection:
        upsert(
            connection,
            "collection_runs",
            {
                "id": run_id,
                "collector": "website-editorial-and-generated-catalog",
                "started_at": generated_at,
                "completed_at": None,
                "status": "running",
                "summary": None,
            },
        )
        record_ids = [record["id"] for record in editorial["records"]]
        if record_ids:
            placeholders = ",".join("?" for _ in record_ids)
            for table in (
                "record_taxonomies",
                "record_repositories",
                "record_packages",
                "record_resources",
                "record_features",
                "limitations",
            ):
                connection.execute(
                    f"DELETE FROM {table} WHERE record_id IN ({placeholders})",
                    record_ids,
                )
            connection.execute(
                f"DELETE FROM record_relations WHERE source_record_id IN ({placeholders})",
                record_ids,
            )
        for organization in editorial["organizations"]:
            upsert(
                connection,
                "organizations",
                {
                    **organization,
                    "summary": None,
                    "website_url": None,
                    "source_url": f"https://github.com/{organization['id']}",
                    "observed_at": generated_at,
                },
            )
            counts["organizations"] += 1

        for record in editorial["records"]:
            upsert(
                connection,
                "records",
                {
                    "id": record["id"],
                    "slug": record["slug"],
                    "organization_id": record["organization_id"],
                    "record_type": record["record_type"],
                    "title": record["title"],
                    "eyebrow": record["artifact_type"],
                    "summary": record["summary"],
                    "body_markdown": None,
                    "content": json.dumps(record.get("content", {})),
                    "maturity": record["maturity"],
                    "visibility": record["visibility"],
                    "featured": int(record["featured"]),
                    "canonical_url": record["canonical_url"],
                    "source_url": next(
                        (link["href"] for link in record["links"] if link.get("kind") == "source"),
                        None,
                    ),
                    "published_at": None,
                    "updated_at": generated_at,
                    "content_revision": 1,
                },
            )
            upsert(
                connection,
                "record_aliases",
                {
                    "id": stable_id("alias", record["id"], "source_name"),
                    "record_id": record["id"],
                    "alias_kind": "source_name",
                    "alias": f"{record['organization_id']}/{record['source_name']}",
                },
            )
            if record["parent_id"]:
                upsert(
                    connection,
                    "record_relations",
                    {
                        "id": stable_id("relation", record["id"], record["parent_id"], "part_of"),
                        "source_record_id": record["id"],
                        "target_record_id": record["parent_id"],
                        "relation_type": "part_of",
                        "note": None,
                    },
                )
            claim_id = stable_id("claim", record["id"], "reviewed-positioning")
            upsert(
                connection,
                "claims",
                {
                    "id": claim_id,
                    "record_id": record["id"],
                    "claim_type": "reviewed-positioning",
                    "statement": record.get("claim_boundary") or record["summary"],
                    "status": "reviewed",
                    "ssot_claim_id": None,
                    "reviewed_at": generated_at,
                },
            )
            source_url = next(
                (link["href"] for link in record["links"] if link.get("kind") == "source"),
                record["canonical_url"],
            )
            for index, evidence in enumerate(record["evidence"]):
                evidence_id = stable_id("evidence", record["id"], str(index))
                upsert(
                    connection,
                    "evidence",
                    {
                        "id": evidence_id,
                        "evidence_type": evidence.get("kind", "reviewed"),
                        "title": evidence["label"],
                        "source_url": source_url,
                        "locator": None,
                        "excerpt": None,
                        "observed_at": evidence.get("checkedAt") or generated_at,
                        "expires_at": None,
                    },
                )
                upsert(
                    connection,
                    "claim_evidence",
                    {
                        "id": stable_id("claim-evidence", claim_id, evidence_id),
                        "claim_id": claim_id,
                        "evidence_id": evidence_id,
                        "support": "supports",
                    },
                )
            for feature_slug in record["capabilities"]:
                feature_id = stable_id("feature", feature_slug)
                upsert(
                    connection,
                    "features",
                    {
                        "id": feature_id,
                        "slug": feature_slug,
                        "name": feature_slug.replace("-", " ").title(),
                        "description": None,
                        "ssot_feature_id": None,
                    },
                )
                upsert(
                    connection,
                    "record_features",
                    {
                        "id": stable_id("record-feature", record["id"], feature_id),
                        "record_id": record["id"],
                        "feature_id": feature_id,
                        "claim_id": claim_id,
                        "status": "reviewed",
                    },
                )
            for taxonomy_type, values in (
                ("audience", record["audience"]),
                ("ecosystem", record["ecosystems"]),
                ("technology", record["technologies"]),
                ("language", record.get("languages", [])),
                ("capability", record["capabilities"]),
            ):
                for label in values:
                    taxonomy_id = stable_id(
                        "taxonomy", taxonomy_type, label.lower().replace(" ", "-")
                    )
                    upsert(
                        connection,
                        "taxonomies",
                        {
                            "id": taxonomy_id,
                            "taxonomy_type": taxonomy_type,
                            "slug": label.lower().replace(" ", "-"),
                            "label": label,
                            "category": None,
                            "description": None,
                        },
                    )
                    upsert(
                        connection,
                        "record_taxonomies",
                        {
                            "id": stable_id("record-taxonomy", record["id"], taxonomy_id),
                            "record_id": record["id"],
                            "taxonomy_id": taxonomy_id,
                        },
                    )
            for index, limitation in enumerate(record["limitations"]):
                upsert(
                    connection,
                    "limitations",
                    {
                        "id": stable_id("limitation", record["id"], str(index)),
                        "record_id": record["id"],
                        "title": "Known limitation",
                        "description": limitation,
                        "severity": None,
                        "evidence_id": None,
                        "reviewed_at": generated_at,
                    },
                )
            counts["records"] += 1

        insights_path = repo_root / "public" / "insights-index.json"
        if insights_path.exists():
            for article in json.loads(insights_path.read_text(encoding="utf-8")):
                insight_id = stable_id("insight", article["legacyPath"])
                insight_slug = article["legacyPath"].strip("/").replace("/", "-")
                author_name = article.get("authorName") or "Groupsum"
                author_id = stable_id("person", author_name.lower().replace(" ", "-"))
                upsert(
                    connection,
                    "people",
                    {
                        "id": author_id,
                        "name": author_name,
                        "handle": None,
                        "profile_url": None,
                    },
                )
                upsert(
                    connection,
                    "records",
                    {
                        "id": insight_id,
                        "slug": insight_slug,
                        "organization_id": "groupsum",
                        "record_type": "insight",
                        "title": article["title"],
                        "eyebrow": article.get("categories", ["Insight"])[0] or "Insight",
                        "summary": article["excerpt"] or "Historical Groupsum article.",
                        "body_markdown": None,
                        "content": json.dumps(
                            {
                                "legacy_path": article["legacyPath"],
                                "content_path": article["contentPath"],
                                "tags": article.get("tags", []),
                                "categories": article.get("categories", []),
                            }
                        ),
                        "maturity": "historical-unreviewed",
                        "visibility": "public",
                        "featured": 0,
                        "canonical_url": article["canonicalUrl"],
                        "source_url": article["canonicalUrl"],
                        "published_at": article.get("date"),
                        "updated_at": article.get("modified") or article.get("date"),
                        "content_revision": 1,
                    },
                )
                upsert(
                    connection,
                    "record_authors",
                    {
                        "id": stable_id("record-author", insight_id, author_id),
                        "record_id": insight_id,
                        "person_id": author_id,
                        "role": "author",
                    },
                )
                upsert(
                    connection,
                    "record_aliases",
                    {
                        "id": stable_id("alias", insight_id, "legacy_path"),
                        "record_id": insight_id,
                        "alias_kind": "legacy_path",
                        "alias": article["legacyPath"],
                    },
                )
                counts["insights"] += 1
                counts["records"] += 1

        records_by_slug = {record["slug"]: record["id"] for record in editorial["records"]}
        for record in editorial["records"]:
            for related_slug in record.get("related_slugs", []):
                target_id = records_by_slug.get(related_slug)
                if not target_id or target_id == record["id"]:
                    continue
                upsert(
                    connection,
                    "record_relations",
                    {
                        "id": stable_id("relation", record["id"], target_id, "related"),
                        "source_record_id": record["id"],
                        "target_record_id": target_id,
                        "relation_type": "related",
                        "note": None,
                    },
                )

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
            repositories = bundle["repository"].get("attached_repositories") or [
                bundle["repository"]
            ]
            for repository in repositories:
                full_name = (
                    repository.get("full_name")
                    or f"{record['organization_id']}/{record['source_name']}"
                )
                repository_id = repository.get("id") or stable_id("repository", full_name)
                owner, name = full_name.split("/", 1)
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
                        "is_archived": int(repository.get("archived", False)),
                        "is_fork": int(repository.get("fork", False)),
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
                for metric, value in repository.get("metrics", {}).items():
                    if not isinstance(value, int | float):
                        continue
                    upsert(
                        connection,
                        "metric_observations",
                        {
                            "id": stable_id(
                                "metric",
                                repository_id,
                                metric,
                                bundle["generated_at"],
                            ),
                            "subject_kind": "repository",
                            "subject_id": repository_id,
                            "metric": metric,
                            "value": value,
                            "unit": "count",
                            "period_start": None,
                            "period_end": None,
                            "source_url": repository.get("source_url") or repository.get("url"),
                            "observed_at": bundle["generated_at"],
                        },
                    )
                latest_release = repository.get("latest_release")
                if latest_release and latest_release.get("url"):
                    version = latest_release.get("tag") or latest_release.get("name", "latest")
                    upsert(
                        connection,
                        "releases",
                        {
                            "id": stable_id("release", repository_id, version),
                            "package_id": None,
                            "repository_id": repository_id,
                            "release_kind": "github",
                            "version": version,
                            "url": latest_release["url"],
                            "published_at": latest_release.get("published_at"),
                            "observed_at": bundle["generated_at"],
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
                existing_package = connection.execute(
                    "SELECT id FROM packages WHERE ecosystem = ? AND name = ?",
                    (package["ecosystem"], package["name"]),
                ).fetchone()
                package_id = existing_package["id"] if existing_package else package["id"]
                upsert(
                    connection,
                    "packages",
                    {
                        "id": package_id,
                        "ecosystem": package["ecosystem"],
                        "name": package["name"],
                        "registry_url": package.get("registry_url") or package["source_url"],
                        "description": package.get("description"),
                        "latest_version": package.get("latest_version"),
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
                counts["packages"] += 1
                if package.get("published") and package.get("latest_version"):
                    upsert(
                        connection,
                        "releases",
                        {
                            "id": stable_id("release", package_id, str(package["latest_version"])),
                            "package_id": package_id,
                            "repository_id": None,
                            "release_kind": package["ecosystem"],
                            "version": str(package["latest_version"]),
                            "url": package.get("registry_url") or package["source_url"],
                            "published_at": None,
                            "observed_at": package.get("observed_at") or bundle["generated_at"],
                        },
                    )
                if isinstance(package.get("downloads"), int | float):
                    observed_at = package.get("observed_at") or bundle["generated_at"]
                    upsert(
                        connection,
                        "metric_observations",
                        {
                            "id": stable_id("metric", package_id, "downloads", observed_at),
                            "subject_kind": "package",
                            "subject_id": package_id,
                            "metric": "downloads",
                            "value": package["downloads"],
                            "unit": "count",
                            "period_start": None,
                            "period_end": None,
                            "source_url": package.get("registry_url") or package["source_url"],
                            "observed_at": observed_at,
                        },
                    )
            for resource in bundle["repository"].get("related_resources", []):
                resource_id = stable_id("resource-url", resource["url"])
                upsert(
                    connection,
                    "resources",
                    {
                        "id": resource_id,
                        "resource_type": resource["kind"],
                        "title": resource.get("name") or resource["kind"],
                        "url": resource["url"],
                        "summary": None,
                        "source_url": resource["url"],
                        "observed_at": bundle["generated_at"],
                    },
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
                counts["resources"] += 1
        connection.execute(
            "UPDATE collection_runs SET completed_at = ?, status = ?, summary = ? WHERE id = ?",
            (generated_at, "complete", json.dumps(counts, sort_keys=True), run_id),
        )
    return counts
