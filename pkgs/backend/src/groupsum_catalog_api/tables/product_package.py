from __future__ import annotations

from .base import *  # noqa: F403


class ProductPackage(CatalogTable):
    __tablename__ = "product_packages"
    id = Column(String(300), primary_key=True)
    product_id = Column(String(200), ForeignKey("products.id"), nullable=False, index=True)
    package_id = Column(String(260), ForeignKey("packages.id"), nullable=False, index=True)
    role = Column(String(60), nullable=False, default="distribution")
    sort_order = Column(Integer, nullable=False, default=0)
    observed_at = Column(DateTime, nullable=True)
    __table_args__ = (
        UniqueConstraint("product_id", "package_id", "role", name="uq_product_package"),
    )
