from __future__ import annotations

from ...base import *  # noqa: F403


class GovernanceIssue(CatalogTable):
    __tablename__ = "resource_governance_issue"
    ENTITY_TYPE = "governance.issue"

    id = Column(String(360), primary_key=True)
    source_key = Column(String(260), nullable=False, index=True)
    title = Column(Text, nullable=True)
    statement = Column(Text, nullable=True)
    status = Column(String(60), nullable=True, index=True)
    implementation_status = Column(String(60), nullable=True)
    source_url = Column(String(2048), nullable=True)
    payload = Column(JSON, nullable=True)
    observed_at = Column(DateTime, nullable=True)
