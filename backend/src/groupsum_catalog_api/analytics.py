from __future__ import annotations

import os
from collections.abc import Iterator
from contextlib import contextmanager
from pathlib import Path
from typing import Any

import duckdb

METRIC_SCHEMA = """
CREATE TABLE IF NOT EXISTS metric_observations (
    id VARCHAR PRIMARY KEY,
    subject_kind VARCHAR NOT NULL,
    subject_id VARCHAR NOT NULL,
    metric VARCHAR NOT NULL,
    value DOUBLE NOT NULL,
    unit VARCHAR NOT NULL,
    period_start TIMESTAMP,
    period_end TIMESTAMP,
    source_url VARCHAR NOT NULL,
    observed_at TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS metric_subject_idx
ON metric_observations(subject_kind, subject_id, metric, observed_at);
CREATE TABLE IF NOT EXISTS record_aggregates (
    record_id VARCHAR PRIMARY KEY,
    repository_count BIGINT NOT NULL DEFAULT 0,
    package_count BIGINT NOT NULL DEFAULT 0,
    resource_count BIGINT NOT NULL DEFAULT 0,
    release_count BIGINT NOT NULL DEFAULT 0,
    dependency_count BIGINT NOT NULL DEFAULT 0,
    dependent_count BIGINT NOT NULL DEFAULT 0,
    refreshed_at TIMESTAMP NOT NULL
);
"""


def default_analytics_path(database: str | Path) -> Path:
    if isinstance(database, Path):
        return database.with_suffix(".metrics.duckdb")
    return Path(os.getenv("GROUPSUM_ANALYTICS_PATH", "data/groupsum-metrics.duckdb"))


@contextmanager
def connect_analytics(
    path: Path, *, read_only: bool = False
) -> Iterator[duckdb.DuckDBPyConnection]:
    path.parent.mkdir(parents=True, exist_ok=True)
    connection = duckdb.connect(str(path), read_only=read_only)
    try:
        if not read_only:
            connection.execute(METRIC_SCHEMA)
        yield connection
    finally:
        connection.close()


def upsert_metric(connection: duckdb.DuckDBPyConnection, values: dict[str, Any]) -> None:
    columns = tuple(values)
    placeholders = ", ".join("?" for _ in columns)
    assignments = ", ".join(f"{column}=excluded.{column}" for column in columns if column != "id")
    connection.execute(
        f"INSERT INTO metric_observations ({', '.join(columns)}) VALUES ({placeholders}) "
        f"ON CONFLICT(id) DO UPDATE SET {assignments}",
        tuple(values[column] for column in columns),
    )


def metric_rows(
    connection: duckdb.DuckDBPyConnection,
    query: str,
    parameters: tuple[Any, ...] = (),
) -> list[dict[str, Any]]:
    result = connection.execute(query, parameters)
    names = [item[0] for item in result.description]
    return [dict(zip(names, row, strict=True)) for row in result.fetchall()]
