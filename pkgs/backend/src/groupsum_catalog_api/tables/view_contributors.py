from __future__ import annotations

from ..projections.contributors import contributor_records
from .association import Association
from .catalog_snapshot import CatalogSnapshot
from .observation import CatalogObservation
from .repository import Repository
from .view_common import (
    _page,
    current_entity_query,
    latest_timestamp,
    payload,
    query_params,
    row_dict,
)


def projected_contributors(table, session):
    edges = session.query(Association).filter(Association.relationship_type == "contributed_by")
    snapshot_id = (
        session.query(CatalogSnapshot.id).filter(CatalogSnapshot.is_current.is_(True)).scalar()
    )
    if snapshot_id:
        present = session.query(CatalogObservation.subject_id).filter(
            CatalogObservation.snapshot_id == snapshot_id,
            CatalogObservation.observation_type == "association_presence",
        )
        edges = edges.filter(Association.id.in_(present))
    return contributor_records(
        [row_dict(row) for row in session.query(table).all()],
        [row_dict(row) for row in current_entity_query(session, Repository).all()],
        [row_dict(row) for row in edges.all()],
    )


def contributor_collection(table, ctx):
    params = query_params(ctx)
    values = (
        ctx["frozen_contributors"]
        if "frozen_contributors" in ctx
        else projected_contributors(table, ctx["db"])
    )
    search = str(params.get("q") or "").strip().casefold()
    if search:
        values = [
            row for row in values if search in f"{row['name']} {row.get('login') or ''}".casefold()
        ]
    types = sorted({row["account_type"] for row in values})
    if params.get("account_type"):
        values = [row for row in values if row["account_type"] == params["account_type"]]
    sort = str(params.get("sort") or "contributions")
    values = sorted(
        values,
        key=lambda row: (
            (
                -row["repository_count"]
                if sort == "repositories"
                else -row["contributions"]
                if sort == "contributions"
                else 0
            ),
            row["name"].casefold(),
            row["id"],
        ),
    )
    key, _, direction = sort.rpartition("_")
    if key in {"name", "type", "repositories", "contributions"} and direction in {"asc", "desc"}:
        field = {
            "name": "name",
            "type": "account_type",
            "repositories": "repository_count",
            "contributions": "contributions",
        }[key]

        def sort_value(row):
            if key == "type":
                return {"bot": "bot", "user": "individual"}.get(
                    str(row[field]).casefold(), "unlinked identity"
                )
            return str(row[field]).casefold() if key == "name" else row[field]

        values.sort(key=sort_value, reverse=direction == "desc")
    page_values, page, page_size, page_count = _page(values, params)
    return {
        "kind": "contributor_collection",
        "resource_kind": "contributor",
        "count": len(values),
        "page": page,
        "page_size": page_size,
        "page_count": page_count,
        "account_types": types,
        "generated_at": latest_timestamp(row.get("observed_at") for row in values),
        "records": [
            {key: value for key, value in row.items() if key != "repositories"}
            for row in page_values
        ],
    }


def contributor_detail(table, ctx):
    params = payload(ctx)
    provider, identifier = str(params.get("provider") or ""), str(params.get("login") or "")
    # Match the public compound identity, not the table's unrelated primary-key read op.
    current = (
        ctx["frozen_contributors"]
        if "frozen_contributors" in ctx
        else projected_contributors(table, ctx["db"])
    )
    person = next(
        (
            item
            for item in current
            if str(item.get("provider") or "github").casefold() == provider.casefold()
            and (
                item["id"] == identifier
                or str(item.get("login") or "").casefold() == identifier.casefold()
            )
        ),
        None,
    )
    if person is None:
        return {"detail": "Contributor not found"}
    return {
        "kind": "contributor_record",
        "item": {key: value for key, value in person.items() if key != "repositories"},
        "repositories": person["repositories"],
    }


def contributor_page(values, params, *, detail=False):
    ctx = {"frozen_contributors": values, "query_params": params, "payload": params}
    return contributor_detail(None, ctx) if detail else contributor_collection(None, ctx)
