from __future__ import annotations

from .base import *  # noqa: F403


class RepositoryTechnology(CatalogTable):
    __tablename__ = "repository_technologies"
    id = Column(String(320), primary_key=True)
    repository_id = Column(String(240), ForeignKey("repositories.id"), nullable=False, index=True)
    technology_id = Column(String(200), ForeignKey("technologies.id"), nullable=False, index=True)
    role = Column(String(60), nullable=False, default="implementation")
    bytes = Column(Integer, nullable=True)
    percentage = Column(Numeric(8, 4), nullable=True)
    observed_at = Column(DateTime, nullable=True)
    __table_args__ = (
        UniqueConstraint("repository_id", "technology_id", "role", name="uq_repository_technology"),
    )
