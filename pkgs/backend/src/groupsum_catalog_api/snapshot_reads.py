"""Bounded caches of verified, finalized public projections (never live entity rows)."""

from __future__ import annotations

import base64
import hashlib
import json
from collections import OrderedDict
from typing import Any

from tigrbl import JSONResponse, Response

from .projections.read_models import ALIASES, VERSION, project, valid_read_models
from .projections.repository_star_history import attach_star_history
from .tables.catalog_snapshot import CatalogSnapshot
from .tables.catalog_snapshot_source import CatalogSnapshotSource

_bundles: OrderedDict[tuple[str, str], dict[str, Any]] = OrderedDict()
_responses: OrderedDict[tuple, bytes] = OrderedDict()
MAX_RESPONSE_BYTES = 32 * 1024 * 1024


def read_bundle(session, snapshot):
    key = (str(session.get_bind().url), snapshot.source_digest)
    if key in _bundles:
        _bundles.move_to_end(key)
        return _bundles[key]
    rows = (
        session.query(CatalogSnapshotSource)
        .filter(CatalogSnapshotSource.snapshot_id == snapshot.id)
        .order_by(CatalogSnapshotSource.chunk_index)
        .all()
    )
    if not rows:
        return None
    chunks = []
    for index, row in enumerate(rows):
        chunk = base64.b64decode(row.content_base64, validate=True)
        if (
            row.chunk_index != index
            or len(chunk) != row.byte_count
            or hashlib.sha256(chunk).hexdigest() != row.content_sha256
        ):
            raise ValueError("Invalid immutable snapshot source chunk")
        chunks.append(chunk)
    content = b"".join(chunks)
    if hashlib.sha256(content).hexdigest() != snapshot.source_digest:
        raise ValueError("Invalid immutable snapshot source digest")
    bundle = json.loads(content).get("_public_read_model")
    if valid_read_models(bundle):
        _bundles[key] = bundle
        while len(_bundles) > 2:
            _bundles.popitem(last=False)
        return bundle
    return None


async def public_projection(session, alias, params, request_headers=None):
    """None means legacy live projection; explicit pins must never silently use live rows."""
    if alias not in ALIASES:
        if params.get("snapshot_id") and alias in {
            "catalog_resource",
            "catalog_resources",
            "catalog_release",
            "catalog_technology",
        }:
            return JSONResponse(
                {"detail": "Snapshot pin unsupported for this projection"},
                status_code=409,
                headers={"Cache-Control": "no-store"},
            )
        return None
    if str(params.get("projection_version") or VERSION) != VERSION:
        return JSONResponse(
            {"detail": "Unsupported public projection version"},
            status_code=409,
            headers={"Cache-Control": "no-store"},
        )
    requested = str(params.get("snapshot_id") or "")
    snapshot = (
        session.get(CatalogSnapshot, requested)
        if requested
        else session.query(CatalogSnapshot).filter(CatalogSnapshot.is_current.is_(True)).first()
    )
    if snapshot is None or snapshot.status != "complete":
        return (
            JSONResponse({"detail": "Snapshot not found"}, status_code=404) if requested else None
        )
    if (snapshot.completeness or {}).get("public_projection_version") != VERSION:
        return (
            JSONResponse(
                {"detail": "Snapshot public projection unavailable"},
                status_code=409,
                headers={"Cache-Control": "no-store"},
            )
            if requested
            else None
        )
    bundle = read_bundle(session, snapshot)
    if bundle is None:
        return (
            JSONResponse(
                {"detail": "Snapshot public projection unavailable"},
                status_code=409,
                headers={"Cache-Control": "no-store"},
            )
            if requested
            else None
        )
    query = tuple(
        sorted((str(key), str(value)) for key, value in params.items() if key != "snapshot_id")
    )
    key = (snapshot.source_digest, VERSION, alias, query)
    hit = key in _responses
    if hit:
        content = _responses[key]
        _responses.move_to_end(key)
    else:
        result = project(bundle, alias, params)
        if set(result) == {"detail"}:
            return JSONResponse(result, status_code=404, headers={"Cache-Control": "no-store"})
        if alias == "catalog_repositories" and params.get("star_history") == "1":
            result = await attach_star_history(session, snapshot, result)
        result = {**result, "snapshot_id": snapshot.id, "projection_version": VERSION}
        content = json.dumps(
            result, sort_keys=True, separators=(",", ":"), ensure_ascii=False, default=str
        ).encode()
        if len(content) <= MAX_RESPONSE_BYTES:
            _responses[key] = content
            while len(_responses) > 256 or sum(map(len, _responses.values())) > MAX_RESPONSE_BYTES:
                _responses.popitem(last=False)
    etag = 'W/"' + hashlib.sha256(content).hexdigest() + '"'
    headers = {
        "ETag": etag,
        "Vary": "Accept-Encoding",
        "X-Catalog-Snapshot": snapshot.id,
        "X-Catalog-Cache": "HIT" if hit else "MISS",
        "Server-Timing": f'projection;desc="{"HIT" if hit else "MISS"}"',
        "Cache-Control": "public, max-age=31536000, immutable"
        if requested
        else "public, max-age=15, s-maxage=15, stale-while-revalidate=15",
    }
    if any((request_headers or {}).get(name) for name in ("authorization", "cookie")):
        headers["Cache-Control"] = "private, no-store"
    matches = str((request_headers or {}).get("if-none-match") or "").split(",")
    not_modified = any(
        tag.strip().removeprefix("W/") == etag[2:] or tag.strip() == "*" for tag in matches
    )
    return Response(
        body=b"" if not_modified else content,
        status_code=304 if not_modified else 200,
        media_type="application/json",
        headers=headers,
    )
