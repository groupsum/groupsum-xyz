from __future__ import annotations

import hashlib
import json
from typing import Any

from ..database import Connection
from ..ontology import SSOT_RESOURCE_TYPES
from .graph_writer import GraphWriter


def project_ssot(
    connection: Connection,
    writer: GraphWriter,
    repository_entities: dict[str, str],
    ssot_registry_entities: dict[str, str],
) -> None:
    ssot_entities_by_registry_key: dict[tuple[str, str, str], str] = {}
    ssot_inventory_items: list[dict[str, Any]] = []
    for row in connection.execute("SELECT * FROM repository_ssot_inventory").fetchall():
        item = dict(row)
        resource_type = SSOT_RESOURCE_TYPES.get(str(item["entity_kind"]))
        registry_entity = ssot_registry_entities.get(str(item["registry_id"]))
        if not resource_type or not registry_entity:
            continue
        if isinstance(item.get("payload"), str):
            item["payload"] = json.loads(item["payload"])
        ssot_inventory_items.append(item)
        route_key = hashlib.sha256(str(item["id"]).encode()).hexdigest()[:20]
        title = str(item.get("title") or item.get("entity_id") or resource_type)
        entity_id = writer.entity(
            "repository_ssot_inventory",
            item["id"],
            resource_type,
            route_key,
            title,
            canonical_url=f"https://groupsum.xyz/catalog/resources/{resource_type}/{route_key}",
            maturity=item.get("implementation_status") or item.get("status"),
            source_url=connection.execute(
                "SELECT registry_url FROM repository_ssot_registries WHERE id = ?",
                (item["registry_id"],),
            ).fetchone()[0],
        )
        ssot_entities_by_registry_key[
            (str(item["registry_id"]), str(item["entity_kind"]), str(item["entity_id"]))
        ] = entity_id
        writer.link(
            registry_entity,
            entity_id,
            "declares",
            origin_kind="ssot_registry",
            ssot_entity_id=item["id"],
        )
        repository_id_row = connection.execute(
            "SELECT repository_id FROM repository_ssot_registries WHERE id = ?",
            (item["registry_id"],),
        ).fetchone()
        if repository_id_row and str(repository_id_row[0]) in repository_entities:
            writer.link(
                repository_entities[str(repository_id_row[0])],
                entity_id,
                "contains",
                origin_kind="ssot_registry",
                ssot_entity_id=item["id"],
            )

    reference_rules = {
        "evidence_ids": ("evidence", "claim_has_evidence", "forward"),
        "test_ids": ("tests", "verifies", "reverse"),
        "claim_ids": ("claims", "references", "forward"),
        "feature_ids": ("features", "references", "forward"),
        "spec_ids": ("specs", "implements_spec", "forward"),
        "adr_ids": ("adrs", "decides", "reverse"),
        "issue_ids": ("issues", "addresses", "reverse"),
        "boundary_ids": ("boundaries", "constrains", "reverse"),
        "profile_ids": ("profiles", "profiles", "reverse"),
        "release_ids": ("releases", "includes", "reverse"),
    }
    for item in ssot_inventory_items:
        source_entity = ssot_entities_by_registry_key.get(
            (str(item["registry_id"]), str(item["entity_kind"]), str(item["entity_id"]))
        )
        payload = item.get("payload") if isinstance(item.get("payload"), dict) else {}
        if source_entity is None:
            continue
        for field, (target_kind, default_relation, direction) in reference_rules.items():
            reference_ids = payload.get(field)
            if not isinstance(reference_ids, list):
                continue
            for reference_id in reference_ids:
                target_entity = ssot_entities_by_registry_key.get(
                    (str(item["registry_id"]), target_kind, str(reference_id))
                )
                if target_entity is None:
                    continue
                relationship_type = default_relation
                relationship_direction = direction
                if field == "claim_ids" and item["entity_kind"] == "evidence":
                    relationship_type, relationship_direction = "claim_has_evidence", "reverse"
                elif field == "claim_ids" and item["entity_kind"] == "tests":
                    relationship_type = "verifies"
                elif field == "feature_ids" and item["entity_kind"] == "tests":
                    relationship_type = "tests"
                elif field == "feature_ids" and item["entity_kind"] == "claims":
                    relationship_type, relationship_direction = "asserts_claim", "reverse"
                edge_source, edge_target = source_entity, target_entity
                if relationship_direction == "reverse":
                    edge_source, edge_target = edge_target, edge_source
                writer.link(
                    edge_source,
                    edge_target,
                    relationship_type,
                    origin_kind="ssot_registry",
                    ssot_entity_id=item["id"],
                )
