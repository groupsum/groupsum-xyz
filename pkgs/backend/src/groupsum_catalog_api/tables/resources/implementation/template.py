from __future__ import annotations

from ...base import *  # noqa: F403


class ImplementationTemplate(CatalogTable):
    __tablename__ = "resource_implementation_template"
    ENTITY_TYPE = "implementation.template"

    id = Column(String(360), primary_key=True)
    title = Column(String(300), nullable=False)
    summary = Column(Text, nullable=True)
    url = Column(String(2048), nullable=False, unique=True)
    canonical_path = Column(String(1000), nullable=True, unique=True)
    source_url = Column(String(2048), nullable=True)
    repository_path = Column(String(1000), nullable=True)
    reachability = Column(String(60), nullable=False, default="unverified", index=True)
    http_status = Column(Integer, nullable=True)
    last_checked_at = Column(DateTime, nullable=True)
    observed_at = Column(DateTime, nullable=True)
    source_payload = Column(JSON, nullable=True)
