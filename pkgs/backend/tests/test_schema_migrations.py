from groupsum_catalog_api.schema_migrations import (
    LEGACY_ADDITIVE_COLUMNS,
    LEGACY_NULLABLE_COLUMNS,
    SOURCE_PAYLOAD_TABLES,
    reconcile_legacy_catalog_schema,
)
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
    assert "resource_party_person" in LEGACY_ADDITIVE_COLUMNS

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
        f"ALTER TABLE resource_party_person ADD COLUMN IF NOT EXISTS {column}" in ddl
        for column in LEGACY_ADDITIVE_COLUMNS["resource_party_person"]
    )
    assert all(
        f"ALTER TABLE {table_name} ALTER COLUMN {column_name} DROP NOT NULL" in ddl
        for table_name, column_name in LEGACY_NULLABLE_COLUMNS
    )
    assert session.committed is True
    assert released == [True]
