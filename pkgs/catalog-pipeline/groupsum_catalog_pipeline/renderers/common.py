#!/usr/bin/env python3
"""Compile the normalized public catalog into deterministic website datasets."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
from collections import Counter, defaultdict
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any

from ..normalization import summarize

ROOT = Path(__file__).resolve().parents[4]


def repair_text(value: Any) -> Any:
    """Repair repeatedly mis-decoded UTF-8 while preserving valid Unicode."""
    if isinstance(value, str):
        repaired = value
        for _ in range(8):
            try:
                candidate = repaired.encode("cp1252").decode("utf-8")
            except (UnicodeEncodeError, UnicodeDecodeError):
                break
            if candidate == repaired:
                break
            repaired = candidate
        return repaired
    if isinstance(value, list):
        return [repair_text(item) for item in value]
    if isinstance(value, dict):
        return {key: repair_text(item) for key, item in value.items()}
    return value


def stable_hash(value: str, size: int = 12) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()[:size]


def slug(value: str) -> str:
    normalized = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return normalized or stable_hash(value)


def observed_at(record: dict[str, Any], fallback: str) -> str:
    observations = record.get("observations") or []
    return next((item.get("observed_at") for item in observations if item.get("observed_at")), fallback)


def daily_commit_activity(
    activity: dict[str, Any], observed: str, days: int = 30
) -> list[dict[str, Any]]:
    """Return a truthful, zero-filled daily commit series ending at observation day."""
    end = datetime.fromisoformat(observed.replace("Z", "+00:00")).date()
    start = end - timedelta(days=days - 1)
    counts: Counter[str] = Counter()
    for commit in activity.get("commit_history") or []:
        timestamp = commit.get("committed_at") or commit.get("authored_at")
        if not timestamp:
            continue
        try:
            day = datetime.fromisoformat(str(timestamp).replace("Z", "+00:00")).date()
        except ValueError:
            continue
        if start <= day <= end:
            counts[day.isoformat()] += 1
    return [
        {"date": (start + timedelta(days=offset)).isoformat(), "count": counts[(start + timedelta(days=offset)).isoformat()]}
        for offset in range(days)
    ]


def related_resource_url(item: dict[str, Any]) -> str | None:
    """Normalize legacy tree links for file-backed resources in cached observations."""
    url = item.get("url")
    resource_path = str(item.get("path") or "")
    if url and resource_path and Path(resource_path).suffix and "/tree/" in url:
        return str(url).replace("/tree/", "/blob/", 1)
    return url


def write_json(path: Path, value: Any) -> dict[str, Any]:
    payload = json.dumps(repair_text(value), indent=2, sort_keys=True, ensure_ascii=False) + "\n"
    path.parent.mkdir(parents=True, exist_ok=True)
    encoded = payload.encode("utf-8")
    path.write_bytes(encoded)
    return {
        "path": path.name,
        "bytes": len(encoded),
        "sha256": hashlib.sha256(encoded).hexdigest(),
        "records": len(value) if isinstance(value, list) else 1,
    }


def load_editorial(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {"schema_version": "1.0.0", "organizations": {}, "entities": {}, "featured_ids": []}
    value = json.loads(path.read_text(encoding="utf-8"))
    if value.get("schema_version") != "1.0.0":
        raise ValueError("catalog editorial schema_version must be 1.0.0")
    return value


def evidence(kind: str, url: str | None, checked_at: str) -> list[dict[str, str]]:
    if not url:
        return []
    return [{"kind": kind, "url": url, "observed_at": checked_at}]


def canonical_package_name(value: str) -> str:
    return value.casefold().replace("_", "-")


def package_key(ecosystem: str, name: str) -> str:
    return f"{ecosystem}:{canonical_package_name(name)}"


def release_url(ecosystem: str, name: str, version: str, fallback: str | None) -> str:
    if ecosystem == "pypi":
        return f"https://pypi.org/project/{name}/{version}/"
    if ecosystem == "npm":
        return f"https://www.npmjs.com/package/{name}/v/{version}"
    if ecosystem == "crates":
        return f"https://crates.io/crates/{name}/{version}"
    return fallback or "https://github.com"


def normalized_releases(package: dict[str, Any], observed: str) -> list[dict[str, Any]]:
    ecosystem = str(package.get("ecosystem") or "unknown")
    name = str(package.get("name") or "unnamed")
    raw_releases = package.get("releases") or package.get("versions") or []
    releases: list[dict[str, Any]] = []
    for raw in raw_releases:
        if isinstance(raw, str):
            version = raw
            published_at = None
            downloads = None
            url = release_url(ecosystem, name, version, package.get("registry_url") or package.get("url"))
        else:
            version = str(raw.get("version") or raw.get("name") or raw.get("id") or "unknown")
            published_at = raw.get("published_at") or raw.get("created_at") or raw.get("updated_at")
            downloads = raw.get("downloads")
            url = raw.get("url") or release_url(
                ecosystem, name, version, package.get("registry_url") or package.get("url")
            )
        releases.append(
            {
                "release_kind": ecosystem,
                "version": version,
                "url": url,
                "published_at": published_at,
                "downloads": downloads,
                "observed_at": observed,
            }
        )
    return sorted(
        releases,
        key=lambda item: (str(item.get("published_at") or ""), item["version"]),
        reverse=True,
    )


def release_activity(releases: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Aggregate dated releases into deterministic calendar-month buckets."""
    counts: Counter[str] = Counter()
    for release in releases:
        published_at = str(release.get("published_at") or "")
        if re.match(r"^\d{4}-\d{2}", published_at):
            counts[published_at[:7]] += 1
    return [{"month": month, "count": counts[month]} for month in sorted(counts)[-24:]]
