from datetime import UTC, datetime

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from groupsum_catalog_api.tables.catalog_snapshot import CatalogSnapshot
from groupsum_catalog_api.tables.observation import CatalogObservation
from groupsum_catalog_api.tables.repository import Repository
from groupsum_catalog_api.tables.view_common import current_entity_query
from groupsum_catalog_api.tables.views_resources import repository_metrics


def test_current_entity_query_excludes_entities_absent_from_current_snapshot() -> None:
    engine = create_engine("sqlite://")
    for table in (Repository.__table__, CatalogSnapshot.__table__, CatalogObservation.__table__):
        table.create(engine)
    observed_at = datetime(2026, 8, 12, tzinfo=UTC)

    with Session(engine) as session:
        session.add_all(
            [
                Repository(
                    id="repository:current",
                    provider="github",
                    owner="groupsum",
                    name="current",
                    url="https://github.com/groupsum/current",
                ),
                Repository(
                    id="repository:stale",
                    provider="github",
                    owner="groupsum",
                    name="stale",
                    url="https://github.com/groupsum/stale",
                ),
                CatalogSnapshot(
                    id="snapshot:current",
                    collected_at=observed_at,
                    status="complete",
                    source_digest="a" * 64,
                    is_current=True,
                ),
                CatalogObservation(
                    id="observation:current",
                    snapshot_id="snapshot:current",
                    subject_type=Repository.ENTITY_TYPE,
                    subject_id="repository:current",
                    observation_type="entity_presence",
                    source_kind="groupsum-catalog",
                    status="observed",
                    observed_at=observed_at,
                    payload={},
                    content_hash="b" * 64,
                    confidence="observed",
                ),
            ]
        )
        session.commit()

        assert [row.id for row in current_entity_query(session, Repository).all()] == [
            "repository:current"
        ]


def test_repository_metrics_returns_a_bounded_metric_projection() -> None:
    engine = create_engine("sqlite://")
    for table in (Repository.__table__, CatalogSnapshot.__table__, CatalogObservation.__table__):
        table.create(engine)
    observed_at = datetime(2026, 8, 12, tzinfo=UTC)

    with Session(engine) as session:
        repositories = []
        observations = []
        for index, name in enumerate(("older", "newer"), start=1):
            repository_id = f"repository:groupsum/{name}"
            repositories.append(
                Repository(
                    id=repository_id,
                    provider="github",
                    owner="groupsum",
                    name=name,
                    url=f"https://github.com/groupsum/{name}",
                    description=f"{name} repository",
                    observed_at=observed_at,
                    source_payload={
                        "metrics": {
                            "stars": index,
                            "forks": index,
                            "watchers": index,
                            "contributors": index,
                            "commits": index,
                        },
                        "history": {"stars": [{"observed_at": "2026-08-12", "value": index}]},
                        "commit_activity": [{"date": f"2026-08-1{index}", "count": index}],
                        "pushed_at": f"2026-08-1{index}T00:00:00Z",
                        "governance": {"inventory": ["must not escape"]},
                        "github_releases": [{"name": "must not escape"}],
                    },
                )
            )
            observations.append(
                CatalogObservation(
                    id=f"observation:{index}",
                    snapshot_id="snapshot:current",
                    subject_type=Repository.ENTITY_TYPE,
                    subject_id=repository_id,
                    observation_type="entity_presence",
                    source_kind="groupsum-catalog",
                    status="observed",
                    observed_at=observed_at,
                    payload={},
                    content_hash=str(index) * 64,
                    confidence="observed",
                )
            )
        session.add_all(
            repositories
            + observations
            + [
                CatalogSnapshot(
                    id="snapshot:current",
                    collected_at=observed_at,
                    status="complete",
                    source_digest="a" * 64,
                    is_current=True,
                )
            ]
        )
        session.commit()

        result = repository_metrics(
            Repository,
            {"db": session, "query_params": {"owner": "groupsum", "limit": "1"}},
        )

    assert result["count"] == 2
    assert result["summary"] == {"count": 2, "stars": 3, "commits": 3, "contributors": 3}
    assert len(result["repositories"]) == 1
    assert result["repositories"][0]["name"] == "newer"
    assert set(result["repositories"][0]) == {
        "id",
        "owner",
        "name",
        "url",
        "route",
        "description",
        "metrics",
        "history",
        "commit_activity",
        "observed_at",
    }
