from __future__ import annotations

import hmac
import inspect
from dataclasses import replace
from datetime import UTC, datetime
from typing import Any

from pydantic import BaseModel, Field
from sqlalchemy import DateTime as SqlDateTime
from sqlalchemy import func, select, update
from tigrbl import JSONResponse, post
from tigrbl.factories.router import defineRouterSpec
from tigrbl_core._spec import PathSpec, RouterSpec, TableSpec

from .config import Settings
from .tables.association import Association
from .tables.catalog_snapshot import CatalogSnapshot
from .tables.metric_observation import MetricObservation
from .tables.observation import CatalogObservation
from .tables.registry import ENTITY_TABLES


class RecordBatch(BaseModel):
    snapshot_id: str
    records: list[dict[str, Any]] = Field(default_factory=list)


class SnapshotCreate(BaseModel):
    snapshot_id: str
    schema_version: str | None = None
    collected_at: datetime
    collector_version: str | None = None
    source_digest: str
    parent_snapshot_id: str | None = None
    completeness: dict[str, Any] = Field(default_factory=dict)
    observation_count: int = Field(ge=0)
    measurement_count: int = Field(ge=0)
    error_count: int = Field(default=0, ge=0)


class InternalResponse(BaseModel):
    status: str
    snapshot_id: str
    accepted: int = 0
    created: int = 0
    existing: int = 0


def _payload(ctx: dict[str, Any]) -> dict[str, Any]:
    value = ctx.get("payload") or {}
    if hasattr(value, "model_dump"):
        value = value.model_dump(mode="python")
    return dict(value)


def _request(ctx: dict[str, Any]) -> Any:
    return getattr(ctx, "request", None) or ctx.get("request")


def _path_parameter(ctx: dict[str, Any], name: str) -> str:
    request = _request(ctx)
    if request is not None:
        value = request.path_params.get(name) or request.scope.get("path_params", {}).get(name)
        if value is not None:
            return str(value)
    value = (ctx.get("path_params") or {}).get(name)
    if value is not None:
        return str(value)
    hot = (ctx.get("temp") or {}).get("hot_ctx")
    value = (getattr(hot, "path_params", None) or {}).get(name)
    return str(value or "")


def _authorized(ctx: dict[str, Any]) -> bool:
    configured = Settings.from_environment().catalog_internal_token
    if not configured:
        return False
    request = _request(ctx)
    supplied = request.headers.get("authorization", "") if request is not None else ""
    prefix = "Bearer "
    return supplied.startswith(prefix) and hmac.compare_digest(supplied[len(prefix) :], configured)


async def _maybe_await(value: Any) -> Any:
    return await value if inspect.isawaitable(value) else value


def _coerce_row(table: type, row: dict[str, Any]) -> dict[str, Any]:
    columns = {column.name: column for column in table.__table__.columns}
    unknown = set(row).difference(columns)
    if unknown:
        raise ValueError(f"Unknown {table.__name__} fields: {', '.join(sorted(unknown))}")
    value = dict(row)
    for name, column in columns.items():
        raw = value.get(name)
        if (
            raw is not None
            and isinstance(column.type, SqlDateTime)
            and not isinstance(raw, datetime)
        ):
            parsed = datetime.fromisoformat(str(raw).replace("Z", "+00:00"))
            value[name] = parsed if parsed.tzinfo else parsed.replace(tzinfo=UTC)
    return value


async def _persist_batch(
    table: type,
    snapshot_id: str,
    records: list[dict[str, Any]],
    *,
    append_only: bool,
) -> dict[str, Any]:
    primary_keys = [column.name for column in table.__table__.primary_key.columns]
    if len(primary_keys) != 1:
        raise ValueError(f"{table.__name__} must have one primary key")
    primary_key = primary_keys[0]
    created = existing = 0
    session, release = table.acquire(op_alias="create")
    try:
        for raw in records:
            row = _coerce_row(table, raw)
            current = await _maybe_await(session.get(table, row[primary_key]))
            if current is not None and append_only:
                existing += 1
                continue
            if current is None:
                session.add(table(**row))
                created += 1
            else:
                await _maybe_await(session.merge(table(**row)))
                existing += 1
        await _maybe_await(session.commit())
    except Exception:
        await _maybe_await(session.rollback())
        raise
    finally:
        release()
    return {
        "status": "ok",
        "snapshot_id": snapshot_id,
        "accepted": len(records),
        "created": created,
        "existing": existing,
    }


def _bind_batch(path: str, *, table: type, alias: str, append_only: bool) -> None:
    async def endpoint(cls: type, ctx: dict[str, Any]) -> Any:
        if not _authorized(ctx):
            return JSONResponse({"detail": "Unauthorized"}, status_code=401)
        body = RecordBatch.model_validate(_payload(ctx))
        try:
            return await _persist_batch(
                cls,
                body.snapshot_id,
                body.records,
                append_only=append_only,
            )
        except (KeyError, TypeError, ValueError) as exc:
            return JSONResponse({"detail": str(exc)}, status_code=422)

    endpoint.__name__ = alias
    endpoint.__qualname__ = alias
    post(
        path,
        bind=table,
        alias=alias,
        target="custom",
        arity="collection",
        persist="skip",
        request_schema=RecordBatch,
        response_schema=InternalResponse,
        status_code=200,
    )(endpoint)


