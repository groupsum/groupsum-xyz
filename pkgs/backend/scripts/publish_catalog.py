from __future__ import annotations

import argparse
import json
import logging
import os
import sys
from pathlib import Path

from groupsum_catalog_api.record_compiler import compile_catalog_records


def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
    backend_root = Path(__file__).resolve().parents[1]
    repo_root = backend_root.parents[1]
    sys.path.insert(0, str(repo_root / "pkgs" / "catalog-pipeline"))
    from groupsum_catalog_pipeline.api_client import CatalogApiClient
    from groupsum_catalog_pipeline.api_records import publication_facts, publish_catalog
    from groupsum_catalog_pipeline.publication_quality import publication_quality_errors
    from groupsum_catalog_pipeline.snapshot_source import (
        ENTITY_TYPE as SNAPSHOT_SOURCE_ENTITY_TYPE,
    )
    from groupsum_catalog_pipeline.snapshot_source import (
        snapshot_source_records,
    )

    parser = argparse.ArgumentParser(description="Publish one append-only catalog snapshot")
    parser.add_argument(
        "--api-url",
        default=os.getenv("GROUPSUM_CATALOG_API_URL", "https://groupsum.xyz"),
    )
    parser.add_argument(
        "--token",
        default=os.getenv("GROUPSUM_CATALOG_PUBLISH_API_KEY")
        or os.getenv("GROUPSUM_CATALOG_INTERNAL_TOKEN"),
    )
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    if not args.token and not args.dry_run:
        raise SystemExit("GROUPSUM_CATALOG_PUBLISH_API_KEY is required")

    catalog = json.loads((repo_root / "catalog/generated/catalog.json").read_text(encoding="utf-8"))
    quality_errors = publication_quality_errors(catalog)
    if quality_errors:
        raise SystemExit(
            "Catalog source collection is incomplete; no records published:\n"
            + "\n".join(quality_errors[:20])
        )
    entity_records, associations = compile_catalog_records(repo_root)
    descriptor, observations, measurements = publication_facts(
        catalog, entity_records, associations
    )
    source_records = snapshot_source_records(
        catalog,
        str(descriptor["snapshot_id"]),
        str(descriptor["source_digest"]),
    )
    entity_records[SNAPSHOT_SOURCE_ENTITY_TYPE] = source_records
    descriptor["source_chunk_count"] = len(source_records)
    summary = {
        "snapshot_id": descriptor["snapshot_id"],
        "entities": sum(map(len, entity_records.values())),
        "entity_types": len(entity_records),
        "associations": len(associations),
        "observations": len(observations),
        "measurements": len(measurements),
        "source_chunks": len(source_records),
    }
    if args.dry_run:
        print(json.dumps(summary, indent=2, sort_keys=True))
        return

    client = CatalogApiClient(args.api_url, args.token)
    descriptor["parent_snapshot_id"] = client.current_snapshot_id()
    results = publish_catalog(
        client, descriptor, entity_records, associations, observations, measurements
    )
    output = {**summary, "results": results}
    print(json.dumps(output, indent=2, sort_keys=True))
    github_output = os.getenv("GITHUB_OUTPUT")
    if github_output:
        deployment = results.get("snapshot", {}).get("deployment") or {}
        with Path(github_output).open("a", encoding="utf-8") as stream:
            stream.write(f"snapshot_id={descriptor['snapshot_id']}\n")
            stream.write(f"deployment_status={deployment.get('status', 'unknown')}\n")


if __name__ == "__main__":
    main()
