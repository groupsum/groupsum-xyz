from __future__ import annotations

from datetime import UTC, datetime
from pathlib import Path

import httpx
import pytest

from groupsum_catalog_api.app import _analytics_engine, _initialize, build_app
from groupsum_catalog_api.domain.resources.ontology import RESOURCE_TYPES
from groupsum_catalog_api.tables.association import Association
from groupsum_catalog_api.tables.metric_observation import MetricObservation
from groupsum_catalog_api.tables.organization import Organization
from groupsum_catalog_api.tables.package import Package
from groupsum_catalog_api.tables.portfolio import Portfolio
from groupsum_catalog_api.tables.product import Product
from groupsum_catalog_api.tables.registry import ALL_TABLES, ENTITY_TABLES, RESOURCE_TABLES
from groupsum_catalog_api.tables.repository import Repository
from groupsum_catalog_api.tables.technology import Technology
from groupsum_catalog_api.tables.view_common import latest_timestamp
from groupsum_catalog_api.tables.views_resources import _collection_aggregates


def test_every_table_exposes_only_hidden_create_read_and_list() -> None:
    assert len(ALL_TABLES) == 161
    for table in ALL_TABLES:
        assert {operation.target for operation in table.TABLE_PROFILE.ops} == {
            "create",
            "read",
            "list",
        }
        assert all(not operation.expose_routes for operation in table.TABLE_PROFILE.ops)


def test_analytics_engine_uses_a_terse_quack_dsn() -> None:
    engine = _analytics_engine(
        "quack://groupsum-duckdb:9494",
        token="test-token",
        disable_ssl=True,
    )

    assert engine.dsn == "quack://groupsum-duckdb:9494"
    assert engine.mapping == {
        "catalog": "analytics",
        "disable_ssl": True,
        "token": "test-token",
    }


def test_initialize_propagates_engine_errors() -> None:
    class BrokenApp:
        def initialize(self) -> None:
            raise RuntimeError("remote unavailable")

    with pytest.raises(RuntimeError, match="remote unavailable"):
        _initialize(BrokenApp(), "quack://groupsum-duckdb:9494")


def test_quack_initialization_tolerates_only_current_table_idempotency() -> None:
    class Router:
        pass

    class ExistingRemoteTable:
        routers = {"public": Router(), "internal": Router()}

        def initialize(self) -> None:
            raise RuntimeError(
                'Table with name "catalog_metric_observations" already exists!'
            )

    app = ExistingRemoteTable()
    _initialize(app, "quack://groupsum-duckdb:9494")
    assert app._ddl_executed is True
    assert all(router._ddl_executed is True for router in app.routers.values())

    with pytest.raises(RuntimeError, match="catalog_metric_observations"):
        _initialize(ExistingRemoteTable(), "metrics.duckdb")


def test_metrics_use_a_tigrbl_owned_append_only_table() -> None:
    assert MetricObservation.__tablename__ == "catalog_metric_observations"
    assert not MetricObservation.__table__.indexes


def test_latest_timestamp_accepts_database_and_source_payload_values() -> None:
    database_value = datetime(2026, 8, 9, tzinfo=UTC)
    source_value = "2026-08-10T00:00:00Z"

    assert latest_timestamp((database_value, source_value)) == source_value


def test_collection_aggregates_cover_every_catalog_resource_kind() -> None:
    assert _collection_aggregates(
        [
            {
                "metrics": {"stars": 3},
                "ssot_governed": True,
                "package_count": 2,
            },
            {
                "metrics": {"stars": 5},
                "governance": {"governed": True},
                "package_count": 4,
            },
        ],
        "repository",
    ) == {"stars": 8, "ssot_governed": 2, "contained_packages": 6}
    assert _collection_aggregates(
        [
            {"published": True, "ecosystem": "pypi"},
            {"publication_status": "candidate", "ecosystem": "npm"},
        ],
        "package",
    ) == {"published": 1, "unpublished": 1, "ecosystems": 2}
    assert _collection_aggregates(
        [
            {"resource_type": "documentation.guide"},
            {"resource_type": "runtime.endpoint"},
            {"resource_type": "implementation.demo"},
        ],
        "resource",
    ) == {"websites_and_docs": 1, "apis_and_endpoints": 1, "demos_and_showcases": 1}
    assert _collection_aggregates(
        [{"category": "database"}, {"category": "database"}, {"category": "runtime"}],
        "technology",
    ) == {"categories": 2}


