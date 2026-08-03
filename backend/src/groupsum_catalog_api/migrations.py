from __future__ import annotations

import sqlite3
from collections.abc import Callable
from dataclasses import dataclass
from pathlib import Path

from .importer import connect


@dataclass(frozen=True, slots=True)
class Migration:
    version: int
    name: str
    apply: Callable[[sqlite3.Connection], None]


def _baseline(connection: sqlite3.Connection) -> None:
    expected = {"records", "packages", "resources", "metric_observations"}
    present = {
        row[0] for row in connection.execute("SELECT name FROM sqlite_master WHERE type = 'table'")
    }
    missing = expected - present
    if missing:
        raise RuntimeError(f"Tigrbl baseline schema is incomplete: {sorted(missing)}")


def _add_record_content(connection: sqlite3.Connection) -> None:
    columns = {row[1] for row in connection.execute("PRAGMA table_info(records)")}
    if "content" not in columns:
        connection.execute("ALTER TABLE records ADD COLUMN content JSON")


def _add_registry_evidence_fields(connection: sqlite3.Connection) -> None:
    additions = {
        "packages": {
            "source_url": "TEXT",
            "manifest_path": "TEXT",
            "published": "BOOLEAN",
            "publication_status": "TEXT",
        },
        "releases": {
            "downloads": "NUMERIC",
            "prerelease": "BOOLEAN NOT NULL DEFAULT 0",
            "draft": "BOOLEAN NOT NULL DEFAULT 0",
        },
        "dependencies": {
            "evidence_type": "TEXT NOT NULL DEFAULT 'repository.manifest'",
            "source_url": "TEXT",
            "completeness": "TEXT NOT NULL DEFAULT 'catalog-observed'",
        },
    }
    for table, columns in additions.items():
        present = {row[1] for row in connection.execute(f"PRAGMA table_info({table})")}
        for name, definition in columns.items():
            if name not in present:
                connection.execute(f"ALTER TABLE {table} ADD COLUMN {name} {definition}")


MIGRATIONS = (
    Migration(1, "tigrbl_normalized_catalog_baseline", _baseline),
    Migration(2, "add_structured_record_content", _add_record_content),
    Migration(3, "add_registry_release_and_dependency_evidence", _add_registry_evidence_fields),
)


def migrate(database_path: Path) -> list[int]:
    applied_now: list[int] = []
    with connect(database_path) as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS schema_migrations (
                version INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        applied = {row[0] for row in connection.execute("SELECT version FROM schema_migrations")}
        for migration in MIGRATIONS:
            if migration.version in applied:
                continue
            migration.apply(connection)
            connection.execute(
                "INSERT INTO schema_migrations(version, name) VALUES (?, ?)",
                (migration.version, migration.name),
            )
            applied_now.append(migration.version)
    return applied_now
