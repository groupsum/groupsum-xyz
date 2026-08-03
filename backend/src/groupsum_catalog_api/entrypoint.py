from __future__ import annotations

from pathlib import Path

import uvicorn

from .app import app
from .config import Settings
from .importer import import_catalog


def main() -> None:
    settings = Settings.from_environment()
    import_catalog(settings.database_path, Path("/app"))
    uvicorn.run(app, host="0.0.0.0", port=8000, proxy_headers=True, forwarded_allow_ips="*")


if __name__ == "__main__":
    main()
