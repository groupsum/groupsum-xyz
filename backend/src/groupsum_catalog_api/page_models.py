from __future__ import annotations

import hashlib
import json
import sqlite3
from collections import defaultdict
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from tigrbl import JSONResponse, Request, Response

from .importer import connect

CACHE_CONTROL = "public, max-age=60, s-maxage=300, stale-while-revalidate=86400"


def rows(
    connection: sqlite3.Connection, query: str, parameters: tuple[Any, ...] = ()
) -> list[dict]:
    return [dict(row) for row in connection.execute(query, parameters).fetchall()]


def cacheable_json(request: Request, payload: dict[str, Any]) -> JSONResponse | Response:
    body = json.dumps(payload, sort_keys=True, separators=(",", ":"), default=str).encode()
    etag = f'"{hashlib.sha256(body).hexdigest()}"'
    headers = {
        "Cache-Control": CACHE_CONTROL,
        "ETag": etag,
        "Vary": "Accept-Encoding",
        "Content-Language": "en",
    }
    if request.headers.get("if-none-match") == etag:
        return Response(status_code=304, headers=headers)
    return JSONResponse(payload, headers=headers)


def record_collection(
    database_path: Path,
    request: Request,
    record_type: str,
) -> JSONResponse | Response:
    with connect(database_path) as connection:
        records = rows(
            connection,
            """
            SELECT r.id, r.slug, r.record_type, r.title, r.eyebrow, r.summary,
                   r.maturity, r.featured, r.canonical_url, r.updated_at,
                   o.id AS organization_id, o.name AS organization_name,
                   COUNT(DISTINCT rp.package_id) AS package_count,
                   COUNT(DISTINCT rr.repository_id) AS repository_count,
                   COUNT(DISTINCT rs.resource_id) AS resource_count
              FROM records r
              JOIN organizations o ON o.id = r.organization_id
         LEFT JOIN record_packages rp ON rp.record_id = r.id
         LEFT JOIN record_repositories rr ON rr.record_id = r.id
         LEFT JOIN record_resources rs ON rs.record_id = r.id
             WHERE r.record_type = ? AND r.visibility = 'public'
          GROUP BY r.id
          ORDER BY r.featured DESC, r.title COLLATE NOCASE
            """,
            (record_type,),
        )
        for record in records:
            record["featured"] = bool(record["featured"])
            record["technologies"] = [
                item["label"]
                for item in rows(
                    connection,
                    """
                    SELECT t.label FROM taxonomies t
                    JOIN record_taxonomies rt ON rt.taxonomy_id = t.id
                    WHERE rt.record_id = ? AND t.taxonomy_type = 'technology'
                    ORDER BY t.label COLLATE NOCASE
                    """,
                    (record["id"],),
                )
            ]
    return cacheable_json(
        request,
        {
            "kind": f"{record_type}_collection",
            "generated_at": max((item["updated_at"] for item in records), default=None),
            "count": len(records),
            "records": records,
        },
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
            record["content"] = json.loads(record["content"] or "{}")
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


def record_detail(
    database_path: Path,
    request: Request,
    slug: str,
    expected_type: str,
) -> JSONResponse | Response:
    with connect(database_path) as connection:
        record_row = connection.execute(
            """
            SELECT r.*, o.slug AS organization_slug, o.name AS organization_name,
                   o.website_url AS organization_url
              FROM records r JOIN organizations o ON o.id = r.organization_id
             WHERE r.slug = ? AND r.record_type = ? AND r.visibility = 'public'
            """,
            (slug, expected_type),
        ).fetchone()
        if record_row is None:
            return JSONResponse(
                {"detail": "Record not found", "slug": slug},
                status_code=404,
                headers={"Cache-Control": "public, max-age=30"},
            )
        record = dict(record_row)
        record["featured"] = bool(record["featured"])
        record["content"] = json.loads(record["content"] or "{}")
        taxonomy_rows = rows(
            connection,
            """
            SELECT t.taxonomy_type, t.slug, t.label, t.category
              FROM taxonomies t JOIN record_taxonomies rt ON rt.taxonomy_id = t.id
             WHERE rt.record_id = ? ORDER BY t.taxonomy_type, t.label COLLATE NOCASE
            """,
            (record["id"],),
        )
        taxonomies: dict[str, list[dict]] = defaultdict(list)
        for taxonomy in taxonomy_rows:
            taxonomies[taxonomy.pop("taxonomy_type")].append(taxonomy)
        repositories = rows(
            connection,
            """
            SELECT repo.id, repo.owner, repo.name, repo.url, repo.description,
                   repo.default_branch, repo.is_archived, repo.is_fork, repo.observed_at, rr.role
              FROM repositories repo
              JOIN record_repositories rr ON rr.repository_id = repo.id
             WHERE rr.record_id = ?
             ORDER BY CASE rr.role
                        WHEN 'primary-implementation' THEN 0
                        WHEN 'primary-public-evidence' THEN 0
                        ELSE 1
                      END,
                      rr.role, repo.owner, repo.name
            """,
            (record["id"],),
        )
        for repository in repositories:
            repository["is_archived"] = bool(repository["is_archived"])
            repository["is_fork"] = bool(repository["is_fork"])
            repository["metrics"] = {
                item["metric"]: item["value"]
                for item in rows(
                    connection,
                    """
                    SELECT mo.metric, mo.value FROM metric_observations mo
                    JOIN (
                        SELECT metric, MAX(observed_at) AS observed_at
                        FROM metric_observations
                        WHERE subject_kind = 'repository' AND subject_id = ?
                        GROUP BY metric
                    ) latest ON latest.metric = mo.metric AND latest.observed_at = mo.observed_at
                    WHERE mo.subject_kind = 'repository' AND mo.subject_id = ?
                    """,
                    (repository["id"], repository["id"]),
                )
            }
        packages = rows(
            connection,
            """
            SELECT p.id, p.ecosystem, p.name, p.registry_url, p.description,
                   p.latest_version, p.published_at, p.observed_at, rp.role
              FROM packages p JOIN record_packages rp ON rp.package_id = p.id
             WHERE rp.record_id = ? ORDER BY p.ecosystem, p.name COLLATE NOCASE
            """,
            (record["id"],),
        )
        resources = rows(
            connection,
            """
            SELECT rs.id, rs.resource_type, rs.title, rs.url, rs.summary,
                   rs.observed_at, rr.role
              FROM resources rs JOIN record_resources rr ON rr.resource_id = rs.id
             WHERE rr.record_id = ? ORDER BY rr.role, rr.sort_order, rs.title COLLATE NOCASE
            """,
            (record["id"],),
        )
        releases = rows(
            connection,
            """
            SELECT rel.id, rel.release_kind, rel.version, rel.url, rel.published_at,
                   rel.observed_at, rel.package_id, rel.repository_id
              FROM releases rel
             WHERE rel.package_id IN (
                       SELECT package_id FROM record_packages WHERE record_id = ?
                   )
                OR rel.repository_id IN (
                       SELECT repository_id FROM record_repositories WHERE record_id = ?
                   )
          ORDER BY COALESCE(rel.published_at, rel.observed_at) DESC
            """,
            (record["id"], record["id"]),
        )
        deployments = rows(
            connection,
            """
            SELECT id, name, url, environment, reachability, observed_at
              FROM deployments WHERE record_id = ? ORDER BY observed_at DESC
            """,
            (record["id"],),
        )
        relations = rows(
            connection,
            """
            SELECT rel.relation_type, rel.note, target.slug, target.title,
                   target.record_type, target.summary, target.canonical_url
              FROM record_relations rel JOIN records target ON target.id = rel.target_record_id
             WHERE rel.source_record_id = ?
             ORDER BY rel.relation_type, target.title COLLATE NOCASE
            """,
            (record["id"],),
        )
        evidence = rows(
            connection,
            """
            SELECT e.id, e.evidence_type, e.title, e.source_url, e.locator,
                   e.excerpt, e.observed_at, e.expires_at, c.id AS claim_id,
                   c.statement AS claim, c.status AS claim_status
              FROM claims c
              JOIN claim_evidence ce ON ce.claim_id = c.id
              JOIN evidence e ON e.id = ce.evidence_id
             WHERE c.record_id = ? ORDER BY e.observed_at DESC
            """,
            (record["id"],),
        )
        limitations = rows(
            connection,
            "SELECT id, title, description, severity, reviewed_at FROM limitations "
            "WHERE record_id = ? ORDER BY id",
            (record["id"],),
        )
        features = rows(
            connection,
            """
            SELECT f.id, f.slug, f.name, f.description, f.ssot_feature_id,
                   rf.status, rf.claim_id
              FROM features f JOIN record_features rf ON rf.feature_id = f.id
             WHERE rf.record_id = ? ORDER BY f.name COLLATE NOCASE
            """,
            (record["id"],),
        )
    return cacheable_json(
        request,
        {
            "kind": f"{expected_type}_record",
            "generated_at": record["updated_at"] or datetime.now(UTC).isoformat(),
            "record": record,
            "taxonomies": dict(taxonomies),
            "implementation": {
                "repositories": repositories,
                "packages": packages,
                "resources": resources,
                "releases": releases,
                "deployments": deployments,
            },
            "relations": relations,
            "governance": {
                "features": features,
                "evidence": evidence,
                "limitations": limitations,
            },
        },
    )
