from __future__ import annotations

from .base import *  # noqa: F403


class CatalogEntry(CatalogTable):
    """Materialized cross-catalog read index; never a typed-resource authority."""

    __tablename__ = "catalog_entries"

    id = Column(String(360), primary_key=True)
    kind = Column(String(60), nullable=False, index=True)
    source_id = Column(String(320), nullable=False, index=True)
    organization_id = Column(String(160), ForeignKey("organizations.id"), nullable=True, index=True)
    slug = Column(String(300), nullable=False, index=True)
    name = Column(String(300), nullable=False)
    summary = Column(Text, nullable=True)
    canonical_url = Column(String(2048), nullable=True)
    icon_key = Column(String(80), nullable=True)
    visibility = Column(String(40), nullable=False, default="public", index=True)
    maturity = Column(String(60), nullable=True, index=True)
    observed_at = Column(DateTime, nullable=True)
    __table_args__ = (UniqueConstraint("kind", "source_id", name="uq_catalog_entry_source"),)
