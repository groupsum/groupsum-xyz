from __future__ import annotations

from .base import *  # noqa: F403


class CatalogObservation(CatalogTable):
    """Source evidence attached polymorphically to a catalog subject."""

    __tablename__ = "catalog_observations"

    id = Column(String(160), primary_key=True)
    snapshot_id = Column(String(160), nullable=False, index=True)
    subject_type = Column(String(80), nullable=False, index=True)
    subject_id = Column(String(360), nullable=False, index=True)
    observation_type = Column(String(80), nullable=False, index=True)
    source_kind = Column(String(80), nullable=False, index=True)
    source_url = Column(Text, nullable=True)
    status = Column(String(40), nullable=False, index=True)
    observed_at = Column(DateTime, nullable=False, index=True)
    payload = Column(JSON, nullable=True)
    content_hash = Column(String(64), nullable=False)
    confidence = Column(String(40), nullable=False)

    __table_args__ = (
        UniqueConstraint(
            "snapshot_id", "subject_type", "subject_id", "content_hash",
            name="uq_catalog_observation_fact",
        ),
    )
