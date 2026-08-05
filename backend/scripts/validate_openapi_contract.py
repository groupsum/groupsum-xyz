from __future__ import annotations

import json
from pathlib import Path

OPENAPI_PATH = Path(__file__).resolve().parents[1] / "openapi.json"
COLLECTIONS = (
    "/api/v1/catalog/repositories",
    "/api/v1/catalog/packages",
    "/api/v1/catalog/resources",
    "/api/v1/catalog/technologies",
)
MEMBERS = (
    "/api/v1/catalog/repositories/{owner}/{repository}",
    "/api/v1/catalog/packages/{route_key}",
    "/api/v1/catalog/resources/{route_key}",
    "/api/v1/catalog/technologies/{slug}",
)


def response_schema(operation: dict) -> dict:
    return (
        operation.get("responses", {})
        .get("200", {})
        .get("content", {})
        .get("application/json", {})
        .get("schema", {})
    )


def main() -> None:
    document = json.loads(OPENAPI_PATH.read_text(encoding="utf-8"))
    paths = document.get("paths", {})
    failures: list[str] = []
    for path in (*COLLECTIONS, *MEMBERS):
        operation = paths.get(path, {}).get("get", {})
        schema = response_schema(operation)
        if not operation:
            failures.append(f"missing GET {path}")
        elif not schema.get("$ref"):
            failures.append(f"GET {path} lacks a typed 200 JSON response")
    for path in COLLECTIONS:
        parameters = {
            parameter.get("name")
            for parameter in paths.get(path, {}).get("get", {}).get("parameters", [])
        }
        for required in ("page", "page_size", "q", "sort"):
            if required not in parameters:
                failures.append(f"GET {path} lacks {required} query parameter")
    if failures:
        raise SystemExit("OpenAPI catalog contract validation failed:\n- " + "\n- ".join(failures))
    print(f"validated {len(COLLECTIONS)} collections and {len(MEMBERS)} member contracts")


if __name__ == "__main__":
    main()
