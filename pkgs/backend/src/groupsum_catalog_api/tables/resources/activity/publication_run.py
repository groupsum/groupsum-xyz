from __future__ import annotations

from ...base import *  # noqa: F403


class ActivityPublicationRun(CatalogTable):
    __tablename__ = "resource_activity_publication_run"
    ENTITY_TYPE = "activity.publication_run"

    id = Column(String(360), primary_key=True)
    status = Column(String(60), nullable=True, index=True)
    actor = Column(String(240), nullable=True)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    result = Column(JSON, nullable=True)
    observed_at = Column(DateTime, nullable=True)