async def publish_entities(_cls: type, ctx: dict[str, Any]) -> Any:
    if not _authorized(ctx):
        return JSONResponse({"detail": "Unauthorized"}, status_code=401)
    entity_type = _path_parameter(ctx, "entity_type")
    table = ENTITY_TABLES.get(entity_type)
    if table is None:
        return JSONResponse({"detail": f"Unknown entity type: {entity_type}"}, status_code=404)
    body = RecordBatch.model_validate(_payload(ctx))
    try:
        return await _persist_batch(
            table,
            body.snapshot_id,
            body.records,
            append_only=False,
        )
    except (KeyError, TypeError, ValueError) as exc:
        return JSONResponse({"detail": str(exc)}, status_code=422)


publish_entities.__name__ = "publish_entities"
publish_entities.__qualname__ = publish_entities.__name__
post(
    "/internal/v1/catalog/entities/{entity_type}",
    bind=Association,
    alias="publish_entities",
    target="custom",
    arity="collection",
    persist="skip",
    request_schema=RecordBatch,
    response_schema=InternalResponse,
    status_code=200,
)(publish_entities)

_bind_batch(
    "/internal/v1/catalog/associations",
    table=Association,
    alias="publish_associations",
    append_only=False,
)
_bind_batch(
    "/internal/v1/catalog/observations",
    table=CatalogObservation,
    alias="publish_observations",
    append_only=True,
)
_bind_batch(
    "/internal/v1/catalog/metrics",
    table=MetricObservation,
    alias="publish_metrics",
    append_only=True,
)


async def _count(table: type, snapshot_id: str) -> int:
    session, release = table.acquire(op_alias="list")
    try:
        result = await _maybe_await(
            session.execute(
                select(func.count()).select_from(table).where(table.snapshot_id == snapshot_id)
            )
        )
        return int(result.scalar_one())
    finally:
        release()


async def create_snapshot(_cls: type, ctx: dict[str, Any]) -> Any:
    if not _authorized(ctx):
        return JSONResponse({"detail": "Unauthorized"}, status_code=401)
    body = SnapshotCreate.model_validate(_payload(ctx))
    actual_observations = await _count(CatalogObservation, body.snapshot_id)
    actual_measurements = await _count(MetricObservation, body.snapshot_id)
    expected = (body.observation_count, body.measurement_count)
    actual = (actual_observations, actual_measurements)
    if actual != expected:
        return JSONResponse(
            {
                "detail": "Snapshot facts are incomplete",
                "snapshot_id": body.snapshot_id,
                "expected": {"observations": expected[0], "measurements": expected[1]},
                "actual": {"observations": actual[0], "measurements": actual[1]},
            },
            status_code=409,
        )

    session, release = CatalogSnapshot.acquire(op_alias="create")
    try:
        existing = await _maybe_await(session.get(CatalogSnapshot, body.snapshot_id))
        if existing is not None:
            if existing.source_digest != body.source_digest:
                return JSONResponse({"detail": "Snapshot id already exists"}, status_code=409)
            return {
                "status": "ok",
                "snapshot_id": body.snapshot_id,
                "accepted": 1,
                "created": 0,
                "existing": 1,
            }
        await _maybe_await(session.execute(update(CatalogSnapshot).values(is_current=False)))
        session.add(
            CatalogSnapshot(
                id=body.snapshot_id,
                schema_version=body.schema_version,
                collected_at=body.collected_at,
                completed_at=datetime.now(UTC).replace(microsecond=0),
                status="complete",
                collector_version=body.collector_version,
                source_digest=body.source_digest,
                parent_snapshot_id=body.parent_snapshot_id,
                is_current=True,
                completeness=body.completeness,
                observation_count=actual_observations,
                measurement_count=actual_measurements,
                error_count=body.error_count,
            )
        )
        await _maybe_await(session.commit())
    except Exception:
        await _maybe_await(session.rollback())
        raise
    finally:
        release()
    return {
        "status": "ok",
        "snapshot_id": body.snapshot_id,
        "accepted": 1,
        "created": 1,
        "existing": 0,
    }


create_snapshot.__name__ = "publish_snapshot"
create_snapshot.__qualname__ = create_snapshot.__name__
post(
    "/internal/v1/catalog/snapshots",
    bind=CatalogSnapshot,
    alias="publish_snapshot",
    target="custom",
    arity="collection",
    persist="skip",
    request_schema=SnapshotCreate,
    response_schema=InternalResponse,
    status_code=200,
)(create_snapshot)


def _table_spec(table: type, operation: Any) -> TableSpec:
    return TableSpec(
        model_ref=f"{table.__module__}:{table.__name__}",
        engine_name=getattr(table, "ENGINE_NAME", None),
        ops=(operation,),
    )


def _internal_paths() -> tuple[PathSpec, ...]:
    paths: list[PathSpec] = []
    route_tables = (
        Association,
        CatalogObservation,
        MetricObservation,
        CatalogSnapshot,
    )
    for table in route_tables:
        for operation in tuple(getattr(table, "__tigrbl_ops__", ()) or ()):
            if not operation.alias.startswith("publish_"):
                continue
            for binding in tuple(operation.bindings or ()):
                paths.append(
                    PathSpec(
                        path=binding.path,
                        kind="resource",
                        tables=(
                            _table_spec(table, replace(operation, bindings=(binding,))),
                        ),
                    )
                )
    return tuple(paths)


class InternalApiRouterSpec(defineRouterSpec(name="internal-api", paths=_internal_paths())):
    pass


INTERNAL_API_ROUTER = RouterSpec.collect(InternalApiRouterSpec)

__all__ = ["INTERNAL_API_ROUTER", "InternalApiRouterSpec", "RecordBatch", "SnapshotCreate"]
