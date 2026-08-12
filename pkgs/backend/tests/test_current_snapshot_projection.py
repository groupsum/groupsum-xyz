from datetime import UTC, datetime

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from groupsum_catalog_api.tables.catalog_snapshot import CatalogSnapshot
from groupsum_catalog_api.tables.observation import CatalogObservation
from groupsum_catalog_api.tables.repository import Repository
from groupsum_catalog_api.tables.view_common import current_entity_query


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
