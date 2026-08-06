from __future__ import annotations

from ..table_base import *  # noqa: F403


class CollectionRun(TableBase):
    __tablename__ = "collection_runs"
    __allow_unmapped__ = True
    TABLE_PROFILE = INTERNAL_TABLE_PROFILE
    id = Column(String(200), primary_key=True)
    collector = Column(String(160), nullable=False)
    started_at = Column(DateTime, nullable=False)
    completed_at = Column(DateTime, nullable=True)
    status = Column(String(40), nullable=False)
    summary = Column(JSON, nullable=True)


class Observation(TableBase):
    __tablename__ = "observations"
    __allow_unmapped__ = True
    TABLE_PROFILE = INTERNAL_TABLE_PROFILE
    id = Column(String(300), primary_key=True)
    collection_run_id = Column(
        String(200), ForeignKey("collection_runs.id"), nullable=False, index=True
    )
    subject_kind = Column(String(60), nullable=False, index=True)
    subject_id = Column(String(280), nullable=False, index=True)
    observation_type = Column(String(80), nullable=False, default="inventory")
    # Deprecated compatibility field. Evidence is reserved for SSOT entities.
    evidence_type = Column(String(60), nullable=True)
    source_url = Column(String(2048), nullable=False)
    payload = Column(JSON, nullable=True)
    completeness = Column(String(60), nullable=False, default="observed")
    observed_at = Column(DateTime, nullable=False, index=True)


class MetricObservation(TableBase):
    __tablename__ = "metric_observations"
    __allow_unmapped__ = True
    TABLE_PROFILE = INTERNAL_TABLE_PROFILE
    id = Column(String(320), primary_key=True)
    subject_kind = Column(String(60), nullable=False, index=True)
    subject_id = Column(String(280), nullable=False, index=True)
    metric = Column(String(80), nullable=False, index=True)
    value = Column(Numeric(24, 4), nullable=False)
    unit = Column(String(40), nullable=False, default="count")
    period_start = Column(DateTime, nullable=True)
    period_end = Column(DateTime, nullable=True)
    source_url = Column(String(2048), nullable=False)
    observed_at = Column(DateTime, nullable=False, index=True)
