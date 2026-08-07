from __future__ import annotations

from .base import *  # noqa: F403


class RepositoryPackage(CatalogTable):
    __tablename__ = "repository_packages"
    id = Column(String(320), primary_key=True)
    repository_id = Column(String(240), ForeignKey("repositories.id"), nullable=False, index=True)
    package_id = Column(String(260), ForeignKey("packages.id"), nullable=False, index=True)
    role = Column(String(60), nullable=False, default="source")
    repository_path = Column(String(1000), nullable=True)
    sort_order = Column(Integer, nullable=False, default=0)
    observed_at = Column(DateTime, nullable=True)
    __table_args__ = (
        UniqueConstraint("repository_id", "package_id", "role", name="uq_repository_package"),
    )
