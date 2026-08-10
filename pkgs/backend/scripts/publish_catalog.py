from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

from groupsum_catalog_api.record_compiler import compile_catalog_records


def main() -> None:
    backend_root = Path(__file__).resolve().parents[1]
    repo_root = backend_root.parents[1]
    sys.path.insert(0, str(repo_root / "pkgs" / "catalog-pipeline"))
    from groupsum_catalog_pipeline.api_client import CatalogApiClient
    from groupsum_catalog_pipeline.api_records import publication_facts, publish_catalog

    parser = argparse.ArgumentParser(description="Publish one append-only catalog snapshot")
    parser.add_argument(
        "--api-url",
        default=os.getenv("GROUPSUM_CATALOG_API_URL", "https://groupsum.xyz"),
    )
    parser.add_argument("--token", default=os.getenv("GROUPSUM_CATALOG_INTERNAL_TOKEN"))
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    if not args.token and not args.dry_run:
        raise SystemExit("GROUPSUM_CATALOG_INTERNAL_TOKEN is required")

    catalog = json.loads((repo_root / "catalog/generated/catalog.json").read_text(encoding="utf-8"))
    entity_records, associations = compile_catalog_records(repo_root)
    descriptor, observations, measurements = publication_facts(
        catalog, entity_records, associations
    )
    summary = {
        "snapshot_id": descriptor["snapshot_id"],
        "entities": sum(map(len, entity_records.values())),
        "entity_types": len(entity_records),
        "associations": len(associations),
        "observations": len(observations),
        "measurements": len(measurements),
    }
    if args.dry_run:
        print(json.dumps(summary, indent=2, sort_keys=True))
        return

    client = CatalogApiClient(args.api_url, args.token)
    descriptor["parent_snapshot_id"] = client.current_snapshot_id()
    results = publish_catalog(
        client, descriptor, entity_records, associations, observations, measurements
    )
    print(json.dumps({**summary, "results": results}, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
