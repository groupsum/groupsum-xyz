"""Bounded, snapshot-pinned history for one repository collection page."""

from datetime import UTC

from sqlalchemy import and_, func, or_, select

from ..tables.catalog_snapshot import CatalogSnapshot
from ..tables.metric_observation import MetricObservation

POINT_LIMIT = 30


async def attach_star_history(session, snapshot, page):
    records = page["records"]
    if not records:
        return page

    earlier = (
        and_(
            CatalogSnapshot.completed_at < snapshot.completed_at,
            CatalogSnapshot.collected_at <= snapshot.collected_at,
        )
        if snapshot.completed_at
        else False
    )
    snapshots = session.scalars(
        select(CatalogSnapshot.id).where(
            CatalogSnapshot.status == "complete", or_(CatalogSnapshot.id == snapshot.id, earlier)
        )
    ).all()

    metric = MetricObservation
    ranked = (
        select(
            metric.subject_id,
            metric.observed_at,
            metric.numeric_value,
            func.row_number()
            .over(
                partition_by=metric.subject_id,
                order_by=(
                    metric.observed_at.desc(),
                    metric.snapshot_id.desc(),
                    metric.measurement_id,
                ),
            )
            .label("rank"),
        )
        .where(
            metric.subject_type == "source.repository",
            metric.metric_key == "stars",
            metric.snapshot_id.in_(snapshots),
            metric.subject_id.in_([record["id"] for record in records]),
            metric.numeric_value.is_not(None),
        )
        .subquery()
    )
    analytics, release = metric.acquire(op_alias="list")
    try:
        result = await analytics.execute(
            select(ranked).where(ranked.c.rank <= POINT_LIMIT).order_by(ranked.c.rank.desc())
        )
        histories = {}
        for row in result.mappings().all():
            observed = row["observed_at"]
            if not observed.tzinfo:
                observed = observed.replace(tzinfo=UTC)
            histories.setdefault(row["subject_id"], []).append(
                {"observed_at": observed.isoformat(), "value": float(row["numeric_value"])}
            )
    finally:
        release()
    return {
        **page,
        "records": [
            {
                **record,
                "history": {
                    **(record.get("history") or {}),
                    "stars": histories.get(record["id"], []),
                },
            }
            for record in records
        ],
    }
