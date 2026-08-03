from __future__ import annotations

import json
import shutil
from pathlib import Path
from types import SimpleNamespace

from groupsum_catalog_api.app import build_app
from groupsum_catalog_api.importer import connect, import_catalog
from groupsum_catalog_api.page_models import (
    record_collection,
    record_detail,
    repository_metric_snapshot,
)


def payload(response) -> dict:
    return json.loads(bytes(response.body))


def main() -> None:
    backend_root = Path(__file__).resolve().parents[1]
    repo_root = backend_root.parent
    database_path = backend_root / "data" / "page-model-export.sqlite3"
    output = backend_root / "generated" / "page-models"
    build_app(database_path)
    import_catalog(database_path, repo_root)
    if output.exists():
        shutil.rmtree(output)
    request = SimpleNamespace(headers={}, query_params={})
    with connect(database_path) as connection:
        records = connection.execute(
            "SELECT slug, record_type FROM records WHERE visibility = 'public'"
        ).fetchall()
    for record_type in ("product", "portfolio", "solution", "service"):
        collection = payload(record_collection(database_path, request, record_type))
        target = output / record_type / "index.json"
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(json.dumps(collection, indent=2, sort_keys=True) + "\n")
    for record in records:
        slug = record["slug"]
        record_type = record["record_type"]
        if record_type == "insight":
            continue
        model = payload(record_detail(database_path, request, slug, record_type))
        target = output / record_type / f"{slug}.json"
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(json.dumps(model, indent=2, sort_keys=True) + "\n")
    repository_metrics = payload(repository_metric_snapshot(database_path, request))
    metrics_target = output / "repository-metrics" / "index.json"
    metrics_target.parent.mkdir(parents=True, exist_ok=True)
    metrics_target.write_text(
        json.dumps(repository_metrics, indent=2, sort_keys=True) + "\n"
    )
    print(f"wrote page models to {output}")


if __name__ == "__main__":
    main()
