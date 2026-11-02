from __future__ import annotations

from .base import *  # noqa: F403


class CatalogDeploymentRequest(CatalogTable):
    """Retryable GitHub deployment dispatch state for a finalized snapshot."""

    __tablename__ = "catalog_deployment_requests"

    id = Column(String(160), primary_key=True)
    status = Column(String(30), nullable=False, index=True)
    attempt_count = Column(Integer, nullable=False, default=0)
    last_attempt_at = Column(DateTime, nullable=True)
    dispatched_at = Column(DateTime, nullable=True)
    last_error = Column(Text, nullable=True)
