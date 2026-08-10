"""Catalog ingestion through Tigrbl-managed table sessions."""

from .importers.service import import_catalog_data


async def import_catalog(repo_root) -> dict[str, int | str]:
    return await import_catalog_data(repo_root)


__all__ = ["import_catalog", "import_catalog_data"]
