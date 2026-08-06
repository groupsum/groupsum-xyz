from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from tigrbl import JSONResponse, Request, Response

from ..importer import connect

CACHE_CONTROL = "public, max-age=60, s-maxage=300, stale-while-revalidate=86400"

from .common import *  # noqa: F403
from .signals import *  # noqa: F403


def catalog_repository_detail(
    database_path: str | Path,
    request: Request,
    owner: str,
    repository: str,
) -> JSONResponse | Response:
    with connect(database_path) as connection:
        row = connection.execute(
            "SELECT * FROM repositories WHERE owner = ? AND name = ?",
            (owner, repository),
        ).fetchone()
        if row is None:
            return JSONResponse({"detail": "Repository not found"}, status_code=404)
        item = dict(row)
        item["is_archived"] = bool(item["is_archived"])
        item["is_fork"] = bool(item["is_fork"])
        item["ssot_governed"] = bool(item["ssot_governed"])
        if isinstance(item.get("ssot_summary"), str):
            item["ssot_summary"] = json.loads(item["ssot_summary"] or "{}")
        item.update(repository_signals(connection, item["id"]))
        packages = rows(
            connection,
            """
            SELECT p.id, p.ecosystem, p.name, p.route_key, p.registry_url,
                   p.manifest_path, p.latest_version, p.license_expression,
                   p.license_status, p.observed_at
              FROM packages p JOIN package_repositories pr ON pr.package_id = p.id
             WHERE pr.repository_id = ? ORDER BY p.ecosystem, p.name COLLATE NOCASE
            """,
            (item["id"],),
        )
        for package in packages:
            package["route"] = f"/catalog/packages/{package['ecosystem']}/{package['route_key']}"
        resources = rows(
            connection,
            """SELECT id, resource_type, route_key, title, url, summary, path, observed_at
                   FROM resources WHERE repository_id = ?
               ORDER BY resource_type, title COLLATE NOCASE""",
            (item["id"],),
        )
        for resource in resources:
            resource["route"] = (
                f"/catalog/resources/{resource['resource_type']}/{resource['route_key']}"
            )
        releases = rows(
            connection,
            """SELECT id, release_kind, route_key, version, url, published_at,
                      downloads, prerelease, draft, observed_at
                   FROM releases WHERE repository_id = ?
               ORDER BY COALESCE(published_at, observed_at) DESC LIMIT 100""",
            (item["id"],),
        )
        legal = rows(
            connection,
            """SELECT evidence_kind, name, expression, path, url, scope,
                      origin_kind, observed_at
                   FROM legal_evidence
                  WHERE subject_kind = 'repository' AND subject_id = ?
               ORDER BY scope, evidence_kind, name""",
            (item["id"],),
        )
        graph = entity_graph_for_source(connection, "repositories", item["id"])
        linked_sections = linked_resource_sections_for_source(
            connection,
            "repositories",
            item["id"],
            excluded_types=frozenset(
                {
                    "party.organization",
                    "distribution.package",
                    "release.package",
                    "release.container",
                    "release.repository",
                }
            ),
        )
    return cacheable_json(
        request,
        {
            "kind": "catalog_repository_record",
            "item": item,
            "graph": graph,
            "linked_sections": linked_sections,
            "implementation": {"packages": packages, "resources": resources, "releases": releases},
            "governance": {
                "governed": item["ssot_governed"],
                "registry_url": item.get("ssot_registry_url"),
                "schema_version": item.get("ssot_schema_version"),
                "summary": item.get("ssot_summary") or {},
                "observed_at": item.get("ssot_observed_at"),
            },
            "legal": {
                "license_expression": item.get("license_expression"),
                "status": "observed" if legal or item.get("license_expression") else "not-observed",
                "observations": legal,
            },
        },
    )


def catalog_technology_detail(
    database_path: str | Path,
    request: Request,
    slug: str,
) -> JSONResponse | Response:
    with connect(database_path) as connection:
        row = connection.execute(
            "SELECT * FROM taxonomies "
            "WHERE slug = ? AND taxonomy_type IN ('technology', 'language')",
            (slug,),
        ).fetchone()
        if row is None:
            return JSONResponse({"detail": "Technology not found"}, status_code=404)
        item = dict(row)
        records = rows(
            connection,
            """SELECT r.id, r.slug, r.record_type, r.title, r.summary, r.canonical_url
                   FROM records r JOIN record_taxonomies rt ON rt.record_id = r.id
                  WHERE rt.taxonomy_id = ? AND r.visibility = 'public'
               ORDER BY r.record_type, r.title COLLATE NOCASE""",
            (item["id"],),
        )
    return cacheable_json(
        request,
        {"kind": "catalog_technology_record", "item": item, "related_records": records},
    )


def insight_collection(
    database_path: Path,
    request: Request,
    q: str = "",
    page: int = 1,
    page_size: int = 20,
) -> JSONResponse | Response:
    page = max(1, page)
    page_size = min(50, max(1, page_size))
    term = f"%{q.strip()}%"
    where = "r.record_type = 'insight' AND r.visibility = 'public'"
    parameters: list[Any] = []
    if q.strip():
        where += " AND (r.title LIKE ? OR r.summary LIKE ?)"
        parameters.extend((term, term))
    with connect(database_path) as connection:
        total = connection.execute(
            f"SELECT COUNT(*) FROM records r WHERE {where}", parameters
        ).fetchone()[0]
        records = rows(
            connection,
            f"""
            SELECT r.id, r.slug, r.title, r.summary, r.eyebrow, r.canonical_url,
                   r.published_at, r.updated_at, r.content, p.name AS author
              FROM records r
         LEFT JOIN record_authors ra ON ra.record_id = r.id AND ra.role = 'author'
         LEFT JOIN people p ON p.id = ra.person_id
             WHERE {where}
          ORDER BY r.published_at DESC, r.title COLLATE NOCASE
             LIMIT ? OFFSET ?
            """,
            (*parameters, page_size, (page - 1) * page_size),
        )
        for record in records:
            record["content"] = record.get("content") or {}
    return cacheable_json(
        request,
        {
            "kind": "insight_collection",
            "query": q,
            "page": page,
            "page_size": page_size,
            "total": total,
            "page_count": (total + page_size - 1) // page_size,
            "records": records,
        },
    )


def organization_detail(
    database_path: Path,
    request: Request,
    slug: str,
) -> JSONResponse | Response:
    with connect(database_path) as connection:
        organization_row = connection.execute(
            "SELECT * FROM organizations WHERE slug = ?", (slug,)
        ).fetchone()
        if organization_row is None:
            return JSONResponse({"detail": "Organization not found"}, status_code=404)
        organization = dict(organization_row)
        records = rows(
            connection,
            """
            SELECT id, slug, record_type, title, eyebrow, summary, maturity,
                   featured, canonical_url, updated_at
              FROM records
             WHERE organization_id = ? AND visibility = 'public' AND record_type != 'insight'
          ORDER BY record_type, featured DESC, title COLLATE NOCASE
            """,
            (organization["id"],),
        )
        for record in records:
            record["featured"] = bool(record["featured"])
    return cacheable_json(
        request,
        {
            "kind": "organization_record",
            "generated_at": organization["observed_at"],
            "organization": organization,
            "records": records,
        },
    )
