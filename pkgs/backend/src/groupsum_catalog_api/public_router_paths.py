from dataclasses import replace
from typing import Any

from tigrbl_core._spec import PathSpec, TableSpec

from .tables.catalog_snapshot import CatalogSnapshot
from .tables.metric_observation import MetricObservation
from .tables.observation import CatalogObservation
from .tables.registry import ALL_TABLES


def _table_spec(table: type, *, ops: tuple[Any, ...] = ()) -> TableSpec:
    return TableSpec(
        model_ref=f"{table.__module__}:{table.__name__}",
        engine_name=getattr(table, "ENGINE_NAME", None),
        ops=ops,
    )


def public_paths() -> tuple[PathSpec, ...]:
    route_tables = (
        CatalogObservation,
        MetricObservation,
        CatalogSnapshot,
        *(
            table
            for table in ALL_TABLES
            if table not in {CatalogObservation, MetricObservation, CatalogSnapshot}
        ),
    )
    paths = [
        PathSpec(
            path="/",
            kind="resource",
            tables=tuple(_table_spec(table) for table in route_tables),
        )
    ]
    for table in route_tables:
        for operation in tuple(getattr(table, "__tigrbl_ops__", ()) or ()):
            for binding in tuple(getattr(operation, "bindings", ()) or ()):
                if getattr(binding, "proto", None) != "http.rest":
                    continue
                paths.append(
                    PathSpec(
                        path=binding.path,
                        kind="resource",
                        tables=(
                            _table_spec(
                                table,
                                ops=(replace(operation, bindings=(binding,)),),
                            ),
                        ),
                    )
                )
    return tuple(paths)
