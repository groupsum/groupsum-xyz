from groupsum_catalog_api.projections.contributor_activity import (
    activity_deltas,
    build_contributor_activity,
)
from groupsum_catalog_api.projections.read_models import build_read_models, project


def test_deltas_use_exact_windows_and_require_full_coverage():
    data = {
        "through": "2026-11-09T12:00:00Z",
        "weeks": ["2026-08-17"],
        "repositories": [{"name": "org/a"}, {"name": "org/b"}],
        "events": [
            {"at": "2026-09-10T12:00:00Z", "repository": "org/b"},
            {"at": "2026-10-10T12:00:00Z", "repository": "org/a"},
            {"at": "2026-10-10T12:00:01Z", "repository": "org/a"},
            {"at": "2026-11-09T12:00:00Z", "repository": "org/b"},
            {"at": "2026-11-09T12:00:01Z", "repository": "org/b"},
        ],
    }
    bounds = {"since": "2026-09-01T00:00:00Z", "until": data["through"]}
    coverage = {"org/a": bounds, "org/b": bounds}
    assert activity_deltas(data, coverage) == {"commits": 1, "active_repositories": 1}
    assert activity_deltas({**data, "events": []}, coverage) == {
        "commits": 0,
        "active_repositories": 0,
    }
    assert activity_deltas(data, {"org/a": bounds}) is None
    assert activity_deltas(data, {**coverage, "org/b": {**bounds, "until": "2026-11-09"}}) is None


def test_activity_uses_only_linked_public_commits_and_preserves_coverage():
    repos = [
        {"name": "org/public", "route": "/catalog/repositories/org/public"},
        {"name": "org/unknown", "route": "/catalog/repositories/org/unknown"},
    ]
    person = {
        "id": "person:1",
        "name": "Example",
        "login": "example",
        "provider": "github",
        "provider_id": "42",
        "account_type": "User",
        "repositories": repos,
    }
    commit = {
        "sha": "first",
        "url": "https://github.com/org/public/commit/first",
        "committed_at": "2026-11-03T12:00:00Z",
        "author_id": 42,
        "message": "Fix docs",
    }
    rows = [
        commit,
        commit,
        {
            **commit,
            "sha": "unlinked",
            "url": "https://github.com/org/public/commit/unlinked",
            "author": "example",
            "author_id": None,
        },
        {
            **commit,
            "sha": "later",
            "url": "https://github.com/org/public/commit/later",
            "committed_at": "2026-11-20T00:00:00Z",
        },
        {
            **commit,
            "sha": "another",
            "url": "https://github.com/org/public/commit/another",
            "committed_at": "2026-11-04T12:00:00Z",
        },
    ]
    model = build_read_models([], [], [], [person])
    model["contributor_activity"] = build_contributor_activity(
        {
            "generated_at": "2026-11-10T09:00:00Z",
            "repositories": [
                {
                    "full_name": "org/public",
                    "visibility": "public",
                    "activity": {
                        "commit_history": rows,
                        "commit_coverage": {
                            "since": "2026-10-01T00:00:00Z",
                            "until": "2026-11-10T09:00:00Z",
                        },
                    },
                }
            ],
        },
        [person],
    )
    args = {"provider": "github", "login": "EXAMPLE"}
    summary = project(model, "contributor_detail", {**args, "activity": "1"})
    assert "events" not in summary
    assert summary["commit_count"] == 2
    assert len(summary["weeks"]) == 13
    week = summary["weeks"].index("2026-11-02")
    assert summary["repositories"][0]["cells"][week] == {"count": 2, "complete": True}
    assert summary["repositories"][1]["cells"][week] == {"count": 0, "complete": False}
    assert summary["repositories"][0]["cells"][-1] == {"count": 0, "complete": False}
    assert [item["id"] for item in summary["achievements"]] == ["multi-repo", "observed-commit"]
    timeline = project(
        model,
        "contributor_detail",
        {
            **args,
            "activity": "timeline",
            "week": "2026-11-02",
            "repository": "org/public",
            "page_size": 1,
        },
    )
    assert timeline["count"] == 2 and timeline["page_count"] == 2
    assert timeline["records"][0]["url"].endswith("/another")
    assert project(model, "contributor_detail", args)["kind"] == "contributor_record"


