from __future__ import annotations

from .base import *  # noqa: F403


class TypedResource(CatalogTable):
    __tablename__ = "typed_resources"

    id = Column(String(280), primary_key=True)
    resource_type = Column(String(80), nullable=False, index=True)
    organization_id = Column(String(160), ForeignKey("organizations.id"), nullable=True, index=True)
    repository_id = Column(String(240), ForeignKey("repositories.id"), nullable=True, index=True)
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
