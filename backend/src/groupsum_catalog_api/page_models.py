from __future__ import annotations

import hashlib
import json
from collections import defaultdict
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

import orjson
from tigrbl import JSONResponse, Request, Response

from .analytics import connect_analytics, default_analytics_path, metric_rows
from .database import Connection
from .importer import connect

CACHE_CONTROL = "public, max-age=60, s-maxage=300, stale-while-revalidate=86400"


def rows(connection: Connection, query: str, parameters: tuple[Any, ...] = ()) -> list[dict]:
    return [dict(row) for row in connection.execute(query, parameters).fetchall()]


def entity_route(canonical_url: str | None) -> str | None:
    prefix = "https://groupsum.xyz"
    if canonical_url and canonical_url.startswith(prefix):
        return canonical_url.removeprefix(prefix) or "/"
    return canonical_url


def entity_graph_for_source(
    connection: Connection, source_table: str, source_id: str
) -> dict[str, Any] | None:
    entity_row = connection.execute(
        """
        SELECT e.*, t.label AS type_label, t.semantic_class
          FROM catalog_entities e JOIN entity_types t ON t.id = e.entity_type_id
         WHERE e.source_table = ? AND e.source_id = ?
        """,
        (source_table, source_id),
    ).fetchone()
    if entity_row is None:
        return None
    entity = dict(entity_row)
    entity["route"] = entity_route(entity.get("canonical_url"))
    urls = rows(
        connection,
        """
        SELECT url_role, url, label, evidence_type, observed_at
          FROM entity_urls WHERE entity_id = ? ORDER BY url_role, url
        """,
        (entity["id"],),
    )

    def edges(direction: str) -> list[dict[str, Any]]:
        local_column = "source_entity_id" if direction == "outgoing" else "target_entity_id"
        remote_column = "target_entity_id" if direction == "outgoing" else "source_entity_id"
        result = rows(
            connection,
            f"""
            SELECT rel.id, rel.relationship_type, rel.role, rel.evidence_type,
                   rel.source_url, rel.confidence, rel.status, rel.observed_at,
                   remote.id AS entity_id, remote.entity_type_id, remote.name,
                   remote.summary, remote.canonical_url, remote.organization_id,
                   type.label AS type_label, type.semantic_class
              FROM entity_relationships rel
              JOIN catalog_entities remote ON remote.id = rel.{remote_column}
              JOIN entity_types type ON type.id = remote.entity_type_id
             WHERE rel.{local_column} = ?
          ORDER BY rel.relationship_type, remote.name
            """,
            (entity["id"],),
        )
        for item in result:
            item["direction"] = direction
            item["route"] = entity_route(item.get("canonical_url"))
        return result

    outgoing = edges("outgoing")
    incoming = edges("incoming")
    owner = next(
        (item for item in outgoing if item["relationship_type"] == "owned_by"),
        None,
    )
    return {
        "entity": entity,
        "owner": owner,
        "urls": urls,
        "relationships": outgoing + incoming,
        "outgoing": outgoing,
        "incoming": incoming,
    }


