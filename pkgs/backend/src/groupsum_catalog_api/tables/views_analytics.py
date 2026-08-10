from __future__ import annotations

import json
from decimal import Decimal
from typing import Any

from sqlalchemy import func, select

from .catalog_snapshot import CatalogSnapshot
from .metric_observation import MetricObservation
from .observation import CatalogObservation
from .registry import ENTITY_TABLES


def _params(ctx: dict[str, Any]) -> dict[str, Any]:
    values = dict(ctx.get("payload") or {})
    values.update(ctx.get("query_params") or {})
    values.update(ctx.get("path_params") or {})
    return values


def _snapshot_record(row: CatalogSnapshot) -> dict[str, Any]:
    return {
        "snapshot_id": row.id,
        "schema_version": row.schema_version,
        "collected_at": row.collected_at,
        "completed_at": row.completed_at,
        "status": row.status,
        "collector_version": row.collector_version,
        "source_digest": row.source_digest,
        "parent_snapshot_id": row.parent_snapshot_id,
        "is_current": row.is_current,
        "completeness": row.completeness or {},
        "observation_count": row.observation_count,
        "measurement_count": row.measurement_count,
        "error_count": row.error_count,
    }


def snapshots(_table: type, ctx: dict[str, Any]) -> dict[str, Any]:
    rows = ctx["db"].query(CatalogSnapshot).order_by(CatalogSnapshot.collected_at.desc()).all()
    return {
        "kind": "catalog_snapshot_collection",
        "count": len(rows),
        "snapshots": [_snapshot_record(row) for row in rows],
    }


def snapshot_detail(_table: type, ctx: dict[str, Any]) -> dict[str, Any]:
    row = ctx["db"].get(CatalogSnapshot, _params(ctx)["snapshot_id"])
    return _snapshot_record(row) if row else {"detail": "Snapshot not found"}


def entity_observations(_table: type, ctx: dict[str, Any]) -> dict[str, Any]:
    params = _params(ctx)
    entity_type = str(params["entity_type"])
    entity_id = str(params.get("entity_id") or "")
    query = ctx["db"].query(CatalogObservation).filter(
        CatalogObservation.subject_type == entity_type,
        CatalogObservation.subject_id == entity_id,
    )
    snapshot_id = str(params.get("snapshot_id") or "")
    if snapshot_id:
        query = query.filter(CatalogObservation.snapshot_id == snapshot_id)
    rows = query.order_by(CatalogObservation.observed_at.desc()).all()
    return {
        "kind": "entity_observations",
        "entity_type": entity_type,
        "entity_id": entity_id,
        "count": len(rows),
        "observations": [
            {
                "observation_id": row.id,
                "snapshot_id": row.snapshot_id,
                "observation_type": row.observation_type,
                "source_kind": row.source_kind,
                "source_url": row.source_url,
                "status": row.status,
                "observed_at": row.observed_at,
                "payload": row.payload,
                "content_hash": row.content_hash,
                "confidence": row.confidence,
            }
            for row in rows
        ],
    }


def _entity_exists(entity_type: str, entity_id: str) -> bool:
    table = ENTITY_TABLES.get(entity_type)
    if table is None:
        return False
    session, release = table.acquire(op_alias="read")
    try:
        return session.get(table, entity_id) is not None
    finally:
        release()


def _serialize(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [
        {
            key: value.isoformat().replace("+00:00", "Z")
            if hasattr(value, "isoformat")
            else float(value)
            if isinstance(value, Decimal)
            else json.loads(value)
            if key == "dimensions" and isinstance(value, str)
            else value
            for key, value in row.items()
        }
        for row in rows
    ]


async def _rows(ctx: dict[str, Any], statement: Any) -> list[dict[str, Any]]:
    result = await ctx["db"].execute(statement)
    return [dict(row) for row in result.mappings().all()]


async def entity_metrics(_table: type, ctx: dict[str, Any]) -> dict[str, Any]:
    params = _params(ctx)
    entity_type = str(params["entity_type"])
    entity_id = str(params.get("entity_id") or "")
    if not _entity_exists(entity_type, entity_id):
        return {"detail": "Entity not found"}
    metric_key = params.get("metric_key")
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
    points = _serialize(
        await _rows(
            ctx,
            statement.order_by(
                MetricObservation.observed_at,
                MetricObservation.period_start,
            ),
        )
    )
    return {
        "kind": "entity_metric_series" if metric_key else "entity_metrics",
        "entity_type": entity_type,
        "entity_id": entity_id,
        "metric_key": metric_key,
        "count": len(points),
        "points": points,
        "insufficient_history": len({row["snapshot_id"] for row in points}) < 2,
    }


async def analytics_overview(_table: type, ctx: dict[str, Any]) -> dict[str, Any]:
    snapshot_id = str(_params(ctx).get("snapshot_id") or "") or None
    if snapshot_id is None:
        current = await _rows(
            ctx,
            select(MetricObservation.snapshot_id)
            .order_by(MetricObservation.observed_at.desc())
            .limit(1),
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
    rows = await _rows(ctx, statement) if snapshot_id else []
    return {
        "kind": "catalog_analytics_overview",
        "snapshot_id": snapshot_id,
        "count": len(rows),
        "rollups": _serialize(rows),
    }


async def analytics_summary(_table: type, ctx: dict[str, Any]) -> dict[str, Any]:
    rows = await _rows(
        ctx,
        select(func.count().label("row_count")).select_from(MetricObservation),
    )
    return {
        "status": "ok",
        "engine": "duckdb",
        "metric_observations": int(rows[0]["row_count"]),
    }


async def analytics_readiness() -> dict[str, Any]:
    session, release = MetricObservation.acquire(op_alias="list")
    try:
        return await analytics_summary(MetricObservation, {"db": session})
    finally:
        release()


__all__ = [
    "analytics_overview",
    "analytics_readiness",
    "analytics_summary",
    "entity_metrics",
    "entity_observations",
    "snapshot_detail",
    "snapshots",
]
