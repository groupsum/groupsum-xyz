from __future__ import annotations

import hashlib
from pathlib import Path
from typing import Any

import orjson
from tigrbl import JSONResponse, Request, Response

from ..database import Connection
from ..importer import connect

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
        SELECT e.*, t.label AS type_label, t.semantic_class, t.icon_key,
               t.detail_schema_key
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
        SELECT url_role, url, label, origin_kind, observation_id, observed_at
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
            SELECT rel.id, rel.relationship_type, rel.role, rel.origin_kind,
                   rel.observation_id, rel.ssot_entity_id, rel.source_url,
                   rel.confidence, rel.status, rel.observed_at,
                   remote.id AS entity_id, remote.entity_type_id, remote.name,
                   remote.summary, remote.canonical_url, remote.organization_id,
                   type.label AS type_label, type.semantic_class, type.icon_key,
                   type.detail_schema_key
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


def linked_resource_sections_for_source(
    connection: Connection,
    source_table: str,
    source_id: str,
    *,
    excluded_types: frozenset[str] = frozenset(),
) -> list[dict[str, Any]]:
    """Group directly linked resources by their single canonical leaf type."""
    graph = entity_graph_for_source(connection, source_table, source_id)
    if graph is None:
        return []
    grouped: dict[str, dict[str, Any]] = {}
    for member in graph["relationships"]:
        type_key = str(member["entity_type_id"])
        if type_key in excluded_types:
            continue
        section = grouped.setdefault(
            type_key,
            {
                "type_key": type_key,
                "label": member["type_label"],
                "family": member["semantic_class"],
                "icon_key": member.get("icon_key"),
                "detail_schema_key": member.get("detail_schema_key"),
                "members": [],
            },
        )
        section["members"].append(
            {
                "id": member["entity_id"],
                "name": member["name"],
                "summary": member.get("summary"),
                "route": member.get("route"),
                "relationship": member["relationship_type"],
                "direction": member["direction"],
                "role": member.get("role"),
                "origin_kind": member.get("origin_kind"),
                "source_url": member.get("source_url"),
                "observed_at": member.get("observed_at"),
            }
        )
    sections = list(grouped.values())
    for section in sections:
        section["members"].sort(key=lambda item: str(item["name"]).casefold())
        section["count"] = len(section["members"])
    sections.sort(key=lambda item: (str(item["family"]), str(item["label"])))
    return sections


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
    item = payload.get("item") if isinstance(payload.get("item"), dict) else {}
    revision = payload.get("generated_at") or item.get("observed_at")
    request_url = getattr(request, "url", None)
    path = getattr(request_url, "path", "")
    query = getattr(request_url, "query", "")
    if revision:
        cache_identity = f"{path}?{query}|{revision}|{payload.get('kind', '')}".encode()
        etag = f'"{hashlib.sha256(cache_identity).hexdigest()}"'
    else:
        body = orjson.dumps(
            payload, option=orjson.OPT_SORT_KEYS | orjson.OPT_NAIVE_UTC, default=str
        )
        etag = f'"{hashlib.sha256(body).hexdigest()}"'
    headers = {
        "Cache-Control": CACHE_CONTROL,
        "ETag": etag,
        "Vary": "Accept-Encoding",
        "Content-Language": "en",
    }
    if request.headers.get("if-none-match") == etag:
        return Response(status_code=304, headers=headers)
    if revision:
        body = orjson.dumps(
            payload, option=orjson.OPT_SORT_KEYS | orjson.OPT_NAIVE_UTC, default=str
        )
    return Response(content=body, media_type="application/json", headers=headers)
