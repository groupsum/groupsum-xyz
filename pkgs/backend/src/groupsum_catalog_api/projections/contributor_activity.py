"""Build contributor activity from identified commits in one frozen source export."""

from collections import Counter, defaultdict
from datetime import UTC, datetime, timedelta
from urllib.parse import urlsplit

from ..tables.view_common import _page

RULE_VERSION = "1"
WEEK = timedelta(days=7)


def _date(value):
    try:
        result = datetime.fromisoformat(str(value))
        return result.astimezone(UTC) if result.tzinfo else result.replace(tzinfo=UTC)
    except ValueError:
        return None


def _monday(value):
    return value.replace(hour=0, minute=0, second=0, microsecond=0) - timedelta(
        days=value.weekday()
    )


def activity_deltas(data, coverage):
    """Compare two adjacent 30-day windows ending at the snapshot cutoff."""
    through = _date(data.get("through"))
    weeks = data.get("weeks") or []
    repos = {row["name"] for row in data.get("repositories", [])}
    if through is None or not weeks or not repos or "events" not in data:
        return None
    middle = through - timedelta(days=30)
    start = middle - timedelta(days=30)
    first = _date(weeks[0])
    if first is None or first > start:
        return None
    for repo in repos:
        bounds = coverage.get(repo) or {}
        since, until = _date(bounds.get("since")), _date(bounds.get("until"))
        if since is None or until is None or since > start or until < through:
            return None
    counts = [0, 0]
    active = [set(), set()]
    for event in data.get("events", []):
        at = _date(event.get("at"))
        if at is not None and start < at <= through and event["repository"] in repos:
            window = int(at > middle)
            counts[window] += 1
            active[window].add(event["repository"])
    return {
        "commits": counts[1] - counts[0],
        "active_repositories": len(active[1]) - len(active[0]),
    }


def recent_activity_counts(activity, people):
    """Compare four complete UTC weeks, never scoring incomplete repository coverage."""
    cutoff = next(
        (value for row in activity.values() if (value := _date(row.get("through")))), None
    )
    if cutoff is None:
        return None, {}
    end = _monday(cutoff)
    start = end - 4 * WEEK
    weeks = [(start + i * WEEK).date().isoformat() for i in range(4)]
    counts = {}
    for person in people:
        data = activity.get(person["id"])
        if not person.get("provider_id") or not data or _date(data.get("through")) != cutoff:
            continue
        dates = data.get("weeks", [])
        if not all(week in dates for week in weeks):
            continue
        indexes = [dates.index(week) for week in weeks]
        repos = {row["name"]: row["cells"] for row in data.get("repositories", [])}
        expected = {row["name"] for row in person.get("repositories", [])}
        if not expected or repos.keys() != expected:
            continue
        if all(
            len(cells) > max(indexes) and all(cells[i]["complete"] for i in indexes)
            for cells in repos.values()
        ):
            counts[person["id"]] = sum(
                cells[i]["count"] for cells in repos.values() for i in indexes
            )
    return {"start": weeks[0], "end": (end - timedelta(days=1)).date().isoformat()}, counts


def build_contributor_activity(catalog, people):
    cutoff = _date(catalog.get("generated_at"))
    if cutoff is None:
        return {}
    weeks = [_monday(cutoff) - WEEK * index for index in range(12, -1, -1)]
    coverage, events = {}, defaultdict(dict)
    for repo in catalog.get("repositories", []):
        if repo.get("visibility") != "public" or not repo.get("full_name"):
            continue
        key = repo["full_name"]
        activity = repo.get("activity") or {}
        bounds = activity.get("commit_coverage") or {}
        start, end = _date(bounds.get("since")), _date(bounds.get("until"))
        if start and end and start <= end <= cutoff:
            coverage[key] = (start, end)
        for commit in activity.get("commit_history") or []:
            actor, sha = commit.get("author_id"), commit.get("sha")
            # Use commit time for consistency with the collected GitHub window.
            occurred = _date(commit.get("committed_at"))
            url = str(commit.get("url") or "")
            source = urlsplit(url)
            if not (
                actor
                and sha
                and occurred
                and weeks[0] <= occurred <= cutoff
                and source.scheme == "https"
                and source.netloc == "github.com"
                and source.path == f"/{key}/commit/{sha}"
            ):
                continue
            events[str(actor)][(key, sha)] = {
                "id": f"{key}:{sha}",
                "repository": key,
                "at": occurred.isoformat(),
                "week": _monday(occurred).date().isoformat(),
                "url": url,
                "label": str(commit.get("message") or sha[:12])[:160],
            }

    result = {}
    for person in people:
        repos = person["repositories"]
        actor = str(person.get("provider_id") or "")
        keys = {repo["name"] for repo in repos}
        observed = sorted(
            (event for event in events.get(actor, {}).values() if event["repository"] in keys),
            key=lambda event: (event["at"], event["id"]),
        )
        counts = Counter((event["repository"], event["week"]) for event in observed)
        grid = []
        for repo in repos:
            key = repo["name"]
            bounds = coverage.get(key) if actor else None
            cells = []
            for week in weeks:
                label = week.date().isoformat()
                count = counts[key, label]
                complete = bool(bounds and bounds[0] <= week and week + WEEK <= bounds[1])
                cells.append({"count": count, "complete": complete})
            grid.append({"name": key, "route": repo["route"], "cells": cells})
        result[person["id"]] = {
            "weeks": [week.date().isoformat() for week in weeks],
            "repositories": grid,
            "events": observed,
            "through": cutoff.isoformat(),
        }
    return result


def activity_projection(person, repositories, activity, params):
    if params.get("activity") == "timeline":
        rows = [
            event
            for event in (activity or {}).get("events", [])
            if event["week"] == params.get("week")
            and event["repository"] == params.get("repository")
        ]
        selected, page, size, pages = _page(list(reversed(rows)), params)
        return {
            "kind": "contributor_timeline",
            "records": selected,
            "count": len(rows),
            "page": page,
            "page_size": size,
            "page_count": pages,
        }

    achievements = []
    if person.get("provider_id") and len(repositories) >= 2:
        achievements.append(
            {
                "id": "multi-repo",
                "label": "Multi-repository contributor",
                "reason": f"Observed across {len(repositories)} catalog repositories.",
                "evidence": [
                    {"label": repo["name"], "url": repo["route"]} for repo in repositories[:3]
                ],
            }
        )
    observed = (activity or {}).get("events", [])
    if observed:
        first = observed[0]
        achievements.append(
            {
                "id": "observed-commit",
                "label": "First observed commit in this window",
                "reason": first["repository"],
                "at": first["at"],
                "evidence": [{"label": "View commit", "url": first["url"]}],
            }
        )
    return {
        "kind": "contributor_activity",
        "rule_version": RULE_VERSION,
        "identity_linked": bool(person.get("provider_id")),
        **{key: value for key, value in (activity or {}).items() if key != "events"},
        "commit_count": len(observed),
        "achievements": achievements,
    }
