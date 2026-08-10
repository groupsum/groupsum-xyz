from __future__ import annotations

import inspect

from sqlalchemy import text

from .tables.metric_observation import MetricObservation
from .tables.repository import Repository

SOURCE_PAYLOAD_TABLES = (
    "packages",
    "portfolios",
    "products",
    "repositories",
    "technologies",
)

LEGACY_NULLABLE_COLUMNS = (
    ("packages", "registry_url"),
    ("portfolios", "organization_id"),
    ("products", "organization_id"),
    ("repository_ssot_registries", "repository_id"),
)

ANALYTICS_COLUMN_RENAMES = {
    "id": "measurement_id",
    "subject_kind": "subject_type",
    "metric": "metric_key",
    "value": "numeric_value",
}

ANALYTICS_COLUMN_ADDITIONS = {
    "snapshot_id": "VARCHAR",
    "text_value": "VARCHAR",
    "dimensions": "JSON",
    "source_observation_id": "VARCHAR",
}


def reconcile_legacy_catalog_schema() -> None:
    """Bring the pre-graph PostgreSQL schema forward without discarding records."""

    session, release = Repository.acquire(op_alias="create")
    try:
        for table_name in SOURCE_PAYLOAD_TABLES:
            session.execute(
                text(f"ALTER TABLE {table_name} ADD COLUMN IF NOT EXISTS source_payload JSON")
            )
        for table_name, column_name in LEGACY_NULLABLE_COLUMNS:
            exists = session.execute(
                text(
                    "SELECT 1 FROM information_schema.columns "
                    "WHERE table_schema = current_schema() "
                    "AND table_name = :table_name AND column_name = :column_name"
                ),
                {"table_name": table_name, "column_name": column_name},
            ).scalar_one_or_none()
            if exists is not None:
                session.execute(
                    text(f"ALTER TABLE {table_name} ALTER COLUMN {column_name} DROP NOT NULL")
                )
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        release()


async def _maybe_await(value):
    return await value if inspect.isawaitable(value) else value


async def reconcile_legacy_analytics_schema() -> None:
    """Upgrade the durable pre-snapshot metric table through its Tigrbl engine."""

    session, release = MetricObservation.acquire(op_alias="create")
    try:
        result = await _maybe_await(
            session.execute(text("PRAGMA table_info('metric_observations')"))
        )
        column_rows = result.fetchall()
        columns = {str(row[1]): bool(row[3]) for row in column_rows}
        for legacy_name, current_name in ANALYTICS_COLUMN_RENAMES.items():
            if legacy_name in columns and current_name not in columns:
                await _maybe_await(
                    session.execute(
                        text(
                            "ALTER TABLE metric_observations "
                            f"RENAME COLUMN {legacy_name} TO {current_name}"
                        )
                    )
                )
                columns[current_name] = columns.pop(legacy_name)
        for column_name, definition in ANALYTICS_COLUMN_ADDITIONS.items():
            if column_name not in columns:
                await _maybe_await(
                    session.execute(
                        text(
                            "ALTER TABLE metric_observations "
                            f"ADD COLUMN {column_name} {definition}"
                        )
                    )
                )
                columns[column_name] = False
        await _maybe_await(
            session.execute(
                text(
                    "UPDATE metric_observations SET snapshot_id = 'legacy:pre-snapshot' "
                    "WHERE snapshot_id IS NULL"
                )
            )
        )
        for column_name in ("numeric_value", "source_url"):
            if columns.get(column_name):
                await _maybe_await(
                    session.execute(
                        text(
                            "ALTER TABLE metric_observations "
                            f"ALTER COLUMN {column_name} DROP NOT NULL"
                        )
                    )
                )
        await _maybe_await(session.commit())
    except Exception:
        await _maybe_await(session.rollback())
        raise
    finally:
        release()


__all__ = [
    "LEGACY_NULLABLE_COLUMNS",
    "ANALYTICS_COLUMN_ADDITIONS",
    "ANALYTICS_COLUMN_RENAMES",
    "SOURCE_PAYLOAD_TABLES",
    "reconcile_legacy_analytics_schema",
    "reconcile_legacy_catalog_schema",
]
