from __future__ import annotations

import hashlib
import json
import re
from typing import Any

from ..database import Connection
from ..database import connect as connect


def stable_id(*parts: str) -> str:
    readable = ":".join(parts)
    if len(readable) <= 300:
        return readable
    return f"sha256:{hashlib.sha256(readable.encode()).hexdigest()}"


def package_key(ecosystem: str, name: str) -> str:
    return f"{ecosystem}:{name.casefold().replace('_', '-')}"


def canonical_package_id(
    connection: Connection,
    proposed_id: str,
    ecosystem: str,
    name: str,
    route_key: str | None = None,
) -> str:
    row = None
    if route_key:
        row = connection.execute(
            "SELECT id FROM packages WHERE route_key = ?",
            (route_key,),
        ).fetchone()
    if row is None:
        row = connection.execute(
            "SELECT id FROM packages WHERE ecosystem = ? AND name = ?",
            (ecosystem, name),
        ).fetchone()
    return str(row[0]) if row else proposed_id


def record_slug(owner: str, name: str) -> str:
    value = re.sub(r"[^a-z0-9]+", "-", f"catalog-{owner}-{name}".lower()).strip("-")
    return value or hashlib.sha256(f"{owner}/{name}".encode()).hexdigest()[:16]


def upsert(connection: Connection, table: str, values: dict[str, Any]) -> None:
    columns = tuple(values)
    placeholders = ", ".join("?" for _ in columns)
    assignments = ", ".join(f"{column}=excluded.{column}" for column in columns if column != "id")
    connection.execute(
        f"INSERT INTO {table} ({', '.join(columns)}) VALUES ({placeholders}) "
        f"ON CONFLICT(id) DO UPDATE SET {assignments}",
        tuple(values[column] for column in columns),
    )


def import_legal_observations(
    connection: Connection,
    subject_kind: str,
    subject_id: str,
    evidence: list[dict[str, Any]],
    observed_at: str,
) -> None:
    for item in evidence:
        url = item.get("url")
        if not url:
            continue
        evidence_kind = item.get("kind") or "license"
        upsert(
            connection,
            "legal_evidence",
            {
                "id": stable_id("legal", subject_kind, subject_id, evidence_kind, url),
                "subject_kind": subject_kind,
                "subject_id": subject_id,
                "evidence_kind": evidence_kind,
                "name": item.get("name") or item.get("path") or evidence_kind.title(),
                "expression": item.get("expression"),
                "path": item.get("path"),
                "url": url,
                "scope": item.get("scope") or "direct",
                "evidence_type": item.get("evidence") or "repository.file",
                "origin_kind": item.get("evidence") or "repository.file",
                "observed_at": observed_at,
            },
        )


DISCOVERED_RESOURCE_TYPES = {
    "website": ("Website", "experience"),
    "documentation": ("Documentation", "content"),
    "api_definition": ("API definition", "contract"),
    "api_source": ("API source", "source"),
    "api": ("Live API", "experience"),
    "demo": ("Demo", "experience"),
    "example": ("Example", "content"),
    "showcase": ("Showcase", "experience"),
    "ui": ("User interface", "experience"),
}


def import_resource_type(connection: Connection, resource_type: str) -> None:
    label, category = DISCOVERED_RESOURCE_TYPES.get(
        resource_type, (resource_type.replace("_", " ").title(), "resource")
    )
    upsert(
        connection,
        "resource_types",
        {
            "id": resource_type,
            "label": label,
            "category": category,
            "description": None,
            "icon_key": resource_type,
            "detail_schema_key": resource_type,
        },
    )


def import_resource_repository(
    connection: Connection,
    resource_id: str,
    repository_id: str | None,
    path: str | None,
    observed_at: str,
) -> None:
    if not repository_id:
        return
    upsert(
        connection,
        "resource_repositories",
        {
            "id": stable_id("resource-repository", resource_id, repository_id, "owner"),
            "resource_id": resource_id,
            "repository_id": repository_id,
            "role": "owner",
            "path": path,
            "observed_at": observed_at,
        },
    )


