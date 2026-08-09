from __future__ import annotations

from pathlib import Path

import httpx
import pytest

from groupsum_catalog_api.app import build_app
from groupsum_catalog_api.domain.resources.relationship_types import RELATIONSHIP_TYPES
from groupsum_catalog_api.importer import import_catalog
from groupsum_catalog_api.tables.association import Association
from groupsum_catalog_api.tables.catalog_entry import CatalogEntry
from groupsum_catalog_api.tables.organization import Organization
from groupsum_catalog_api.tables.package import Package
from groupsum_catalog_api.tables.portfolio import Portfolio
from groupsum_catalog_api.tables.product import Product
from groupsum_catalog_api.tables.registry import ALL_TABLES, ENTITY_TABLES
from groupsum_catalog_api.tables.repository import Repository
from groupsum_catalog_api.tables.technology import Technology
from groupsum_catalog_api.tables.typed_resource import TypedResource


def test_every_public_table_exposes_exactly_read_and_list() -> None:
    assert len(ALL_TABLES) == 11
    for table in ALL_TABLES:
        assert {operation.target for operation in table.TABLE_PROFILE.ops} == {"read", "list"}


def test_entity_tables_have_no_foreign_keys_and_use_one_association_table() -> None:
    assert set(ENTITY_TABLES) == {
        "organization",
        "product",
        "portfolio",
        "repository",
        "package",
        "typed_resource",
        "technology",
        "ssot_registry",
        "ssot_item",
    }
    assert all(not table.__table__.foreign_keys for table in ENTITY_TABLES.values())
    assert not Association.__table__.foreign_keys
    assert {
        "source_type",
        "source_id",
        "relationship_type",
        "target_type",
        "target_id",
    } <= {column.name for column in Association.__table__.columns}


def test_former_read_operations_are_bound_to_their_owning_tables() -> None:
    expected = {
        CatalogEntry: {
            "catalog_overview",
            "entity_collection",
            "entity_detail",
            "insight_collection",
        },
        Product: {"record_collection", "record_detail"},
        Portfolio: {"record_collection", "record_detail"},
        Organization: {"organization_detail"},
        Repository: {"repository_collection", "repository_detail", "repository_metrics"},
        Package: {"package_collection", "package_detail"},
        TypedResource: {"resource_collection", "resource_detail"},
        Technology: {"technology_collection", "technology_detail"},
    }
    for table, aliases in expected.items():
        assert aliases <= set(vars(table.handlers))


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

        assert "/api/v1/catalog/repositories" in paths
        assert "/api/v1/products" in paths
        assert "/api/v1/entities/{entity_id}" in paths


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
        for resource in (
            "product",
            "portfolio",
            "repository",
            "package",
            "typedresource",
            "association",
        ):
            response = await client.get(f"/{resource}")
            assert response.status_code == 200
            assert response.json()

        product = await client.get("/product/groupsum-ssot-registry")
        assert product.status_code == 200
        assert product.json()["slug"] == "ssot-registry"

        typed_resources = (await client.get("/typedresource")).json()
        assert all("." in item["resource_type"] for item in typed_resources)

        associations = (await client.get("/association")).json()
        assert associations
        assert all(edge["relationship_type"] in RELATIONSHIP_TYPES for edge in associations)
        entity_ids = {}
        for entity_type, table in ENTITY_TABLES.items():
            response = await client.get(f"/{table.__name__.lower()}")
            entity_ids[entity_type] = {item["id"] for item in response.json()}
        assert all(
            edge["source_id"] in entity_ids[edge["source_type"]]
            and edge["target_id"] in entity_ids[edge["target_type"]]
            for edge in associations
        )

        overview = (await client.get("/api/v1/catalog")).json()
        assert overview["counts"]["repositories"] == counts["repositories"]

        products = (await client.get("/api/v1/products")).json()
        assert products["count"] == counts["products"]
        product_detail = await client.get(f"/api/v1/products/{products['records'][0]['slug']}")
        assert product_detail.status_code == 200

        portfolio_rows = (await client.get("/portfolio")).json()
        public_portfolios = [row for row in portfolio_rows if row["visibility"] == "public"]
        portfolios = (await client.get("/api/v1/portfolio")).json()
        assert portfolios["count"] == len(public_portfolios)
        if public_portfolios:
            portfolio_detail = await client.get(
                f"/api/v1/portfolio/{public_portfolios[0]['slug']}"
            )
            assert portfolio_detail.status_code == 200

        organizations = (await client.get("/organization")).json()
        organization = await client.get(f"/api/v1/organizations/{organizations[0]['slug']}")
        assert organization.status_code == 200

        repositories = (await client.get("/api/v1/catalog/repositories?page_size=3")).json()
        assert repositories["count"] == counts["repositories"]
        repository = repositories["records"][0]
        repository_detail = await client.get(
            f"/api/v1/catalog/repositories/{repository['owner']}/{repository['name']}"
        )
        assert repository_detail.status_code == 200
        metrics = (await client.get("/api/v1/repository-metrics")).json()
        assert metrics["count"] == counts["repositories"]

        packages = (await client.get("/api/v1/catalog/packages?page_size=3")).json()
        package = packages["records"][0]
        package_detail = await client.get(f"/api/v1/catalog/packages/{package['route_key']}")
        assert package_detail.status_code == 200

        resources = (await client.get("/api/v1/catalog/resources?page_size=3")).json()
        resource = resources["records"][0]
        resource_detail = await client.get(
            f"/api/v1/catalog/resources/{resource['resource_type']}/{resource['route_key']}"
        )
        assert resource_detail.status_code == 200

        technologies = (await client.get("/api/v1/catalog/technologies?page_size=3")).json()
        technology = technologies["records"][0]
        technology_detail = await client.get(f"/api/v1/catalog/technologies/{technology['slug']}")
        assert technology_detail.status_code == 200

        entities = (await client.get("/api/v1/entities?page_size=3")).json()
        entity = await client.get(f"/api/v1/entities/{entities['entities'][0]['id']}")
        assert entity.status_code == 200
        assert entity.json()["graph"]["relationships"]
        assert (await client.get("/api/v1/insights")).status_code == 200

        release_route = next(
            release["route"] for item in packages["records"] for release in item.get("releases", [])
        )
        release_detail = await client.get(
            f"/api/v1/catalog/releases/{release_route.rsplit('/', 1)[-1]}"
        )
        assert release_detail.status_code == 200
