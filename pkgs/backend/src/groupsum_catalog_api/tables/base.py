from __future__ import annotations

from dataclasses import replace

from tigrbl import RestOlapTable, op_ctx
from tigrbl.types import (
    JSON,
    Boolean,
    Column,
    DateTime,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
)

READ_LIST_PROFILE = replace(
    RestOlapTable.TABLE_PROFILE,
    kind="groupsum.catalog.read_list",
    ops=tuple(
        replace(operation, expose_routes=False)
        for operation in RestOlapTable.TABLE_PROFILE.ops
        if operation.target in {"read", "list"}
    ),
    custom=True,
    namespace="groupsum.catalog",
)


class CatalogTable(RestOlapTable):
    """Public catalog table exposing only Tigrbl's native read and list operations."""

    __abstract__ = True
    __allow_unmapped__ = True
    TABLE_PROFILE = READ_LIST_PROFILE


__all__ = [
    "Boolean",
    "CatalogTable",
    "Column",
    "DateTime",
    "Integer",
    "Numeric",
    "JSON",
    "op_ctx",
    "String",
    "Text",
    "UniqueConstraint",
]
