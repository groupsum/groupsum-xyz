import pytest

from groupsum_catalog_api.schema_migrations import (
    ANALYTICS_COLUMN_ADDITIONS,
    ANALYTICS_COLUMN_RENAMES,
    LEGACY_NULLABLE_COLUMNS,
    SOURCE_PAYLOAD_TABLES,
    reconcile_legacy_analytics_schema,
    reconcile_legacy_catalog_schema,
)
from groupsum_catalog_api.tables.metric_observation import MetricObservation
from groupsum_catalog_api.tables.repository import Repository


def test_postgres_compatibility_migration_covers_legacy_catalog_columns(monkeypatch) -> None:
    assert SOURCE_PAYLOAD_TABLES == (
        "packages",
        "portfolios",
        "products",
        "repositories",
        "technologies",
    )
    assert LEGACY_NULLABLE_COLUMNS == (
        ("packages", "registry_url"),
        ("portfolios", "organization_id"),
        ("products", "organization_id"),
        ("repository_ssot_registries", "repository_id"),
    )

    class Result:
        @staticmethod
        def scalar_one_or_none():
            return 1

    class Session:
        def __init__(self):
            self.statements = []
            self.committed = False

        def execute(self, statement, parameters=None):
            self.statements.append((str(statement), parameters))
            return Result()

        def commit(self):
            self.committed = True

        def rollback(self):
            raise AssertionError("migration should not roll back")

    session = Session()
    released = []
    monkeypatch.setattr(
        Repository,
        "acquire",
        staticmethod(lambda **_kwargs: (session, lambda: released.append(True))),
    )

    reconcile_legacy_catalog_schema()

    ddl = [statement for statement, _parameters in session.statements]
    assert all(
        f"ALTER TABLE {table_name} ADD COLUMN IF NOT EXISTS source_payload JSON" in ddl
        for table_name in SOURCE_PAYLOAD_TABLES
    )
    assert all(
        f"ALTER TABLE {table_name} ALTER COLUMN {column_name} DROP NOT NULL" in ddl
        for table_name, column_name in LEGACY_NULLABLE_COLUMNS
    )
    assert session.committed is True
    assert released == [True]


@pytest.mark.anyio
async def test_analytics_migration_preserves_legacy_metrics(monkeypatch) -> None:
    class Result:
        @staticmethod
        def fetchall():
            return [
                (0, "id", "VARCHAR", True),
                (1, "subject_kind", "VARCHAR", True),
                (2, "subject_id", "VARCHAR", True),
                (3, "metric", "VARCHAR", True),
                (4, "value", "DECIMAL", True),
                (5, "unit", "VARCHAR", True),
                (6, "source_url", "VARCHAR", True),
                (7, "observed_at", "TIMESTAMP", True),
            ]

    class Session:
        def __init__(self):
            self.statements = []
            self.committed = False

        def execute(self, statement, parameters=None):
            self.statements.append((str(statement), parameters))
            return Result()

        def commit(self):
            self.committed = True

        def rollback(self):
            raise AssertionError("migration should not roll back")

    session = Session()
    released = []
    monkeypatch.setattr(
        MetricObservation,
        "acquire",
        staticmethod(lambda **_kwargs: (session, lambda: released.append(True))),
    )

    await reconcile_legacy_analytics_schema()

    ddl = [statement for statement, _parameters in session.statements]
    assert all(
        "ALTER TABLE metric_observations "
        f"RENAME COLUMN {legacy_name} TO {current_name}" in ddl
        for legacy_name, current_name in ANALYTICS_COLUMN_RENAMES.items()
    )
    assert all(
        "ALTER TABLE metric_observations " f"ADD COLUMN {column_name} {definition}" in ddl
        for column_name, definition in ANALYTICS_COLUMN_ADDITIONS.items()
    )
    assert any("legacy:pre-snapshot" in statement for statement in ddl)
    assert session.committed is True
    assert released == [True]
