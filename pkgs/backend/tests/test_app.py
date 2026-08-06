from __future__ import annotations

import json
from pathlib import Path

import httpx
import pytest

from groupsum_catalog_api.analytics import connect_analytics, default_analytics_path
from groupsum_catalog_api.app import build_app
from groupsum_catalog_api.importer import canonical_package_id, connect, import_catalog


def test_package_identity_reuses_persisted_route_key(tmp_path: Path) -> None:
    database_path = tmp_path / "catalog.sqlite3"
    build_app(database_path)
    with connect(database_path) as connection:
        connection.execute(
            """
            INSERT INTO packages (
                id, ecosystem, name, registry_url, package_kind, private, route_key
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                "legacy:package:id",
                "npm",
                "legacy-editor-name",
                "https://www.npmjs.com/package/legacy-editor-name",
                "published-package",
                False,
                "mdwrk-example-editor-basic-8e46b996",
            ),
        )
        connection.execute(
            """
            INSERT INTO packages (
                id, ecosystem, name, registry_url, package_kind, private
            ) VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                "new:package:id",
                "npm",
                "@mdwrk/example-editor-basic",
                "https://www.npmjs.com/package/@mdwrk/example-editor-basic",
                "published-package",
                False,
            ),
        )
        assert (
            canonical_package_id(
                connection,
                "new:package:id",
                "npm",
                "@mdwrk/example-editor-basic",
                "mdwrk-example-editor-basic-8e46b996",
            )
            == "legacy:package:id"
        )


@pytest.mark.anyio
async def test_health_and_openapi(tmp_path: Path) -> None:
    app = build_app(tmp_path / "catalog.sqlite3")
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        health = await client.get("/healthz")
        assert health.status_code == 200
        assert health.json()["status"] == "ok"
        assert health.json()["database"] == "sqlite-test"
        assert health.json()["analytics"] == "duckdb"
        assert health.json()["schema_tables"] >= 41
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
        assert "/api/v1/entities" in openapi.json()["paths"]
        assert "/api/v1/entities/{entity_id}" in openapi.json()["paths"]
        assert "/api/v1/catalog" in openapi.json()["paths"]
        assert "/api/v1/catalog/repositories" in openapi.json()["paths"]
        assert "/api/v1/catalog/repositories/{owner}/{repository}" in openapi.json()["paths"]
        assert "/api/v1/catalog/packages" in openapi.json()["paths"]
        assert "/api/v1/catalog/resources" in openapi.json()["paths"]
        assert "/api/v1/catalog/technologies" in openapi.json()["paths"]
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
        assert "/evidence" not in openapi.json()["paths"]


