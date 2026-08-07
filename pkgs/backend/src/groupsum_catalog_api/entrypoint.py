from __future__ import annotations

import asyncio
from pathlib import Path

from tigrcorn import run
from tigrcorn.config import build_config

from .app import app
from .config import Settings
from .importer import import_catalog


def main() -> None:
    settings = Settings.from_environment()
    asyncio.run(import_catalog(settings.database_url, Path("/app"), settings.analytics_path))
    config = build_config(
        host="0.0.0.0",
        port=8000,
        config={
            "proxy": {
                "proxy_headers": True,
                "forwarded_allow_ips": ["*"],
            }
        },
    )
    run(app, config=config)


if __name__ == "__main__":
    main()
