import pytest

from groupsum_catalog_api.projections.read_models import relationship_page
from groupsum_catalog_api.tables.view_common import _filter, _page


@pytest.mark.parametrize(
    ("column", "field", "low", "high"),
    [
        ("forks", "metrics", {"forks": 2}, {"forks": 10}),
        ("contributors", "contributors", [{}], [{}, {}]),
        ("packages", "package_count", 2, 10),
        ("latest_release", "latest_release", {"published_at": "2026-01-01"}, "2026-02-01"),
        ("version", "latest_version", "1.2.0", "1.10.0"),
        ("dependencies", "dependency_count", 2, 10),
        ("dependents", "dependent_count", 2, 10),
        ("name_lex", "name", "alpha", "Zulu"),
    ],
)
def test_column_sorts_both_directions_before_pagination(column, field, low, high):
    rows = [
        {"id": "low", "name": "low", field: low},
        {"id": "high", "name": "high", field: high},
    ]
    for direction, first in (("asc", "low"), ("desc", "high")):
        params = {"sort": f"{column}_{direction}", "page": 1, "page_size": 1}
        page, *_ = _page(_filter(rows, params), params)
        assert [item["id"] for item in page] == [first]


def test_unobserved_release_is_last_in_both_directions():
    rows = [
        {"id": "missing"},
        {"id": "invalid", "latest_release": "not a date"},
        {"id": "known", "latest_release": {"published_at": "2026-02-01T12:00:00Z"}},
    ]
    for direction in ("asc", "desc"):
        assert _filter(rows, {"sort": f"latest_release_{direction}"})[0]["id"] == "known"


def test_relationship_ownership_and_scope_sort_precedes_pagination():
    records = [
        ("aardvark", "external", "dependencies"),
        ("able", "resolved", "dependency-groups.dev"),
        ("zebra", "resolved", "dependencies"),
        ("yak", "resolved", "dependencies"),
    ]
    values = [
        {"id": name, "name": name, "resolution": status, "scope": scope, "optional": False}
        for name, status, scope in records
    ]
    item = {"dependencies": values, "dependents": []}
    params = {"sort": "ownership", "page_size": 2}
    first = relationship_page(item, list(values), params)
    second = relationship_page(item, list(values), {**params, "page": 2})
    assert [row["name"] for row in first["records"] + second["records"]] == [
        "yak",
        "zebra",
        "able",
        "aardvark",
    ]
