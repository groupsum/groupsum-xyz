from __future__ import annotations

from typing import Any

from ..database import Connection
from ..ontology import RELATIONSHIP_TYPES
from .common import catalog_entity_id, stable_id, upsert


class GraphWriter:
    def __init__(self, connection: Connection, generated_at: str) -> None:
        self.connection = connection
        self.generated_at = generated_at

    def entity(
        self,
        source_table: str,
        source_id: str,
        resource_type: str,
        slug: str,
        name: str,
        **metadata: Any,
    ) -> str:
        entity_id = catalog_entity_id(source_table, source_id)
        observed_at = metadata.get("observed_at") or self.generated_at
        canonical_url = metadata.get("canonical_url")
        upsert(
            self.connection,
            "catalog_entities",
            {
                "id": entity_id,
                "entity_type_id": resource_type,
                "organization_id": metadata.get("organization_id"),
                "slug": slug,
                "name": name,
                "summary": metadata.get("summary"),
                "canonical_url": canonical_url,
                "source_table": source_table,
                "source_id": source_id,
                "visibility": metadata.get("visibility", "public"),
                "maturity": metadata.get("maturity"),
                "observed_at": observed_at,
            },
        )
        urls = (
            ("canonical", canonical_url, "Canonical record", "catalog_projection"),
            ("source", metadata.get("source_url"), "Primary source", "collector_observation"),
        )
        for role, url, label, origin in urls:
            if not url:
                continue
            upsert(
                self.connection,
                "entity_urls",
                {
                    "id": stable_id("entity-url", entity_id, role, url),
                    "entity_id": entity_id,
                    "url_role": role,
                    "url": url,
                    "label": label,
                    "evidence_type": origin,
                    "origin_kind": origin,
                    "observation_id": None,
                    "observed_at": observed_at,
                },
            )
        if canonical_url:
            upsert(
                self.connection,
                "entity_aliases",
                {
                    "id": stable_id("entity-alias", entity_id, "route", canonical_url),
                    "entity_id": entity_id,
                    "alias_kind": "route",
                    "alias": canonical_url,
                },
            )
        return entity_id

    def link(
        self,
        source: str,
        target: str,
        relationship_type: str,
        **metadata: Any,
    ) -> None:
        if relationship_type not in RELATIONSHIP_TYPES:
            raise ValueError(f"Unregistered resource relationship: {relationship_type}")
        role = metadata.get("role")
        origin = metadata["origin_kind"]
        upsert(
            self.connection,
            "entity_relationships",
            {
                "id": stable_id(
                    "entity-relationship", source, target, relationship_type, role or ""
                ),
                "source_entity_id": source,
                "target_entity_id": target,
                "relationship_type": relationship_type,
                "role": role,
                "evidence_type": origin,
                "origin_kind": origin,
                "observation_id": metadata.get("observation_id"),
                "ssot_entity_id": metadata.get("ssot_entity_id"),
                "source_url": metadata.get("source_url"),
                "confidence": metadata.get("confidence", "observed"),
                "status": "active",
                "observed_at": metadata.get("observed_at") or self.generated_at,
            },
        )
