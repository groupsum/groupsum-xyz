from __future__ import annotations

from datetime import UTC, datetime
from pathlib import Path

import httpx
import pytest

from groupsum_catalog_api.app import build_app
from groupsum_catalog_api.public_api import _binding_parameters
from groupsum_catalog_api.record_compiler import RecordAccumulator, _import_repositories
from groupsum_catalog_api.tables.association import Association
from groupsum_catalog_api.tables.resources.documentation.collection import (
    DocumentationCollection,
)
from groupsum_catalog_api.tables.resources.governance.boundary import GovernanceBoundary
from groupsum_catalog_api.tables.resources.governance.feature import GovernanceFeature


def test_compiler_materializes_ssot_reference_edges() -> None:
    collector = RecordAccumulator()
    observed_at = datetime(2026, 8, 11, tzinfo=UTC)
    _import_repositories(
        collector,
        [
            {
                "id": "repository:test/example",
                "owner": "test",
                "name": "example",
                "full_name": "test/example",
                "url": "https://github.com/test/example",
                "ssot_governance": {
                    "present": True,
                    "valid": True,
                    "registry_url": "https://github.com/test/example/blob/main/.ssot/registry.json",
                    "source_sha256": "a" * 64,
                    "schema_version": "0.8.0",
                    "observed_at": "2026-08-11T00:00:00Z",
                    "inventory": {
                        "features": [{"id": "feat:public", "title": "Public feature"}],
                        "boundaries": [
                            {
                                "id": "bnd:public",
                                "title": "Public boundary",
                                "feature_ids": ["feat:public"],
                            }
                        ],
                    },
                },
            }
        ],
        set(),
        observed_at,
    )

    edges = list(collector.records[Association].values())
    boundary_edge = next(edge for edge in edges if edge.relationship_type == "boundary_for")
    assert boundary_edge.source_type == GovernanceBoundary.ENTITY_TYPE
    assert boundary_edge.target_type == GovernanceFeature.ENTITY_TYPE
    assert boundary_edge.role == "feature_ids"


def test_binding_parameters_decode_existing_tigrbl_path_parameters() -> None:
    params = _binding_parameters(
        {
            "path_params": {
                "resource_type": "governance.boundary",
                "route_key": "ssot-item%3Aboundary-test",
            }
        },
        "/api/v1/catalog/resources/{resource_type}/{route_key}",
    )

    assert params["route_key"] == "ssot-item:boundary-test"


@pytest.mark.anyio
async def test_resource_collection_routes_round_trip_encoded_primary_keys(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    monkeypatch.setenv("GROUPSUM_CATALOG_INTERNAL_TOKEN", "test-token")
    app = build_app(tmp_path / "catalog.sqlite3", tmp_path / "metrics.duckdb")
    transport = httpx.ASGITransport(app=app)
    headers = {"Authorization": "Bearer test-token"}
    records = {
        GovernanceBoundary.ENTITY_TYPE: {
            "id": "ssot-item:boundary-test",
            "source_key": "boundary:test",
            "title": "Boundary test",
            "payload": {},
        },
        DocumentationCollection.ENTITY_TYPE: {
            "id": "resource:documentation-test",
            "title": "Documentation test",
            "url": "https://example.com/docs",
            "canonical_path": None,
            "reachability": "unverified",
        },
    }

    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        for resource_type, record in records.items():
            published = await client.post(
                f"/internal/v1/catalog/entities/{resource_type}",
                headers=headers,
                json={"snapshot_id": "snapshot:resource-route-test", "records": [record]},
            )
            assert published.status_code == 200, published.text

            collection = (
                await client.get(
                    "/api/v1/catalog/resources",
                    params={"resource_type": resource_type},
                )
            ).json()
            member = collection["records"][0]
            encoded_route_key = member["route_key"].replace(":", "%3A")
            assert member["route"] == (f"/catalog/resources/{resource_type}/{member['route_key']}")

            detail = await client.get(
                f"/api/v1/catalog/resources/{resource_type}/{encoded_route_key}"
            )
            assert detail.status_code == 200, detail.text
            assert detail.json()["item"]["id"] == record["id"]


@pytest.mark.anyio
async def test_governance_detail_exposes_navigable_existing_associations(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    monkeypatch.setenv("GROUPSUM_CATALOG_INTERNAL_TOKEN", "test-token")
    app = build_app(tmp_path / "catalog.sqlite3", tmp_path / "metrics.duckdb")
    transport = httpx.ASGITransport(app=app)
    headers = {"Authorization": "Bearer test-token"}
    boundary_id = "ssot-item:boundary-detail"
    feature_id = "ssot-item:feature-detail"

    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        for entity_type, record in (
            (
                GovernanceBoundary.ENTITY_TYPE,
                {
                    "id": boundary_id,
                    "source_key": "bnd:detail",
                    "title": "Public boundary",
                    "status": "frozen",
                    "payload": {"id": "bnd:detail", "frozen": True},
                },
            ),
            (
                GovernanceFeature.ENTITY_TYPE,
                {
                    "id": feature_id,
                    "source_key": "feat:detail",
                    "title": "Public feature",
                    "implementation_status": "implemented",
                    "payload": {"id": "feat:detail"},
                },
            ),
        ):
            response = await client.post(
                f"/internal/v1/catalog/entities/{entity_type}",
                headers=headers,
                json={"snapshot_id": "snapshot:ssot-detail", "records": [record]},
            )
            assert response.status_code == 200, response.text

        edge = {
            "id": "association:ssot-boundary-feature",
            "source_type": GovernanceBoundary.ENTITY_TYPE,
            "source_id": boundary_id,
            "relationship_type": "boundary_for",
            "target_type": GovernanceFeature.ENTITY_TYPE,
            "target_id": feature_id,
            "role": "feature_ids",
            "sort_order": 0,
            "attributes": None,
            "observed_at": "2026-08-11T00:00:00Z",
        }
        response = await client.post(
            "/internal/v1/catalog/associations",
            headers=headers,
            json={"snapshot_id": "snapshot:ssot-detail", "records": [edge]},
        )
        assert response.status_code == 200, response.text

        detail = await client.get(
            f"/api/v1/catalog/resources/{GovernanceBoundary.ENTITY_TYPE}/{boundary_id}"
        )

    assert detail.status_code == 200, detail.text
    model = detail.json()
    assert model["implementation"] == {
        "relationship_count": 1,
        "outgoing_count": 1,
        "incoming_count": 0,
    }
    assert model["graph"]["outgoing"][0]["name"] == "Public feature"
    assert model["graph"]["outgoing"][0]["route"].endswith(feature_id)
    assert model["linked_sections"][0]["members"][0]["relationship"] == "boundary_for"
