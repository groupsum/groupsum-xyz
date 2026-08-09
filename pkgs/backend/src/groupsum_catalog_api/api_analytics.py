from __future__ import annotations

from typing import Any

from .analytics import metric_rows, serialize_rows
from .tables.catalog_snapshot import CatalogSnapshot
from .tables.observation import CatalogObservation
from .tables.registry import ENTITY_TABLES


def _snapshot_record(row: CatalogSnapshot) -> dict[str, Any]:
    return {
        "snapshot_id": row.id, "schema_version": row.schema_version,
        "collected_at": row.collected_at, "completed_at": row.completed_at,
        "status": row.status, "collector_version": row.collector_version,
        "source_digest": row.source_digest, "parent_snapshot_id": row.parent_snapshot_id,
        "is_current": row.is_current, "completeness": row.completeness or {},
        "observation_count": row.observation_count, "measurement_count": row.measurement_count,
        "error_count": row.error_count,
    }


def snapshots() -> dict[str, Any]:
    session, release = CatalogSnapshot.acquire(op_alias="list")
    try:
        rows = session.query(CatalogSnapshot).order_by(CatalogSnapshot.collected_at.desc()).all()
        return {
            "kind": "catalog_snapshot_collection",
            "count": len(rows),
            "snapshots": [_snapshot_record(row) for row in rows],
        }
    finally:
        release()


def snapshot_detail(snapshot_id: str) -> dict[str, Any]:
    session, release = CatalogSnapshot.acquire(op_alias="list")
    try:
        row = session.get(CatalogSnapshot, snapshot_id)
        return _snapshot_record(row) if row else {"detail": "Snapshot not found"}
    finally:
        release()


def entity_observations(
    entity_type: str,
    entity_id: str,
    snapshot_id: str | None = None,
) -> dict[str, Any]:
    session, release = CatalogObservation.acquire(op_alias="list")
    try:
        query = session.query(CatalogObservation).filter(
            CatalogObservation.subject_type == entity_type,
            CatalogObservation.subject_id == entity_id,
        )
        if snapshot_id:
            query = query.filter(CatalogObservation.snapshot_id == snapshot_id)
        rows = query.order_by(CatalogObservation.observed_at.desc()).all()
        return {
            "kind": "entity_observations", "entity_type": entity_type,
            "entity_id": entity_id, "count": len(rows),
            "observations": [{
                "observation_id": row.id, "snapshot_id": row.snapshot_id,
                "observation_type": row.observation_type, "source_kind": row.source_kind,
                "source_url": row.source_url, "status": row.status,
                "observed_at": row.observed_at, "payload": row.payload,
                "content_hash": row.content_hash, "confidence": row.confidence,
            } for row in rows],
        }
    finally:
        release()


def _entity_exists(entity_type: str, entity_id: str) -> bool:
    table = ENTITY_TABLES.get(entity_type)
    if table is None:
        return False
    session, release = table.acquire(op_alias="list")
    try:
        return session.get(table, entity_id) is not None
    finally:
        release()


async def entity_metrics(
    entity_type: str,
    entity_id: str,
    metric_key: str | None = None,
) -> dict[str, Any]:
    if not _entity_exists(entity_type, entity_id):
        return {"detail": "Entity not found"}
    filters, parameters = "subject_type = ? AND subject_id = ?", [entity_type, entity_id]
    if metric_key:
        filters += " AND metric_key = ?"
        parameters.append(metric_key)
    columns = (
        "subject_type",
        "subject_id",
        "metric_key",
        "numeric_value",
        "text_value",
        "unit",
        "dimensions",
        "period_start",
        "period_end",
        "observed_at",
        "snapshot_id",
        "source_url",
    )
    rows = await metric_rows(
        f"SELECT * FROM metric_series WHERE {filters} ORDER BY observed_at, period_start",
        columns,
        parameters,
    )
    points = serialize_rows(rows)
    return {
        "kind": "entity_metric_series" if metric_key else "entity_metrics",
        "entity_type": entity_type, "entity_id": entity_id, "metric_key": metric_key,
        "count": len(points), "points": points,
        "insufficient_history": len({row["snapshot_id"] for row in points}) < 2,
    }


async def analytics_overview(snapshot_id: str | None = None) -> dict[str, Any]:
    if snapshot_id is None:
        current = await metric_rows(
            "SELECT snapshot_id FROM metric_observations ORDER BY observed_at DESC LIMIT 1",
            ("snapshot_id",),
        )
        snapshot_id = current[0]["snapshot_id"] if current else None
    rows = await metric_rows(
        "SELECT * FROM catalog_rollups WHERE snapshot_id = ? ORDER BY subject_type, metric_key"
        if snapshot_id
        else "SELECT * FROM catalog_rollups WHERE false",
        (
            "snapshot_id",
            "subject_type",
            "metric_key",
            "unit",
            "subject_count",
            "total_value",
            "average_value",
            "observed_at",
        ),
        [snapshot_id] if snapshot_id else [],
    )
    return {
        "kind": "catalog_analytics_overview",
        "snapshot_id": snapshot_id,
        "count": len(rows),
        "rollups": serialize_rows(rows),
    }


async def summary() -> dict[str, Any]:
    rows = await metric_rows(
        "SELECT (SELECT count(*) FROM metric_observations) AS metric_observations, "
        "(SELECT count(*) FROM record_aggregates) AS record_aggregates",
        ("metric_observations", "record_aggregates"),
    )
    return {"status": "ok", "engine": "duckdb", **rows[0]}


__all__ = [
    "analytics_overview",
    "entity_metrics",
    "entity_observations",
    "snapshot_detail",
    "snapshots",
    "summary",
]
