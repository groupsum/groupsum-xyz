from __future__ import annotations

import json
from pathlib import Path

OPENAPI_PATH = Path(__file__).resolve().parents[1] / "openapi.json"
EXPECTED_TABLE_COUNT = 158
REMOVED_TABLES = (
    "catalogentry",
    "repositoryssotitem",
    "typedresource",
)


def main() -> None:
    document = json.loads(OPENAPI_PATH.read_text(encoding="utf-8"))
    paths = document.get("paths", {})
    failures: list[str] = []
    native_paths = {
        path: operations
        for path, operations in paths.items()
        if not path.startswith("/api/") and path not in {"/healthz", "/openapi.json"}
    }
    table_names = sorted(path.removeprefix("/") for path in native_paths if path.count("/") == 1)
    if len(table_names) != EXPECTED_TABLE_COUNT:
        failures.append(f"expected {EXPECTED_TABLE_COUNT} native tables, found {len(table_names)}")
    for table in table_names:
        collection = native_paths.get(f"/{table}", {})
        member = native_paths.get(f"/{table}/{{item_id}}", {})
        if set(collection) != {"get"}:
            failures.append(f"/{table} must expose only list GET")
        if set(member) != {"get"}:
            failures.append(f"/{table}/{{item_id}} must expose only read GET")
    for table in REMOVED_TABLES:
        if f"/{table}" in paths or f"/{table}/{{item_id}}" in paths:
            failures.append(f"removed table /{table} must not be exposed")
    for required in ("association", "contentinsight", "contractopenapi"):
        if required not in table_names:
            failures.append(f"required concrete table /{required} is missing")
    if failures:
        raise SystemExit("OpenAPI table contract validation failed:\n- " + "\n- ".join(failures))
    print(f"validated native read/list contracts for {len(table_names)} Tigrbl tables")


if __name__ == "__main__":
    main()
