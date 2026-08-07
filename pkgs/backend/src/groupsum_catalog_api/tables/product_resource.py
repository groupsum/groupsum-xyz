from __future__ import annotations

from .base import *  # noqa: F403


class ProductResource(CatalogTable):
    __tablename__ = "product_resources"
    id = Column(String(300), primary_key=True)
    product_id = Column(String(200), ForeignKey("products.id"), nullable=False, index=True)
    resource_id = Column(String(280), ForeignKey("typed_resources.id"), nullable=False, index=True)
    role = Column(String(60), nullable=False, default="related")
    sort_order = Column(Integer, nullable=False, default=0)
    observed_at = Column(DateTime, nullable=True)
    __table_args__ = (
        UniqueConstraint("product_id", "resource_id", "role", name="uq_product_resource"),
    )
