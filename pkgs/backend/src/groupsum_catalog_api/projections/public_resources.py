from __future__ import annotations

from collections.abc import Mapping
from typing import Any
from urllib.parse import quote


def public_resource_record(entity_type: str, row: Mapping[str, Any]) -> dict[str, Any]:
    """Project one persisted typed resource into the public catalog representation."""

    source_payload = row.get("source_payload")
    item = dict(source_payload) if isinstance(source_payload, dict) else dict(row)
    canonical_path = row.get("canonical_path")
    route_key = str(canonical_path or row["id"]).rstrip("/").rsplit("/", 1)[-1]
    title = (
        row.get("title")
        or row.get("name")
        or row.get("source_key")
        or item.get("display_name")
        or item.get("name")
        or row["id"]
    )
    description = (
        item.get("description")
        or item.get("summary")
        or row.get("statement")
        or row.get("summary")
        or f"Observed {entity_type} resource."
    )
    route_base = canonical_path or f"/catalog/resources/{entity_type}/{route_key}"
    route = f"{str(route_base).rstrip('/').rsplit('/', 1)[0]}/{quote(route_key, safe='-._~')}"
    observed_at = (
        row.get("observed_at")
        or item.get("observed_at")
        or row.get("updated_at")
        or item.get("updated_at")
        or row.get("published_at")
        or item.get("published_at")
    )
    source_url = (
        row.get("source_url")
        or item.get("source_url")
        or row.get("url")
        or item.get("url")
        or row.get("canonical_url")
        or item.get("canonical_url")
        or row.get("profile_url")
        or item.get("profile_url")
    )
    evidence = item.get("evidence")
    if not evidence:
        evidence_item = {
            "kind": "source" if source_url else "catalog.entity",
            "observed_at": observed_at,
        }
        if source_url:
            evidence_item["url"] = source_url
        evidence = [evidence_item]
    item |= {
        "id": row["id"],
        "kind": "resource",
        "resource_type": entity_type,
        "title": title,
        "display_name": title,
        "description": description,
        "route": route,
        "route_key": route_key,
        "observed_at": observed_at,
        "evidence": evidence or [],
    }
    return item


def public_resource_records(
    entity_records: Mapping[str, list[dict[str, Any]]],
    resource_types: set[str] | frozenset[str],
) -> list[dict[str, Any]]:
    """Project and deterministically order every registered typed resource."""

    records = [
        public_resource_record(entity_type, row)
        for entity_type, rows in entity_records.items()
        if entity_type in resource_types
        for row in rows
    ]
    return sorted(
        records,
        key=lambda item: (
            str(item.get("display_name") or "").casefold(),
            str(item["resource_type"]),
            str(item["id"]),
        ),
    )


__all__ = ["public_resource_record", "public_resource_records"]
