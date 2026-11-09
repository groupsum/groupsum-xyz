from __future__ import annotations

import base64
import hashlib
import json
from datetime import UTC, datetime
from types import SimpleNamespace

import httpx
import pytest
from sqlalchemy import create_engine, update
from sqlalchemy.orm import Session

from groupsum_catalog_api.app import build_app
from groupsum_catalog_api.projections.read_models import (
    build_read_models,
    project,
    valid_read_models,
)
from groupsum_catalog_api.snapshot_finalization import _validate_source
from groupsum_catalog_api.snapshot_reads import _bundles, _responses, public_projection
from groupsum_catalog_api.tables.catalog_snapshot import CatalogSnapshot
from groupsum_catalog_api.tables.catalog_snapshot_source import CatalogSnapshotSource
from groupsum_catalog_api.tables.repository import Repository


def fixture_models(name="original"):
    packages = [
        {
            "id": "p",
            "name": name,
            "ecosystem": "pypi",
            "repository": "fixture/repo",
            "route_key": "actual-route",
            "route": "/catalog/packages/pypi/actual-route",
            "published": True,
            "dependencies": [],
            "dependents": [],
        }
    ]
    repos = [
        {
            "id": "r",
            "full_name": "fixture/repo",
            "owner": "fixture",
            "name": "repo",
            "route": "/catalog/repositories/fixture/repo",
            "package_ids": ["p"],
            "ssot_governance": {"governed": True, "inventory": {"claims": [{"id": "claim"}]}},
        }
    ]
    return build_read_models(repos, packages, [], [])


def seed(session, identifier, models, current=True, complete=True, at=None):
    content = json.dumps({"_public_read_model": models}, sort_keys=True).encode()
    digest = hashlib.sha256(content).hexdigest()
    now = at or datetime.now(UTC)
    session.add(
        CatalogSnapshot(
            id=identifier,
            collected_at=now,
            completed_at=now if complete else None,
            status="complete" if complete else "pending",
            source_digest=digest,
            is_current=current,
            completeness={"public_projection_version": "1"},
        )
    )
    session.add(
        CatalogSnapshotSource(
            id=identifier,
            snapshot_id=identifier,
            source_digest=digest,
            chunk_index=0,
            chunk_count=1,
            byte_count=len(content),
            content_sha256=digest,
            content_base64=base64.b64encode(content).decode(),
            observed_at=now,
        )
    )
    session.commit()


def test_read_models_remove_duplicate_inventories_and_preserve_collection_totals():
    models = fixture_models()
    assert valid_read_models(models)
    assert not valid_read_models({"version": "1"})
    assert not valid_read_models(None)
    detail = project(models, "catalog_repository", {"owner": "fixture", "repository": "repo"})
    assert "ssot_governance" not in detail["item"] and "governance" not in detail["item"]
    assert detail["governance"]["inventory"]["claims"][0]["id"] == "claim"
    result = project(models, "catalog_repositories", {"page_size": "1"})
    assert result["aggregates"]["contained_packages"] == 1
    assert result["aggregates"]["ssot_governed"] == 1
    assert result["records"][0]["package_summary"]["total"] == 1
    assert project(models, "catalog_packages", {})["count"] == 1


@pytest.mark.anyio
async def test_snapshot_cache_does_not_read_mutated_live_rows(tmp_path):
    engine = create_engine(f"sqlite:///{tmp_path / 'cache.sqlite'}")
    for table in (CatalogSnapshot, CatalogSnapshotSource, Repository):
        table.__table__.create(engine)
    _bundles.clear()
    _responses.clear()
    with Session(engine) as session:
        seed(session, "snapshot:one", fixture_models())
        args = {"route_key": "actual-route", "snapshot_id": "snapshot:one"}
        first = await public_projection(session, "catalog_package", args)
        session.add(
            Repository(
                id="new-live-row",
                provider="github",
                owner="different",
                name="different",
                url="https://example.invalid",
            )
        )
        session.commit()
        second = await public_projection(session, "catalog_package", args)
        assert first.body == second.body
        assert second.headers.get("x-catalog-cache") == "HIT"
        assert json.loads(second.body)["item"]["name"] == "original"
        etag = second.headers.get("etag")
        conditional = await public_projection(
            session, "catalog_package", args, {"if-none-match": etag}
        )
        assert conditional.status_code == 304 and conditional.body == b""
        session.execute(update(CatalogSnapshot).values(is_current=False))
        session.commit()
        seed(session, "snapshot:two", fixture_models("new"))
        assert (
            json.loads(
                (
                    await public_projection(
                        session, "catalog_package", {"route_key": "actual-route"}
                    )
                ).body
            )["item"]["name"]
            == "new"
        )
        assert (
            json.loads((await public_projection(session, "catalog_package", args)).body)["item"][
                "name"
            ]
            == "original"
        )