@pytest.mark.anyio
async def test_peagen_page_model_has_explicit_attachments(tmp_path: Path) -> None:
    repo_root = Path(__file__).resolve().parents[3]
    database_path = tmp_path / "catalog.sqlite3"
    app = build_app(database_path)
    counts = await import_catalog(database_path, repo_root)
    assert counts["records"] >= 32
    assert counts["repositories"] >= 60
    assert counts["packages"] >= 1_000
    assert counts["releases"] > 17_000
    assert counts["dependencies"] > 8_000
    assert counts["entities"] > 1_700
    assert counts["entity_relationships"] > 1_000
    assert await import_catalog(database_path, repo_root) == counts
    with connect(database_path) as connection:
        release_count = connection.execute("SELECT COUNT(*) FROM releases").fetchone()[0]
        dependency_count = connection.execute("SELECT COUNT(*) FROM dependencies").fetchone()[0]
        assert release_count == counts["releases"]
        assert dependency_count == counts["dependencies"]
        assert (
            connection.execute("SELECT COUNT(*) FROM repository_contributors").fetchone()[0] >= 40
        )
        assert (
            connection.execute(
                "SELECT COUNT(*) FROM observations WHERE evidence_type IS NOT NULL"
            ).fetchone()[0]
            == 0
        )
    with connect_analytics(default_analytics_path(database_path), read_only=True) as analytics:
        assert (
            analytics.execute(
                "SELECT COUNT(*) FROM metric_observations WHERE metric = 'commits_daily'"
            ).fetchone()[0]
            == counts["repositories"] * 30
        )
        assert analytics.execute("SELECT COUNT(*) FROM record_aggregates").fetchone()[0] == 0
        assert (
            analytics.execute(
                "SELECT COUNT(*) FROM metric_observations WHERE subject_kind = 'record'"
            ).fetchone()[0]
            == 0
        )

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/products/peagen")
        assert response.status_code == 200, response.text
        model = response.json()
        assert model["record"]["title"] == "Peagen"
        assert model["graph"]["entity"]["type_label"] == "Product"
        assert model["graph"]["owner"]["name"] == "Swarmauri"
        assert model["graph"]["owner"]["relationship_type"] == "owned_by"
        assert any(
            relation["relationship_type"] == "documents"
            for relation in model["graph"]["relationships"]
        )
        assert len(model["implementation"]["repositories"]) == 3
        assert len(model["implementation"]["packages"]) == 5
        assert len(model["implementation"]["resources"]) == 7
        assert model["implementation"]["repositories"][0]["name"] == "peagen-com"
        assert {package["role"] for package in model["implementation"]["packages"]} == {
            "documentation-support",
            "website-support",
        }
        assert all("release_count" in package for package in model["implementation"]["packages"])
        assert "dependency_summary" not in model["implementation"]
        assert "signals" not in model["implementation"]
        assert "releases" not in model["implementation"]
        assert all(
            "dependencies" in package
            and "dependents" in package
            and "dependency_summary" in package
            and "dependent_summary" in package
            and "repositories" in package
            for package in model["implementation"]["packages"]
        )
        peagen_dependency_groups = {
            (package["ecosystem"], package["name"]): package["dependency_summary"]["edge_count"]
            for package in model["implementation"]["packages"]
        }
        assert peagen_dependency_groups[("npm", "peagen-com")] == 10
        assert peagen_dependency_groups[("pypi", "docs-peagen-com")] == 11
        assert all(
            repository["metrics"] and "governance" in repository
            for repository in model["implementation"]["repositories"]
        )
        assert "governance" in model and "editorial" in model
        assert any(
            limitation["description"].startswith("No public core implementation repository")
            for limitation in model["editorial"]["limitations"]
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
            release["release_kind"]
            for package in tigrbl_model["implementation"]["packages"]
            for release in package["releases"]
        } | {
            release["release_kind"]
            for repository in tigrbl_model["implementation"]["repositories"]
            for release in repository["releases"]
        }
        assert release_kinds >= {
            "crates",
            "github",
            "npm",
            "pypi",
        }
        assert (
            sum(
                package["dependency_summary"]["edge_count"]
                for package in tigrbl_model["implementation"]["packages"]
            )
            >= 450
        )
        assert (
            sum(
                package["dependent_summary"]["edge_count"]
                for package in tigrbl_model["implementation"]["packages"]
            )
            > 100
        )
        assert all(
            len(repository["commit_activity"]) == 30
            for repository in tigrbl_model["implementation"]["repositories"]
        )
        governed_repositories = [
            repository
            for repository in tigrbl_model["implementation"]["repositories"]
            if repository["governance"]["governed"]
        ]
        assert governed_repositories
        assert all(repository["governance"]["registry_url"] for repository in governed_repositories)
        assert tigrbl_model["governance"]["repositories"]
        tigrbl_registry = next(
            registry
            for registry in tigrbl_model["governance"]["repositories"]
            if registry["repository"] == "tigrbl/tigrbl"
        )
        assert tigrbl_registry["summary"]["counts"]["adrs"] > 0
        assert tigrbl_registry["summary"]["counts"]["claims"] > 0
        assert tigrbl_registry["summary"]["inventory"]["claims"]
        assert tigrbl_model["editorial"]["ssot_claim_rooting"]["status"] == "repository-scoped"
        assert "evidence" not in tigrbl_model["editorial"]
        assert "observations" in tigrbl_model["editorial"]

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

        catalog_overview = await client.get("/api/v1/catalog")
        assert catalog_overview.status_code == 200
        assert catalog_overview.json()["counts"]["repositories"] == counts["repositories"]
        assert 1_000 <= catalog_overview.json()["counts"]["packages"] < counts["packages"]

        repositories = await client.get("/api/v1/catalog/repositories?page_size=5")
        assert repositories.status_code == 200
        assert repositories.json()["count"] == counts["repositories"]
        assert repositories.json()["page_size"] == 5
        assert len(repositories.json()["records"]) == 5
        assert all(
            item["route"].startswith("/catalog/repositories/")
            for item in repositories.json()["records"]
        )

        repository_detail = await client.get("/api/v1/catalog/repositories/groupsum/groupsum-xyz")
        assert repository_detail.status_code == 200
        assert repository_detail.json()["item"]["name"] == "groupsum-xyz"
        assert "packages" in repository_detail.json()["implementation"]

        packages = await client.get("/api/v1/catalog/packages")
        assert packages.status_code == 200
        assert packages.json()["count"] == catalog_overview.json()["counts"]["packages"]

        resources = await client.get("/api/v1/catalog/resources")
        assert resources.status_code == 200
        assert resources.json()["count"] > 0
        assert all("." in resource["resource_type"] for resource in resources.json()["records"])

        technologies = await client.get("/api/v1/catalog/technologies")
        assert technologies.status_code == 200
        assert technologies.json()["count"] > 0

        portfolio = await client.get("/api/v1/portfolio")
        assert portfolio.status_code == 200
        assert portfolio.json()["count"] >= 40
        generated = await client.get("/api/v1/portfolio/catalog-groupsum-groupsum-xyz")
        assert generated.status_code == 200
        generated_model = generated.json()
        assert generated_model["record"]["content"]["generated_from"] == "public-catalog"
        assert generated_model["implementation"]["repositories"][0]["name"] == "groupsum-xyz"

        package_row = next(
            item
            for item in json.loads((repo_root / "catalog/generated/site/packages.json").read_text())
            if item.get("route") and item.get("legal_evidence")
        )
        package_key = package_row["route"].rstrip("/").split("/")[-1]
        package_detail = await client.get(f"/api/v1/catalog/packages/{package_key}")
        assert package_detail.status_code == 200
        assert package_detail.json()["legal"]["observations"]
        assert "dependencies" in package_detail.json()["implementation"]
        assert package_detail.json()["implementation"]["repositories"]
        assert package_detail.json()["graph"]["entity"]["entity_type_id"] == "distribution.package"

        entities = await client.get("/api/v1/entities?entity_type=interface.website&page_size=5")
        assert entities.status_code == 200
        assert entities.json()["total"] > 0
        assert all(
            entity["entity_type_id"] == "interface.website"
            for entity in entities.json()["entities"]
        )

        entity_id = model["graph"]["entity"]["id"]
        entity_record = await client.get(f"/api/v1/entities/{entity_id}")
        assert entity_record.status_code == 200
        assert entity_record.json()["graph"]["owner"]["type_label"] == "Organization"
