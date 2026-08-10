from __future__ import annotations

import json
from pathlib import Path

OPENAPI_PATH = Path(__file__).resolve().parents[1] / "openapi.json"
REQUIRED_PATHS = (
    "/api/v1/catalog",
    "/api/v1/catalog/repositories",
    "/api/v1/catalog/packages",
    "/api/v1/catalog/resources",
    "/api/v1/catalog/technologies",
    "/api/v1/products",
    "/api/v1/portfolio",
    "/api/v1/entities",
    "/api/v1/analytics/overview",
    "/api/v1/analytics/summary",
)


def main() -> None:
    document = json.loads(OPENAPI_PATH.read_text(encoding="utf-8"))
    paths = document.get("paths", {})
    failures: list[str] = []
    native_paths = [
        path
        for path in paths
        if not path.startswith(("/api/", "/internal/", "/system/"))
        and path not in {"/healthz", "/openapi.json"}
    ]
    if native_paths:
        failures.append(f"storage-table routes must not be public: {', '.join(native_paths)}")
    for required in REQUIRED_PATHS:
        if set(paths.get(required, {})) != {"get"}:
            failures.append(f"{required} must expose GET")
    required_internal_paths = (
        "/internal/v1/catalog/entities/{entity_type}",
        "/internal/v1/catalog/associations",
        "/internal/v1/catalog/observations",
        "/internal/v1/catalog/metrics",
        "/internal/v1/catalog/snapshots",
    )
    for required in required_internal_paths:
        if set(paths.get(required, {})) != {"post"}:
            failures.append(f"{required} must expose POST")
    for path, methods in paths.items():
        if path.startswith("/internal/") and set(methods) != {"post"}:
            failures.append(f"{path} must expose only POST")
    if failures:
        raise SystemExit("OpenAPI table contract validation failed:\n- " + "\n- ".join(failures))
    print(f"validated {len(REQUIRED_PATHS)} curated API contracts")


if __name__ == "__main__":
    main()
