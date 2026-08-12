from __future__ import annotations

from collections.abc import Mapping

from ..domain.resources.ontology import RESOURCE_TYPES
from ..tables.registry import RESOURCE_TABLES


def resource_type_descriptors(
    counts: Mapping[str, int] | None = None,
) -> list[dict[str, object]]:
    """Describe every registered public resource table with current-snapshot counts."""

    current_counts = counts or {}
    missing = set(RESOURCE_TABLES).difference(RESOURCE_TYPES)
    if missing:
        raise ValueError(f"Resource tables lack ontology definitions: {', '.join(sorted(missing))}")
    return [
        {
            "id": resource_type,
            "resource_type": resource_type,
            "label": definition.label,
            "family": definition.family,
            "icon_key": definition.icon_key,
            "detail_schema_key": definition.detail_schema_key,
            "table_name": model.__tablename__,
            "count": int(current_counts.get(resource_type, 0)),
            "populated": int(current_counts.get(resource_type, 0)) > 0,
        }
        for resource_type, model in RESOURCE_TABLES.items()
        for definition in [RESOURCE_TYPES[resource_type]]
    ]


__all__ = ["resource_type_descriptors"]