def entity_collection(
    database_path: str | Path,
    request: Request,
    entity_type: str = "",
    q: str = "",
    page: int = 1,
    page_size: int = 50,
) -> JSONResponse | Response:
    page = max(1, page)
    page_size = min(100, max(1, page_size))
    clauses = ["e.visibility = 'public'"]
    parameters: list[Any] = []
    if entity_type:
        clauses.append("e.entity_type_id = ?")
        parameters.append(entity_type)
    if q.strip():
        clauses.append("(e.name LIKE ? OR e.summary LIKE ?)")
        term = f"%{q.strip()}%"
        parameters.extend((term, term))
    where = " AND ".join(clauses)
    with connect(database_path) as connection:
        total = connection.execute(
            f"SELECT COUNT(*) FROM catalog_entities e WHERE {where}", parameters
        ).fetchone()[0]
        entities = rows(
            connection,
            f"""
            SELECT e.id, e.entity_type_id, t.label AS type_label, t.semantic_class,
                   e.organization_id, e.slug, e.name, e.summary, e.canonical_url,
                   e.maturity, e.observed_at,
                   (SELECT COUNT(*) FROM entity_relationships rel
                     WHERE rel.source_entity_id = e.id OR rel.target_entity_id = e.id)
                     AS relationship_count
              FROM catalog_entities e JOIN entity_types t ON t.id = e.entity_type_id
             WHERE {where}
          ORDER BY t.semantic_class, t.label, e.name
             LIMIT ? OFFSET ?
            """,
            (*parameters, page_size, (page - 1) * page_size),
        )
        for entity in entities:
            entity["route"] = entity_route(entity.get("canonical_url"))
    return cacheable_json(
        request,
        {
            "kind": "entity_collection",
            "entity_type": entity_type or None,
            "query": q,
            "page": page,
            "page_size": page_size,
            "total": total,
            "page_count": (total + page_size - 1) // page_size,
            "entities": entities,
        },
    )


def entity_detail(
    database_path: str | Path, request: Request, entity_id: str
) -> JSONResponse | Response:
    with connect(database_path) as connection:
        row = connection.execute(
            "SELECT source_table, source_id FROM catalog_entities WHERE id = ?",
            (entity_id,),
        ).fetchone()
        if row is None:
            return JSONResponse({"detail": "Catalog entity not found"}, status_code=404)
        graph = entity_graph_for_source(connection, row[0], row[1])
    return cacheable_json(request, {"kind": "entity_record", "graph": graph})


def cacheable_json(request: Request, payload: dict[str, Any]) -> JSONResponse | Response:
    body = orjson.dumps(payload, option=orjson.OPT_SORT_KEYS | orjson.OPT_NAIVE_UTC, default=str)
    etag = f'"{hashlib.sha256(body).hexdigest()}"'
    headers = {
        "Cache-Control": CACHE_CONTROL,
        "ETag": etag,
        "Vary": "Accept-Encoding",
        "Content-Language": "en",
    }
    if request.headers.get("if-none-match") == etag:
        return Response(status_code=304, headers=headers)
    return Response(content=body, media_type="application/json", headers=headers)


def metric_number(value: Any) -> int | float:
    number = float(value or 0)
    return int(number) if number.is_integer() else number


def analytics_rows(
    connection: Connection, query: str, parameters: tuple[Any, ...] = ()
) -> list[dict[str, Any]]:
    with connect_analytics(
        default_analytics_path(connection.database), read_only=True
    ) as analytics:
        return metric_rows(analytics, query, parameters)


def repository_signals(connection: Connection, repository_id: str) -> dict[str, Any]:
    snapshot_rows = analytics_rows(
        connection,
        """
        SELECT metric, value, observed_at
          FROM metric_observations
         WHERE subject_kind = 'repository' AND subject_id = ?
           AND metric IN ('stars', 'forks', 'watchers', 'contributors', 'commits')
           AND period_start IS NULL
      ORDER BY observed_at
        """,
        (repository_id,),
    )
    latest: dict[str, dict[str, Any]] = {}
    history_by_day: dict[str, dict[str, dict[str, Any]]] = defaultdict(dict)
    for item in snapshot_rows:
        item["value"] = metric_number(item["value"])
        latest[item["metric"]] = item
        day = str(item["observed_at"])[:10]
        history_by_day[item["metric"]][day] = {
            "observed_at": item["observed_at"],
            "value": item["value"],
        }
    contributor_count = connection.execute(
        "SELECT COUNT(*) FROM repository_contributors WHERE repository_id = ?",
        (repository_id,),
    ).fetchone()[0]
    metrics = {
        metric: metric_number(latest.get(metric, {}).get("value"))
        for metric in ("stars", "forks", "watchers", "contributors", "commits")
    }
    if contributor_count or "contributors" not in latest:
        metrics["contributors"] = contributor_count
    commit_activity = analytics_rows(
        connection,
        """
        SELECT DATE(period_start) AS date, value AS count
          FROM metric_observations
         WHERE subject_kind = 'repository' AND subject_id = ?
           AND metric = 'commits_daily' AND period_start IS NOT NULL
      ORDER BY period_start DESC LIMIT 30
        """,
        (repository_id,),
    )
    commit_activity.reverse()
    for item in commit_activity:
        item["count"] = metric_number(item["count"])
    observed_values = [item["observed_at"] for item in latest.values()]
    return {
        "metrics": metrics,
        "history": {
            metric: list(history_by_day[metric].values())[-30:]
            for metric in ("stars", "forks", "watchers", "contributors")
        },
        "commit_activity": commit_activity,
        "observed_at": max(observed_values, default=None),
    }


