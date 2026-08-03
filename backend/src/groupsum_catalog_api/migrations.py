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


MIGRATIONS = (
    Migration(1, "tigrbl_normalized_catalog_baseline", _baseline),
    Migration(2, "add_structured_record_content", _add_record_content),
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
