from __future__ import annotations

from sqlalchemy import text

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

LEGACY_ADDITIVE_COLUMNS = {
    "resource_party_person": (
        "provider VARCHAR(60)",
        "provider_id VARCHAR(200)",
        "login VARCHAR(240)",
        "profile_url VARCHAR(2048)",
        "avatar_url VARCHAR(2048)",
        "account_type VARCHAR(80)",
        "anonymous BOOLEAN NOT NULL DEFAULT FALSE",
    ),
}


def reconcile_legacy_catalog_schema() -> None:
    """Bring the pre-graph PostgreSQL schema forward without discarding records."""

    session, release = Repository.acquire(op_alias="create")
    try:
        for table_name in SOURCE_PAYLOAD_TABLES:
            session.execute(
                text(f"ALTER TABLE {table_name} ADD COLUMN IF NOT EXISTS source_payload JSON")
            )
        for table_name, columns in LEGACY_ADDITIVE_COLUMNS.items():
            for column in columns:
                session.execute(text(f"ALTER TABLE {table_name} ADD COLUMN IF NOT EXISTS {column}"))
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


__all__ = [
    "LEGACY_NULLABLE_COLUMNS",
    "LEGACY_ADDITIVE_COLUMNS",
    "SOURCE_PAYLOAD_TABLES",
    "reconcile_legacy_catalog_schema",
]
