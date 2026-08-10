from __future__ import annotations

import json
from collections.abc import AsyncIterator, Iterable
from contextlib import asynccontextmanager
from decimal import Decimal
from typing import Any

from sqlalchemy import delete, func, select

from .tables.metric_observation import MetricObservation
from .tables.record_aggregate import RecordAggregate


@asynccontextmanager
async def analytics_session() -> AsyncIterator[Any]:
    """Acquire the named DuckDB engine through the owning Tigrbl table."""

    session, release = MetricObservation.acquire(op_alias="list")
    try:
        yield session
    finally:
        release()


async def replace_snapshot_metrics(
    snapshot_id: str,
    rows: Iterable[dict[str, Any]],
) -> int:
    values = list(rows)
    async with analytics_session() as session:
        await session.begin()
        try:
            await session.execute(
                delete(MetricObservation).where(MetricObservation.snapshot_id == snapshot_id)
            )
            for row in values:
                session.add(MetricObservation(**row))
            await session.commit()
        except Exception:
            await session.rollback()
            raise
    return len(values)


async def delete_snapshot(snapshot_id: str) -> None:
    async with analytics_session() as session:
        await session.begin()
        try:
            await session.execute(
                delete(MetricObservation).where(MetricObservation.snapshot_id == snapshot_id)
            )
            await session.execute(
                delete(RecordAggregate).where(RecordAggregate.snapshot_id == snapshot_id)
            )
            await session.commit()
        except Exception:
            await session.rollback()
            raise


async def metric_rows(statement: Any) -> list[dict[str, Any]]:
    async with analytics_session() as session:
        result = await session.execute(statement)
        return [dict(row) for row in result.mappings().all()]


async def metric_count(table: type) -> int:
    rows = await metric_rows(select(func.count().label("row_count")).select_from(table))
    return int(rows[0]["row_count"])


def serialize_rows(rows: Iterable[dict[str, Any]]) -> list[dict[str, Any]]:
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


__all__ = [
    "analytics_session",
    "delete_snapshot",
    "metric_count",
    "metric_rows",
    "replace_snapshot_metrics",
    "serialize_rows",
]
