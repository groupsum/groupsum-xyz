from __future__ import annotations

import asyncio
import json
import shutil
import tempfile
from pathlib import Path
from urllib.parse import quote

import httpx

from groupsum_catalog_api.app import build_app
from groupsum_catalog_api.importer import import_catalog


async def export() -> None:
    backend_root = Path(__file__).resolve().parents[1]
    repo_root = backend_root.parents[1]
    output = backend_root / "generated" / "api-snapshots"
    with tempfile.TemporaryDirectory(
        prefix="groupsum-static-api-", ignore_cleanup_errors=True
    ) as temp_dir:
        temp_root = Path(temp_dir)
        app = build_app(temp_root / "catalog.sqlite3", temp_root / "analytics.duckdb")
        await import_catalog(repo_root)
        if output.exists():
            shutil.rmtree(output)
        transport = httpx.ASGITransport(app=app)
        async with httpx.AsyncClient(
            transport=transport, base_url="http://catalog.local"
        ) as client:
            async def write_endpoint(endpoint: str, target: Path) -> object:
                response = await client.get(endpoint)
                if response.status_code != 200:
                    raise RuntimeError(f"{endpoint}: HTTP {response.status_code}")
                payload = response.json()
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n")
                return payload

            snapshot_collection = await write_endpoint(
                "/api/v1/snapshots", output / "snapshots" / "index.json"
            )
            for snapshot in snapshot_collection.get("snapshots", []):
                snapshot_id = str(snapshot["snapshot_id"])
                await write_endpoint(
                    f"/api/v1/snapshots/{quote(snapshot_id, safe='')}",
                    output / "snapshots" / f"{snapshot_id.replace(':', '_')}.json",
                )
            analytics_overview = await write_endpoint(
                "/api/v1/analytics/overview", output / "analytics" / "overview.json"
            )
            await write_endpoint(
                "/api/v1/analytics/summary", output / "analytics" / "summary.json"
            )
            await write_endpoint(
                "/api/v1/repository-metrics",
                output / "repository-metrics" / "index.json",
            )
            (output / "manifest.json").write_text(
                json.dumps(
                    {
                        "snapshot_id": analytics_overview.get("snapshot_id"),
                        "snapshots": snapshot_collection.get("count", 0),
                        "exports": [
                            "/api/v1/snapshots",
                            "/api/v1/analytics/overview",
                            "/api/v1/analytics/summary",
                            "/api/v1/repository-metrics",
                        ],
                    },
                    indent=2,
                    sort_keys=True,
                )
                + "\n"
            )
    print(f"wrote backend API snapshots to {output}")


if __name__ == "__main__":
    asyncio.run(export())
