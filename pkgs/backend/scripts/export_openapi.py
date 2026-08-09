from __future__ import annotations

import asyncio
import json
import os
import tempfile
from pathlib import Path

import httpx

from groupsum_catalog_api.app import build_app


async def export() -> None:
    backend_root = Path(__file__).resolve().parents[1]
    target = Path(os.getenv("GROUPSUM_OPENAPI_OUTPUT", backend_root / "openapi.json"))
    target.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(
        prefix="groupsum-openapi-", ignore_cleanup_errors=True
    ) as directory:
        app = build_app(Path(directory) / "catalog.sqlite3")
        transport = httpx.ASGITransport(app=app)
        async with httpx.AsyncClient(
            transport=transport, base_url="http://catalog.local"
        ) as client:
            response = await client.get("/openapi.json")
            response.raise_for_status()
            document = response.json()
    target.write_text(
        json.dumps(document, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    print(f"wrote {target}")


if __name__ == "__main__":
    asyncio.run(export())
