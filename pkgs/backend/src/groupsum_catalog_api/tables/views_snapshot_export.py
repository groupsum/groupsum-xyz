from __future__ import annotations

from typing import Any
from urllib.parse import quote

from .catalog_snapshot import CatalogSnapshot
from .catalog_snapshot_source import CatalogSnapshotSource
from .view_common import payload


def snapshot_export_manifest(_table: type, ctx: dict[str, Any]) -> dict[str, Any]:
    snapshot_id = str(payload(ctx).get("snapshot_id", ""))
    session = ctx["db"]
    snapshot = session.get(CatalogSnapshot, snapshot_id)
    if snapshot is None:
        return {"detail": "Snapshot not found"}
    rows = (
        session.query(CatalogSnapshotSource)
        .filter(CatalogSnapshotSource.snapshot_id == snapshot_id)
        .order_by(CatalogSnapshotSource.chunk_index)
        .all()
    )
    if not rows:
        return {"detail": "Snapshot export not found"}
    encoded_id = quote(snapshot_id, safe="")
    return {
        "kind": "catalog_snapshot_export",
        "snapshot_id": snapshot_id,
        "source_digest": snapshot.source_digest,
        "collected_at": snapshot.collected_at,
        "publisher_id": snapshot.publisher_id,
        "byte_count": sum(row.byte_count for row in rows),
        "chunk_count": len(rows),
        "chunks": [
            {
                "index": row.chunk_index,
                "byte_count": row.byte_count,
                "sha256": row.content_sha256,
                "url": (
                    f"/api/v1/snapshots/{encoded_id}/export/chunks/{row.chunk_index}"
                ),
            }
            for row in rows
        ],
    }


def snapshot_export_chunk(_table: type, ctx: dict[str, Any]) -> dict[str, Any]:
    values = payload(ctx)
    snapshot_id = str(values.get("snapshot_id", ""))
    try:
        chunk_index = int(values.get("chunk_index", -1))
    except (TypeError, ValueError):
        return {"detail": "Snapshot export chunk not found"}
    row = (
        ctx["db"].query(CatalogSnapshotSource)
        .filter(
            CatalogSnapshotSource.snapshot_id == snapshot_id,
            CatalogSnapshotSource.chunk_index == chunk_index,
        )
        .first()
    )
    if row is None:
        return {"detail": "Snapshot export chunk not found"}
    return {
        "kind": "catalog_snapshot_export_chunk",
        "snapshot_id": snapshot_id,
        "index": row.chunk_index,
        "byte_count": row.byte_count,
        "sha256": row.content_sha256,
        "content_base64": row.content_base64,
    }


__all__ = ["snapshot_export_chunk", "snapshot_export_manifest"]
