from __future__ import annotations

import json
from pathlib import Path

from groupsum_catalog_api.app import build_app

COLLECTION_PARAMETERS = {
    "/api/v1/catalog/repositories": ("page", "page_size", "q", "owner", "sort"),
    "/api/v1/catalog/packages": (
        "page",
        "page_size",
        "q",
        "ecosystem",
        "publication_status",
        "sort",
    ),
    "/api/v1/catalog/resources": (
        "page",
        "page_size",
        "q",
        "resource_type",
        "repository_owner",
        "sort",
    ),
    "/api/v1/catalog/technologies": ("page", "page_size", "q", "sort"),
}


def add_collection_parameters(schema: dict) -> dict:
    for path, names in COLLECTION_PARAMETERS.items():
        schema["paths"][path]["get"]["parameters"] = [
            {
                "name": name,
                "in": "query",
                "required": False,
                "schema": {
                    "type": "integer" if name in {"page", "page_size"} else "string",
                    **({"minimum": 1} if name in {"page", "page_size"} else {}),
                },
            }
            for name in names
        ]
    return schema


def main() -> None:
    backend_root = Path(__file__).resolve().parents[1]
    app = build_app(backend_root / "data" / "openapi-export.sqlite3")
    target = backend_root / "openapi.json"
    target.write_text(
        json.dumps(add_collection_parameters(app.openapi()), indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    print(f"wrote {target}")


if __name__ == "__main__":
    main()
