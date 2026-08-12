SSOT_RELATIONSHIPS: dict[str, dict[str, tuple[str, str, bool]]] = {
    "adrs": {
        "supersedes": ("adrs", "supersedes", False),
        "superseded_by": ("adrs", "supersedes", True),
    },
    "specs": {"adr_ids": ("adrs", "derived_from", False)},
    "features": {
        "spec_ids": ("specs", "implements_spec", False),
        "claim_ids": ("claims", "asserts_claim", False),
        "test_ids": ("tests", "tests", True),
        "requires": ("features", "depends_on", False),
        "parent_feature_ids": ("features", "has_component", True),
        "replacement_feature_ids": ("features", "replaces", True),
    },
    "profiles": {
        "feature_ids": ("features", "profiles", False),
        "profile_ids": ("profiles", "includes", False),
    },
    "tests": {
        "feature_ids": ("features", "tests", False),
        "claim_ids": ("claims", "verifies", False),
        "evidence_ids": ("evidence", "produces", False),
    },
    "claims": {
        "feature_ids": ("features", "applies_to", False),
        "test_ids": ("tests", "verifies", True),
        "evidence_ids": ("evidence", "claim_has_evidence", False),
        "depends_on_claim_ids": ("claims", "depends_on", False),
    },
    "evidence": {
        "claim_ids": ("claims", "claim_has_evidence", True),
        "test_ids": ("tests", "produces", True),
    },
    "issues": {
        "feature_ids": ("features", "applies_to", False),
        "claim_ids": ("claims", "applies_to", False),
        "test_ids": ("tests", "applies_to", False),
        "evidence_ids": ("evidence", "applies_to", False),
        "risk_ids": ("risks", "references", False),
    },
    "risks": {
        "feature_ids": ("features", "applies_to", False),
        "claim_ids": ("claims", "applies_to", False),
        "test_ids": ("tests", "applies_to", False),
        "evidence_ids": ("evidence", "applies_to", False),
        "issue_ids": ("issues", "references", False),
    },
    "boundaries": {
        "feature_ids": ("features", "boundary_for", False),
        "profile_ids": ("profiles", "includes", False),
        "test_ids": ("tests", "covers", False),
        "evidence_ids": ("evidence", "covers", False),
    },
    "releases": {
        "boundary_id": ("boundaries", "covers", False),
        "boundary_ids": ("boundaries", "covers", False),
        "claim_ids": ("claims", "includes", False),
        "evidence_ids": ("evidence", "includes", False),
    },
}


def reference_values(value: object) -> list[str]:
    if isinstance(value, list):
        return [str(item) for item in value if item]
    return [str(value)] if value else []
