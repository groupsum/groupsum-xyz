from __future__ import annotations

from pathlib import Path

import httpx
import pytest

from groupsum_catalog_api.app import build_app
from groupsum_catalog_api.tables.resources.documentation.collection import (
    DocumentationCollection,
)
from groupsum_catalog_api.tables.resources.governance.boundary import GovernanceBoundary


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
            assert member["route"] == (
                f"/catalog/resources/{resource_type}/{member['route_key']}"
            )

            detail = await client.get(
                f"/api/v1/catalog/resources/{resource_type}/{encoded_route_key}"
            )
            assert detail.status_code == 200, detail.text
            assert detail.json()["item"]["id"] == record["id"]
