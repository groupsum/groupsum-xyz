from __future__ import annotations

from .base import *  # noqa: F403


class PortfolioRepository(CatalogTable):
    __tablename__ = "portfolio_repositories"
    id = Column(String(300), primary_key=True)
    portfolio_id = Column(String(200), ForeignKey("portfolios.id"), nullable=False, index=True)
    repository_id = Column(String(240), ForeignKey("repositories.id"), nullable=False, index=True)
    role = Column(String(60), nullable=False, default="implementation")
    sort_order = Column(Integer, nullable=False, default=0)
    observed_at = Column(DateTime, nullable=True)
    __table_args__ = (
        UniqueConstraint("portfolio_id", "repository_id", "role", name="uq_portfolio_repository"),
    )
