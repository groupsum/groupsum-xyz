from __future__ import annotations

from .base import *  # noqa: F403


class Organization(CatalogTable):
    __tablename__ = "organizations"
    ENTITY_TYPE = "party.organization"
    id = Column(String(160), primary_key=True)
    slug = Column(String(160), nullable=False, unique=True, index=True)
    name = Column(String(240), nullable=False)
    summary = Column(Text, nullable=True)
    website_url = Column(String(2048), nullable=True)
    source_url = Column(String(2048), nullable=True)
    observed_at = Column(DateTime, nullable=True)
