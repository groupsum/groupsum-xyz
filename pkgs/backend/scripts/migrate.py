from __future__ import annotations

import argparse
from pathlib import Path

from groupsum_catalog_api.app import build_app


def main() -> None:
    backend_root = Path(__file__).resolve().parents[1]
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--database", type=Path, default=backend_root / "data" / "groupsum-catalog.sqlite3"
    )
    args = parser.parse_args()
    app = build_app(args.database)
    print(f"initialized {len(app.tables)} Tigrbl tables")


if __name__ == "__main__":
    main()
