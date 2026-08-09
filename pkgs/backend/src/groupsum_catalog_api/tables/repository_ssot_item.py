from __future__ import annotations

from .base import *  # noqa: F403


class RepositorySsotItem(CatalogTable):
    __tablename__ = "repository_ssot_items"

    id = Column(String(360), primary_key=True)
    entity_kind = Column(String(60), nullable=False, index=True)
    entity_id = Column(String(260), nullable=False)
    title = Column(Text, nullable=True)
    status = Column(String(60), nullable=True)
    implementation_status = Column(String(60), nullable=True)
    payload = Column(JSON, nullable=True)
