"""Bound bulk-import operation for the catalog collection-run table."""

from typing import Any

from tigrbl import op_ctx

from ..importers.service import import_catalog_data
from .observations.tables import CollectionRun


@op_ctx(alias="import_snapshot", target="custom", arity="collection", persist="skip", rest=False)
def import_snapshot(cls, ctx):
    payload: dict[str, Any] = ctx.get("payload", {})
    return import_catalog_data(
        payload["database_path"], payload["repo_root"], payload.get("analytics_path")
    )


CollectionRun.import_snapshot = import_snapshot
