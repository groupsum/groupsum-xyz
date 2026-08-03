from __future__ import annotations

import json
from pathlib import Path

from groupsum_catalog_api.app import build_app


def main() -> None:
    backend_root = Path(__file__).resolve().parents[1]
    app = build_app(backend_root / "data" / "openapi-export.sqlite3")
    target = backend_root / "openapi.json"
    target.write_text(json.dumps(app.openapi(), indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(f"wrote {target}")


if __name__ == "__main__":
    main()
