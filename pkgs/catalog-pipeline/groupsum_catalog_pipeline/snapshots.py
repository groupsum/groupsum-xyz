from __future__ import annotations

import hashlib
import json
import os
import shutil
from collections.abc import Iterable
from pathlib import Path
from typing import Any


def _canonical(value: Any) -> str:
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def _stable_id(namespace: str, *parts: object) -> str:
    digest = hashlib.sha256("\x1f".join(str(part) for part in parts).encode()).hexdigest()[:20]
    return f"{namespace}:{digest}"


def _package_id(row: dict[str, Any]) -> str:
    ecosystem = str(row.get("ecosystem") or "unknown")
    name = str(row.get("name") or "unnamed")
    owner = row.get("repository") or row.get("owner") or "registry"
    manifest = row.get("manifest_path") or "package"
    return f"package:{ecosystem}:{name}:{owner}:{manifest}"


def _measurement(
    snapshot_id: str,
    subject_type: str,
    subject_id: str,
    metric_key: str,
    value: float,
    observed_at: str,
    *,
    unit: str = "count",
    source_url: str | None = None,
    period_start: str | None = None,
    period_end: str | None = None,
    dimensions: dict[str, Any] | None = None,
) -> dict[str, Any]:
    return {
        "measurement_id": _stable_id(
            "measurement",
            snapshot_id,
            subject_type,
            subject_id,
            metric_key,
            period_start or "",
            _canonical(dimensions or {}),
        ),
        "snapshot_id": snapshot_id,
        "subject_type": subject_type,
        "subject_id": subject_id,
        "metric_key": metric_key,
        "numeric_value": float(value),
        "unit": unit,
        "dimensions": dimensions or {},
        "period_start": period_start,
        "period_end": period_end,
        "source_url": source_url,
        "observed_at": observed_at,
    }


def normalized_measurements(catalog: dict[str, Any], snapshot_id: str) -> list[dict[str, Any]]:
    generated_at = str(catalog["generated_at"])
    rows: list[dict[str, Any]] = []
    for repository in catalog.get("repositories", []):
        subject_id = f"repository:{repository['full_name']}"
        observed_at = str(repository.get("observed_at") or generated_at)
        source_url = repository.get("url") or repository.get("html_url")
        values = {
            **(repository.get("metrics") or {}),
            "commits": (repository.get("activity") or {}).get("commit_count", 0),
            "contributors": (repository.get("activity") or {}).get("contributor_count", 0),
            "github_releases": len(repository.get("github_releases") or []),
            "deployments": len(repository.get("deployments") or []),
            "environments": len(repository.get("environments") or []),
        }
        for key, value in values.items():
            if isinstance(value, (int, float)) and not isinstance(value, bool):
                rows.append(
                    _measurement(
                        snapshot_id, "source.repository", subject_id, str(key), value, observed_at,
                        unit="kilobyte" if key == "size_kb" else "count", source_url=source_url,
                    )
                )
        for language, byte_count in (
            (repository.get("technologies") or {}).get("languages_bytes") or {}
        ).items():
            rows.append(
                _measurement(
                    snapshot_id, "source.repository", subject_id, "language_bytes", byte_count,
                    observed_at, unit="byte", source_url=source_url,
                    dimensions={"language": language},
                )
            )
    for package in catalog.get("packages", []):
        subject_id = _package_id(package)
        observed_at = str(package.get("updated_at") or package.get("observed_at") or generated_at)
        source_url = package.get("registry_url") or package.get("url")
        values = {
            "downloads": package.get("downloads"),
            "releases": len(package.get("releases") or []),
            "dependencies": len(package.get("dependencies") or []),
            "dependents": len(package.get("downstream") or []),
        }
        for key, value in values.items():
            if isinstance(value, (int, float)) and not isinstance(value, bool):
                rows.append(
                    _measurement(
                        snapshot_id, "distribution.package", subject_id, key, value, observed_at,
                        unit="download" if key == "downloads" else "count", source_url=source_url,
                    )
                )
    return rows


