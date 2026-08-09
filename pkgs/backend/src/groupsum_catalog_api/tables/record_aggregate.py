from __future__ import annotations

from .base import *  # noqa: F403


class RecordAggregate(CatalogTable):
    """Snapshot-scoped entity counts stored by the named DuckDB engine."""

    __tablename__ = "record_aggregates"
    ENGINE_NAME = "analytics"

    snapshot_id = Column(String(160), primary_key=True)
    record_type = Column(String(80), primary_key=True)
    record_id = Column(String(360), primary_key=True)
    repository_count = Column(Integer, nullable=False, default=0)
    package_count = Column(Integer, nullable=False, default=0)
    resource_count = Column(Integer, nullable=False, default=0)
    release_count = Column(Integer, nullable=False, default=0)
    dependency_count = Column(Integer, nullable=False, default=0)
    dependent_count = Column(Integer, nullable=False, default=0)
    refreshed_at = Column(DateTime, nullable=False)
