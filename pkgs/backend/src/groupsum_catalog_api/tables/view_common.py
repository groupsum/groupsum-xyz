from __future__ import annotations

import math
from collections import Counter
from collections.abc import Callable
from typing import Any


def payload(ctx: Any) -> dict[str, Any]:
    values = dict(ctx.get("payload", {}) or {}) if hasattr(ctx, "get") else dict(ctx.payload)
    if hasattr(ctx, "get"):
        values.update(ctx.get("query_params", {}) or {})
        values.update(ctx.get("path_params", {}) or {})
    return values


def query_params(ctx: Any) -> Any:
    direct = ctx.get("query_params") if hasattr(ctx, "get") else None
    if direct is not None:
        return direct
    request = payload(ctx).get("request")
    return request.query_params if request is not None else {}


def with_session(table, ctx: Any, callback: Callable[[Any], Any]):
    session = ctx.get("db") if hasattr(ctx, "get") else getattr(ctx, "db", None)
    if session is not None:
        return callback(session)
    session, release = table.acquire(op_alias="list")
    try:
        return callback(session)
    finally:
        release()


def row_dict(row) -> dict[str, Any]:
    return {column.name: getattr(row, column.name) for column in row.__table__.columns}


def source_record(row) -> dict[str, Any]:
    source = getattr(row, "source_payload", None)
    return dict(source) if isinstance(source, dict) else row_dict(row)


def _edge_dict(edge) -> dict[str, Any]:
    return row_dict(edge)


def _entity_edges(session, entity_type: str, entity_id: str):
    from .association import Association

    outgoing = (
        session.query(Association)
        .filter(Association.source_type == entity_type, Association.source_id == entity_id)
        .order_by(Association.sort_order, Association.relationship_type)
        .all()
    )
    incoming = (
        session.query(Association)
        .filter(Association.target_type == entity_type, Association.target_id == entity_id)
        .order_by(Association.sort_order, Association.relationship_type)
        .all()
    )
    return outgoing, incoming


def _page(
    values: list[dict], params: Any, *, default_size: int = 50
) -> tuple[list[dict], int, int, int]:
    try:
        page = max(1, int(params.get("page", 1)))
        page_size = min(250, max(1, int(params.get("page_size", default_size))))
    except (TypeError, ValueError):
        page, page_size = 1, default_size
    count = len(values)
    page_count = max(1, math.ceil(count / page_size))
    page = min(page, page_count)
    start = (page - 1) * page_size
    return values[start : start + page_size], page, page_size, page_count


def _filter(values: list[dict], params: Any) -> list[dict]:
    term = str(params.get("q", "")).strip().casefold()
    filtered = []
    for item in values:
        searchable = " ".join(
            str(item.get(key) or "") for key in ("name", "title", "description", "summary", "owner")
        )
        if term and term not in searchable.casefold():
            continue
        tests = {
            "owner": item.get("owner", item.get("repository_owner")),
            "repository_owner": item.get("repository_owner"),
            "ecosystem": item.get("ecosystem"),
            "publication_status": item.get("publication_status"),
            "resource_type": item.get("resource_type"),
        }
        if any(
            params.get(key) and str(params[key]) != str(value or "") for key, value in tests.items()
        ):
            continue
        filtered.append(item)
    sort = str(params.get("sort", "name"))
    if sort == "recent":
        filtered.sort(key=lambda item: str(item.get("observed_at") or ""), reverse=True)
    elif sort == "activity":
        filtered.sort(key=lambda item: sum((item.get("metrics") or {}).values()), reverse=True)
    else:
        filtered.sort(key=lambda item: str(item.get("name") or item.get("title") or "").casefold())
    return filtered


def _facets(values: list[dict]) -> dict[str, dict[str, int]]:
    result = {}
    for key in ("owner", "repository_owner", "ecosystem", "publication_status", "resource_type"):
        counts = Counter(str(item[key]) for item in values if item.get(key))
        result[key] = dict(sorted(counts.items()))
    return result


__all__ = [
    "_edge_dict",
    "_entity_edges",
    "_facets",
    "_filter",
    "_page",
    "payload",
    "query_params",
    "row_dict",
    "source_record",
    "with_session",
]
