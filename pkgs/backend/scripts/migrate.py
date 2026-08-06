from __future__ import annotations

import argparse
from pathlib import Path

from groupsum_catalog_api.app import build_app
from groupsum_catalog_api.migrations import migrate


def main() -> None:
    backend_root = Path(__file__).resolve().parents[1]
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--database", type=Path, default=backend_root / "data" / "groupsum-catalog.sqlite3"
    )
    args = parser.parse_args()
    build_app(args.database)
    print(f"applied migrations: {migrate(args.database)}")


if __name__ == "__main__":
    main()
