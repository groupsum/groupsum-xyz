from __future__ import annotations

import base64
import hashlib
import inspect
import json
from datetime import UTC, datetime
from typing import Any
from urllib.parse import quote

from sqlalchemy import func, select, update
from tigrbl import JSONResponse

from .catalog_auth import PublisherPrincipal
from .deployment_dispatch import dispatch_snapshot
from .projections.read_models import valid_read_models
from .tables.catalog_deployment_request import CatalogDeploymentRequest
from .tables.catalog_snapshot import CatalogSnapshot
from .tables.catalog_snapshot_source import CatalogSnapshotSource
from .tables.metric_observation import MetricObservation
from .tables.observation import CatalogObservation


async def _maybe_await(value: Any) -> Any:
    return await value if inspect.isawaitable(value) else value


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


async def _validate_source(body: Any) -> JSONResponse | None:
    session, release = CatalogSnapshotSource.acquire(op_alias="list")
    try:
        rows = (
            session.query(CatalogSnapshotSource)
            .filter(CatalogSnapshotSource.snapshot_id == body.snapshot_id)
            .order_by(CatalogSnapshotSource.chunk_index)
            .all()
        )
    finally:
        release()
    if [row.chunk_index for row in rows] != list(range(body.source_chunk_count)) or any(
        row.chunk_count != body.source_chunk_count or row.source_digest != body.source_digest
        for row in rows
    ):
        return JSONResponse(
            {
                "detail": "Snapshot source chunks are incomplete",
                "snapshot_id": body.snapshot_id,
            },
            status_code=409,
        )
    try:
        chunks = [base64.b64decode(row.content_base64, validate=True) for row in rows]
    except ValueError:
        return JSONResponse({"detail": "Snapshot source chunk is invalid"}, status_code=422)
    if any(
        len(chunk) != row.byte_count or hashlib.sha256(chunk).hexdigest() != row.content_sha256
        for row, chunk in zip(rows, chunks, strict=True)
    ):
        return JSONResponse({"detail": "Snapshot source chunk digest mismatch"}, status_code=409)
    if hashlib.sha256(b"".join(chunks)).hexdigest() != body.source_digest:
        return JSONResponse({"detail": "Snapshot source digest mismatch"}, status_code=409)
    if body.completeness.get("public_projection_version"):
        try:
            source = json.loads(b"".join(chunks))
            models = source.get("_public_read_model")
        except (ValueError, AttributeError):
            models = None
        if (
            not valid_read_models(models)
            or models["version"] != body.completeness["public_projection_version"]
        ):
            return JSONResponse(
                {"detail": "Snapshot public projection is incomplete"}, status_code=409
            )
    return None


async def _dispatch_deployment(snapshot_id: str) -> dict[str, Any]:
    session, release = CatalogDeploymentRequest.acquire(op_alias="create")
    try:
        current = await _maybe_await(session.get(CatalogDeploymentRequest, snapshot_id))
        if current is not None and current.status == "dispatched":
            return {"status": "dispatched"}
        dispatch = dispatch_snapshot(snapshot_id)
        attempted_at = datetime.now(UTC).replace(microsecond=0)
        session.merge(
            CatalogDeploymentRequest(
                id=snapshot_id,
                status=dispatch.status,
                attempt_count=int(getattr(current, "attempt_count", 0) or 0) + 1,
                last_attempt_at=attempted_at,
                dispatched_at=attempted_at if dispatch.status == "dispatched" else None,
                last_error=dispatch.detail,
            )
        )
        await _maybe_await(session.commit())
        return {"status": dispatch.status, "detail": dispatch.detail}
    except Exception:
        await _maybe_await(session.rollback())
        raise
    finally:
        release()


async def finalize_snapshot(body: Any, publisher: PublisherPrincipal) -> Any:
    export_manifest_url = f"/api/v1/snapshots/{quote(body.snapshot_id, safe='')}/export"
    actual = (
        await _count(CatalogObservation, body.snapshot_id),
        await _count(MetricObservation, body.snapshot_id),
    )
    expected = (body.observation_count, body.measurement_count)
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
    source_error = await _validate_source(body)
    if source_error is not None:
        return source_error

    session, release = CatalogSnapshot.acquire(op_alias="create")
    try:
        existing = await _maybe_await(session.get(CatalogSnapshot, body.snapshot_id))
        if existing is not None:
            if existing.source_digest != body.source_digest:
                return JSONResponse({"detail": "Snapshot id already exists"}, status_code=409)
            deployment = await _dispatch_deployment(body.snapshot_id)
            return {
                "status": "ok",
                "snapshot_id": body.snapshot_id,
                "accepted": 1,
                "created": 0,
                "existing": 1,
                "publisher_id": existing.publisher_id,
                "export_manifest_url": export_manifest_url,
                "deployment": deployment,
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
                observation_count=actual[0],
                measurement_count=actual[1],
                error_count=body.error_count,
                publisher_id=publisher.publisher_id,
            )
        )
        await _maybe_await(session.commit())
    except Exception:
        await _maybe_await(session.rollback())
        raise
    finally:
        release()

    deployment = await _dispatch_deployment(body.snapshot_id)
    return {
        "status": "ok",
        "snapshot_id": body.snapshot_id,
        "accepted": 1,
        "created": 1,
        "existing": 0,
        "publisher_id": publisher.publisher_id,
        "export_manifest_url": export_manifest_url,
        "deployment": deployment,
    }


__all__ = ["finalize_snapshot"]
