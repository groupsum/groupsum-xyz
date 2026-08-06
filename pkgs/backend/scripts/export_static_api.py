from __future__ import annotations

import asyncio
import json
import shutil
from pathlib import Path

import httpx

from groupsum_catalog_api.app import build_app
from groupsum_catalog_api.importer import import_catalog


async def export() -> None:
    backend_root = Path(__file__).resolve().parents[1]
    repo_root = backend_root.parents[1]
    database_path = backend_root / "data" / "static-api-export.sqlite3"
    output = backend_root / "generated" / "api-snapshots"
    app = build_app(database_path)
    await import_catalog(database_path, repo_root)
    if output.exists():
        shutil.rmtree(output)
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://catalog.local") as client:
        endpoints = {
            "product": "/api/v1/products",
            "portfolio": "/api/v1/portfolio",
            "solution": "/api/v1/solutions",
            "service": "/api/v1/services",
        }
        for family, endpoint in endpoints.items():
            response = await client.get(endpoint)
            if response.status_code != 200:
                raise RuntimeError(f"{endpoint}: HTTP {response.status_code}")
            collection = response.json()
            target = output / family / "index.json"
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(json.dumps(collection, indent=2, sort_keys=True) + "\n")
            for record in collection.get("records", []):
                slug = record["slug"]
                response = await client.get(f"{endpoint}/{slug}")
                if response.status_code != 200:
                    raise RuntimeError(f"{family}/{slug}: HTTP {response.status_code}")
                (output / family / f"{slug}.json").write_text(
                    json.dumps(response.json(), indent=2, sort_keys=True) + "\n"
                )
        metrics = (await client.get("/api/v1/repository-metrics")).json()
        target = output / "repository-metrics" / "index.json"
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(json.dumps(metrics, indent=2, sort_keys=True) + "\n")
    print(f"wrote backend API snapshots to {output}")


if __name__ == "__main__":
    asyncio.run(export())
