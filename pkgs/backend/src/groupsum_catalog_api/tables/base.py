from __future__ import annotations

from dataclasses import replace

from tigrbl import RestOltpTable, op_ctx
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

CREATE_READ_LIST_PROFILE = replace(
    RestOltpTable.TABLE_PROFILE,
    kind="groupsum.catalog.create_read_list",
    ops=tuple(
        replace(operation, expose_routes=False)
        for operation in RestOltpTable.TABLE_PROFILE.ops
        if operation.target in {"create", "read", "list"}
    ),
    custom=True,
    namespace="groupsum.catalog",
)


class CatalogTable(RestOltpTable):
    """Catalog table with hidden create/read/list operations bound by explicit routers."""

    __abstract__ = True
    __allow_unmapped__ = True
    TABLE_PROFILE = CREATE_READ_LIST_PROFILE


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
