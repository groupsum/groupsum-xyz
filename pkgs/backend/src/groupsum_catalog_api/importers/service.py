from __future__ import annotations

import json
from datetime import UTC, datetime
from pathlib import Path

from ..analytics import connect_analytics, default_analytics_path
from .attachments import attach_editorial_resources, import_technologies
from .common import connect, stable_id
from .editorial import (
    import_editorial,
    import_insights,
    import_record_relations,
    prepare_import,
)
from .graph import rebuild_entity_graph
from .packages import import_packages
from .repositories import import_repositories

COUNT_KEYS = (
    "organizations",
    "repositories",
    "records",
    "insights",
    "packages",
    "releases",
    "dependencies",
    "resources",
    "languages",
)


def _site_inputs(repo_root: Path):
    site_root = repo_root / "catalog" / "generated" / "site"
    return tuple(
        json.loads((site_root / name).read_text(encoding="utf-8"))
        for name in ("repositories.json", "packages.json", "technologies.json")
    )


def _claimed_repositories(repo_root: Path, editorial: dict) -> set[str]:
    claimed: set[str] = set()
    for record in editorial["records"]:
        if record["record_type"] not in {"product", "portfolio"}:
            continue
        path = (
            repo_root
            / "catalog"
            / "generated"
            / "product-evidence"
            / record["organization_id"]
            / f"{record['source_name']}.json"
        )
        if not path.exists():
            continue
        bundle = json.loads(path.read_text(encoding="utf-8"))
        attached = bundle["repository"].get("attached_repositories") or [bundle["repository"]]
        claimed.update(item["full_name"] for item in attached if item.get("full_name"))
    return claimed


def import_catalog_data(
    database_path: str | Path,
    repo_root: Path,
    analytics_path: Path | None = None,
) -> dict[str, int]:
    editorial = json.loads(
        (repo_root / "catalog" / "content" / "records.json").read_text(encoding="utf-8")
    )
    generated_at = datetime.now(UTC).replace(microsecond=0).isoformat()
    run_id = stable_id("collection-run", "website-editorial", generated_at)
    counts = dict.fromkeys(COUNT_KEYS, 0)
    repositories, packages, technologies = _site_inputs(repo_root)
    claimed = _claimed_repositories(repo_root, editorial)
    analytics_path = analytics_path or default_analytics_path(database_path)
    with connect(database_path) as connection, connect_analytics(analytics_path) as analytics:
        prepare_import(connection, analytics, editorial, run_id, generated_at)
        import_editorial(connection, editorial, run_id, generated_at, counts)
        import_insights(connection, repo_root, generated_at, counts)
        import_record_relations(connection, editorial)
        generated_records, repository_ids = import_repositories(
            connection, analytics, repositories, claimed, generated_at, run_id, counts
        )
        import_packages(
            connection, analytics, packages, repository_ids, generated_records, generated_at, counts
        )
        import_technologies(connection, technologies, counts)
        attach_editorial_resources(connection, repo_root, editorial, repository_ids)
        counts.update(rebuild_entity_graph(connection, generated_at))
        counts["releases"] = connection.execute("SELECT COUNT(*) FROM releases").fetchone()[0]
        counts["dependencies"] = connection.execute("SELECT COUNT(*) FROM dependencies").fetchone()[
            0
        ]
        connection.execute(
            "UPDATE collection_runs SET completed_at = ?, status = ?, summary = ? WHERE id = ?",
            (generated_at, "complete", json.dumps(counts, sort_keys=True), run_id),
        )
    return counts
