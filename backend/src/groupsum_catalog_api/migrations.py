from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from pathlib import Path

from .database import Connection
from .importer import connect


@dataclass(frozen=True, slots=True)
class Migration:
    version: int
    name: str
    apply: Callable[[Connection], None]


def _baseline(connection: Connection) -> None:
    expected = {"records", "packages", "resources", "releases"}
    present = {
        row[0] for row in connection.execute("SELECT name FROM sqlite_master WHERE type = 'table'")
    }
    missing = expected - present
    if missing:
        raise RuntimeError(f"Tigrbl baseline schema is incomplete: {sorted(missing)}")


def _add_record_content(connection: Connection) -> None:
    columns = {row[1] for row in connection.execute("PRAGMA table_info(records)")}
    if "content" not in columns:
        connection.execute("ALTER TABLE records ADD COLUMN content JSON")


def _add_registry_evidence_fields(connection: Connection) -> None:
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


def _add_routes_and_legal_fields(connection: Connection) -> None:
    additions = {
        "repositories": {"license_expression": "TEXT"},
        "packages": {
            "route_key": "TEXT",
            "license_expression": "TEXT",
            "license_status": "TEXT",
        },
        "releases": {"route_key": "TEXT"},
        "resources": {
            "route_key": "TEXT",
            "repository_id": "TEXT",
            "path": "TEXT",
        },
    }
    for table, columns in additions.items():
        present = {row[1] for row in connection.execute(f"PRAGMA table_info({table})")}
        for name, definition in columns.items():
            if name not in present:
                connection.execute(f"ALTER TABLE {table} ADD COLUMN {name} {definition}")


def _add_package_ownership_fields(connection: Connection) -> None:
    additions = {
        "package_kind": "TEXT NOT NULL DEFAULT 'package-candidate'",
        "private": "BOOLEAN NOT NULL DEFAULT 0",
    }
    present = {row[1] for row in connection.execute("PRAGMA table_info(packages)")}
    for name, definition in additions.items():
        if name not in present:
            connection.execute(f"ALTER TABLE packages ADD COLUMN {name} {definition}")


MIGRATIONS = (
    Migration(1, "tigrbl_normalized_catalog_baseline", _baseline),
    Migration(2, "add_structured_record_content", _add_record_content),
    Migration(3, "add_registry_release_and_dependency_evidence", _add_registry_evidence_fields),
    Migration(4, "add_catalog_routes_and_legal_evidence", _add_routes_and_legal_fields),
    Migration(5, "add_package_ownership_fields", _add_package_ownership_fields),
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
