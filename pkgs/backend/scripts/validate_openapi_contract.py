from __future__ import annotations

import json
from pathlib import Path

OPENAPI_PATH = Path(__file__).resolve().parents[1] / "openapi.json"
TABLES = (
    "organization",
    "product",
    "portfolio",
    "repository",
    "package",
    "typedresource",
    "technology",
    "catalogentry",
    "portfolioproduct",
    "portfoliorepository",
    "productrepository",
    "productpackage",
    "productresource",
    "repositorypackage",
    "repositoryresource",
    "repositorytechnology",
    "packagetechnology",
    "repositoryssotregistry",
    "repositoryssotitem",
)


def main() -> None:
    document = json.loads(OPENAPI_PATH.read_text(encoding="utf-8"))
    paths = document.get("paths", {})
    failures: list[str] = []
    for table in TABLES:
        collection = paths.get(f"/{table}", {})
        member = paths.get(f"/{table}/{{item_id}}", {})
        if set(collection) != {"get"}:
            failures.append(f"/{table} must expose only list GET")
        if set(member) != {"get"}:
            failures.append(f"/{table}/{{item_id}} must expose only read GET")
    if failures:
        raise SystemExit("OpenAPI table contract validation failed:\n- " + "\n- ".join(failures))
    print(f"validated native read/list contracts for {len(TABLES)} Tigrbl tables")


if __name__ == "__main__":
    main()
