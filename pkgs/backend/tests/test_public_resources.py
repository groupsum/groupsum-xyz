from groupsum_catalog_api.projections.public_resources import (
    public_resource_record,
    public_resource_records,
)


def test_public_resource_projection_is_shared_by_static_and_api_surfaces() -> None:
    row = {
        "id": "ssot-item:boundary-1",
        "source_key": "boundary-1",
        "title": "Admin boundary",
        "statement": "Administrators are isolated from public users.",
        "source_url": "https://example.test/.ssot/registry.json",
        "payload": {"id": "boundary-1", "status": "active"},
        "observed_at": "2026-08-12T00:00:00Z",
    }

    projected = public_resource_record("governance.boundary", row)

    assert projected["display_name"] == "Admin boundary"
    assert projected["description"] == row["statement"]
    assert projected["route_key"] == "ssot-item:boundary-1"
    assert projected["route"] == (
        "/catalog/resources/governance.boundary/ssot-item%3Aboundary-1"
    )


def test_public_resource_projection_covers_every_registered_input_type() -> None:
    records = public_resource_records(
        {
            "governance.claim": [
                {
                    "id": "claim:2",
                    "source_key": "claim-2",
                    "title": "Second",
                    "observed_at": "2026-08-12T00:00:00Z",
                }
            ],
            "governance.boundary": [
                {
                    "id": "boundary:1",
                    "source_key": "boundary-1",
                    "title": "First",
                    "observed_at": "2026-08-12T00:00:00Z",
                }
            ],
            "source.repository": [{"id": "repository:ignored"}],
        },
        frozenset({"governance.boundary", "governance.claim"}),
    )

    assert [record["display_name"] for record in records] == ["First", "Second"]
    assert {record["resource_type"] for record in records} == {
        "governance.boundary",
        "governance.claim",
    }
