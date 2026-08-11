#!/usr/bin/env python3
"""Validate deterministic, display-safe catalog datasets and route contracts."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
REQUIRED_DATASETS = {"organizations", "repositories", "packages", "resources", "technologies"}
DISALLOWED_DATASETS = {"releases", "deployments", "surfaces", "relationships"}
MOJIBAKE = re.compile(r"(?:Ã.|Â.|â(?:€|€¦)|�)")


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def validate_site(site_dir: Path) -> list[str]:
    errors: list[str] = []
    manifest_path = site_dir / "manifest.json"
    if not manifest_path.exists():
        return ["missing display manifest.json"]
    manifest = load_json(manifest_path)
    product_evidence_dir = site_dir.parent / "product-evidence"
    datasets = {item.get("dataset"): item for item in manifest.get("files", [])}
    missing = REQUIRED_DATASETS - datasets.keys()
    if missing:
        errors.append(f"manifest missing datasets: {', '.join(sorted(missing))}")
    unexpected = DISALLOWED_DATASETS & datasets.keys()
    if unexpected:
        errors.append(f"manifest exposes child datasets: {', '.join(sorted(unexpected))}")
    for name in DISALLOWED_DATASETS:
        if (site_dir / f"{name}.json").exists():
            errors.append(f"standalone child dataset still exists: {name}")
    for name in {"releases", "deployments", "relationships"}:
        if name not in manifest.get("source_counts", {}):
            errors.append(f"manifest missing aggregated source count: {name}")
    evidence_files = list(product_evidence_dir.glob("*/*.json")) if product_evidence_dir.exists() else []
    if len(evidence_files) != manifest.get("product_evidence", {}).get("records"):
        errors.append("product evidence bundle count does not match manifest")
    all_routes: set[str] = set()
    for name, metadata in datasets.items():
        path = site_dir / metadata.get("path", "")
        if not path.exists():
            errors.append(f"missing dataset file: {name}")
            continue
        payload = path.read_bytes()
        # Git may materialize tracked JSON with CRLF on Windows. The renderer and
        # published manifest intentionally describe canonical UTF-8/LF bytes.
        canonical_payload = payload.replace(b"\r\n", b"\n")
        if hashlib.sha256(canonical_payload).hexdigest() != metadata.get("sha256"):
            errors.append(f"dataset hash mismatch: {name}")
        if len(canonical_payload) != metadata.get("bytes"):
            errors.append(f"dataset byte count mismatch: {name}")
        records = json.loads(canonical_payload)
        if MOJIBAKE.search(canonical_payload.decode("utf-8")):
            errors.append(f"dataset contains mojibake: {name}")
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
            if name in {"organizations", "repositories", "packages", "resources", "technologies"} and not record.get("evidence"):
                errors.append(f"{name} record missing evidence: {identity}")
            if name == "repositories" and record.get("visibility") != "public":
                errors.append(f"non-public repository rendered: {identity}")
            if name == "repositories" and str(record.get("name") or "").casefold() == ".github":
                errors.append(f"excluded .github repository rendered: {identity}")
            if name == "repositories" and not {"github_releases", "deployments"} <= set((record.get("metrics") or {}).keys()):
                errors.append(f"repository missing release/deployment aggregates: {identity}")
            if name == "repositories" and "relationship_counts" not in record:
                errors.append(f"repository missing relationship aggregates: {identity}")
            if name == "repositories" and "related_resources" not in record:
                errors.append(f"repository missing related resources: {identity}")
            if name == "repositories":
                for package in record.get("packages") or []:
                    if not package.get("id") or not package.get("route"):
                        errors.append(
                            f"repository contains package without stable navigation: {identity}"
                        )
                    if not package.get("package_kind"):
                        errors.append(
                            f"repository contains unclassified package: {identity}: {package.get('id')}"
                        )
                    if not {
                        "release_count", "release_activity", "latest_version",
                        "license_expression", "license_status", "license_url", "notice_count",
                    } <= package.keys():
                        errors.append(
                            f"repository package missing release or legal summary: {identity}: {package.get('id')}"
                        )
            if name == "repositories":
                ssot = record.get("ssot_governance") or {}
                if ssot.get("governed"):
                    required_ssot = {"registry_url", "source_sha256", "schema_version", "observed_at", "counts", "coverage"}
                    missing_ssot = required_ssot - ssot.keys()
                    if missing_ssot:
                        errors.append(
                            f"SSOT-governed repository missing provenance fields: {identity}: "
                            + ", ".join(sorted(missing_ssot))
                        )
                    if not ssot.get("valid"):
                        errors.append(f"SSOT-governed repository has invalid registry: {identity}")
            if name == "repositories":
                owner, repository_name = str(record.get("full_name") or "/").split("/", 1)
                evidence_path = product_evidence_dir / owner / f"{repository_name}.json"
                if not evidence_path.exists():
                    errors.append(f"repository missing product evidence bundle: {identity}")
            if name == "packages" and record.get("published") is True and not record.get("registry_url") and record.get("ecosystem") not in {"ghcr", "github-npm"}:
                errors.append(f"published package missing registry URL: {identity}")
            if name == "packages" and not {"release_count", "dependency_count", "downstream_count", "relationship_count", "relationship_counts"} <= record.keys():
                errors.append(f"package missing child aggregates: {identity}")
            if name == "packages" and not record.get("package_kind"):
                errors.append(f"package missing manifest classification: {identity}")
            if name == "packages" and not record.get("repository"):
                errors.append(f"package missing repository ownership: {identity}")
            if name == "packages" and "technologies" not in record:
                errors.append(f"package missing technology stack field: {identity}")
            if name == "resources":
                resource_path = str(record.get("path") or "").replace("\\", "/")
                if resource_path.startswith(".ssot/"):
                    errors.append(f"SSOT registry artifact misclassified as public resource: {identity}")
                if record.get("resource_type") == "api_definition":
                    filename = Path(resource_path).name.casefold()
                    valid_contract = filename in {
                        "openapi.json", "openapi.yaml", "openapi.yml", "openrpc.json",
                        "openrpc.yaml", "openrpc.yml", "asyncapi.json", "asyncapi.yaml",
                        "asyncapi.yml",
                    } or filename.endswith(".proto")
                    if not valid_contract:
                        errors.append(f"API definition lacks a canonical contract filename: {identity}")
            if name == "organizations" and not {"github_releases", "package_releases", "deployments", "relationships"} <= record.keys():
                errors.append(f"organization missing child aggregates: {identity}")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--site-dir", type=Path, default=ROOT / "catalog" / "generated" / "site")
    args = parser.parse_args()
    errors = validate_site(args.site_dir)
    if errors:
        for error in errors:
            print(f"catalog site validation failed: {error}")
        return 1
    manifest = load_json(args.site_dir / "manifest.json")
    print("catalog site valid: " + ", ".join(f"{name}={count}" for name, count in sorted(manifest["counts"].items())))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
