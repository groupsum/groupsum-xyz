from __future__ import annotations

from collections import defaultdict
from pathlib import Path
from typing import Any

from tigrbl import JSONResponse, Request, Response

from ..analytics import connect_analytics, default_analytics_path, metric_rows
from ..database import Connection
from ..importer import connect

CACHE_CONTROL = "public, max-age=60, s-maxage=300, stale-while-revalidate=86400"

from .common import *  # noqa: F403


def metric_number(value: Any) -> int | float:
    number = float(value or 0)
    return int(number) if number.is_integer() else number


def analytics_rows(
    connection: Connection, query: str, parameters: tuple[Any, ...] = ()
) -> list[dict[str, Any]]:
    with connect_analytics(
        default_analytics_path(connection.database), read_only=True
    ) as analytics:
        return metric_rows(analytics, query, parameters)


def repository_signals(connection: Connection, repository_id: str) -> dict[str, Any]:
    snapshot_rows = analytics_rows(
        connection,
        """
        SELECT metric, value, observed_at
          FROM metric_observations
         WHERE subject_kind = 'repository' AND subject_id = ?
           AND metric IN ('stars', 'forks', 'watchers', 'contributors', 'commits')
           AND period_start IS NULL
      ORDER BY observed_at
        """,
        (repository_id,),
    )
    latest: dict[str, dict[str, Any]] = {}
    history_by_day: dict[str, dict[str, dict[str, Any]]] = defaultdict(dict)
    for item in snapshot_rows:
        item["value"] = metric_number(item["value"])
        latest[item["metric"]] = item
        day = str(item["observed_at"])[:10]
        history_by_day[item["metric"]][day] = {
            "observed_at": item["observed_at"],
            "value": item["value"],
        }
    contributor_count = connection.execute(
        "SELECT COUNT(*) FROM repository_contributors WHERE repository_id = ?",
        (repository_id,),
    ).fetchone()[0]
    metrics = {
        metric: metric_number(latest.get(metric, {}).get("value"))
        for metric in ("stars", "forks", "watchers", "contributors", "commits")
    }
    if contributor_count or "contributors" not in latest:
        metrics["contributors"] = contributor_count
    commit_activity = analytics_rows(
        connection,
        """
        SELECT DATE(period_start) AS date, value AS count
          FROM metric_observations
         WHERE subject_kind = 'repository' AND subject_id = ?
           AND metric = 'commits_daily' AND period_start IS NOT NULL
      ORDER BY period_start DESC LIMIT 30
        """,
        (repository_id,),
    )
    commit_activity.reverse()
    for item in commit_activity:
        item["count"] = metric_number(item["count"])
    observed_values = [item["observed_at"] for item in latest.values()]
    return {
        "metrics": metrics,
        "history": {
            metric: list(history_by_day[metric].values())[-30:]
            for metric in ("stars", "forks", "watchers", "contributors")
        },
        "commit_activity": commit_activity,
        "observed_at": max(observed_values, default=None),
    }


def record_signals(connection: Connection, record_id: str) -> dict[str, Any]:
    repository_ids = [
        item["repository_id"]
        for item in rows(
            connection,
            "SELECT repository_id FROM record_repositories WHERE record_id = ?",
            (record_id,),
        )
    ]
    if not repository_ids:
        return {
            "repository_count": 0,
            "metrics": {
                metric: 0 for metric in ("stars", "forks", "watchers", "contributors", "commits")
            },
            "history": {metric: [] for metric in ("stars", "forks", "watchers", "contributors")},
            "commit_activity": [],
            "observed_at": None,
        }
    signals = [repository_signals(connection, repository_id) for repository_id in repository_ids]
    snapshot_rows = analytics_rows(
        connection,
        """
        SELECT metric, value, observed_at
          FROM metric_observations
         WHERE subject_kind = 'record' AND subject_id = ?
           AND metric IN ('stars', 'forks', 'watchers', 'contributors', 'commits')
           AND period_start IS NULL
      ORDER BY observed_at
        """,
        (record_id,),
    )
    latest: dict[str, dict[str, Any]] = {}
    by_metric_day: dict[str, dict[str, dict[str, Any]]] = defaultdict(dict)
    for item in snapshot_rows:
        item["value"] = metric_number(item["value"])
        latest[item["metric"]] = item
        by_metric_day[item["metric"]][str(item["observed_at"])[:10]] = {
            "observed_at": item["observed_at"],
            "value": item["value"],
        }
    metrics = {
        metric: metric_number(latest.get(metric, {}).get("value"))
        for metric in ("stars", "forks", "watchers", "contributors", "commits")
    }
    if not snapshot_rows:
        metrics = {
            metric: sum(signal["metrics"][metric] for signal in signals)
            for metric in ("stars", "forks", "watchers", "contributors", "commits")
        }
    history = {
        metric: list(by_metric_day[metric].values())[-30:]
        for metric in ("stars", "forks", "watchers", "contributors")
    }
    commit_days: dict[str, int | float] = defaultdict(int)
    for signal in signals:
        for point in signal["commit_activity"]:
            commit_days[point["date"]] += point["count"]
    return {
        "repository_count": len(repository_ids),
        "metrics": metrics,
        "history": history,
        "commit_activity": [
            {"date": day, "count": count} for day, count in sorted(commit_days.items())[-30:]
        ],
        "observed_at": max(
            [item["observed_at"] for item in latest.values()]
            + [signal["observed_at"] for signal in signals if signal["observed_at"]],
            default=None,
        ),
    }


def repository_metric_snapshot(
    database_path: Path, request: Request, owner: str = ""
) -> JSONResponse | Response:
    with connect(database_path) as connection:
        parameters: tuple[Any, ...] = (owner,) if owner else ()
        repository_rows = rows(
            connection,
            """
            SELECT id, owner, name, url, description, observed_at
              FROM repositories
            """
            + (" WHERE owner = ?" if owner else "")
            + " ORDER BY owner, name COLLATE NOCASE",
            parameters,
        )
        for repository in repository_rows:
            repository.update(repository_signals(connection, repository["id"]))
            repository["route"] = (
                f"/catalog/repositories/{repository['owner']}/{repository['name']}"
            )
        repository_rows.sort(
            key=lambda item: (
                -item["metrics"]["stars"],
                -item["metrics"]["commits"],
                item["owner"],
                item["name"],
            )
        )
    return cacheable_json(
        request,
        {
            "kind": "repository_metric_snapshot",
            "owner": owner or None,
            "generated_at": max(
                (item["observed_at"] for item in repository_rows if item["observed_at"]),
                default=None,
            ),
            "count": len(repository_rows),
            "repositories": repository_rows,
        },
    )
