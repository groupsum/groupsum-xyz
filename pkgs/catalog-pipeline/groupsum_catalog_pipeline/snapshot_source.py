from __future__ import annotations

import base64
import hashlib
import json
from typing import Any

ENTITY_TYPE = "catalog.snapshot_source"
DEFAULT_CHUNK_SIZE = 3 * 1024 * 1024


def canonical_catalog_bytes(catalog: dict[str, Any]) -> bytes:
    return json.dumps(
        catalog,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    ).encode("utf-8")


def snapshot_source_records(
    catalog: dict[str, Any],
    snapshot_id: str,
    source_digest: str,
    *,
    chunk_size: int = DEFAULT_CHUNK_SIZE,
) -> list[dict[str, Any]]:
    content = canonical_catalog_bytes(catalog)
    if hashlib.sha256(content).hexdigest() != source_digest:
        raise ValueError("Catalog source digest does not match snapshot descriptor")
    chunks = [content[index : index + chunk_size] for index in range(0, len(content), chunk_size)]
    return [
        {
            "id": f"{snapshot_id}:source:{index}",
            "snapshot_id": snapshot_id,
            "source_digest": source_digest,
            "chunk_index": index,
            "chunk_count": len(chunks),
            "byte_count": len(chunk),
            "content_sha256": hashlib.sha256(chunk).hexdigest(),
            "content_base64": base64.b64encode(chunk).decode("ascii"),
            "observed_at": catalog["generated_at"],
        }
        for index, chunk in enumerate(chunks)
    ]


__all__ = [
    "DEFAULT_CHUNK_SIZE",
    "ENTITY_TYPE",
    "canonical_catalog_bytes",
    "snapshot_source_records",
]
