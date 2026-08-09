from __future__ import annotations

import json
from collections.abc import AsyncIterator, Iterable, Sequence
from contextlib import asynccontextmanager
from typing import Any

from .tables.metric_observation import MetricObservation

METRIC_SCHEMA = """
CREATE TABLE IF NOT EXISTS metric_observations (
    measurement_id VARCHAR PRIMARY KEY,
    snapshot_id VARCHAR NOT NULL,
    subject_type VARCHAR NOT NULL,
    subject_id VARCHAR NOT NULL,
    metric_key VARCHAR NOT NULL,
    numeric_value DOUBLE,
    text_value VARCHAR,
    unit VARCHAR NOT NULL,
    dimensions JSON,
    period_start TIMESTAMP,
    period_end TIMESTAMP,
    source_url VARCHAR,
    source_observation_id VARCHAR,
    observed_at TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS metric_subject_idx
ON metric_observations(subject_type, subject_id, metric_key, observed_at);
CREATE INDEX IF NOT EXISTS metric_snapshot_idx ON metric_observations(snapshot_id);
CREATE TABLE IF NOT EXISTS record_aggregates (
    snapshot_id VARCHAR NOT NULL,
    record_type VARCHAR NOT NULL,
    record_id VARCHAR NOT NULL,
    repository_count BIGINT NOT NULL DEFAULT 0,
    package_count BIGINT NOT NULL DEFAULT 0,
    resource_count BIGINT NOT NULL DEFAULT 0,
    release_count BIGINT NOT NULL DEFAULT 0,
    dependency_count BIGINT NOT NULL DEFAULT 0,
    dependent_count BIGINT NOT NULL DEFAULT 0,
    refreshed_at TIMESTAMP NOT NULL,
    PRIMARY KEY (snapshot_id, record_type, record_id)
);
CREATE OR REPLACE VIEW metric_series AS
SELECT subject_type, subject_id, metric_key, numeric_value, text_value, unit, dimensions,
       period_start, period_end, observed_at, snapshot_id, source_url
FROM metric_observations
ORDER BY subject_type, subject_id, metric_key, observed_at;
CREATE OR REPLACE VIEW entity_metric_summary AS
SELECT subject_type, subject_id, metric_key, unit, count(*) AS point_count,
       min(observed_at) AS first_observed_at, max(observed_at) AS last_observed_at,
       arg_max(numeric_value, observed_at) AS latest_value
FROM metric_observations
GROUP BY subject_type, subject_id, metric_key, unit;
CREATE OR REPLACE VIEW catalog_rollups AS
SELECT snapshot_id, subject_type, metric_key, unit, count(*) AS subject_count,
       sum(numeric_value) AS total_value, avg(numeric_value) AS average_value,
       max(observed_at) AS observed_at
FROM metric_observations
GROUP BY snapshot_id, subject_type, metric_key, unit;
"""

METRIC_COLUMNS = (
    "measurement_id", "snapshot_id", "subject_type", "subject_id", "metric_key",
    "numeric_value", "text_value", "unit", "dimensions", "period_start", "period_end",
    "source_url", "source_observation_id", "observed_at",
)


@asynccontextmanager
async def analytics_session() -> AsyncIterator[Any]:
    """Acquire the named DuckDB provider through Tigrbl and ensure its schema."""

    session, release = MetricObservation.acquire(op_alias="list")
    try:
        await session.execute(METRIC_SCHEMA)
        yield session
    finally:
        release()


async def replace_snapshot_metrics(
    snapshot_id: str,
    rows: Iterable[dict[str, Any]],
) -> int:
    values = [
        tuple(
            json.dumps(row.get(column) or {}) if column == "dimensions" else row.get(column)
            for column in METRIC_COLUMNS
        )
        for row in rows
    ]
    async with analytics_session() as session:
        await session.begin()
        try:
            await session.execute(
                ("DELETE FROM metric_observations WHERE snapshot_id = ?", [snapshot_id])
            )
            if values:
                placeholders = ", ".join("?" for _ in METRIC_COLUMNS)
                statement = (
                    f"INSERT INTO metric_observations "
                    f"({', '.join(METRIC_COLUMNS)}) VALUES ({placeholders})"
                )
                for row in values:
                    await session.execute((statement, row))
            await session.commit()
        except Exception:
            await session.rollback()
            raise
    return len(values)


async def delete_snapshot(snapshot_id: str) -> None:
    async with analytics_session() as session:
        await session.begin()
        try:
            for table in ("metric_observations", "record_aggregates"):
                await session.execute(
                    (f"DELETE FROM {table} WHERE snapshot_id = ?", [snapshot_id])
                )
            await session.commit()
        except Exception:
            await session.rollback()
            raise


async def metric_rows(
    query: str,
    columns: Sequence[str],
    parameters: tuple[Any, ...] | list[Any] = (),
) -> list[dict[str, Any]]:
    async with analytics_session() as session:
        result = await session.execute((query, parameters))
        return [dict(zip(columns, row, strict=True)) for row in result.all()]


def serialize_rows(rows: Iterable[dict[str, Any]]) -> list[dict[str, Any]]:
    return [
        {
            key: value.isoformat().replace("+00:00", "Z")
            if hasattr(value, "isoformat")
            else json.loads(value)
            if key == "dimensions" and isinstance(value, str)
            else value
            for key, value in row.items()
        }
        for row in rows
    ]
