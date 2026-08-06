from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from tigrbl import JSONResponse, Request, Response

from ..importer import connect

CACHE_CONTROL = "public, max-age=60, s-maxage=300, stale-while-revalidate=86400"

from .common import *  # noqa: F403
from .signals import *  # noqa: F403


def catalog_resource_detail(
    database_path: str | Path,
    request: Request,
    resource_kind: str,
    route_key: str,
    entity_type: str | None = None,
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
            if resource_kind == "resource":
                entity_row = connection.execute(
                    """
                    SELECT e.*, t.label AS type_label, t.semantic_class AS resource_family,
                           t.icon_key, t.detail_schema_key
                      FROM catalog_entities e
                      JOIN entity_types t ON t.id = e.entity_type_id
                     WHERE e.slug = ? AND e.visibility = 'public'
                       AND (? IS NULL OR e.entity_type_id = ?)
                  ORDER BY e.id LIMIT 1
                    """,
                    (route_key, entity_type, entity_type),
                ).fetchone()
                if entity_row is not None:
                    item = dict(entity_row)
                    item["title"] = item["name"]
                    item["resource_type"] = item["entity_type_id"]
                    item["route_key"] = item["slug"]
                    item["url"] = next(
                        (
                            url[0]
                            for url in connection.execute(
                                """SELECT url FROM entity_urls
                                     WHERE entity_id = ? AND url_role = 'source'
                                  ORDER BY observed_at DESC""",
                                (item["id"],),
                            ).fetchall()
                        ),
                        None,
                    )
                    if item["source_table"] == "repository_ssot_inventory":
                        ssot_row = connection.execute(
                            """SELECT entity_kind, entity_id, status,
                                      implementation_status, payload
                                 FROM repository_ssot_inventory WHERE id = ?""",
                            (item["source_id"],),
                        ).fetchone()
                        if ssot_row is not None:
                            ssot_item = dict(ssot_row)
                            if isinstance(ssot_item.get("payload"), str):
                                ssot_item["payload"] = json.loads(ssot_item["payload"])
                            item["ssot"] = ssot_item
                    graph = entity_graph_for_source(
                        connection, item["source_table"], item["source_id"]
                    )
                    linked_sections = linked_resource_sections_for_source(
                        connection, item["source_table"], item["source_id"]
                    )
                    return cacheable_json(
                        request,
                        {
                            "kind": "catalog_resource_record",
                            "resource_type": item["resource_type"],
                            "item": item,
                            "graph": graph,
                            "linked_sections": linked_sections,
                            "implementation": {},
                            "legal": {
                                "status": "not-observed",
                                "observations": [],
                                "notice": (
                                    "Legal metadata is reported only when observed for "
                                    "this resource or an explicit owning resource."
                                ),
                            },
                        },
                    )
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
                   origin_kind, observed_at
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
                SELECT target_kind, target_id, requirement, scope, origin_kind,
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
                SELECT source_kind, source_id, requirement, scope, origin_kind,
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
                           origin_kind, observed_at
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
                           origin_kind, observed_at
                      FROM legal_evidence
                     WHERE subject_kind = 'repository' AND subject_id = ?
                  ORDER BY scope, evidence_kind, name
                    """,
                    (parent["id"],),
                )
                legal_source = {"kind": "repository", "id": parent["id"]}
        entity_graph = entity_graph_for_source(
            connection,
            {"package": "packages", "resource": "resources", "release": "releases"}[resource_kind],
            item["id"],
        )
        linked_sections = linked_resource_sections_for_source(
            connection,
            {"package": "packages", "resource": "resources", "release": "releases"}[resource_kind],
            item["id"],
            excluded_types=frozenset(
                {"source.repository", "release.package", "release.container", "release.repository"}
                if resource_kind == "package"
                else set()
            ),
        )
    return cacheable_json(
        request,
        {
            "kind": f"catalog_{resource_kind}_record",
            "resource_type": (
                item.get("resource_type") or item.get("release_kind") or item.get("ecosystem")
            ),
            "item": item,
            "graph": entity_graph,
            "linked_sections": linked_sections,
            "parent": parent,
            "implementation": implementation,
            "legal": {
                "license_expression": item.get("license_expression"),
                "status": item.get("license_status") or ("observed" if legal else "not-observed"),
                "observations": legal,
                "inherited_from": legal_source if legal_source["kind"] != resource_kind else None,
                "notice": (
                    "License and notice data reports observed metadata and files; "
                    "it is not legal advice."
                ),
            },
        },
    )