def import_repository_ssot(
    connection: Connection,
    repository_id: str,
    ssot: dict[str, Any],
    observed_at: str,
) -> None:
    registry_url = ssot.get("registry_url")
    if not ssot.get("governed") or not registry_url:
        return
    registry_id = stable_id("ssot-registry", repository_id, str(registry_url))
    upsert(
        connection,
        "repository_ssot_registries",
        {
            "id": registry_id,
            "repository_id": repository_id,
            "registry_url": registry_url,
            "schema_version": ssot.get("schema_version"),
            "source_sha256": ssot.get("source_sha256"),
            "valid": bool(ssot.get("valid", True)),
            "observed_at": ssot.get("observed_at") or observed_at,
        },
    )
    for entity_kind, items in (ssot.get("inventory") or {}).items():
        if not isinstance(items, list):
            continue
        for item in items:
            entity_id = str(
                item.get("id") or stable_id(entity_kind, json.dumps(item, sort_keys=True))
            )
            upsert(
                connection,
                "repository_ssot_inventory",
                {
                    "id": stable_id("ssot-inventory", registry_id, entity_kind, entity_id),
                    "registry_id": registry_id,
                    "entity_kind": entity_kind,
                    "entity_id": entity_id,
                    "title": item.get("title") or item.get("name") or item.get("statement"),
                    "status": item.get("status"),
                    "implementation_status": item.get("implementation_status"),
                    "payload": json.dumps(item, sort_keys=True),
                },
            )


def ensure_repository_ssot_columns(connection: Connection) -> None:
    definitions = {
        "ssot_governed": "BOOLEAN NOT NULL DEFAULT FALSE",
        "ssot_registry_url": "TEXT",
        "ssot_registry_sha256": "VARCHAR(64)",
        "ssot_schema_version": "VARCHAR(40)",
        "ssot_summary": "JSONB" if connection.postgres else "JSON",
        "ssot_observed_at": "TIMESTAMP WITH TIME ZONE" if connection.postgres else "TEXT",
    }
    if connection.postgres:
        for name, definition in definitions.items():
            connection.execute(
                f"ALTER TABLE repositories ADD COLUMN IF NOT EXISTS {name} {definition}"
            )
        return
    present = {row[1] for row in connection.execute("PRAGMA table_info(repositories)")}
    for name, definition in definitions.items():
        if name not in present:
            connection.execute(f"ALTER TABLE repositories ADD COLUMN {name} {definition}")


def ensure_package_ownership_columns(connection: Connection) -> None:
    definitions = {
        "package_kind": "VARCHAR(60) NOT NULL DEFAULT 'package-candidate'",
        "private": "BOOLEAN NOT NULL DEFAULT FALSE",
    }
    if connection.postgres:
        for name, definition in definitions.items():
            connection.execute(f"ALTER TABLE packages ADD COLUMN IF NOT EXISTS {name} {definition}")
        return
    present = {row[1] for row in connection.execute("PRAGMA table_info(packages)")}
    for name, definition in definitions.items():
        if name not in present:
            connection.execute(f"ALTER TABLE packages ADD COLUMN {name} {definition}")


def ensure_universal_resource_columns(connection: Connection) -> None:
    additions = {
        "entity_types": {
            "parent_type_id": "VARCHAR(80)",
            "icon_key": "VARCHAR(80)",
            "detail_schema_key": "VARCHAR(120)",
        },
        "entity_urls": {
            "origin_kind": "VARCHAR(80) NOT NULL DEFAULT 'collector_observation'",
            "observation_id": "VARCHAR(300)",
        },
        "entity_relationships": {
            "origin_kind": "VARCHAR(80) NOT NULL DEFAULT 'collector_observation'",
            "observation_id": "VARCHAR(300)",
            "ssot_entity_id": "VARCHAR(360)",
        },
        "observations": {
            "observation_type": "VARCHAR(80) NOT NULL DEFAULT 'inventory'",
        },
        "dependencies": {
            "origin_kind": "VARCHAR(80) NOT NULL DEFAULT 'repository.manifest'",
        },
        "legal_evidence": {
            "origin_kind": "VARCHAR(80) NOT NULL DEFAULT 'repository.file'",
        },
    }
    if connection.postgres:
        for table, columns in additions.items():
            for name, definition in columns.items():
                connection.execute(
                    f"ALTER TABLE {table} ADD COLUMN IF NOT EXISTS {name} {definition}"
                )
        # Existing deployments created this compatibility column as NOT NULL.
        # Observations are not SSOT evidence, so new rows deliberately leave it empty.
        connection.execute("ALTER TABLE observations ALTER COLUMN evidence_type DROP NOT NULL")
        return
    for table, columns in additions.items():
        present = {row[1] for row in connection.execute(f"PRAGMA table_info({table})")}
        for name, definition in columns.items():
            if name not in present:
                connection.execute(f"ALTER TABLE {table} ADD COLUMN {name} {definition}")


def catalog_entity_id(source_table: str, source_id: str) -> str:
    return stable_id("entity", source_table, source_id)
