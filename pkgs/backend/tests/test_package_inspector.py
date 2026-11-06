from types import SimpleNamespace

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from groupsum_catalog_api.tables.catalog_snapshot import CatalogSnapshot
from groupsum_catalog_api.tables.observation import CatalogObservation
from groupsum_catalog_api.tables.package import Package
from groupsum_catalog_api.tables.repository import Repository
from groupsum_catalog_api.tables.view_common import _filter, _page
from groupsum_catalog_api.tables.view_package_summary import package_summary
from groupsum_catalog_api.tables.views_resources import catalog_collection


def test_star_sort_is_global_numeric_and_deterministic():
    values = [
        {"id": name, "name": name, "metrics": {"stars": stars}}
        for name, stars in [("z", 2), ("b", 105), ("a", 105), ("missing", None)]
    ]
    ordered = _filter(values, {"sort": "stars"})
    assert [row["name"] for row in ordered] == ["a", "b", "z", "missing"]
    assert _page(ordered, {"page_size": 2})[0] == ordered[:2]
    assert [row["name"] for row in _filter(values, {"sort": "stars_asc"})] == [
        "missing",
        "z",
        "a",
        "b",
    ]


def test_repository_filter_matches_exact_owner_and_name_not_substrings():
    values = [
        {"name": "a", "repository": "groupsum/app"},
        {"name": "b", "repository": "groupsum/app-extra"},
        {"name": "c", "repository": "other/app"},
        {"name": "d", "repositories": [{"owner": "groupsum", "name": "app"}]},
    ]
    assert [
        row["name"] for row in _filter(values, {"repository": "GROUPSUM/app", "sort": "name"})
    ] == ["a", "d"]


def test_summary_preserves_unknown_status_and_deduplicates_ids():
    index = {"p": SimpleNamespace(ecosystem="pypi", published=True, publication_status="published")}
    assert package_summary(["p", "p", "unknown"], index) == {
        "total": 2,
        "ecosystems": {"pypi": 1, "unknown": 1},
        "publications": {"not-observed": 1, "published": 1},
    }


def test_inspector_collection_filters_paginates_and_bounds_payload():
    engine = create_engine("sqlite://")
    for model in (Package, Repository, CatalogSnapshot, CatalogObservation):
        model.__table__.create(engine)
    with Session(engine) as session:
        for index in range(13):
            session.add(
                Package(
                    id=f"package:{index}",
                    ecosystem="pypi",
                    name=f"pkg-{index:02}",
                    route_key=f"pkg-{index}",
                    source_payload={
                        "id": f"package:{index}",
                        "name": f"pkg-{index:02}",
                        "ecosystem": "pypi",
                        "repository": "groupsum/app" if index < 12 else "other/app",
                        "latest_version": "1.0",
                        "dependencies": [{"name": "must-not-leak"}],
                        "publication_status": "published",
                    },
                )
            )
        session.add(
            Repository(
                id="repo",
                provider="github",
                owner="groupsum",
                name="app",
                url="https://github.com/groupsum/app",
                source_payload={
                    "package_ids": [f"package:{index}" for index in range(12)],
                    "packages": [{"name": "must-not-leak"}],
                },
            )
        )
        session.commit()
        result = catalog_collection(
            Package,
            {
                "db": session,
                "query_params": {
                    "repository": "groupsum/app",
                    "ecosystem": "pypi",
                    "publication_status": "published",
                    "projection": "summary",
                    "page": "2",
                    "page_size": "10",
                    "sort": "name",
                },
            },
            "package",
        )
        assert result["count"] == 12
        assert result["page_count"] == 2
        assert [row["name"] for row in result["records"]] == ["pkg-10", "pkg-11"]
        assert all("dependencies" not in row and "releases" not in row for row in result["records"])
        repositories = catalog_collection(
            Repository, {"db": session, "query_params": {}}, "repository"
        )
        assert repositories["records"][0]["package_summary"]["ecosystems"] == {"pypi": 12}
        assert "packages" not in repositories["records"][0]
        empty = catalog_collection(
            Package, {"db": session, "query_params": {"repository": "missing/app"}}, "package"
        )
        assert empty["count"] == 0
