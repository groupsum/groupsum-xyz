#!/usr/bin/env python3
"""Validate deterministic, display-safe catalog datasets and route contracts."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
REQUIRED_DATASETS = {
    "organizations", "repositories", "packages", "releases",
    "deployments", "technologies", "surfaces", "relationships",
}


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def validate_site(site_dir: Path, typescript: Path) -> list[str]:
    errors: list[str] = []
    manifest_path = site_dir / "manifest.json"
    if not manifest_path.exists():
        return ["missing display manifest.json"]
    manifest = load_json(manifest_path)
    datasets = {item.get("dataset"): item for item in manifest.get("files", [])}
    missing = REQUIRED_DATASETS - datasets.keys()
    if missing:
        errors.append(f"manifest missing datasets: {', '.join(sorted(missing))}")
    all_routes: set[str] = set()
    for name, metadata in datasets.items():
        path = site_dir / metadata.get("path", "")
        if not path.exists():
            errors.append(f"missing dataset file: {name}")
            continue
        payload = path.read_bytes()
        if hashlib.sha256(payload).hexdigest() != metadata.get("sha256"):
            errors.append(f"dataset hash mismatch: {name}")
        if len(payload) != metadata.get("bytes"):
            errors.append(f"dataset byte count mismatch: {name}")
        records = json.loads(payload)
        if len(records) != metadata.get("records") or len(records) != manifest.get("counts", {}).get(name):
            errors.append(f"dataset record count mismatch: {name}")
        ids: set[str] = set()
        for record in records:
            identity = record.get("id")
            if not identity:
                errors.append(f"{name} record missing stable id")
            elif identity in ids:
                errors.append(f"duplicate {name} id: {identity}")
            ids.add(identity)
            if not record.get("observed_at"):
                errors.append(f"{name} record missing observed_at: {identity}")
            route = record.get("route")
            if route:
                if route in all_routes:
                    errors.append(f"duplicate generated route: {route}")
                all_routes.add(route)
            if name in {"organizations", "repositories", "packages", "technologies"} and not record.get("evidence"):
                errors.append(f"{name} record missing evidence: {identity}")
            if name == "repositories" and record.get("visibility") != "public":
                errors.append(f"non-public repository rendered: {identity}")
            if name == "packages" and record.get("published") is True and not record.get("registry_url") and record.get("ecosystem") not in {"ghcr", "github-npm"}:
                errors.append(f"published package missing registry URL: {identity}")
            if name == "deployments" and "live" in str(record.get("claim_boundary", "")).lower() and "not proof" not in str(record.get("claim_boundary", "")).lower():
                errors.append(f"deployment overstates live availability: {identity}")
    if not typescript.exists():
        errors.append("missing generated TypeScript summary")
    elif typescript.stat().st_size > 262_144:
        errors.append(f"generated TypeScript exceeds 256 KiB: {typescript.stat().st_size} bytes")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--site-dir", type=Path, default=ROOT / "catalog" / "generated" / "site")
    parser.add_argument("--typescript", type=Path, default=ROOT / "src" / "data" / "catalog.generated.ts")
    args = parser.parse_args()
    errors = validate_site(args.site_dir, args.typescript)
    if errors:
        for error in errors:
            print(f"catalog site validation failed: {error}")
        return 1
    manifest = load_json(args.site_dir / "manifest.json")
    print("catalog site valid: " + ", ".join(f"{name}={count}" for name, count in sorted(manifest["counts"].items())))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
