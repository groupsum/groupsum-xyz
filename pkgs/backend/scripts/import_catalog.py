from __future__ import annotations

import argparse
import asyncio
import json
from pathlib import Path

from groupsum_catalog_api.app import build_app
from groupsum_catalog_api.importer import import_catalog


def main() -> None:
    backend_root = Path(__file__).resolve().parents[1]
    repo_root = backend_root.parents[1]
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--database", type=Path, default=backend_root / "data" / "groupsum-catalog.sqlite3"
    )
    args = parser.parse_args()
    build_app(args.database)
    print(
        json.dumps(asyncio.run(import_catalog(args.database, repo_root)), indent=2, sort_keys=True)
    )


if __name__ == "__main__":
    main()