def record_signals(connection: Connection, record_id: str) -> dict[str, Any]:
    repository_ids = [
        item["repository_id"]
        for item in rows(
            connection,
            "SELECT repository_id FROM record_repositories WHERE record_id = ?",
            (record_id,),
        )
    ]
    if not repository_ids:
        return {
            "repository_count": 0,
            "metrics": {
                metric: 0 for metric in ("stars", "forks", "watchers", "contributors", "commits")
            },
            "history": {
                metric: [] for metric in ("stars", "forks", "watchers", "contributors")
            },
            "commit_activity": [],
            "observed_at": None,
        }
    signals = [repository_signals(connection, repository_id) for repository_id in repository_ids]
    snapshot_rows = analytics_rows(
        connection,
        """
        SELECT metric, value, observed_at
          FROM metric_observations
         WHERE subject_kind = 'record' AND subject_id = ?
           AND metric IN ('stars', 'forks', 'watchers', 'contributors', 'commits')
           AND period_start IS NULL
      ORDER BY observed_at
        """,
        (record_id,),
    )
    latest: dict[str, dict[str, Any]] = {}
    by_metric_day: dict[str, dict[str, dict[str, Any]]] = defaultdict(dict)
    for item in snapshot_rows:
        item["value"] = metric_number(item["value"])
        latest[item["metric"]] = item
        by_metric_day[item["metric"]][str(item["observed_at"])[:10]] = {
            "observed_at": item["observed_at"],
            "value": item["value"],
        }
    metrics = {
        metric: metric_number(latest.get(metric, {}).get("value"))
        for metric in ("stars", "forks", "watchers", "contributors", "commits")
    }
    if not snapshot_rows:
        metrics = {
            metric: sum(signal["metrics"][metric] for signal in signals)
            for metric in ("stars", "forks", "watchers", "contributors", "commits")
        }
    history = {
        metric: list(by_metric_day[metric].values())[-30:]
        for metric in ("stars", "forks", "watchers", "contributors")
    }
    commit_days: dict[str, int | float] = defaultdict(int)
    for signal in signals:
        for point in signal["commit_activity"]:
            commit_days[point["date"]] += point["count"]
    return {
        "repository_count": len(repository_ids),
        "metrics": metrics,
        "history": history,
        "commit_activity": [
            {"date": day, "count": count}
            for day, count in sorted(commit_days.items())[-30:]
        ],
        "observed_at": max(
            [item["observed_at"] for item in latest.values()]
            + [signal["observed_at"] for signal in signals if signal["observed_at"]],
            default=None,
        ),
    }


