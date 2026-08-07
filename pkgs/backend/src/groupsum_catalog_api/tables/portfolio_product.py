from __future__ import annotations

from .base import *  # noqa: F403


class PortfolioProduct(CatalogTable):
    __tablename__ = "portfolio_products"
    id = Column(String(300), primary_key=True)
    portfolio_id = Column(String(200), ForeignKey("portfolios.id"), nullable=False, index=True)
    product_id = Column(String(200), ForeignKey("products.id"), nullable=False, index=True)
    role = Column(String(60), nullable=False, default="member")
    sort_order = Column(Integer, nullable=False, default=0)
    observed_at = Column(DateTime, nullable=True)
    __table_args__ = (
        UniqueConstraint("portfolio_id", "product_id", "role", name="uq_portfolio_product"),
    )
