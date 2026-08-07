"""Catalog ingestion through Tigrbl-managed table sessions."""

from .importers.service import import_catalog_data


async def import_catalog(database_path, repo_root, analytics_path=None):
    return import_catalog_data(database_path, repo_root, analytics_path)


__all__ = ["import_catalog", "import_catalog_data"]