def repository_metric_snapshot(
    database_path: Path, request: Request, owner: str = ""
) -> JSONResponse | Response:
    with connect(database_path) as connection:
        parameters: tuple[Any, ...] = (owner,) if owner else ()
        repository_rows = rows(
            connection,
            """
            SELECT id, owner, name, url, description, observed_at
              FROM repositories
            """
            + (" WHERE owner = ?" if owner else "")
            + " ORDER BY owner, name COLLATE NOCASE",
            parameters,
        )
        for repository in repository_rows:
            repository.update(repository_signals(connection, repository["id"]))
            repository["route"] = (
                f"/catalog/repositories/{repository['owner']}/{repository['name']}"
            )
        repository_rows.sort(
            key=lambda item: (
                -item["metrics"]["stars"],
                -item["metrics"]["commits"],
                item["owner"],
                item["name"],
            )
        )
    return cacheable_json(
        request,
        {
            "kind": "repository_metric_snapshot",
            "owner": owner or None,
            "generated_at": max(
                (item["observed_at"] for item in repository_rows if item["observed_at"]),
                default=None,
            ),
            "count": len(repository_rows),
            "repositories": repository_rows,
        },
    )


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
            "products": connection.execute("SELECT COUNT(*) FROM records WHERE record_type = 'product' AND visibility = 'public'").fetchone()[0],
            "portfolio": connection.execute("SELECT COUNT(*) FROM records WHERE record_type = 'portfolio' AND visibility = 'public'").fetchone()[0],
            "repositories": connection.execute("SELECT COUNT(*) FROM repositories").fetchone()[0],
            "packages": connection.execute("SELECT COUNT(*) FROM packages").fetchone()[0],
            "resources": connection.execute("SELECT COUNT(*) FROM resources").fetchone()[0],
            "technologies": connection.execute("SELECT COUNT(*) FROM taxonomies WHERE taxonomy_type = 'technology'").fetchone()[0],
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
    """Return collection page models for the catalog routes exposed by the frontend."""
    with connect(database_path) as connection:
        if resource_kind == "repository":
            records = rows(
                connection,
                """
                SELECT repo.id, repo.owner, repo.name, repo.url, repo.description,
                       repo.default_branch, repo.is_archived, repo.is_fork,
                       repo.license_expression, repo.ssot_governed, repo.observed_at,
                       COUNT(DISTINCT pr.package_id) AS package_count,
                       COUNT(DISTINCT rs.id) AS resource_count,
                       COUNT(DISTINCT rel.id) AS release_count
                  FROM repositories repo
             LEFT JOIN package_repositories pr ON pr.repository_id = repo.id
             LEFT JOIN resources rs ON rs.repository_id = repo.id
             LEFT JOIN releases rel ON rel.repository_id = repo.id
              GROUP BY repo.id
              ORDER BY repo.owner, repo.name COLLATE NOCASE
                """,
            )
            for record in records:
                record["is_archived"] = bool(record["is_archived"])
                record["is_fork"] = bool(record["is_fork"])
                record["ssot_governed"] = bool(record["ssot_governed"])
                record["route"] = f"/catalog/repositories/{record['owner']}/{record['name']}"
                record.update(repository_signals(connection, record["id"]))
        elif resource_kind == "package":
            records = rows(
                connection,
                """
                SELECT p.id, p.ecosystem, p.name, p.description, p.registry_url,
                       p.source_url, p.manifest_path, p.package_kind, p.private,
                       p.latest_version, p.published, p.publication_status,
                       p.route_key, p.license_expression, p.license_status,
                       p.published_at, p.observed_at,
                       COUNT(DISTINCT rel.id) AS release_count,
                       COUNT(DISTINCT dep.id) AS dependency_count
                  FROM packages p
             LEFT JOIN releases rel ON rel.package_id = p.id
             LEFT JOIN dependencies dep
                    ON dep.source_kind = 'package' AND dep.source_id = p.id
              GROUP BY p.id
              ORDER BY p.ecosystem, p.name COLLATE NOCASE
                """,
            )
            for record in records:
                record["private"] = bool(record["private"])
                record["published"] = bool(record["published"]) if record["published"] is not None else None
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
                SELECT rs.id, rs.resource_type, rs.route_key, rs.title, rs.url,
                       rs.summary, rs.path, rs.source_url, rs.observed_at,
                       repo.owner AS repository_owner, repo.name AS repository_name
                  FROM resources rs
             LEFT JOIN repositories repo ON repo.id = rs.repository_id
              ORDER BY rs.resource_type, rs.title COLLATE NOCASE
                """,
            )
            for record in records:
                record["route"] = f"/catalog/resources/{record['resource_type']}/{record['route_key']}"
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
        if normalized_query and normalized_query not in " ".join(
            str(record.get(key) or "")
            for key in ("name", "title", "description", "summary", "owner")
        ).casefold():
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
            ) or None,
            "records": filtered[start : start + page_size],
        },
    )


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
            resource["route"] = f"/catalog/resources/{resource['resource_type']}/{resource['route_key']}"
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
                      evidence_type, observed_at
                   FROM legal_evidence
                  WHERE subject_kind = 'repository' AND subject_id = ?
               ORDER BY scope, evidence_kind, name""",
            (item["id"],),
        )
        graph = entity_graph_for_source(connection, "repositories", item["id"])
    return cacheable_json(
        request,
        {
            "kind": "catalog_repository_record",
            "item": item,
            "graph": graph,
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
                "evidence": legal,
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
            "SELECT * FROM taxonomies WHERE slug = ? AND taxonomy_type IN ('technology', 'language')",
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


def catalog_resource_detail(
    database_path: str | Path,
    request: Request,
    resource_kind: str,
    route_key: str,
) -> JSONResponse | Response:
    table = {"package": "packages", "release": "releases", "resource": "resources"}.get(
        resource_kind
    )
    if table is None:
        return JSONResponse({"detail": "Unsupported catalog resource"}, status_code=404)
    with connect(database_path) as connection:
        item_row = connection.execute(
            f"SELECT * FROM {table} WHERE route_key = ?", (route_key,)
        ).fetchone()
        if item_row is None:
            return JSONResponse(
                {"detail": "Catalog resource not found", "route_key": route_key},
                status_code=404,
                headers={"Cache-Control": "public, max-age=30"},
            )
        item = dict(item_row)
        legal = rows(
            connection,
            """
            SELECT evidence_kind, name, expression, path, url, scope,
                   evidence_type, observed_at
              FROM legal_evidence
             WHERE subject_kind = ? AND subject_id = ?
          ORDER BY scope, evidence_kind, name
            """,
            (resource_kind, item["id"]),
        )
        parent: dict[str, Any] | None = None
        legal_source = {"kind": resource_kind, "id": item["id"]}
        implementation: dict[str, Any] = {}
        if resource_kind == "package":
            repositories = rows(
                connection,
                """
                SELECT repo.id, repo.owner, repo.name, repo.url, pr.path
                  FROM repositories repo JOIN package_repositories pr
                    ON pr.repository_id = repo.id
                 WHERE pr.package_id = ? ORDER BY repo.owner, repo.name
                """,
                (item["id"],),
            )
            releases = rows(
                connection,
                """
                SELECT release_kind, version, route_key, url, published_at, downloads,
                       prerelease, draft, observed_at
                  FROM releases WHERE package_id = ?
              ORDER BY COALESCE(published_at, observed_at) DESC LIMIT 100
                """,
                (item["id"],),
            )
            dependencies = rows(
                connection,
                """
                SELECT target_kind, target_id, requirement, scope, evidence_type,
                       source_url, completeness, observed_at
                  FROM dependencies WHERE source_kind = 'package' AND source_id = ?
              ORDER BY scope, target_id LIMIT 300
                """,
                (item["id"],),
            )
            natural_key = f"{item['ecosystem']}:{item['name'].lower().replace('_', '-')}"
            dependents = rows(
                connection,
                """
                SELECT source_kind, source_id, requirement, scope, evidence_type,
                       source_url, completeness, observed_at
                  FROM dependencies WHERE target_id = ?
              ORDER BY source_kind, source_id LIMIT 300
                """,
                (natural_key,),
            )
            downloads = analytics_rows(
                connection,
                """
                SELECT value, observed_at FROM metric_observations
                 WHERE subject_kind = 'package' AND subject_id = ? AND metric = 'downloads'
              ORDER BY observed_at DESC LIMIT 1
                """,
                (item["id"],),
            )
            implementation = {
                "repositories": repositories,
                "releases": releases,
                "dependencies": dependencies,
                "dependents": dependents,
                "downloads": downloads[0] if downloads else None,
            }
        elif resource_kind == "release":
            if item.get("package_id"):
                parent_row = connection.execute(
                    "SELECT id, ecosystem, name, route_key, registry_url "
                    "FROM packages WHERE id = ?",
                    (item["package_id"],),
                ).fetchone()
                parent = dict(parent_row) if parent_row else None
            elif item.get("repository_id"):
                parent_row = connection.execute(
                    "SELECT id, owner, name, url FROM repositories WHERE id = ?",
                    (item["repository_id"],),
                ).fetchone()
                parent = dict(parent_row) if parent_row else None
            if not legal and parent:
                parent_kind = "package" if item.get("package_id") else "repository"
                legal = rows(
                    connection,
                    """
                    SELECT evidence_kind, name, expression, path, url, scope,
                           evidence_type, observed_at
                      FROM legal_evidence
                     WHERE subject_kind = ? AND subject_id = ?
                  ORDER BY scope, evidence_kind, name
                    """,
                    (parent_kind, parent["id"]),
                )
                legal_source = {"kind": parent_kind, "id": parent["id"]}
        else:
            if item.get("repository_id"):
                parent_row = connection.execute(
                    "SELECT id, owner, name, url, description FROM repositories WHERE id = ?",
                    (item["repository_id"],),
                ).fetchone()
                parent = dict(parent_row) if parent_row else None
            if not legal and parent:
                legal = rows(
                    connection,
                    """
                    SELECT evidence_kind, name, expression, path, url, scope,
                           evidence_type, observed_at
                      FROM legal_evidence
                     WHERE subject_kind = 'repository' AND subject_id = ?
                  ORDER BY scope, evidence_kind, name
                    """,
                    (parent["id"],),
                )
                legal_source = {"kind": "repository", "id": parent["id"]}
        entity_graph = entity_graph_for_source(
            connection,
            {"package": "packages", "resource": "resources", "release": "releases"}[
                resource_kind
            ],
            item["id"],
        )
    return cacheable_json(
        request,
        {
            "kind": f"catalog_{resource_kind}_record",
            "resource_type": (
                item.get("resource_type")
                or item.get("release_kind")
                or item.get("ecosystem")
            ),
            "item": item,
            "graph": entity_graph,
            "parent": parent,
            "implementation": implementation,
            "legal": {
                "license_expression": item.get("license_expression"),
                "status": item.get("license_status") or ("observed" if legal else "not-observed"),
                "evidence": legal,
                "inherited_from": legal_source if legal_source["kind"] != resource_kind else None,
                "notice": (
                    "License and notice data reports observed metadata and files; "
                    "it is not legal advice."
                ),
            },
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
                   repo.default_branch, repo.is_archived, repo.is_fork, repo.observed_at, rr.role,
                   repo.ssot_governed, repo.ssot_registry_url, repo.ssot_registry_sha256,
                   repo.ssot_schema_version, repo.ssot_summary, repo.ssot_observed_at
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
            repository["ssot_governed"] = bool(repository["ssot_governed"])
            if isinstance(repository.get("ssot_summary"), str):
                repository["ssot_summary"] = json.loads(repository["ssot_summary"] or "{}")
            repository.update(repository_signals(connection, repository["id"]))
            repository["releases"] = rows(
                connection,
                """
                SELECT id, release_kind, route_key, version, url, published_at,
                       downloads, prerelease, draft, observed_at
                  FROM releases WHERE repository_id = ?
              ORDER BY COALESCE(published_at, observed_at) DESC LIMIT 100
                """,
                (repository["id"],),
            )
            for release in repository["releases"]:
                release["prerelease"] = bool(release["prerelease"])
                release["draft"] = bool(release["draft"])
            repository["release_count"] = connection.execute(
                "SELECT COUNT(*) FROM releases WHERE repository_id = ?",
                (repository["id"],),
            ).fetchone()[0]
            repository["governance"] = {
                "governed": repository.pop("ssot_governed"),
                "registry_url": repository.pop("ssot_registry_url"),
                "registry_sha256": repository.pop("ssot_registry_sha256"),
                "schema_version": repository.pop("ssot_schema_version"),
                "observed_at": repository.pop("ssot_observed_at"),
                "summary": repository.pop("ssot_summary") or {},
            }
        packages = rows(
            connection,
            """
            SELECT p.id, p.ecosystem, p.name, p.registry_url, p.description,
                   p.route_key, p.source_url, p.manifest_path, p.package_kind, p.private,
                   p.latest_version, p.published,
                   p.publication_status, p.published_at, p.observed_at, rp.role,
                   (SELECT COUNT(*) FROM releases rel WHERE rel.package_id = p.id)
                       AS release_count,
                   (SELECT COUNT(*) FROM dependencies dep
                     WHERE dep.source_kind = 'package' AND dep.source_id = p.id)
                       AS dependency_count,
                   (SELECT COUNT(*) FROM dependencies dep
                     WHERE dep.target_id = p.ecosystem || ':' || REPLACE(LOWER(p.name), '_', '-'))
                       AS dependent_count
              FROM packages p JOIN record_packages rp ON rp.package_id = p.id
             WHERE rp.record_id = ? ORDER BY p.ecosystem, p.name COLLATE NOCASE
            """,
            (record["id"],),
        )
        for package in packages:
            package["private"] = bool(package["private"])
            package["published"] = (
                bool(package["published"]) if package["published"] is not None else None
            )
            download_rows = analytics_rows(
                connection,
                """
                SELECT value FROM metric_observations
                 WHERE subject_kind = 'package' AND subject_id = ? AND metric = 'downloads'
              ORDER BY observed_at DESC LIMIT 1
                """,
                (package["id"],),
            )
            package["downloads"] = (
                metric_number(download_rows[0]["value"]) if download_rows else None
            )
            package["repositories"] = rows(
                connection,
                """
                SELECT repo.id, repo.owner, repo.name, repo.url, pr.path
                  FROM repositories repo JOIN package_repositories pr
                    ON pr.repository_id = repo.id
                 WHERE pr.package_id = ? ORDER BY repo.owner, repo.name, pr.path
                """,
                (package["id"],),
            )
            package_dependencies = rows(
                connection,
                """
                SELECT id, source_id, target_kind, target_id, requirement, scope,
                       evidence_type, source_url, completeness, observed_at
                  FROM dependencies
                 WHERE source_kind = 'package' AND source_id = ?
              ORDER BY scope, target_id
                """,
                (package["id"],),
            )
            natural_key = f"{package['ecosystem']}:{package['name'].lower().replace('_', '-')}"
            package_dependents = rows(
                connection,
                """
                SELECT dep.id, dep.source_kind, dep.source_id,
                       source.ecosystem AS source_ecosystem,
                       source.name AS source_name, dep.target_id,
                       dep.requirement, dep.scope, dep.evidence_type, dep.source_url,
                       dep.completeness, dep.observed_at
                  FROM dependencies dep
             LEFT JOIN packages source ON source.id = dep.source_id
                 WHERE dep.target_id = ?
              ORDER BY COALESCE(source.ecosystem, dep.source_kind),
                       COALESCE(source.name, dep.source_id) COLLATE NOCASE
                """,
                (natural_key,),
            )
            scope_counts: dict[str, int] = defaultdict(int)
            for dependency in package_dependencies:
                scope_counts[str(dependency.get("scope") or "dependencies")] += 1
            completeness_counts: dict[str, int] = defaultdict(int)
            for dependent in package_dependents:
                completeness_counts[str(dependent.get("completeness") or "catalog-observed")] += 1
            package["dependencies"] = package_dependencies
            package["dependents"] = package_dependents
            package["dependency_summary"] = {
                "edge_count": len(package_dependencies),
                "unique_target_count": len(
                    {item["target_id"] for item in package_dependencies}
                ),
                "internal_edge_count": sum(
                    item["target_kind"] == "package" for item in package_dependencies
                ),
                "external_edge_count": sum(
                    item["target_kind"] == "external-package"
                    for item in package_dependencies
                ),
                "by_scope": dict(sorted(scope_counts.items())),
            }
            package["dependent_summary"] = {
                "edge_count": len(package_dependents),
                "unique_source_count": len(
                    {item["source_id"] for item in package_dependents}
                ),
                "by_completeness": dict(sorted(completeness_counts.items())),
                "coverage": (
                    "All reverse edges within this collected catalog plus bounded registry "
                    "observations where a registry exposes them; not a complete global count."
                ),
            }
            package["releases"] = rows(
                connection,
                """
                SELECT id, release_kind, route_key, version, url, published_at,
                       downloads, prerelease, draft, observed_at
                  FROM releases WHERE package_id = ?
              ORDER BY COALESCE(published_at, observed_at) DESC LIMIT 100
                """,
                (package["id"],),
            )
            for release in package["releases"]:
                release["prerelease"] = bool(release["prerelease"])
                release["draft"] = bool(release["draft"])
        resources = rows(
            connection,
            """
            SELECT rs.id, rs.resource_type, rs.route_key, rs.title, rs.url, rs.summary,
                   rs.observed_at, rr.role
              FROM resources rs JOIN record_resources rr ON rr.resource_id = rs.id
             WHERE rr.record_id = ? ORDER BY rr.role, rr.sort_order, rs.title COLLATE NOCASE
            """,
            (record["id"],),
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
                   c.statement AS claim, c.status AS claim_status,
                   c.ssot_claim_id
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
        claims = rows(
            connection,
            """
            SELECT id, statement, status, ssot_claim_id, reviewed_at
              FROM claims WHERE record_id = ? ORDER BY id
            """,
            (record["id"],),
        )
        for claim in claims:
            claim["rooted_in_ssot"] = bool(claim.get("ssot_claim_id"))
        for item in evidence:
            item["rooted_in_ssot"] = bool(item.get("ssot_claim_id"))
        rooted_claims = sum(1 for claim in claims if claim["rooted_in_ssot"])
        entity_graph = entity_graph_for_source(connection, "records", record["id"])
    return cacheable_json(
        request,
        {
            "kind": f"{expected_type}_record",
            "generated_at": record["updated_at"] or datetime.now(UTC).isoformat(),
            "record": record,
            "graph": entity_graph,
            "taxonomies": dict(taxonomies),
            "implementation": {
                "repositories": repositories,
                "packages": packages,
                "resources": resources,
                "deployments": deployments,
            },
            "relations": relations,
            "editorial": {
                "features": features,
                "claims": claims,
                "evidence": evidence,
                "limitations": limitations,
                "claim_rooting": {
                    "total": len(claims),
                    "rooted": rooted_claims,
                    "unrooted": len(claims) - rooted_claims,
                    "status": "complete" if len(claims) == rooted_claims else "incomplete",
                    "limitation": (
                        None
                        if len(claims) == rooted_claims
                        else "Unrooted editorial claims are reported as limitations and are not "
                        "represented as SSOT-verified claims."
                    ),
                },
            },
            "governance": {
                "repositories": [
                    {
                        "repository_id": repository["id"],
                        "repository": f"{repository['owner']}/{repository['name']}",
                        "role": repository["role"],
                        **repository["governance"],
                    }
                    for repository in repositories
                ],
            },
        },
    )