def test_recent_leaderboard_excludes_partial_weeks_and_preserves_observed_zero():
    weeks = ["2026-10-12", "2026-10-19", "2026-10-26", "2026-11-02", "2026-11-09"]
    people = [
        {
            "id": name,
            "name": name,
            "account_type": "User",
            "provider_id": name,
            "contributions": total,
            "repository_count": 1,
            "repositories": [{"name": "org/repo"}],
        }
        for name, total in [("Active", 3), ("Quiet", 10), ("Partial", 100), ("Missing", 200)]
    ]

    def activity(count, complete):
        return {
            "weeks": weeks,
            "through": "2026-11-10T10:00:00Z",
            "repositories": [
                {
                    "name": "org/repo",
                    "cells": [
                        {"count": count, "complete": complete},
                        *([{"count": 0, "complete": True}] * 3),
                        {"count": 999, "complete": False},
                    ],
                }
            ],
        }

    model = build_read_models([], [], [], people)
    query = {"sort": "leaderboard_recent"}
    assert project(model, "contributors", query)["activity_window"] is None
    model["contributor_activity"] = {
        "Active": activity(3, True),
        "Quiet": activity(0, True),
        "Partial": activity(99, False),
    }
    ranked = project(model, "contributors", query)
    assert ranked["activity_window"] == {"start": "2026-10-12", "end": "2026-11-08"}
    assert [(row["id"], row["rank"], row["recent_commits"]) for row in ranked["records"]] == [
        ("Active", 1, 3),
        ("Quiet", 2, 0),
        ("Missing", None, None),
        ("Partial", None, None),
    ]
    assert project(model, "contributors", {**query, "q": "quiet"})["records"][0]["rank"] == 2
    assert (
        project(model, "contributors", {**query, "page_size": 1, "page": 2})["records"][0]["rank"]
        == 2
    )
    assert project(model, "contributors", {"sort": "leaderboard"})["records"][0]["id"] == "Missing"


def test_contributor_headers_sort_before_pagination():
    people = [
        {
            "id": "1",
            "name": "Zulu",
            "account_type": "Bot",
            "repository_count": 1,
            "contributions": 12,
        },
        {
            "id": "2",
            "name": "Alpha",
            "account_type": "User",
            "repository_count": 2,
            "contributions": 2,
        },
    ]
    model = build_read_models([], [], [], people)
    for sort, first in [
        ("name_asc", "2"),
        ("name_desc", "1"),
        ("type_asc", "1"),
        ("type_desc", "2"),
        ("repositories_asc", "1"),
        ("repositories_desc", "2"),
        ("contributions_asc", "2"),
        ("contributions_desc", "1"),
    ]:
        page = project(model, "contributors", {"sort": sort, "page_size": "1"})
        assert page["records"][0]["id"] == first
    assert model["contributors"] == people


def test_leaderboard_ranks_within_groups_before_search_and_pagination():
    people = [
        {
            "id": name,
            "name": name,
            "account_type": kind,
            "repository_count": 1,
            "contributions": count,
        }
        for name, kind, count in [
            ("Alpha", "User", 12),
            ("Bravo", "User", 12),
            ("Charlie", "User", 3),
            ("Automation", "Bot", 200),
            ("Unknown", "Anonymous", 250),
        ]
    ]
    model = build_read_models([], [], [], people)

    def leaderboard(**params):
        return project(model, "contributors", {"sort": "leaderboard", **params})["records"]

    assert [(row["id"], row["rank"]) for row in leaderboard()] == [
        ("Alpha", 1),
        ("Bravo", 1),
        ("Charlie", 3),
    ]
    assert leaderboard(page_size="1", page="2")[0]["rank"] == 1
    assert leaderboard(q="Charlie")[0]["rank"] == 3
    assert leaderboard(account_type="Bot")[0]["rank"] == 1
    assert all("rank" not in row for row in people)