@pytest.mark.anyio
async def test_actual_http_snapshot_pinning_headers_304_and_legacy_fallback(tmp_path):
    _bundles.clear()
    _responses.clear()
    database = tmp_path / "http.sqlite"
    app = build_app(database, tmp_path / "metrics.duckdb")
    with Session(create_engine(f"sqlite:///{database}")) as session:
        seed(session, "snapshot:verified", fixture_models())
        seed(session, "snapshot:pending", fixture_models("pending"), current=False, complete=False)
    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app), base_url="http://test"
    ) as client:
        path = "/api/v1/catalog/packages/actual-route?snapshot_id=snapshot%3Averified"
        first = await client.get(path)
        assert first.status_code == 200, first.text
        assert first.headers["x-catalog-snapshot"] == "snapshot:verified"
        assert "immutable" in first.headers["cache-control"]
        conditional = await client.get(
            path, headers={"If-None-Match": first.headers["etag"], "Accept-Encoding": "gzip"}
        )
        assert conditional.status_code == 304, conditional.text
        assert (await client.get(path.replace("verified", "pending"))).status_code == 404
        assert (await client.get(path.replace("verified", "absent"))).status_code == 404
        version = await client.get("/api/v1/catalog/version")
        assert version.json()["public_projection_available"] is True
        assert "max-age=15" in version.headers["cache-control"]
        private = await client.get(path, headers={"Authorization": "Bearer example"})
        assert private.headers["cache-control"] == "private, no-store"
        incompatible = await client.get(path + "&projection_version=unsupported")
        assert incompatible.status_code == 409
        assert incompatible.headers["cache-control"] == "no-store"
        assert (await client.get("/healthz")).headers["cache-control"] == "no-store"
        assert (await client.get(path + "&q=unrelated")).headers["etag"] == first.headers["etag"]


@pytest.mark.anyio
async def test_legacy_snapshot_pins_fail_closed_and_corrupt_bundles_are_not_cached(tmp_path):
    engine = create_engine(f"sqlite:///{tmp_path / 'legacy.sqlite'}")
    for table in (CatalogSnapshot, CatalogSnapshotSource):
        table.__table__.create(engine)
    _bundles.clear()
    with Session(engine) as session:
        seed(session, "legacy", fixture_models())
        session.execute(update(CatalogSnapshot).values(completeness={}))
        session.commit()
        assert await public_projection(session, "catalog_packages", {}) is None
        pinned = await public_projection(session, "catalog_packages", {"snapshot_id": "legacy"})
        assert pinned.status_code == 409 and pinned.headers.get("cache-control") == "no-store"
        session.execute(
            update(CatalogSnapshot).values(completeness={"public_projection_version": "1"})
        )
        session.execute(
            update(CatalogSnapshotSource).values(
                content_base64=base64.b64encode(b"broken").decode()
            )
        )
        session.commit()
        with pytest.raises(ValueError, match="chunk"):
            await public_projection(session, "catalog_packages", {"snapshot_id": "legacy"})
        assert not _bundles


@pytest.mark.anyio
async def test_pinned_repository_page_reads_only_finalized_star_history(tmp_path, monkeypatch):
    monkeypatch.setenv("GROUPSUM_CATALOG_INTERNAL_TOKEN", "test-token")
    _responses.clear()
    database = tmp_path / "catalog.sqlite"
    app = build_app(database, tmp_path / "metrics.duckdb")
    headers = {"Authorization": "Bearer test-token"}

    def measurement(snapshot, day, value):
        return {
            "measurement_id": f"{snapshot}:stars",
            "snapshot_id": snapshot,
            "subject_type": "source.repository",
            "subject_id": "r",
            "metric_key": "stars",
            "numeric_value": value,
            "unit": "count",
            "observed_at": f"2026-11-{day:02}T00:00:00Z",
        }

    async with httpx.AsyncClient(
        transport=httpx.ASGITransport(app=app), base_url="http://test"
    ) as client:

        async def publish(row):
            return await client.post(
                "/internal/v1/catalog/metrics",
                headers=headers,
                json={
                    "snapshot_id": row["snapshot_id"],
                    "records": [row],
                },
            )

        rows = [
            measurement("old", 1, 0),
            measurement("selected", 2, 3),
            measurement("newer", 2, 8),
            measurement("pending", 1, 9),
        ]
        for row in rows:
            response = await publish(row)
            assert response.status_code == 200, response.text
        with Session(create_engine(f"sqlite:///{database}")) as session:
            for index, row in enumerate(rows, start=1):
                identifier = row["snapshot_id"]
                seed(
                    session,
                    identifier,
                    fixture_models(identifier),
                    current=identifier == "newer",
                    complete=identifier != "pending",
                    at=datetime(2026, 11, index, tzinfo=UTC),
                )

        plain = await client.get("/api/v1/catalog/repositories?snapshot_id=selected")
        assert plain.json()["records"][0]["history"]["stars"] == []
        path = "/api/v1/catalog/repositories?snapshot_id=selected&star_history=1"
        enriched = await client.get(path)
        assert enriched.status_code == 200, enriched.text
        assert enriched.headers["x-catalog-snapshot"] == "selected"
        assert enriched.json()["records"][0]["history"]["stars"] == [
            {"observed_at": "2026-11-01T00:00:00+00:00", "value": 0.0},
            {"observed_at": "2026-11-02T00:00:00+00:00", "value": 3.0},
        ]
        warm = await client.get(path, headers={"If-None-Match": enriched.headers["etag"]})
        assert warm.status_code == 304 and warm.headers["x-catalog-cache"] == "HIT"
        assert (await publish(rows[1])).status_code == 200
        assert (await publish({**rows[1], "measurement_id": "late"})).status_code == 409


@pytest.mark.anyio
async def test_finalizer_rejects_advertised_but_incomplete_public_projection(tmp_path):
    database = tmp_path / "incomplete.sqlite"
    build_app(database, tmp_path / "incomplete.duckdb")
    with Session(create_engine(f"sqlite:///{database}")) as session:
        seed(session, "incomplete", {"version": "1"})
        snapshot = session.get(CatalogSnapshot, "incomplete")
        body = SimpleNamespace(
            snapshot_id="incomplete",
            source_chunk_count=1,
            source_digest=snapshot.source_digest,
            completeness={"public_projection_version": "1"},
        )
    result = await _validate_source(body)
    assert result.status_code == 409
    assert "projection is incomplete" in json.loads(result.body)["detail"]
