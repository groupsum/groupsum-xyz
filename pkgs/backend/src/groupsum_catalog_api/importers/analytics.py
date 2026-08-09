from __future__ import annotations

import hashlib
import json
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from ..tables.package import Package
from ..tables.repository import Repository
from ..tables.technology import Technology
from .common import stable_id


def _canonical(value: Any) -> str:
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def snapshot_bundle(repo_root: Path) -> tuple[dict[str, Any], list[dict], list[dict]]:
    snapshots = repo_root / "catalog/generated/snapshots"
    latest = snapshots / "latest.json"
    if latest.exists():
        manifest = json.loads(latest.read_text(encoding="utf-8"))
        snapshot_dir = snapshots / str(manifest["snapshot_id"]).replace(":", "-")
        observations = _read_jsonl(snapshot_dir / "observations.jsonl")
        measurements = _read_jsonl(snapshot_dir / "measurements.jsonl")
        return manifest, observations, measurements

    catalog = json.loads((repo_root / "catalog/generated/catalog.json").read_text(encoding="utf-8"))
    digest = hashlib.sha256(_canonical(catalog).encode()).hexdigest()
    timestamp = str(catalog["generated_at"]).replace(":", "").replace("-", "")
    snapshot_id = f"snapshot:{timestamp}:{digest[:12]}"
    observations = []
    for item in catalog.get("observations") or []:
        source = str(item.get("source") or "unknown")
        subject_type, separator, subject_id = source.partition(":")
        if subject_type == "github.repository" and subject_id:
            subject_type, subject_id = Repository.ENTITY_TYPE, f"repository:{subject_id}"
        elif not separator:
            subject_type, subject_id = "source", source
        observations.append(
            {
                "observation_id": stable_id(
                    "observation", snapshot_id, source, item.get("status"), item.get("observed_at")
                ),
                "snapshot_id": snapshot_id,
                "subject_type": subject_type,
                "subject_id": subject_id,
                "observation_type": "collection",
                "source_kind": source.split(":", 1)[0],
                "source_url": item.get("url"),
                "status": item.get("status") or "unknown",
                "observed_at": item.get("observed_at") or catalog["generated_at"],
                "payload": item,
                "content_hash": hashlib.sha256(_canonical(item).encode()).hexdigest(),
                "confidence": "observed" if item.get("status") == "observed" else "reported",
            }
        )
    manifest = {
        "snapshot_id": snapshot_id,
        "schema_version": catalog.get("schema_version"),
        "collected_at": catalog["generated_at"],
        "source_digest": digest,
        "collector_version": "groupsum-catalog/1-compat",
        "status": "complete",
        "observation_count": len(observations),
        "measurement_count": 0,
        "completeness": catalog.get("completeness") or {},
    }
    return manifest, observations, []


def _read_jsonl(path: Path) -> list[dict]:
    if not path.exists():
        return []
    return [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line]


def rendered_measurements(
    snapshot_id: str,
    repositories: list[dict],
    packages: list[dict],
    technologies: list[dict],
) -> list[dict]:
    rows: list[dict] = []

    def add(
        subject_type: str,
        subject_id: str,
        metric_key: str,
        value: object,
        observed_at: object,
        unit: str = "count",
        dimensions: dict | None = None,
        source_url: str | None = None,
        period_start: str | None = None,
        period_end: str | None = None,
    ) -> None:
        if not isinstance(value, (int, float)) or isinstance(value, bool):
            return
        rows.append(
            {
                "measurement_id": stable_id(
                    "measurement", snapshot_id, subject_type, subject_id, metric_key,
                    period_start or "", _canonical(dimensions or {}),
                ),
                "snapshot_id": snapshot_id,
                "subject_type": subject_type,
                "subject_id": subject_id,
                "metric_key": metric_key,
                "numeric_value": float(value),
                "text_value": None,
                "unit": unit,
                "dimensions": dimensions or {},
                "period_start": period_start,
                "period_end": period_end,
                "source_url": source_url,
                "source_observation_id": None,
                "observed_at": observed_at,
            }
        )

    for row in repositories:
        observed_at = row.get("observed_at")
        for key, value in (row.get("metrics") or {}).items():
            add(
                Repository.ENTITY_TYPE, row["id"], key, value, observed_at,
                "kilobyte" if key == "size_kb" else "count", source_url=row.get("url"),
            )
        for point in row.get("commit_activity") or []:
            add(
                Repository.ENTITY_TYPE, row["id"], "commits_daily", point.get("count"),
                observed_at, period_start=point.get("date"), period_end=point.get("date"),
                source_url=row.get("url"),
            )
        for language, value in (row.get("language_bytes") or {}).items():
            add(
                Repository.ENTITY_TYPE, row["id"], "language_bytes", value, observed_at,
                "byte", {"language": language}, row.get("url"),
            )
    for row in packages:
        observed_at = row.get("observed_at")
        for key in ("downloads", "release_count", "dependency_count", "dependent_count"):
            add(
                Package.ENTITY_TYPE, row["id"], key, row.get(key), observed_at,
                "download" if key == "downloads" else "count",
                source_url=row.get("registry_url") or row.get("source_url"),
            )
    for row in technologies:
        observed_at = row.get("observed_at")
        add(Technology.ENTITY_TYPE, row["id"], "bytes", row.get("bytes"), observed_at, "byte")
        add(
            Technology.ENTITY_TYPE, row["id"], "repository_count", row.get("repository_count"),
            observed_at,
        )
    return rows


def completed_at() -> datetime:
    return datetime.now(UTC).replace(microsecond=0)


__all__ = ["completed_at", "rendered_measurements", "snapshot_bundle"]
