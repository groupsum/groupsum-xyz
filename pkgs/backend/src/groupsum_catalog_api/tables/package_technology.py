from __future__ import annotations

from .base import *  # noqa: F403


class PackageTechnology(CatalogTable):
    __tablename__ = "package_technologies"
    id = Column(String(320), primary_key=True)
    package_id = Column(String(260), ForeignKey("packages.id"), nullable=False, index=True)
    technology_id = Column(String(200), ForeignKey("technologies.id"), nullable=False, index=True)
    role = Column(String(60), nullable=False, default="implementation")
    observed_at = Column(DateTime, nullable=True)
    __table_args__ = (
        UniqueConstraint("package_id", "technology_id", "role", name="uq_package_technology"),
    )
