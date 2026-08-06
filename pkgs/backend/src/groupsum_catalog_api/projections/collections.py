from __future__ import annotations

from pathlib import Path

from tigrbl import JSONResponse, Request, Response

from ..importer import connect

CACHE_CONTROL = "public, max-age=60, s-maxage=300, stale-while-revalidate=86400"

from .common import *  # noqa: F403
from .signals import *  # noqa: F403


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
          GROUP BY r.id, o.id
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


def catalog_overview(
    database_path: str | Path,
    request: Request,
) -> JSONResponse | Response:
    with connect(database_path) as connection:
        counts = {
            "products": connection.execute(
                "SELECT COUNT(*) FROM records "
                "WHERE record_type = 'product' AND visibility = 'public'"
            ).fetchone()[0],
            "portfolio": connection.execute(
                "SELECT COUNT(*) FROM records "
                "WHERE record_type = 'portfolio' AND visibility = 'public'"
            ).fetchone()[0],
            "repositories": connection.execute("SELECT COUNT(*) FROM repositories").fetchone()[0],
            "packages": connection.execute("SELECT COUNT(*) FROM packages").fetchone()[0],
            "resources": connection.execute(
                "SELECT COUNT(*) FROM catalog_entities WHERE visibility = 'public'"
            ).fetchone()[0],
            "technologies": connection.execute(
                "SELECT COUNT(*) FROM taxonomies WHERE taxonomy_type = 'technology'"
            ).fetchone()[0],
        }
        observed_at = connection.execute(
            """SELECT MAX(observed_at) FROM (
                 SELECT observed_at FROM repositories UNION ALL
                 SELECT observed_at FROM packages UNION ALL
                 SELECT observed_at FROM resources
               )"""
        ).fetchone()[0]
    return cacheable_json(
        request,
        {"kind": "catalog_overview", "generated_at": observed_at, "counts": counts},
    )


