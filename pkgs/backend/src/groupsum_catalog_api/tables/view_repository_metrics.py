from __future__ import annotations

from .view_common import current_entity_query, latest_timestamp, query_params


def repository_metrics(table, ctx):
    params = query_params(ctx)
    owner = str(params.get("owner", "")).strip()
    try:
        limit = min(24, max(1, int(params.get("limit", 4))))
    except (TypeError, ValueError):
        limit = 4

    def build(session):
        query = current_entity_query(session, table)
        if owner:
            query = query.filter(table.owner == owner)
        rows = query.with_entities(
            table.id.label("id"),
            table.owner.label("owner"),
            table.name.label("name"),
            table.url.label("url"),
            table.description.label("description"),
            table.observed_at.label("observed_at"),
            table.source_payload["metrics"].label("metrics"),
            table.source_payload["history"].label("history"),
            table.source_payload["commit_activity"].label("commit_activity"),
            table.source_payload["pushed_at"].label("pushed_at"),
            table.source_payload["updated_at"].label("updated_at"),
        ).all()
        records = []
        for row in rows:
            metrics = dict(row.metrics or {})
            metrics = {
                key: int(metrics.get(key) or 0)
                for key in ("stars", "forks", "watchers", "contributors", "commits")
            }
            history = dict(row.history or {})
            records.append(
                {
                    "id": row.id,
                    "owner": row.owner,
                    "name": row.name,
                    "url": row.url,
                    "route": f"/catalog/repositories/{row.owner}/{row.name}",
                    "description": row.description,
                    "metrics": metrics,
                    "history": {
                        key: history.get(key) or []
                        for key in ("stars", "forks", "watchers", "contributors")
                    },
                    "commit_activity": row.commit_activity or [],
                    "observed_at": row.observed_at,
                    "activity_at": latest_timestamp(
                        [
                            row.pushed_at,
                            row.updated_at,
                            *(
                                point.get("date")
                                for point in (row.commit_activity or [])
                                if isinstance(point, dict) and int(point.get("count") or 0) > 0
                            ),
                        ]
                    ),
                }
            )
        records.sort(
            key=lambda item: (
                str(item.get("activity_at") or item.get("observed_at") or ""),
                str(item["owner"]).casefold(),
                str(item["name"]).casefold(),
            ),
            reverse=True,
        )
        summary = {
            "count": len(records),
            **{
                key: sum(int(item["metrics"].get(key) or 0) for item in records)
                for key in ("stars", "commits", "contributors")
            },
        }
        visible_records = records[:limit]
        for item in visible_records:
            item.pop("activity_at", None)
        return {
            "kind": "repository_metric_snapshot",
            "owner": owner or None,
            "generated_at": latest_timestamp(item.get("observed_at") for item in records),
            "count": len(records),
            "summary": summary,
            "repositories": visible_records,
        }

    return build(ctx["db"])
