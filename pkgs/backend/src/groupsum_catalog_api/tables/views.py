from __future__ import annotations

from .views_catalog import (
    catalog_overview,
    entity_collection,
    entity_detail,
    insight_collection,
)
from .views_records import organization_detail, record_collection, record_detail
from .views_resources import (
    catalog_collection,
    package_detail,
    release_detail,
    repository_detail,
    repository_metrics,
    resource_collection,
    resource_detail,
    technology_detail,
)

__all__ = [
    "catalog_collection",
    "catalog_overview",
    "entity_collection",
    "entity_detail",
    "insight_collection",
    "organization_detail",
    "package_detail",
    "record_collection",
    "record_detail",
    "release_detail",
    "repository_detail",
    "repository_metrics",
    "resource_collection",
    "resource_detail",
    "technology_detail",
]
