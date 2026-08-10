from __future__ import annotations

from pathlib import Path

import httpx
import pytest

from groupsum_catalog_api.app import build_app


@pytest.mark.anyio
async def test_records_are_created_before_snapshot_finalization(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    monkeypatch.setenv("GROUPSUM_CATALOG_INTERNAL_TOKEN", "test-token")
    app = build_app(tmp_path / "catalog.sqlite3", tmp_path / "metrics.duckdb")
    transport = httpx.ASGITransport(app=app)
    headers = {"Authorization": "Bearer test-token"}
    snapshot_id = "snapshot:test"
    entity = {
        "id": "groupsum",
        "slug": "groupsum",
        "name": "Groupsum",
        "summary": "Test organization",
        "website_url": "https://groupsum.xyz",
        "source_url": None,
        "observed_at": "2026-08-10T00:00:00Z",
    }
    observation = {
        "id": "observation:test",
        "snapshot_id": snapshot_id,
        "subject_type": "party.organization",
        "subject_id": "groupsum",
        "observation_type": "entity_presence",
        "source_kind": "test",
        "source_url": None,
        "status": "observed",
        "observed_at": "2026-08-10T00:00:00Z",
        "payload": {"entity_id": "groupsum"},
        "content_hash": "a" * 64,
        "confidence": "observed",
    }
    metric = {
        "measurement_id": "measurement:test",
        "snapshot_id": snapshot_id,
        "subject_type": "party.organization",
        "subject_id": "groupsum",
        "metric_key": "records",
        "numeric_value": 1,
        "text_value": None,
        "unit": "count",
        "dimensions": {},
        "period_start": None,
        "period_end": None,
        "source_url": None,
        "source_observation_id": "observation:test",
        "observed_at": "2026-08-10T00:00:00Z",
    }
    snapshot = {
        "snapshot_id": snapshot_id,
        "schema_version": "1.0.0",
        "collected_at": "2026-08-10T00:00:00Z",
        "collector_version": "test",
        "source_digest": "b" * 64,
        "parent_snapshot_id": None,
        "completeness": {},
        "observation_count": 1,
        "measurement_count": 1,
        "error_count": 0,
    }

    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        unauthorized = await client.post(
            "/internal/v1/catalog/entities/party.organization",
            json={"snapshot_id": snapshot_id, "records": [entity]},
        )
        assert unauthorized.status_code == 401

        premature = await client.post(
            "/internal/v1/catalog/snapshots", headers=headers, json=snapshot
        )
        assert premature.status_code == 409

        entity_response = await client.post(
            "/internal/v1/catalog/entities/party.organization",
            headers=headers,
            json={"snapshot_id": snapshot_id, "records": [entity]},
        )
        assert entity_response.status_code == 200, entity_response.text
        assert entity_response.json()["created"] + entity_response.json()["existing"] == 1

        for path, record in (
            ("/internal/v1/catalog/observations", observation),
            ("/internal/v1/catalog/metrics", metric),
        ):
            response = await client.post(
                path,
                headers=headers,
                json={"snapshot_id": snapshot_id, "records": [record]},
            )
            assert response.status_code == 200, response.text

        repeated_metric = await client.post(
            "/internal/v1/catalog/metrics",
            headers=headers,
            json={"snapshot_id": snapshot_id, "records": [metric]},
        )
        assert repeated_metric.status_code == 200
        assert repeated_metric.json()["existing"] == 1

        finalized = await client.post(
            "/internal/v1/catalog/snapshots", headers=headers, json=snapshot
        )
        assert finalized.status_code == 200, finalized.text
        assert finalized.json()["created"] + finalized.json()["existing"] == 1

        snapshots = await client.get("/api/v1/snapshots")
        assert snapshots.status_code == 200
        assert snapshots.json()["snapshots"][0]["snapshot_id"] == snapshot_id

        document = (await client.get("/openapi.json")).json()
        assert set(document["paths"]["/internal/v1/catalog/snapshots"]) == {"post"}
        assert set(document["paths"]["/internal/v1/catalog/entities/{entity_type}"]) == {
            "post"
        }
        assert not any(
            "delete" in methods for path, methods in document["paths"].items()
            if path.startswith("/internal/")
        )
