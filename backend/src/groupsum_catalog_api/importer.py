from __future__ import annotations

import hashlib
import json
import re
from datetime import UTC, datetime, timedelta
from pathlib import Path
from typing import Any

from .analytics import connect_analytics, default_analytics_path, upsert_metric
from .database import Connection, connect


def stable_id(*parts: str) -> str:
    readable = ":".join(parts)
    if len(readable) <= 300:
        return readable
    return f"sha256:{hashlib.sha256(readable.encode()).hexdigest()}"


def package_key(ecosystem: str, name: str) -> str:
    return f"{ecosystem}:{name.casefold().replace('_', '-')}"


def record_slug(owner: str, name: str) -> str:
    value = re.sub(r"[^a-z0-9]+", "-", f"catalog-{owner}-{name}".lower()).strip("-")
    return value or hashlib.sha256(f"{owner}/{name}".encode()).hexdigest()[:16]


def upsert(connection: Connection, table: str, values: dict[str, Any]) -> None:
    columns = tuple(values)
    placeholders = ", ".join("?" for _ in columns)
    assignments = ", ".join(f"{column}=excluded.{column}" for column in columns if column != "id")
    connection.execute(
        f"INSERT INTO {table} ({', '.join(columns)}) VALUES ({placeholders}) "
        f"ON CONFLICT(id) DO UPDATE SET {assignments}",
        tuple(values[column] for column in columns),
    )


def import_legal_evidence(
    connection: Connection,
    subject_kind: str,
    subject_id: str,
    evidence: list[dict[str, Any]],
    observed_at: str,
) -> None:
    for item in evidence:
        url = item.get("url")
        if not url:
            continue
        evidence_kind = item.get("kind") or "license"
        upsert(
            connection,
            "legal_evidence",
            {
                "id": stable_id("legal", subject_kind, subject_id, evidence_kind, url),
                "subject_kind": subject_kind,
                "subject_id": subject_id,
                "evidence_kind": evidence_kind,
                "name": item.get("name") or item.get("path") or evidence_kind.title(),
                "expression": item.get("expression"),
                "path": item.get("path"),
                "url": url,
                "scope": item.get("scope") or "direct",
                "evidence_type": item.get("evidence") or "repository.file",
                "observed_at": observed_at,
            },
        )


def ensure_repository_ssot_columns(connection: Connection) -> None:
    definitions = {
        "ssot_governed": "BOOLEAN NOT NULL DEFAULT FALSE",
        "ssot_registry_url": "TEXT",
        "ssot_registry_sha256": "VARCHAR(64)",
        "ssot_schema_version": "VARCHAR(40)",
        "ssot_summary": "JSONB" if connection.postgres else "JSON",
        "ssot_observed_at": "TIMESTAMP WITH TIME ZONE" if connection.postgres else "TEXT",
    }
    if connection.postgres:
        for name, definition in definitions.items():
            connection.execute(
                f"ALTER TABLE repositories ADD COLUMN IF NOT EXISTS {name} {definition}"
            )
        return
    present = {row[1] for row in connection.execute("PRAGMA table_info(repositories)")}
    for name, definition in definitions.items():
        if name not in present:
            connection.execute(f"ALTER TABLE repositories ADD COLUMN {name} {definition}")


def ensure_package_ownership_columns(connection: Connection) -> None:
    definitions = {
        "package_kind": "VARCHAR(60) NOT NULL DEFAULT 'package-candidate'",
        "private": "BOOLEAN NOT NULL DEFAULT FALSE",
    }
    if connection.postgres:
        for name, definition in definitions.items():
            connection.execute(
                f"ALTER TABLE packages ADD COLUMN IF NOT EXISTS {name} {definition}"
            )
        return
    present = {row[1] for row in connection.execute("PRAGMA table_info(packages)")}
    for name, definition in definitions.items():
        if name not in present:
            connection.execute(f"ALTER TABLE packages ADD COLUMN {name} {definition}")