def normalized_observations(catalog: dict[str, Any], snapshot_id: str) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    observations: list[dict[str, Any]] = list(catalog.get("observations") or [])
    for repository in catalog.get("repositories", []):
        observations.extend(repository.get("observations") or [])
    for item in observations:
        source = str(item.get("source") or "unknown")
        subject_type, _, subject_id = source.partition(":")
        if subject_type == "github.repository" and subject_id:
            subject_type, subject_id = "source.repository", f"repository:{subject_id}"
        elif not subject_id:
            subject_type, subject_id = "source", source
        observed_at = str(item.get("observed_at") or catalog["generated_at"])
        observation_id = _stable_id(
            "observation", snapshot_id, source, item.get("status"), observed_at, item.get("url")
        )
        rows.append(
            {
                "observation_id": observation_id,
                "snapshot_id": snapshot_id,
                "subject_type": subject_type,
                "subject_id": subject_id,
                "observation_type": "collection",
                "source_kind": source.split(":", 1)[0],
                "source_url": item.get("url"),
                "status": item.get("status") or "unknown",
                "observed_at": observed_at,
                "payload": item,
                "content_hash": hashlib.sha256(_canonical(item).encode()).hexdigest(),
                "confidence": "observed" if item.get("status") == "observed" else "reported",
            }
        )
    return list({row["observation_id"]: row for row in rows}.values())


def _write_jsonl(path: Path, rows: Iterable[dict[str, Any]]) -> None:
    path.write_text("".join(_canonical(row) + "\n" for row in rows), encoding="utf-8")


def publish_snapshot(catalog: dict[str, Any], output_path: Path) -> dict[str, Any]:
    digest = hashlib.sha256(_canonical(catalog).encode()).hexdigest()
    snapshot_id = f"snapshot:{str(catalog['generated_at']).replace(':', '').replace('-', '')}:{digest[:12]}"
    observations = normalized_observations(catalog, snapshot_id)
    measurements = normalized_measurements(catalog, snapshot_id)
    snapshots_root = output_path.parent / "snapshots"
    latest_path = snapshots_root / "latest.json"
    previous = None
    if latest_path.exists():
        try:
            previous = json.loads(latest_path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            previous = None
    final_dir = snapshots_root / snapshot_id.replace(":", "-")
    staging = snapshots_root / f".{final_dir.name}.tmp"
    snapshots_root.mkdir(parents=True, exist_ok=True)
    if staging.exists():
        shutil.rmtree(staging)
    staging.mkdir()
    (staging / "catalog.json").write_text(
        json.dumps(catalog, indent=2, sort_keys=True) + "\n", encoding="utf-8"
    )
    _write_jsonl(staging / "observations.jsonl", observations)
    _write_jsonl(staging / "measurements.jsonl", measurements)
    formats = ["jsonl"]
    parquet_error = None
    try:
        import duckdb

        connection = duckdb.connect()
        try:
            connection.read_json(str(staging / "measurements.jsonl")).write_parquet(
                str(staging / "measurements.parquet")
            )
            formats.append("parquet")
        finally:
            connection.close()
    except ImportError:
        parquet_error = "duckdb-not-installed"
    except duckdb.Error as exc:
        parquet_error = str(exc)
    manifest = {
        "snapshot_id": snapshot_id,
        "schema_version": catalog.get("schema_version"),
        "collected_at": catalog["generated_at"],
        "source_digest": digest,
        "collector_version": "groupsum-catalog/2",
        "parent_snapshot_id": (
            previous.get("snapshot_id")
            if previous and previous.get("snapshot_id") != snapshot_id
            else previous.get("parent_snapshot_id") if previous else None
        ),
        "status": "complete",
        "observation_count": len(observations),
        "measurement_count": len(measurements),
        "measurement_formats": formats,
        "parquet_error": parquet_error,
        "completeness": catalog.get("completeness") or {},
    }
    (staging / "manifest.json").write_text(
        json.dumps(manifest, indent=2, sort_keys=True) + "\n", encoding="utf-8"
    )
    if final_dir.exists():
        shutil.rmtree(staging)
    else:
        staging.replace(final_dir)
    latest_tmp = snapshots_root / ".latest.json.tmp"
    latest_tmp.write_text(json.dumps(manifest, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    os.replace(latest_tmp, snapshots_root / "latest.json")
    return manifest


__all__ = ["normalized_measurements", "normalized_observations", "publish_snapshot"]
