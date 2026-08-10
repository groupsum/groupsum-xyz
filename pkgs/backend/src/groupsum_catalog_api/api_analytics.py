from __future__ import annotations

from typing import Any

from sqlalchemy import func, select

from .analytics import metric_count, metric_rows, serialize_rows
from .tables.catalog_snapshot import CatalogSnapshot
from .tables.metric_observation import MetricObservation
from .tables.observation import CatalogObservation
from .tables.record_aggregate import RecordAggregate
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
    statement = select(
        MetricObservation.subject_type,
        MetricObservation.subject_id,
        MetricObservation.metric_key,
        MetricObservation.numeric_value,
        MetricObservation.text_value,
        MetricObservation.unit,
        MetricObservation.dimensions,
        MetricObservation.period_start,
        MetricObservation.period_end,
        MetricObservation.observed_at,
        MetricObservation.snapshot_id,
        MetricObservation.source_url,
    ).where(
        MetricObservation.subject_type == entity_type,
        MetricObservation.subject_id == entity_id,
    )
    if metric_key:
        statement = statement.where(MetricObservation.metric_key == metric_key)
    rows = await metric_rows(
        statement.order_by(MetricObservation.observed_at, MetricObservation.period_start)
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
            select(MetricObservation.snapshot_id)
            .order_by(MetricObservation.observed_at.desc())
            .limit(1)
        )
        snapshot_id = current[0]["snapshot_id"] if current else None
    statement = (
        select(
            MetricObservation.snapshot_id,
            MetricObservation.subject_type,
            MetricObservation.metric_key,
            MetricObservation.unit,
            func.count().label("subject_count"),
            func.sum(MetricObservation.numeric_value).label("total_value"),
            func.avg(MetricObservation.numeric_value).label("average_value"),
            func.max(MetricObservation.observed_at).label("observed_at"),
        )
        .where(MetricObservation.snapshot_id == snapshot_id)
        .group_by(
            MetricObservation.snapshot_id,
            MetricObservation.subject_type,
            MetricObservation.metric_key,
            MetricObservation.unit,
        )
        .order_by(MetricObservation.subject_type, MetricObservation.metric_key)
    )
    rows = await metric_rows(statement) if snapshot_id else []
    return {
        "kind": "catalog_analytics_overview",
        "snapshot_id": snapshot_id,
        "count": len(rows),
        "rollups": serialize_rows(rows),
    }


async def summary() -> dict[str, Any]:
    return {
        "status": "ok",
        "engine": "duckdb",
        "metric_observations": await metric_count(MetricObservation),
        "record_aggregates": await metric_count(RecordAggregate),
    }


__all__ = [
    "analytics_overview",
    "entity_metrics",
    "entity_observations",
    "snapshot_detail",
    "snapshots",
    "summary",
]