def catalog_collection(
    database_path: str | Path,
    request: Request,
    resource_kind: str,
    page: int = 1,
    page_size: int = 50,
    query: str = "",
    resource_type: str = "",
    owner: str = "",
    ecosystem: str = "",
    publication_status: str = "",
    sort: str = "name",
) -> JSONResponse | Response:
    """Return collection resource representations for the catalog routes exposed by the frontend."""
    with connect(database_path) as connection:
        if resource_kind == "repository":
            records = rows(
                connection,
                """
                WITH package_counts AS (
                    SELECT repository_id, COUNT(DISTINCT package_id) AS count
                      FROM package_repositories GROUP BY repository_id
                ), resource_counts AS (
                    SELECT repository_id, COUNT(*) AS count
                      FROM resources GROUP BY repository_id
                ), release_counts AS (
                    SELECT repository_id, COUNT(*) AS count
                      FROM releases WHERE repository_id IS NOT NULL GROUP BY repository_id
                )
                SELECT repo.id, repo.owner, repo.name, repo.url, repo.description,
                       repo.default_branch, repo.is_archived, repo.is_fork,
                       repo.license_expression, repo.ssot_governed, repo.observed_at,
                       COALESCE(pc.count, 0) AS package_count,
                       COALESCE(rc.count, 0) AS resource_count,
                       COALESCE(rlc.count, 0) AS release_count
                  FROM repositories repo
             LEFT JOIN package_counts pc ON pc.repository_id = repo.id
             LEFT JOIN resource_counts rc ON rc.repository_id = repo.id
             LEFT JOIN release_counts rlc ON rlc.repository_id = repo.id
              ORDER BY repo.owner, repo.name COLLATE NOCASE
                """,
            )
            for record in records:
                record["is_archived"] = bool(record["is_archived"])
                record["is_fork"] = bool(record["is_fork"])
                record["ssot_governed"] = bool(record["ssot_governed"])
                record["route"] = f"/catalog/repositories/{record['owner']}/{record['name']}"
        elif resource_kind == "package":
            records = rows(
                connection,
                """
                WITH release_counts AS (
                    SELECT package_id, COUNT(*) AS count
                      FROM releases WHERE package_id IS NOT NULL GROUP BY package_id
                ), dependency_counts AS (
                    SELECT source_id AS package_id, COUNT(*) AS count
                      FROM dependencies WHERE source_kind = 'package' GROUP BY source_id
                )
                SELECT p.id, p.ecosystem, p.name, p.description, p.registry_url,
                       p.source_url, p.manifest_path, p.package_kind, p.private,
                       p.latest_version, p.published, p.publication_status,
                       p.route_key, p.license_expression, p.license_status,
                       p.published_at, p.observed_at,
                       COALESCE(rc.count, 0) AS release_count,
                       COALESCE(dc.count, 0) AS dependency_count
                  FROM packages p
             LEFT JOIN release_counts rc ON rc.package_id = p.id
             LEFT JOIN dependency_counts dc ON dc.package_id = p.id
              ORDER BY p.ecosystem, p.name COLLATE NOCASE
                """,
            )
            for record in records:
                record["private"] = bool(record["private"])
                record["published"] = (
                    bool(record["published"]) if record["published"] is not None else None
                )
                record["route"] = f"/catalog/packages/{record['ecosystem']}/{record['route_key']}"
                record["repositories"] = rows(
                    connection,
                    """SELECT repo.id, repo.owner, repo.name, repo.url, pr.path
                         FROM repositories repo JOIN package_repositories pr
                           ON pr.repository_id = repo.id
                        WHERE pr.package_id = ? ORDER BY repo.owner, repo.name""",
                    (record["id"],),
                )
        elif resource_kind == "resource":
            records = rows(
                connection,
                """
                SELECT e.id, e.entity_type_id AS resource_type, e.slug AS route_key,
                       e.name AS title, e.canonical_url AS url, e.summary,
                       e.source_table, e.source_id, e.organization_id,
                       e.observed_at, t.label AS type_label,
                       t.semantic_class AS resource_family, t.icon_key,
                       o.slug AS repository_owner, o.name AS repository_name
                  FROM catalog_entities e
                  JOIN entity_types t ON t.id = e.entity_type_id
             LEFT JOIN organizations o ON o.id = e.organization_id
                 WHERE e.visibility = 'public'
              ORDER BY t.semantic_class, t.label, e.name COLLATE NOCASE
                """,
            )
            for record in records:
                canonical_route = entity_route(record.get("url"))
                record["route"] = (
                    canonical_route
                    if canonical_route and str(canonical_route).startswith("/")
                    else f"/catalog/resources/{record['resource_type']}/{record['route_key']}"
                )
        elif resource_kind == "technology":
            records = rows(
                connection,
                """
                SELECT t.id, t.slug, t.label AS name, t.category, t.description,
                       COUNT(DISTINCT rt.record_id) AS record_count
                  FROM taxonomies t
             LEFT JOIN record_taxonomies rt ON rt.taxonomy_id = t.id
                 WHERE t.taxonomy_type = 'technology'
              GROUP BY t.id
              ORDER BY t.label COLLATE NOCASE
                """,
            )
            for record in records:
                record["route"] = f"/catalog/technologies/{record['slug']}"
        else:
            return JSONResponse({"detail": "Unsupported catalog collection"}, status_code=404)
    normalized_query = query.strip().casefold()
    filtered = []
    for record in records:
        if (
            normalized_query
            and normalized_query
            not in " ".join(
                str(record.get(key) or "")
                for key in ("name", "title", "description", "summary", "owner")
            ).casefold()
        ):
            continue
        if resource_type and record.get("resource_type") != resource_type:
            continue
        if owner and record.get("owner", record.get("repository_owner")) != owner:
            continue
        if ecosystem and record.get("ecosystem") != ecosystem:
            continue
        if publication_status and record.get("publication_status") != publication_status:
            continue
        filtered.append(record)
    if sort == "activity" and resource_kind == "repository":
        with connect(database_path) as signal_connection:
            for record in filtered:
                record.update(repository_signals(signal_connection, record["id"]))
    if sort == "recent":
        filtered.sort(key=lambda item: str(item.get("observed_at") or ""), reverse=True)
    elif sort == "activity":
        filtered.sort(
            key=lambda item: float((item.get("metrics") or {}).get("stars", 0)),
            reverse=True,
        )
    total = len(filtered)
    page_size = min(max(page_size, 1), 100)
    page_count = max(1, (total + page_size - 1) // page_size)
    page = min(max(page, 1), page_count)
    start = (page - 1) * page_size
    page_records = filtered[start : start + page_size]
    if resource_kind == "repository" and sort != "activity":
        with connect(database_path) as signal_connection:
            for record in page_records:
                record.update(repository_signals(signal_connection, record["id"]))
    facet_fields = {
        "repository": ("owner",),
        "package": ("ecosystem", "publication_status"),
        "resource": ("resource_type", "repository_owner"),
        "technology": ("category",),
    }[resource_kind]
    facets = {
        field: {
            str(value): sum(1 for item in records if item.get(field) == value)
            for value in sorted({item.get(field) for item in records if item.get(field)})
        }
        for field in facet_fields
    }
    return cacheable_json(
        request,
        {
            "kind": f"catalog_{resource_kind}_collection",
            "resource_kind": resource_kind,
            "count": total,
            "page": page,
            "page_size": page_size,
            "page_count": page_count,
            "facets": facets,
            "generated_at": max(
                (str(item.get("observed_at") or "") for item in records), default=""
            )
            or None,
            "records": page_records,
        },
    )
