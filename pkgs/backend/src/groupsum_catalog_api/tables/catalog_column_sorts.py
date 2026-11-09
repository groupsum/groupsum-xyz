"""Sort keys for repository and package collection columns."""

import re
from datetime import UTC, datetime


def _release_sort(item: dict):
    release = item.get("latest_release")
    if isinstance(release, dict):
        release = next(
            (
                release[key]
                for key in (
                    "published_at",
                    "publishedAt",
                    "released_at",
                    "release_date",
                    "created_at",
                    "createdAt",
                )
                if release.get(key)
            ),
            None,
        )
    if not release:
        return None
    try:
        parsed = datetime.fromisoformat(str(release))
        return (parsed if parsed.tzinfo else parsed.replace(tzinfo=UTC)).timestamp()
    except ValueError:
        return None


def _text_sort(value):
    return str(value).casefold() if value else None


def _version_sort(item: dict):
    version = _text_sort(item.get("latest_version"))
    if version is None:
        return None
    return tuple(
        (1, int(part)) if part.isdigit() else (0, part) for part in re.split(r"(\d+)", version)
    )


def _repository_sort(item: dict):
    repositories = item.get("repositories") or []
    first = repositories[0] if repositories else {}
    return _text_sort(
        f"{first['owner']}/{first.get('name', '')}"
        if first.get("owner")
        else item.get("repository")
    )


COLUMN_SORTS = {
    "name_lex": lambda item: _text_sort(item.get("name")),
    "owner": lambda item: _text_sort(item.get("owner")),
    "forks": lambda item: float((item.get("metrics") or {}).get("forks") or 0),
    "commits": lambda item: sum(
        float(point.get("count") or 0) for point in (item.get("commit_activity") or [])[-30:]
    ),
    "contributors": lambda item: float(
        (item.get("metrics") or {}).get("contributors") or len(item.get("contributors") or [])
    ),
    "packages": lambda item: float(item.get("package_count") or len(item.get("package_ids") or [])),
    "latest_release": _release_sort,
    "ecosystem": lambda item: _text_sort(item.get("ecosystem")),
    "repository": _repository_sort,
    "publication": lambda item: _text_sort(
        "published" if item.get("published") else item.get("publication_status")
    ),
    "version": _version_sort,
    "dependencies": lambda item: float(item.get("dependency_count") or 0),
    "dependents": lambda item: float(item.get("dependent_count") or 0),
    "license": lambda item: _text_sort(item.get("license_expression")),
}
