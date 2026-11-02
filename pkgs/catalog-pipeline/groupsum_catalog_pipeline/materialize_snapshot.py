from __future__ import annotations

import argparse
import base64
import hashlib
import json
import os
import shutil
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any


def _json(base_url: str, path: str, *, timeout: int = 120) -> dict[str, Any]:
    request = urllib.request.Request(
        f"{base_url.rstrip('/')}{path}",
        headers={"Accept": "application/json", "User-Agent": "groupsum-catalog-materializer"},
    )
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            value = json.loads(response.read().decode("utf-8"))
    except (urllib.error.HTTPError, urllib.error.URLError) as exc:
        raise RuntimeError(f"Unable to download {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError(f"Expected an object from {path}")
    return value


def materialize_snapshot(base_url: str, snapshot_id: str, output: Path) -> dict[str, Any]:
    encoded_id = urllib.parse.quote(snapshot_id, safe="")
    manifest = _json(base_url, f"/api/v1/snapshots/{encoded_id}/export")
    if manifest.get("snapshot_id") != snapshot_id:
        raise ValueError("Snapshot export manifest identity mismatch")
    chunks = manifest.get("chunks")
    if not isinstance(chunks, list) or len(chunks) != manifest.get("chunk_count"):
        raise ValueError("Snapshot export manifest has incomplete chunks")
    content = bytearray()
    for expected_index, descriptor in enumerate(chunks):
        if not isinstance(descriptor, dict) or descriptor.get("index") != expected_index:
            raise ValueError("Snapshot export chunks are not contiguous")
        path = str(descriptor.get("url") or "")
        expected_prefix = f"/api/v1/snapshots/{encoded_id}/export/chunks/"
        if not path.startswith(expected_prefix):
            raise ValueError("Snapshot export contains an untrusted chunk URL")
        chunk_payload = _json(base_url, path)
        if (
            chunk_payload.get("snapshot_id") != snapshot_id
            or chunk_payload.get("index") != expected_index
        ):
            raise ValueError("Snapshot export chunk identity mismatch")
        chunk = base64.b64decode(str(chunk_payload.get("content_base64") or ""), validate=True)
        digest = hashlib.sha256(chunk).hexdigest()
        if digest != descriptor.get("sha256") or digest != chunk_payload.get("sha256"):
            raise ValueError("Snapshot export chunk digest mismatch")
        if len(chunk) != descriptor.get("byte_count"):
            raise ValueError("Snapshot export chunk size mismatch")
        content.extend(chunk)
    source_digest = hashlib.sha256(content).hexdigest()
    if source_digest != manifest.get("source_digest"):
        raise ValueError("Snapshot export source digest mismatch")
    catalog = json.loads(content.decode("utf-8"))
    staging = output.with_name(f".{output.name}.materializing")
    if staging.exists():
        shutil.rmtree(staging)
    staging.mkdir(parents=True)
    (staging / "catalog.json").write_bytes(content)
    (staging / "snapshot-provenance.json").write_text(
        json.dumps(
            {
                "snapshot_id": snapshot_id,
                "source_digest": source_digest,
                "collected_at": manifest.get("collected_at"),
                "source": base_url.rstrip("/"),
            },
            indent=2,
            sort_keys=True,
        )
        + "\n",
        encoding="utf-8",
    )
    if output.exists():
        for child in output.iterdir():
            if child.name not in {"catalog.json", "snapshot-provenance.json"}:
                target = staging / child.name
                if child.is_dir():
                    shutil.copytree(child, target)
                else:
                    shutil.copy2(child, target)
        shutil.rmtree(output)
    staging.replace(output)
    return {
        "snapshot_id": snapshot_id,
        "source_digest": source_digest,
        "repositories": len(catalog.get("repositories", [])),
        "packages": len(catalog.get("packages", [])),
    }


def main() -> int:
    root = Path(__file__).resolve().parents[3]
    parser = argparse.ArgumentParser(description="Materialize one immutable catalog snapshot")
    parser.add_argument(
        "--api-url",
        default=os.getenv("GROUPSUM_CATALOG_API_URL", "https://groupsum.xyz"),
    )
    parser.add_argument("--snapshot-id", required=True)
    parser.add_argument("--output", type=Path, default=root / "catalog" / "generated")
    args = parser.parse_args()
    print(
        json.dumps(
            materialize_snapshot(args.api_url, args.snapshot_id, args.output),
            indent=2,
            sort_keys=True,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
