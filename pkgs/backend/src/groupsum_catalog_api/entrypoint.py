from __future__ import annotations

import asyncio
from pathlib import Path

import uvicorn

from .app import app
from .config import Settings
from .importer import import_catalog


def main() -> None:
    settings = Settings.from_environment()
    asyncio.run(import_catalog(settings.database_url, Path("/app"), settings.analytics_path))
    uvicorn.run(app, host="0.0.0.0", port=8000, proxy_headers=True, forwarded_allow_ips="*")


if __name__ == "__main__":
    main()