def test_entity_tables_have_no_foreign_keys_and_use_one_association_table() -> None:
    assert set(ENTITY_TABLES) == {
        *RESOURCE_TYPES,
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
    assert set(ENTITY_TABLES) == set(RESOURCE_TYPES)
    assert len(RESOURCE_TABLES) == 150
    assert {table.__tablename__ for table in ALL_TABLES}.isdisjoint(
        {"catalog_entries", "typed_resources", "repository_ssot_items"}
    )


def test_public_operations_are_native_and_bound_to_their_owning_tables() -> None:
    expected = {
        Association: {
            "catalog",
            "entities",
            "entity",
            "insights",
            "catalog_resources",
            "catalog_release",
            "catalog_resource",
        },
        Product: {"products", "product", "solutions", "solution", "services", "service"},
        Portfolio: {"portfolios", "portfolio"},
        Organization: {"organization"},
        Repository: {"catalog_repositories", "catalog_repository", "repository_metrics"},
        Package: {"catalog_packages", "catalog_package"},
        Technology: {"catalog_technologies", "catalog_technology"},
    }
    for table, aliases in expected.items():
        assert aliases <= set(vars(table.handlers))
        operations = {operation.alias: operation for operation in table.__tigrbl_ops__}
        assert all(operations[alias].target in {"list", "read"} for alias in aliases)


@pytest.mark.anyio
async def test_openapi_is_generated_from_tigrbl_tables(tmp_path: Path) -> None:
    app = build_app(tmp_path / "catalog.sqlite3", tmp_path / "metrics.duckdb")
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        health = await client.get("/healthz")
        assert health.status_code == 200
        assert health.json()["schema_tables"] == len(ALL_TABLES)

        document = (await client.get("/openapi.json")).json()
        assert "paths" in document, document
        paths = document["paths"]
        assert not any(f"/{table.__name__.lower()}" in paths for table in ALL_TABLES)

        assert "/api/v1/catalog/repositories" in paths
        assert "/api/v1/products" in paths
        assert "/api/v1/entities/{entity_type}/{entity_id}" in paths


@pytest.mark.anyio
async def _legacy_analytics_import_test(tmp_path: Path) -> None:
    pytest.skip("covered by append-only internal API publication tests")
    """
    analytics_path = tmp_path / "metrics.duckdb"
    app = build_app(tmp_path / "catalog.sqlite3", analytics_path)
    measurement = {
        "measurement_id": "measurement:test",
        "snapshot_id": "snapshot:test",
        "subject_type": "source.repository",
        "subject_id": "repository:test",
        "metric_key": "stars",
        "numeric_value": 3.0,
        "text_value": None,
        "unit": "count",
        "dimensions": {},
        "period_start": None,
        "period_end": None,
        "source_url": None,
        "source_observation_id": None,
        "observed_at": "2026-08-09T00:00:00Z",
    }

    assert await legacy_metric_write("snapshot:test", [measurement]) == 1

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/analytics/summary")
        overview = await client.get("/api/v1/analytics/overview")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "engine": "duckdb",
        "metric_observations": 1,
    }
    assert overview.json().get("snapshot_id") == "snapshot:test", overview.json()
    assert analytics_path.is_file()


    """


@pytest.mark.anyio
async def _legacy_filesystem_import_test(tmp_path: Path) -> None:
    pytest.skip("filesystem importer was removed in favor of API publication")
    """
    repo_root = Path(__file__).resolve().parents[3]
    database = tmp_path / "catalog.sqlite3"
    app = build_app(database, tmp_path / "metrics.duckdb")
    counts = await legacy_filesystem_load(repo_root)

    assert counts["products"] == 12
    assert counts["portfolios"] == 6
    assert counts["repositories"] >= 60
    assert counts["packages"] >= 1_000
    assert counts["resources"] > 0
    assert counts["technologies"] > 0

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        session, release = Association.acquire(op_alias="list")
        try:
            associations = [
                {column.name: getattr(edge, column.name) for column in edge.__table__.columns}
                for edge in session.query(Association).all()
            ]
            entity_ids = {
                entity_type: {row[0] for row in session.query(table.id).all()}
                for entity_type, table in ENTITY_TABLES.items()
            }
        finally:
            release()
        assert associations
        assert all(edge["relationship_type"] in RELATIONSHIP_TYPES for edge in associations)
        assert all(
            edge["source_id"] in entity_ids[edge["source_type"]]
            and edge["target_id"] in entity_ids[edge["target_type"]]
            for edge in associations
        )

        overview = (await client.get("/api/v1/catalog")).json()
        assert "counts" in overview, overview
        assert overview["counts"]["repositories"] == counts["repositories"]

        products = (await client.get("/api/v1/products")).json()
        assert products["count"] == counts["products"]
        product_detail = await client.get(f"/api/v1/products/{products['records'][0]['slug']}")
        assert product_detail.status_code == 200, product_detail.json()
        packaged_product = next(record for record in products["records"] if record["package_count"])
        packaged_detail = (
            await client.get(f"/api/v1/products/{packaged_product['slug']}")
        ).json()
        package = packaged_detail["implementation"]["packages"][0]
        assert package["route_key"]
        assert package["repositories"]
        assert package["dependency_summary"]["edge_count"] == len(package["dependencies"])
        assert package["dependent_summary"]["edge_count"] == len(package["dependents"])
        repository = packaged_detail["implementation"]["repositories"][0]
        assert repository["owner"]
        assert repository["name"]
        assert repository["role"]
        assert repository["governance"]["summary"] is not None

        session, release = Portfolio.acquire(op_alias="list")
        try:
            portfolio_rows = [
                {column.name: getattr(row, column.name) for column in row.__table__.columns}
                for row in session.query(Portfolio).all()
            ]
        finally:
            release()
        public_portfolios = [row for row in portfolio_rows if row["visibility"] == "public"]
        portfolios = (await client.get("/api/v1/portfolio")).json()
        assert portfolios["count"] == len(public_portfolios)
        if public_portfolios:
            portfolio_detail = await client.get(f"/api/v1/portfolio/{public_portfolios[0]['slug']}")
            assert portfolio_detail.status_code == 200

        session, release = Organization.acquire(op_alias="list")
        try:
            organization_slug = session.query(Organization.slug).first()[0]
        finally:
            release()
        organization = await client.get(f"/api/v1/organizations/{organization_slug}")
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

        snapshots = (await client.get("/api/v1/snapshots")).json()
        assert snapshots["count"] == 1
        assert snapshots["snapshots"][0]["is_current"] is True
        snapshot_id = snapshots["snapshots"][0]["snapshot_id"]
        assert (await client.get(f"/api/v1/snapshots/{snapshot_id}")).status_code == 200

        analytics = (await client.get("/api/v1/analytics/overview")).json()
        assert analytics.get("snapshot_id") == snapshot_id, analytics
        assert analytics["count"] > 0
        entity_metrics = (
            await client.get(
                "/api/v1/entities/source.repository/metrics",
                params={"entity_id": repository["id"]},
            )
        ).json()
        assert entity_metrics.get("count", 0) > 0, entity_metrics
        assert entity_metrics["insufficient_history"] is True
        star_series = await client.get(
            "/api/v1/entities/source.repository/metrics/stars/series",
            params={"entity_id": repository["id"]},
        )
        assert star_series.status_code == 200
        observations = await client.get(
            "/api/v1/entities/source.repository/observations",
            params={"entity_id": repository["id"]},
        )
        assert observations.status_code == 200
        assert observations.json()["kind"] == "entity_observations"

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

        entities = (await client.get("/api/v1/entities?page_size=250")).json()
        entity_row = next(
            item
            for item in entities["entities"]
            if "/" not in item["id"] and item["relationship_count"] > 0
        )
        entity = await client.get(
            f"/api/v1/entities/{entity_row['entity_type_id']}/{entity_row['id']}"
        )
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
    """
