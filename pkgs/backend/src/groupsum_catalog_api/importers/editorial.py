from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from ..database import Connection
from .common import *  # noqa: F403


def prepare_import(
    connection: Connection,
    analytics: Any,
    editorial: dict[str, Any],
    run_id: str,
    generated_at: str,
) -> None:
    ensure_repository_ssot_columns(connection)
    ensure_package_ownership_columns(connection)
    ensure_universal_resource_columns(connection)
    # Product and portfolio records do not own repository metrics. Remove
    # legacy record-wide rollups so evidence links cannot transfer stars,
    # commits, contributors, releases, dependencies, or dependents.
    analytics.execute("DELETE FROM metric_observations WHERE subject_kind = 'record'")
    analytics.execute("DELETE FROM record_aggregates")
    # Release pages inherit legal evidence from their package or repository parent.
    # Remove legacy duplicated rows so refreshes converge to the compact model.
    connection.execute(
        "DELETE FROM legal_evidence WHERE subject_kind IN (?, ?)",
        ("release", "resource"),
    )
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
    # These tables are a deterministic projection of the current public catalog,
    # not append-only observations. Replacing them prevents removed relationships
    # and release IDs from older importer versions from surviving a refresh.
    connection.execute("DELETE FROM resource_evidence")
    connection.execute("DELETE FROM resource_taxonomies")
    connection.execute("DELETE FROM resource_repositories")
    connection.execute("DELETE FROM record_resources")
    connection.execute("DELETE FROM resources")
    connection.execute("DELETE FROM package_repositories")
    connection.execute("DELETE FROM repository_contributors")
    connection.execute("DELETE FROM dependencies")
    connection.execute("DELETE FROM releases")
    connection.execute("DELETE FROM legal_evidence")
    # Evidence and governance features are reserved for SSOT registry entities.
    # Legacy editorial/source checks are re-imported as observations below.
    connection.execute("UPDATE limitations SET evidence_id = NULL")
    connection.execute("DELETE FROM claim_evidence")
    connection.execute("DELETE FROM record_features")
    connection.execute("DELETE FROM features")
    connection.execute("DELETE FROM claims")
    connection.execute("DELETE FROM evidence")


def import_editorial(
    connection: Connection,
    editorial: dict[str, Any],
    run_id: str,
    generated_at: str,
    counts: dict[str, int],
) -> None:
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
                "featured": bool(record["featured"]),
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
        source_url = next(
            (link["href"] for link in record["links"] if link.get("kind") == "source"),
            record["canonical_url"],
        )
        for index, source_check in enumerate(record["evidence"]):
            upsert(
                connection,
                "observations",
                {
                    "id": stable_id("observation", run_id, record["id"], str(index)),
                    "collection_run_id": run_id,
                    "subject_kind": "record",
                    "subject_id": record["id"],
                    "observation_type": "editorial-source-check",
                    "evidence_type": None,
                    "source_url": source_url,
                    "payload": json.dumps(
                        {
                            "kind": source_check.get("kind", "reviewed"),
                            "label": source_check["label"],
                        }
                    ),
                    "completeness": "reviewed-source-check",
                    "observed_at": source_check.get("checkedAt") or generated_at,
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
                taxonomy_id = stable_id("taxonomy", taxonomy_type, label.lower().replace(" ", "-"))
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


def import_insights(
    connection: Connection, repo_root: Path, generated_at: str, counts: dict[str, int]
) -> None:
    insights_path = repo_root / "pkgs" / "frontend" / "public" / "insights-index.json"
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
                    "featured": False,
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


def import_record_relations(connection: Connection, editorial: dict[str, Any]) -> None:
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
