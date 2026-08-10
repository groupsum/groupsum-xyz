from __future__ import annotations

from collections.abc import Iterable
from typing import Any

from sqlalchemy import delete

from .base import *  # noqa: F403


class MetricObservation(CatalogTable):
    """One immutable analytical measurement stored by the named DuckDB engine."""

    __tablename__ = "metric_observations"
    ENGINE_NAME = "analytics"

    measurement_id = Column(String(160), primary_key=True)
    snapshot_id = Column(String(160), nullable=False, index=True)
    subject_type = Column(String(80), nullable=False, index=True)
    subject_id = Column(String(360), nullable=False, index=True)
    metric_key = Column(String(120), nullable=False, index=True)
    numeric_value = Column(Numeric, nullable=True)
    text_value = Column(Text, nullable=True)
    unit = Column(String(40), nullable=False)
    dimensions = Column(JSON, nullable=True)
    period_start = Column(DateTime, nullable=True)
    period_end = Column(DateTime, nullable=True)
    source_url = Column(Text, nullable=True)
    source_observation_id = Column(String(160), nullable=True)
    observed_at = Column(DateTime, nullable=False, index=True)


async def replace_snapshot_metrics(
    snapshot_id: str,
    rows: Iterable[dict[str, Any]],
) -> int:
    values = list(rows)
    session, release = MetricObservation.acquire(op_alias="list")
    try:
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
    finally:
        release()
    return len(values)


async def delete_snapshot_metrics(snapshot_id: str) -> None:
    session, release = MetricObservation.acquire(op_alias="list")
    try:
        await session.begin()
        try:
            await session.execute(
                delete(MetricObservation).where(MetricObservation.snapshot_id == snapshot_id)
            )
            await session.commit()
        except Exception:
            await session.rollback()
            raise
    finally:
        release()


__all__ = ["MetricObservation", "delete_snapshot_metrics", "replace_snapshot_metrics"]
