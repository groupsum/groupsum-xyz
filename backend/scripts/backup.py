from __future__ import annotations

import argparse
import sqlite3
from datetime import UTC, datetime
from pathlib import Path


def main() -> None:
    backend_root = Path(__file__).resolve().parents[1]
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--database", type=Path, default=backend_root / "data" / "groupsum-catalog.sqlite3"
    )
    parser.add_argument("--output-dir", type=Path, default=backend_root / "data" / "backups")
    args = parser.parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now(UTC).strftime("%Y%m%dT%H%M%SZ")
    target = args.output_dir / f"groupsum-catalog-{stamp}.sqlite3"
    with sqlite3.connect(args.database) as source, sqlite3.connect(target) as destination:
        source.backup(destination)
    with sqlite3.connect(target) as validation:
        result = validation.execute("PRAGMA integrity_check").fetchone()[0]
    if result != "ok":
        target.unlink(missing_ok=True)
        raise RuntimeError(f"Backup integrity check failed: {result}")
    print(f"wrote verified backup {target}")


if __name__ == "__main__":
    main()
