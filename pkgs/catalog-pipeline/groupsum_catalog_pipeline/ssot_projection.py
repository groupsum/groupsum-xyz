from __future__ import annotations

from typing import Any

SSOT_ENTITY_KEYS = (
    "adrs",
    "specs",
    "features",
    "tests",
    "claims",
    "evidence",
    "issues",
    "boundaries",
    "profiles",
    "risks",
    "releases",
    "scopes",
)

SSOT_PUBLIC_FIELDS = (
    "id",
    "status",
    "implementation_status",
    "title",
    "name",
    "statement",
    "number",
    "kind",
    "tier",
    "severity",
    "release_blocking",
    "frozen",
    "origin",
    "managed",
    "immutable",
    "package_version",
    "content_sha256",
    "version",
    "claim_tier",
)

SSOT_REFERENCE_TARGETS: dict[str, dict[str, str]] = {
    "adrs": {"supersedes": "adrs", "superseded_by": "adrs"},
    "specs": {"adr_ids": "adrs"},
    "features": {
        "spec_ids": "specs",
        "claim_ids": "claims",
        "test_ids": "tests",
        "requires": "features",
        "parent_feature_ids": "features",
        "replacement_feature_ids": "features",
    },
    "profiles": {"feature_ids": "features", "profile_ids": "profiles"},
    "tests": {
        "feature_ids": "features",
        "claim_ids": "claims",
        "evidence_ids": "evidence",
    },
    "claims": {
        "feature_ids": "features",
        "test_ids": "tests",
        "evidence_ids": "evidence",
        "depends_on_claim_ids": "claims",
    },
    "evidence": {"claim_ids": "claims", "test_ids": "tests"},
    "issues": {
        "feature_ids": "features",
        "claim_ids": "claims",
        "test_ids": "tests",
        "evidence_ids": "evidence",
        "risk_ids": "risks",
    },
    "risks": {
        "feature_ids": "features",
        "claim_ids": "claims",
        "test_ids": "tests",
        "evidence_ids": "evidence",
        "issue_ids": "issues",
    },
    "boundaries": {
        "feature_ids": "features",
        "profile_ids": "profiles",
        "test_ids": "tests",
        "evidence_ids": "evidence",
    },
    "releases": {
        "boundary_id": "boundaries",
        "boundary_ids": "boundaries",
        "claim_ids": "claims",
        "evidence_ids": "evidence",
    },
}


def _reference_values(value: object) -> list[str]:
    if isinstance(value, list):
        return [str(item) for item in value if item]
    return [str(value)] if value else []


def project_ssot_inventory(registry: dict[str, Any]) -> tuple[dict, dict, dict]:
    """Return the complete display-safe SSOT graph and explicit integrity diagnostics."""

    source_rows: dict[str, list[dict[str, Any]]] = {}
    identifiers: dict[str, set[str]] = {}
    for kind in SSOT_ENTITY_KEYS:
        values = registry.get(kind)
        rows = (
            [item for item in values if isinstance(item, dict) and item.get("id")]
            if isinstance(values, list)
            else []
        )
        source_rows[kind] = rows
        identifiers[kind] = {str(item["id"]) for item in rows}

    inventory: dict[str, list[dict[str, Any]]] = {}
    all_unresolved: list[dict[str, str]] = []
    reference_count = 0
    resolved_count = 0
    for kind in SSOT_ENTITY_KEYS:
        projected_rows = []
        reference_fields = SSOT_REFERENCE_TARGETS.get(kind, {})
        public_fields = (*SSOT_PUBLIC_FIELDS, *reference_fields)
        for item in source_rows[kind]:
            projected = {
                field: item[field]
                for field in public_fields
                if item.get(field) is not None
            }
            unresolved = []
            item_reference_count = 0
            item_resolved_count = 0
            for field, target_kind in reference_fields.items():
                for target_id in _reference_values(item.get(field)):
                    item_reference_count += 1
                    reference_count += 1
                    if target_id in identifiers[target_kind]:
                        item_resolved_count += 1
                        resolved_count += 1
                        continue
                    diagnostic = {
                        "field": field,
                        "target_kind": target_kind,
                        "target_id": target_id,
                    }
                    unresolved.append(diagnostic)
                    all_unresolved.append(
                        {
                            "source_kind": kind,
                            "source_id": str(item["id"]),
                            **diagnostic,
                        }
                    )
            projected["relationship_integrity"] = {
                "reference_count": item_reference_count,
                "resolved_reference_count": item_resolved_count,
                "unresolved_reference_count": len(unresolved),
                "unresolved_references": unresolved,
            }
            projected_rows.append(projected)
        inventory[kind] = projected_rows

    diagnostic_limit = 100
    integrity = {
        "reference_count": reference_count,
        "resolved_reference_count": resolved_count,
        "unresolved_reference_count": len(all_unresolved),
        "unresolved_references": all_unresolved[:diagnostic_limit],
        "unresolved_references_omitted": max(0, len(all_unresolved) - diagnostic_limit),
        "relationship_closed": not all_unresolved,
    }
    return inventory, {kind: 0 for kind in SSOT_ENTITY_KEYS}, integrity


__all__ = [
    "SSOT_ENTITY_KEYS",
    "SSOT_PUBLIC_FIELDS",
    "SSOT_REFERENCE_TARGETS",
    "project_ssot_inventory",
]
