from __future__ import annotations

from pathlib import Path

import httpx
import pytest

from groupsum_catalog_api.app import build_app
from groupsum_catalog_api.importer import import_catalog
from groupsum_catalog_api.tables.registry import ALL_TABLES


def test_every_public_table_exposes_exactly_read_and_list() -> None:
    assert len(ALL_TABLES) == 19
    for table in ALL_TABLES:
        assert {operation.target for operation in table.TABLE_PROFILE.ops} == {"read", "list"}


@pytest.mark.anyio
async def test_openapi_is_generated_from_tigrbl_tables(tmp_path: Path) -> None:
    app = build_app(tmp_path / "catalog.sqlite3", tmp_path / "metrics.duckdb")
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        health = await client.get("/healthz")
        assert health.status_code == 200
        assert health.json()["schema_tables"] == len(ALL_TABLES)

        document = (await client.get("/openapi.json")).json()
        paths = document["paths"]
        for table in ALL_TABLES:
            resource = table.__name__.lower()
            assert f"/{resource}" in paths
            assert f"/{resource}/{{item_id}}" in paths

        assert "/api/v1/catalog/repositories" not in paths
        assert "/api/v1/products" not in paths


@pytest.mark.anyio
async def test_importer_populates_native_table_resources(tmp_path: Path) -> None:
    repo_root = Path(__file__).resolve().parents[3]
    database = tmp_path / "catalog.sqlite3"
    app = build_app(database, tmp_path / "metrics.duckdb")
    counts = await import_catalog(database, repo_root)

    assert counts["products"] == 12
    assert counts["portfolios"] == 6
    assert counts["repositories"] >= 60
    assert counts["packages"] >= 1_000
    assert counts["resources"] > 0
    assert counts["technologies"] > 0

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        for resource in ("product", "portfolio", "repository", "package", "typedresource"):
            response = await client.get(f"/{resource}")
            assert response.status_code == 200
            assert response.json()

        product = await client.get("/product/groupsum-ssot-registry")
        assert product.status_code == 200
        assert product.json()["slug"] == "ssot-registry"

        typed_resources = (await client.get("/typedresource")).json()
        assert all("." in item["resource_type"] for item in typed_resources)
