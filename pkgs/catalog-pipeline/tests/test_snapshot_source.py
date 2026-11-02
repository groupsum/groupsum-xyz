import json
import shutil
import sys
import unittest
from pathlib import Path
from urllib.parse import quote
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "pkgs" / "catalog-pipeline"))

from groupsum_catalog_pipeline.materialize_snapshot import materialize_snapshot
from groupsum_catalog_pipeline.snapshot_source import (
    canonical_catalog_bytes,
    snapshot_source_records,
)


class SnapshotSourceTests(unittest.TestCase):
    def test_chunked_source_round_trips_through_verified_materialization(self):
        catalog = {
            "generated_at": "2026-11-02T00:00:00Z",
            "repositories": [{"full_name": "groupsum/example"}],
            "packages": [],
        }
        content = canonical_catalog_bytes(catalog)
        import hashlib

        digest = hashlib.sha256(content).hexdigest()
        snapshot_id = "snapshot:test"
        records = snapshot_source_records(
            catalog, snapshot_id, digest, chunk_size=max(1, len(content) // 2)
        )
        manifest = {
            "snapshot_id": snapshot_id,
            "source_digest": digest,
            "collected_at": catalog["generated_at"],
            "chunk_count": len(records),
            "chunks": [
                {
                    "index": row["chunk_index"],
                    "byte_count": row["byte_count"],
                    "sha256": row["content_sha256"],
                    "url": (
                        f"/api/v1/snapshots/{quote(snapshot_id, safe='')}/export/chunks/"
                        f"{row['chunk_index']}"
                    ),
                }
                for row in records
            ],
        }
        responses = {
            f"/api/v1/snapshots/{quote(snapshot_id, safe='')}/export": manifest,
            **{
                item["url"]: {
                    "snapshot_id": snapshot_id,
                    "index": row["chunk_index"],
                    "byte_count": row["byte_count"],
                    "sha256": row["content_sha256"],
                    "content_base64": row["content_base64"],
                }
                for item, row in zip(manifest["chunks"], records, strict=True)
            },
        }
        output = ROOT / ".codex-tmp" / "snapshot-source-unit-generated"
        if output.exists():
            shutil.rmtree(output)
        try:
            with patch(
                "groupsum_catalog_pipeline.materialize_snapshot._json",
                side_effect=lambda _base, path: responses[path],
            ):
                result = materialize_snapshot("https://groupsum.xyz", snapshot_id, output)

            self.assertEqual(result["source_digest"], digest)
            self.assertEqual(
                json.loads((output / "catalog.json").read_text(encoding="utf-8")), catalog
            )
        finally:
            if output.exists():
                shutil.rmtree(output)


if __name__ == "__main__":
    unittest.main()
