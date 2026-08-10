from __future__ import annotations

import asyncio
import json
import os
import shutil
from pathlib import Path
from urllib.parse import quote

import httpx


async def export() -> None:
    backend_root = Path(__file__).resolve().parents[1]
    output = backend_root / "generated" / "api-snapshots"
    base_url = os.getenv("GROUPSUM_CATALOG_API_URL", "https://groupsum.xyz").rstrip("/")
    staging = output.with_name(f".{output.name}.tmp")
    if staging.exists():
        shutil.rmtree(staging)
    staging.mkdir(parents=True)
    async with httpx.AsyncClient(
        base_url=base_url, timeout=120, follow_redirects=True
    ) as client:
        async def write_endpoint(endpoint: str, target: Path) -> object:
            response = await client.get(endpoint)
            response.raise_for_status()
            payload = response.json()
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n")
            return payload

        for family, endpoint in (
            ("product", "/api/v1/products"),
            ("portfolio", "/api/v1/portfolio"),
        ):
            collection = await write_endpoint(endpoint, staging / family / "index.json")
            for record in collection.get("records", []):
                slug = str(record["slug"])
                await write_endpoint(
                    f"{endpoint}/{quote(slug, safe='')}", staging / family / f"{slug}.json"
                )
        snapshot_collection = await write_endpoint(
            "/api/v1/snapshots", staging / "snapshots" / "index.json"
        )
        for snapshot in snapshot_collection.get("snapshots", []):
            snapshot_id = str(snapshot["snapshot_id"])
            await write_endpoint(
                f"/api/v1/snapshots/{quote(snapshot_id, safe='')}",
                staging / "snapshots" / f"{snapshot_id.replace(':', '_')}.json",
            )
        analytics_overview = await write_endpoint(
            "/api/v1/analytics/overview", staging / "analytics" / "overview.json"
        )
        await write_endpoint(
            "/api/v1/analytics/summary", staging / "analytics" / "summary.json"
        )
        await write_endpoint(
            "/api/v1/repository-metrics", staging / "repository-metrics" / "index.json"
        )
        (staging / "manifest.json").write_text(
            json.dumps(
                {
                    "snapshot_id": analytics_overview.get("snapshot_id"),
                    "snapshots": snapshot_collection.get("count", 0),
                    "source": base_url,
                },
                indent=2,
                sort_keys=True,
            )
            + "\n"
        )
    if output.exists():
        shutil.rmtree(output)
    staging.replace(output)
    print(f"wrote read-only API snapshots from {base_url} to {output}")


if __name__ == "__main__":
    asyncio.run(export())
