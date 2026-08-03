from __future__ import annotations

from pathlib import Path

import httpx
import pytest

from groupsum_catalog_api.app import build_app
from groupsum_catalog_api.importer import import_catalog


@pytest.mark.anyio
async def test_health_and_openapi(tmp_path: Path) -> None:
    app = build_app(tmp_path / "catalog.sqlite3")
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        health = await client.get("/healthz")
        assert health.status_code == 200
        assert health.json() == {"status": "ok", "database": "sqlite", "schema_tables": 27}
        assert health.headers["cache-control"] == "no-store"

        openapi = await client.get("/openapi.json")
        assert openapi.status_code == 200
        assert openapi.json()["info"]["title"] == "Groupsum Catalog API"
        assert "/record" in openapi.json()["paths"]
        assert "/package" in openapi.json()["paths"]
        assert "/recordpackage" in openapi.json()["paths"]
        assert "/api/v1/products/{slug}" in openapi.json()["paths"]
        operation_ids = {
            operation["operationId"]
            for path in ("/record", "/record/{item_id}")
            for operation in openapi.json()["paths"][path].values()
        }
        assert not any(
            operation_id.endswith((".create", ".update", ".replace", ".delete", ".clear"))
            for operation_id in operation_ids
        )
        assert "/observation" not in openapi.json()["paths"]


@pytest.mark.anyio
async def test_peagen_page_model_has_explicit_attachments(tmp_path: Path) -> None:
    repo_root = Path(__file__).resolve().parents[2]
    database_path = tmp_path / "catalog.sqlite3"
    app = build_app(database_path)
    counts = import_catalog(database_path, repo_root)
    assert counts["records"] >= 32
    assert import_catalog(database_path, repo_root) == counts

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/products/peagen")
        assert response.status_code == 200
        model = response.json()
        assert model["record"]["title"] == "Peagen"
        assert len(model["implementation"]["repositories"]) == 3
        assert len(model["implementation"]["packages"]) == 5
        assert len(model["implementation"]["resources"]) == 7
        assert model["implementation"]["repositories"][0]["name"] == "peagen-com"
        assert {package["role"] for package in model["implementation"]["packages"]} == {
            "documentation-support",
            "website-support",
        }
        assert any(
            limitation["description"].startswith("No public core implementation repository")
            for limitation in model["governance"]["limitations"]
        )
        assert response.headers["etag"]
        assert "stale-while-revalidate" in response.headers["cache-control"]

        unchanged = await client.get(
            "/api/v1/products/peagen",
            headers={"If-None-Match": response.headers["etag"]},
        )
        assert unchanged.status_code == 304
        assert unchanged.content == b""

        insights = await client.get("/api/v1/insights?page=1&page_size=20")
        assert insights.status_code == 200
        insight_model = insights.json()
        assert insight_model["page"] == 1
        assert insight_model["page_size"] == 20
        assert insight_model["total"] >= 2_000
        assert len(insight_model["records"]) <= 20

        organization = await client.get("/api/v1/organizations/swarmauri")
        assert organization.status_code == 200
        organization_model = organization.json()
        assert organization_model["organization"]["slug"] == "swarmauri"
        assert any(record["slug"] == "peagen" for record in organization_model["records"])
