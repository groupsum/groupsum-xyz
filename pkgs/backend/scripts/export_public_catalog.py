from __future__ import annotations

import argparse
import hashlib
import json
import sys
from collections import Counter
from pathlib import Path
from typing import Any

from groupsum_catalog_api.projections.public_resources import public_resource_records
from groupsum_catalog_api.projections.resource_types import resource_type_descriptors
from groupsum_catalog_api.record_compiler import compile_catalog_records
from groupsum_catalog_api.tables.registry import RESOURCE_TABLES


def _write_json(path: Path, value: Any) -> dict[str, Any]:
    payload = json.dumps(value, indent=2, sort_keys=True, ensure_ascii=False) + "\n"
    encoded = payload.encode("utf-8")
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(encoded)
    return {
        "path": path.name,
        "bytes": len(encoded),
        "sha256": hashlib.sha256(encoded).hexdigest(),
        "records": len(value) if isinstance(value, list) else 1,
    }


def export_public_catalog(repo_root: Path, site_dir: Path) -> dict[str, Any]:
    pipeline_root = repo_root / "pkgs" / "catalog-pipeline"
    sys.path.insert(0, str(pipeline_root))
    from groupsum_catalog_pipeline.snapshots import snapshot_descriptor

    catalog = json.loads(
        (repo_root / "catalog/generated/catalog.json").read_text(encoding="utf-8")
    )
    entity_records, _ = compile_catalog_records(repo_root)
    resources = public_resource_records(entity_records, frozenset(RESOURCE_TABLES))
    resource_type_counts = Counter(item["resource_type"] for item in resources)
    resource_types = resource_type_descriptors(resource_type_counts)
    resource_file = {
        "dataset": "resources",
        **_write_json(site_dir / "resources.json", resources),
    }
    resource_type_file = {
        "dataset": "resource_types",
        **_write_json(site_dir / "resource-types.json", resource_types),
    }

    manifest_path = site_dir / "manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    descriptor = snapshot_descriptor(catalog)
    manifest["snapshot"] = {
        key: descriptor[key]
        for key in ("snapshot_id", "collected_at", "source_digest", "schema_version")
    }
    manifest["counts"]["resources"] = len(resources)
    manifest["counts"]["resource_types"] = len(resource_types)
    manifest["resource_type_counts"] = dict(sorted(resource_type_counts.items()))
    manifest["resource_table_count"] = len(resource_types)
    manifest["resource_family_count"] = len({item["family"] for item in resource_types})
    manifest["populated_resource_type_count"] = sum(item["populated"] for item in resource_types)
    manifest["files"] = sorted(
        [
            resource_file if item.get("dataset") == "resources" else item
            for item in manifest["files"]
            if item.get("dataset") != "resource_types"
        ],
        key=lambda item: item["dataset"],
    )
    manifest["files"].append(resource_type_file)
    manifest["files"].sort(key=lambda item: item["dataset"])
    _write_json(manifest_path, manifest)
    return {
        "snapshot_id": descriptor["snapshot_id"],
        "resources": len(resources),
        "resource_types": len(resource_types),
        "populated_resource_types": sum(item["populated"] for item in resource_types),
    }


def main() -> None:
    backend_root = Path(__file__).resolve().parents[1]
    repo_root = backend_root.parents[1]
    parser = argparse.ArgumentParser(
        description="Export the Tigrbl public projection used by static catalog pages"
    )
    parser.add_argument(
        "--site-dir", type=Path, default=repo_root / "catalog/generated/site"
    )
    args = parser.parse_args()
    print(json.dumps(export_public_catalog(repo_root, args.site_dir), indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