ENTITY_TYPES = {
    "organization": ("Organization", "party"),
    "product": ("Product", "offering"),
    "portfolio": ("Portfolio", "collection"),
    "solution": ("Solution", "offering"),
    "service": ("Service", "offering"),
    "insight": ("Insight", "content"),
    "repository": ("Repository", "resource"),
    "package": ("Package", "resource"),
    "website": ("Website", "experience"),
    "documentation": ("Documentation", "content"),
    "api_definition": ("API definition", "resource"),
    "api_source": ("API source", "resource"),
    "api": ("Live API", "experience"),
    "demo": ("Demo", "experience"),
    "example": ("Example", "content"),
    "showcase": ("Showcase", "experience"),
    "ui": ("User interface", "experience"),
    "resource": ("Resource", "resource"),
    "governance_registry": ("SSOT registry", "governance"),
}


def catalog_entity_id(source_table: str, source_id: str) -> str:
    return stable_id("entity", source_table, source_id)


def rebuild_entity_graph(connection: Connection, generated_at: str) -> dict[str, int]:
    """Project normalized tables into one canonical, evidence-bearing entity graph."""
    if connection.postgres:
        # create_all does not widen an existing deployment column. Relationship roles
        # include manifest paths, so keep the additive schema migration idempotent.
        connection.execute(
            "ALTER TABLE entity_relationships ALTER COLUMN role TYPE VARCHAR(512)"
        )
    for table in ("entity_relationships", "entity_urls", "entity_aliases", "catalog_entities"):
        connection.execute(f"DELETE FROM {table}")
    connection.execute("DELETE FROM entity_types")
    for type_id, (label, semantic_class) in ENTITY_TYPES.items():
        upsert(
            connection,
            "entity_types",
            {
                "id": type_id,
                "label": label,
                "semantic_class": semantic_class,
                "description": None,
            },
        )

    def add_entity(
        source_table: str,
        source_id: str,
        entity_type: str,
        slug: str,
        name: str,
        *,
        organization_id: str | None = None,
        summary: str | None = None,
        canonical_url: str | None = None,
        visibility: str = "public",
        maturity: str | None = None,
        observed_at: str | None = None,
        source_url: str | None = None,
    ) -> str:
        entity_id = catalog_entity_id(source_table, source_id)
        upsert(
            connection,
            "catalog_entities",
            {
                "id": entity_id,
                "entity_type_id": entity_type if entity_type in ENTITY_TYPES else "resource",
                "organization_id": organization_id,
                "slug": slug,
                "name": name,
                "summary": summary,
                "canonical_url": canonical_url,
                "source_table": source_table,
                "source_id": source_id,
                "visibility": visibility,
                "maturity": maturity,
                "observed_at": observed_at or generated_at,
            },
        )
        for role, url, label, evidence_type in (
            ("canonical", canonical_url, "Canonical record", "catalog.projection"),
            ("source", source_url, "Primary source", "source.observation"),
        ):
            if not url:
                continue
            upsert(
                connection,
                "entity_urls",
                {
                    "id": stable_id("entity-url", entity_id, role, url),
                    "entity_id": entity_id,
                    "url_role": role,
                    "url": url,
                    "label": label,
                    "evidence_type": evidence_type,
                    "observed_at": observed_at or generated_at,
                },
            )
        if canonical_url:
            upsert(
                connection,
                "entity_aliases",
                {
                    "id": stable_id("entity-alias", entity_id, "route", canonical_url),
                    "entity_id": entity_id,
                    "alias_kind": "route",
                    "alias": canonical_url,
                },
            )
        return entity_id

    def link(
        source_entity: str,
        target_entity: str,
        relationship_type: str,
        *,
        role: str | None = None,
        evidence_type: str,
        source_url: str | None = None,
        observed_at: str | None = None,
        confidence: str = "observed",
    ) -> None:
        upsert(
            connection,
            "entity_relationships",
            {
                "id": stable_id(
                    "entity-relationship",
                    source_entity,
                    target_entity,
                    relationship_type,
                    role or "",
                ),
                "source_entity_id": source_entity,
                "target_entity_id": target_entity,
                "relationship_type": relationship_type,
                "role": role,
                "evidence_type": evidence_type,
                "source_url": source_url,
                "confidence": confidence,
                "status": "active",
                "observed_at": observed_at or generated_at,
            },
        )

    organization_entities: dict[str, str] = {}
    for row in connection.execute("SELECT * FROM organizations").fetchall():
        item = dict(row)
        organization_entities[item["id"]] = add_entity(
            "organizations",
            item["id"],
            "organization",
            item["slug"],
            item["name"],
            organization_id=item["id"],
            summary=item.get("summary"),
            canonical_url=f"https://groupsum.xyz/products/{item['slug']}",
            observed_at=item.get("observed_at"),
            source_url=item.get("source_url"),
        )

    for row in connection.execute("SELECT * FROM records").fetchall():
        item = dict(row)
        entity_id = add_entity(
            "records",
            item["id"],
            item["record_type"],
            item["slug"],
            item["title"],
            organization_id=item["organization_id"],
            summary=item.get("summary"),
            canonical_url=item.get("canonical_url"),
            visibility=item.get("visibility") or "public",
            maturity=item.get("maturity"),
            observed_at=item.get("updated_at"),
            source_url=item.get("source_url"),
        )
        owner = organization_entities.get(item["organization_id"])
        if owner:
            link(
                entity_id,
                owner,
                "owned_by",
                evidence_type="editorial.organization_id",
                source_url=item.get("canonical_url"),
                observed_at=item.get("updated_at"),
            )

    for row in connection.execute("SELECT * FROM repositories").fetchall():
        item = dict(row)
        canonical = f"https://groupsum.xyz/catalog/repositories/{item['owner']}/{item['name']}"
        entity_id = add_entity(
            "repositories",
            item["id"],
            "repository",
            f"{item['owner']}/{item['name']}",
            f"{item['owner']}/{item['name']}",
            organization_id=item.get("organization_id"),
            summary=item.get("description"),
            canonical_url=canonical,
            maturity="archived" if item.get("is_archived") else "observed-public-source",
            observed_at=item.get("observed_at"),
            source_url=item.get("url"),
        )
        owner = organization_entities.get(item.get("organization_id"))
        if owner:
            link(
                entity_id,
                owner,
                "owned_by",
                evidence_type="github.repository_owner",
                source_url=item.get("url"),
                observed_at=item.get("observed_at"),
            )
        if item.get("ssot_governed") and item.get("ssot_registry_url"):
            registry_id = add_entity(
                "ssot_registries",
                item["id"],
                "governance_registry",
                f"{item['owner']}/{item['name']}/ssot-registry",
                f"{item['owner']}/{item['name']} SSOT registry",
                organization_id=item.get("organization_id"),
                summary="Canonical repository governance registry.",
                canonical_url=item["ssot_registry_url"],
                observed_at=item.get("ssot_observed_at"),
                source_url=item["ssot_registry_url"],
            )
            link(
                entity_id,
                registry_id,
                "governed_by",
                evidence_type="ssot.registry",
                source_url=item["ssot_registry_url"],
                observed_at=item.get("ssot_observed_at"),
            )

    for row in connection.execute("SELECT * FROM packages").fetchall():
        item = dict(row)
        route = (
            f"https://groupsum.xyz/catalog/packages/{item['ecosystem']}/{item['route_key']}"
            if item.get("route_key")
            else item.get("registry_url")
        )
        add_entity(
            "packages",
            item["id"],
            "package",
            f"{item['ecosystem']}:{item['name']}",
            item["name"],
            summary=item.get("description"),
            canonical_url=route,
            maturity=item.get("publication_status"),
            observed_at=item.get("observed_at"),
            source_url=item.get("registry_url") or item.get("source_url"),
        )

    for row in connection.execute("SELECT * FROM resources").fetchall():
        item = dict(row)
        resource_type = item.get("resource_type") or "resource"
        route = (
            f"https://groupsum.xyz/catalog/resources/{resource_type}/{item['route_key']}"
            if item.get("route_key")
            else item.get("url")
        )
        add_entity(
            "resources",
            item["id"],
            resource_type,
            item.get("route_key") or item["id"],
            item["title"],
            summary=item.get("summary"),
            canonical_url=route,
            observed_at=item.get("observed_at"),
            source_url=item.get("url"),
        )

    record_repository_edges = connection.execute(
        "SELECT rr.*, repo.url FROM record_repositories rr "
        "JOIN repositories repo ON repo.id = rr.repository_id"
    ).fetchall()
    for row in record_repository_edges:
        item = dict(row)
        link(
            catalog_entity_id("records", item["record_id"]),
            catalog_entity_id("repositories", item["repository_id"]),
            "implemented_by",
            role=item.get("role"),
            evidence_type="catalog.record_repository",
            source_url=item.get("url"),
        )
    for row in connection.execute("SELECT * FROM record_packages").fetchall():
        item = dict(row)
        link(
            catalog_entity_id("records", item["record_id"]),
            catalog_entity_id("packages", item["package_id"]),
            "distributed_as",
            role=item.get("role"),
            evidence_type="catalog.record_package",
        )
    resource_relationships = {
        "website": "presented_at",
        "documentation": "documented_by",
        "api_definition": "defines_api_with",
        "api_source": "implements_api_with",
        "api": "exposes_api",
        "demo": "demonstrated_by",
        "example": "has_example",
        "showcase": "showcased_by",
        "ui": "has_ui",
    }
    for row in connection.execute(
        "SELECT rr.*, rs.resource_type, rs.url FROM record_resources rr "
        "JOIN resources rs ON rs.id = rr.resource_id"
    ).fetchall():
        item = dict(row)
        link(
            catalog_entity_id("records", item["record_id"]),
            catalog_entity_id("resources", item["resource_id"]),
            resource_relationships.get(item["resource_type"], "related_to"),
            role=item.get("role"),
            evidence_type="catalog.record_resource",
            source_url=item.get("url"),
        )
    for row in connection.execute("SELECT * FROM package_repositories").fetchall():
        item = dict(row)
        link(
            catalog_entity_id("packages", item["package_id"]),
            catalog_entity_id("repositories", item["repository_id"]),
            "source_code_at",
            role=item.get("path"),
            evidence_type="repository.manifest",
        )
    for row in connection.execute(
        "SELECT id, repository_id, url, path FROM resources WHERE repository_id IS NOT NULL"
    ).fetchall():
        item = dict(row)
        link(
            catalog_entity_id("resources", item["id"]),
            catalog_entity_id("repositories", item["repository_id"]),
            "source_code_at",
            role=item.get("path"),
            evidence_type="repository.resource_path",
            source_url=item.get("url"),
        )
    for row in connection.execute("SELECT * FROM record_relations").fetchall():
        item = dict(row)
        link(
            catalog_entity_id("records", item["source_record_id"]),
            catalog_entity_id("records", item["target_record_id"]),
            item["relation_type"],
            role=item.get("note"),
            evidence_type="editorial.record_relation",
        )
    return {
        "entities": connection.execute("SELECT COUNT(*) FROM catalog_entities").fetchone()[0],
        "entity_relationships": connection.execute(
            "SELECT COUNT(*) FROM entity_relationships"
        ).fetchone()[0],
    }


