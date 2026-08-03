from __future__ import annotations

from pathlib import Path

import httpx
import pytest

from groupsum_catalog_api.app import build_app
from groupsum_catalog_api.importer import connect, import_catalog


@pytest.mark.anyio
async def test_health_and_openapi(tmp_path: Path) -> None:
    app = build_app(tmp_path / "catalog.sqlite3")
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        health = await client.get("/healthz")
        assert health.status_code == 200
        assert health.json() == {"status": "ok", "database": "sqlite", "schema_tables": 28}
        assert health.headers["cache-control"] == "no-store"

        openapi = await client.get("/openapi.json")
        assert openapi.status_code == 200
        assert openapi.json()["info"]["title"] == "Groupsum Catalog API"
        assert "/record" in openapi.json()["paths"]
        assert "/package" in openapi.json()["paths"]
        assert "/recordpackage" in openapi.json()["paths"]
        assert "/repositorycontributor" in openapi.json()["paths"]
        assert "/api/v1/products/{slug}" in openapi.json()["paths"]
        assert "/api/v1/repository-metrics" in openapi.json()["paths"]
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
    assert counts["repositories"] == 68
    assert counts["packages"] == 1_124
    assert counts["releases"] > 17_000
    assert counts["dependencies"] > 8_000
    assert import_catalog(database_path, repo_root) == counts
    with connect(database_path) as connection:
        release_count = connection.execute("SELECT COUNT(*) FROM releases").fetchone()[0]
        dependency_count = connection.execute("SELECT COUNT(*) FROM dependencies").fetchone()[0]
        assert release_count == counts["releases"]
        assert dependency_count == counts["dependencies"]
        assert connection.execute(
            "SELECT COUNT(*) FROM repository_contributors"
        ).fetchone()[0] >= 40
        assert connection.execute(
            "SELECT COUNT(*) FROM metric_observations WHERE metric = 'commits_daily'"
        ).fetchone()[0] == counts["repositories"] * 30

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
        assert all("release_count" in package for package in model["implementation"]["packages"])
        assert "dependency_summary" in model["implementation"]
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

        tigrbl = await client.get("/api/v1/products/tigrbl")
        assert tigrbl.status_code == 200
        tigrbl_model = tigrbl.json()
        assert len(tigrbl_model["implementation"]["repositories"]) == 4
        release_kinds = {
            item["release_kind"]
            for item in tigrbl_model["implementation"]["release_summary"]
        }
        assert release_kinds >= {
            "crates",
            "github",
            "npm",
            "pypi",
        }
        assert tigrbl_model["implementation"]["dependency_summary"]["dependencies"] > 500
        assert tigrbl_model["implementation"]["dependency_summary"]["dependents"] > 100
        assert len(tigrbl_model["implementation"]["releases"]) == 100
        signals = tigrbl_model["implementation"]["signals"]
        assert signals["repository_count"] == 4
        assert signals["metrics"]["stars"] == 4
        assert signals["metrics"]["contributors"] == 2
        assert len(signals["history"]["stars"]) >= 1
        assert len(signals["commit_activity"]) == 30
        assert all(
            len(repository["commit_activity"]) == 30
            for repository in tigrbl_model["implementation"]["repositories"]
        )

        repository_metrics = await client.get("/api/v1/repository-metrics?owner=tigrbl")
        assert repository_metrics.status_code == 200
        repository_metric_model = repository_metrics.json()
        assert repository_metric_model["owner"] == "tigrbl"
        assert repository_metric_model["count"] >= 10
        assert all(
            len(repository["commit_activity"]) == 30
            for repository in repository_metric_model["repositories"]
        )
        assert repository_metrics.headers["etag"]

        portfolio = await client.get("/api/v1/portfolio")
        assert portfolio.status_code == 200
        assert portfolio.json()["count"] >= 40
        generated = await client.get("/api/v1/portfolio/catalog-groupsum-groupsum-xyz")
        assert generated.status_code == 200
        generated_model = generated.json()
        assert generated_model["record"]["content"]["generated_from"] == "public-catalog"
        assert generated_model["implementation"]["repositories"][0]["name"] == "groupsum-xyz"
