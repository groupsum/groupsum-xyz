from groupsum_catalog_api.tables.view_common import _filter


def test_collection_defaults_to_recent_real_activity():
    records = [
        {
            "name": "New observation, old activity",
            "observed_at": "2026-08-11T00:00:00Z",
            "pushed_at": "2026-01-01T00:00:00Z",
            "metrics": {"commits": 500},
        },
        {
            "name": "Recent activity",
            "observed_at": "2026-08-10T00:00:00Z",
            "pushed_at": "2026-08-09T00:00:00Z",
            "metrics": {"commits": 2},
        },
    ]

    assert [record["name"] for record in _filter(records, {})] == [
        "Recent activity",
        "New observation, old activity",
    ]


def test_most_activity_is_distinct_from_recent_activity():
    records = [
        {
            "name": "High volume",
            "pushed_at": "2026-01-01T00:00:00Z",
            "metrics": {"commits": 500},
        },
        {
            "name": "Recent activity",
            "pushed_at": "2026-08-09T00:00:00Z",
            "metrics": {"commits": 2},
        },
    ]

    assert [record["name"] for record in _filter(records, {"sort": "activity"})] == [
        "High volume",
        "Recent activity",
    ]
