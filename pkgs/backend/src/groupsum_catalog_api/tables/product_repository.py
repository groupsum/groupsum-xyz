from __future__ import annotations

from .base import *  # noqa: F403


class ProductRepository(CatalogTable):
    __tablename__ = "product_repositories"
    id = Column(String(300), primary_key=True)
    product_id = Column(String(200), ForeignKey("products.id"), nullable=False, index=True)
    repository_id = Column(String(240), ForeignKey("repositories.id"), nullable=False, index=True)
    role = Column(String(60), nullable=False, default="implementation")
    sort_order = Column(Integer, nullable=False, default=0)
    observed_at = Column(DateTime, nullable=True)
    __table_args__ = (
        UniqueConstraint("product_id", "repository_id", "role", name="uq_product_repository"),
    )
