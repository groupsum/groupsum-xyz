from __future__ import annotations

from .base import *  # noqa: F403


class RepositoryResource(CatalogTable):
    __tablename__ = "repository_resources"
    id = Column(String(320), primary_key=True)
    repository_id = Column(String(240), ForeignKey("repositories.id"), nullable=False, index=True)
    resource_id = Column(String(280), ForeignKey("typed_resources.id"), nullable=False, index=True)
    role = Column(String(60), nullable=False, default="owner")
    repository_path = Column(String(1000), nullable=True)
    sort_order = Column(Integer, nullable=False, default=0)
    observed_at = Column(DateTime, nullable=True)
    __table_args__ = (
        UniqueConstraint("repository_id", "resource_id", "role", name="uq_repository_resource"),
    )
