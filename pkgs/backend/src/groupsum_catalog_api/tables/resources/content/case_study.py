from __future__ import annotations

from ...base import *  # noqa: F403


class ContentCaseStudy(CatalogTable):
    __tablename__ = "resource_content_case_study"
    ENTITY_TYPE = "content.case_study"

    id = Column(String(360), primary_key=True)
    slug = Column(String(240), nullable=True, unique=True, index=True)
    title = Column(String(300), nullable=False)
    summary = Column(Text, nullable=True)
    body_url = Column(String(2048), nullable=True)
    author = Column(String(300), nullable=True)
    visibility = Column(String(40), nullable=False, default="public", index=True)
    published_at = Column(DateTime, nullable=True)
    observed_at = Column(DateTime, nullable=True)
    source_payload = Column(JSON, nullable=True)
