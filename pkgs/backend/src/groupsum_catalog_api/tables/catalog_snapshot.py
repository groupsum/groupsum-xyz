from __future__ import annotations

from .base import *  # noqa: F403


class CatalogSnapshot(CatalogTable):
    """Immutable collection-run provenance and publication state."""

    __tablename__ = "catalog_snapshots"

    id = Column(String(160), primary_key=True)
    schema_version = Column(String(40), nullable=True)
    collected_at = Column(DateTime, nullable=False, index=True)
    completed_at = Column(DateTime, nullable=True)
    status = Column(String(30), nullable=False, index=True)
    collector_version = Column(String(80), nullable=True)
    source_digest = Column(String(64), nullable=False, unique=True)
    parent_snapshot_id = Column(String(160), nullable=True)
    is_current = Column(Boolean, nullable=False, default=False, index=True)
    completeness = Column(JSON, nullable=True)
    observation_count = Column(Integer, nullable=False, default=0)
    measurement_count = Column(Integer, nullable=False, default=0)
    error_count = Column(Integer, nullable=False, default=0)