def import_catalog(
    database_path: str | Path,
    repo_root: Path,
    analytics_path: Path | None = None,
) -> dict[str, int]:
    editorial = json.loads((repo_root / "catalog" / "content" / "records.json").read_text())
    generated_at = datetime.now(UTC).replace(microsecond=0).isoformat()
    run_id = stable_id("collection-run", "website-editorial", generated_at)
    counts = {
        "organizations": 0,
        "repositories": 0,
        "records": 0,
        "insights": 0,
        "packages": 0,
        "releases": 0,
        "dependencies": 0,
        "resources": 0,
    }

    analytics_path = analytics_path or default_analytics_path(database_path)
    with connect(database_path) as connection, connect_analytics(analytics_path) as analytics:
        ensure_repository_ssot_columns(connection)
        ensure_package_ownership_columns(connection)
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
        connection.execute("DELETE FROM package_repositories")
        connection.execute("DELETE FROM repository_contributors")
        connection.execute("DELETE FROM dependencies")
        connection.execute("DELETE FROM releases")
        connection.execute("DELETE FROM legal_evidence")
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

        site_root = repo_root / "catalog" / "generated" / "site"
        site_repositories = json.loads((site_root / "repositories.json").read_text())
        site_packages = json.loads((site_root / "packages.json").read_text())
        claimed_repositories: set[str] = set()
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
            attached = bundle["repository"].get("attached_repositories") or [
                bundle["repository"]
            ]
            claimed_repositories.update(
                item.get("full_name")
                for item in attached
                if item.get("full_name")
            )

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
            import_legal_evidence(
                connection,
                "repository",
                repository_id,
                repository.get("legal_evidence", []),
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
                    datetime.fromisoformat(period_start.replace("Z", "+00:00"))
                    + timedelta(days=1)
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
                        "archived"
                        if repository.get("archived")
                        else "observed-public-source"
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
            claim_id = stable_id("claim", generated_record_id, "catalog-observation")
            evidence_id = stable_id("evidence", generated_record_id, "repository")
            upsert(
                connection,
                "claims",
                {
                    "id": claim_id,
                    "record_id": generated_record_id,
                    "claim_type": "catalog-observation",
                    "statement": summary,
                    "status": "observed",
                    "ssot_claim_id": None,
                    "reviewed_at": None,
                },
            )
            upsert(
                connection,
                "evidence",
                {
                    "id": evidence_id,
                    "evidence_type": "source",
                    "title": "Public GitHub repository observation",
                    "source_url": repository["url"],
                    "locator": None,
                    "excerpt": None,
                    "observed_at": repository.get("observed_at") or generated_at,
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
            upsert(
                connection,
                "limitations",
                {
                    "id": stable_id("limitation", generated_record_id, "generated-record"),
                    "record_id": generated_record_id,
                    "title": "Editorial status",
                    "description": (
                        "Catalog-generated evidence record; product positioning and "
                        "maturity have not been editorially reviewed."
                    ),
                    "severity": None,
                    "evidence_id": evidence_id,
                    "reviewed_at": None,
                },
            )
            for resource in repository.get("related_resources", []):
                if not resource.get("url"):
                    continue
                resource_id = stable_id("resource-url", resource["url"])
                upsert(
                    connection,
                    "resources",
                    {
                        "id": resource_id,
                        "resource_type": resource.get("kind") or "resource",
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
                counts["resources"] += 1
            counts["records"] += 1

        package_ids_by_key: dict[str, list[str]] = {}
        for package in site_packages:
            package_id = package["id"]
            ecosystem = package["ecosystem"]
            name = package["name"]
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
                        bool(package.get("published"))
                        if package.get("published") is not None
                        else None
                    ),
                    "publication_status": package.get("publication_status"),
                    "route_key": package.get("route", "").rstrip("/").split("/")[-1] or None,
                    "license_expression": package.get("license_expression"),
                    "license_status": package.get("license_status"),
                    "published_at": None,
                    "observed_at": package.get("observed_at") or generated_at,
                },
            )
            import_legal_evidence(
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
                            "package"
                            if dependency.get("internal")
                            else "external-package"
                        ),
                        "target_id": target_key,
                        "requirement": dependency.get("requirement"),
                        "scope": dependency.get("scope"),
                        "evidence_type": dependency.get("evidence") or "repository.manifest",
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
                        "requirement": dependent.get("requirement"),
                        "scope": dependent.get("scope") or "registry-dependent",
                        "evidence_type": (
                            dependent.get("evidence")
                            or "registry.reverse_dependencies"
                        ),
                        "source_url": package.get("registry_url"),
                        "completeness": (
                            dependent.get("completeness")
                            or "bounded-registry-observation"
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
                package_id = package["id"]
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
                upsert(
                    connection,
                    "resources",
                    {
                        "id": resource_id,
                        "resource_type": resource["kind"],
                        "route_key": resource.get("route", "").rstrip("/").split("/")[-1] or None,
                        "repository_id": repository_ids.get(
                            bundle["repository"].get("full_name")
                        ),
                        "path": resource.get("path"),
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
        counts.update(rebuild_entity_graph(connection, generated_at))
        counts["releases"] = connection.execute(
            "SELECT COUNT(*) FROM releases"
        ).fetchone()[0]
        counts["dependencies"] = connection.execute(
            "SELECT COUNT(*) FROM dependencies"
        ).fetchone()[0]
        connection.execute(
            "UPDATE collection_runs SET completed_at = ?, status = ?, summary = ? WHERE id = ?",
            (generated_at, "complete", json.dumps(counts, sort_keys=True), run_id),
        )
    return counts
