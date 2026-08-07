from __future__ import annotations

from .base import *  # noqa: F403


class Technology(CatalogTable):
    __tablename__ = "technologies"

    id = Column(String(200), primary_key=True)
    slug = Column(String(200), nullable=False, unique=True, index=True)
    name = Column(String(240), nullable=False)
    category = Column(String(80), nullable=False, index=True)
    description = Column(Text, nullable=True)
    icon_key = Column(String(80), nullable=True)
    website_url = Column(String(2048), nullable=True)
    source_url = Column(String(2048), nullable=True)
    observed_at = Column(DateTime, nullable=True)
