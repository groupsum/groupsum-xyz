"""Compatibility facade for the modular catalog importer."""

from .domain.observations.tables import CollectionRun
from .importers.common import (
    canonical_package_id,
    catalog_entity_id,
    connect,
    ensure_package_ownership_columns,
    ensure_repository_ssot_columns,
    ensure_universal_resource_columns,
    package_key,
    record_slug,
    stable_id,
)
from .importers.graph import rebuild_entity_graph


async def import_catalog(database_path, repo_root, analytics_path=None):
    """Run catalog ingestion through the CollectionRun-bound lifecycle operation."""
    return await CollectionRun.handlers.import_snapshot.invoke(
        {
            "payload": {
                "database_path": database_path,
                "repo_root": repo_root,
                "analytics_path": analytics_path,
            }
        }
    )


__all__ = [
    "canonical_package_id",
    "catalog_entity_id",
    "connect",
    "ensure_package_ownership_columns",
    "ensure_repository_ssot_columns",
    "ensure_universal_resource_columns",
    "import_catalog",
    "package_key",
    "rebuild_entity_graph",
    "record_slug",
    "stable_id",
]
