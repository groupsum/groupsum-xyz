from groupsum_catalog_api.ontology import (
    RELATIONSHIP_TYPES,
    RESOURCE_TYPES,
    SSOT_RESOURCE_TYPES,
    normalize_legacy_resource_type,
)


def test_resource_types_are_single_leaf_classifications() -> None:
    assert RESOURCE_TYPES
    assert all(type_key.count(".") == 1 for type_key in RESOURCE_TYPES)
    assert all(
        definition.detail_schema_key == type_key for type_key, definition in RESOURCE_TYPES.items()
    )


def test_evidence_is_reserved_for_ssot_and_observations_are_not_resources() -> None:
    assert SSOT_RESOURCE_TYPES["evidence"] == "governance.evidence"
    assert "evidence" not in RESOURCE_TYPES
    assert not any(type_key.startswith("observation.") for type_key in RESOURCE_TYPES)


def test_non_addressable_source_paths_are_not_projected_as_resources() -> None:
    assert normalize_legacy_resource_type("api_source", "src/api") is None
    assert normalize_legacy_resource_type("ui", "src/components/Button.tsx") is None
    assert normalize_legacy_resource_type("documentation") == "documentation.collection"
    assert (
        normalize_legacy_resource_type(
            "api_definition", ".ssot/specs/SPEC-1027-openapi-baseline-public-full-json.yaml"
        )
        is None
    )


def test_relationship_vocabulary_has_no_ambiguous_related_edge() -> None:
    assert "related" not in RELATIONSHIP_TYPES
    assert "related_to" not in RELATIONSHIP_TYPES
    assert {"documents", "depends_on", "claim_has_evidence", "contains"} <= RELATIONSHIP_TYPES
