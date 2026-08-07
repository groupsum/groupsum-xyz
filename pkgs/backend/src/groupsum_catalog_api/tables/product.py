from __future__ import annotations

from .base import *  # noqa: F403


class Product(CatalogTable):
    __tablename__ = "products"

    id = Column(String(200), primary_key=True)
    organization_id = Column(
        String(160), ForeignKey("organizations.id"), nullable=False, index=True
    )
    slug = Column(String(200), nullable=False, unique=True, index=True)
    name = Column(String(240), nullable=False)
    eyebrow = Column(String(160), nullable=True)
    summary = Column(Text, nullable=False)
    body_markdown = Column(Text, nullable=True)
    maturity = Column(String(60), nullable=True, index=True)
    visibility = Column(String(40), nullable=False, default="public", index=True)
    featured = Column(Boolean, nullable=False, default=False, index=True)
    canonical_url = Column(String(2048), nullable=True)
    source_url = Column(String(2048), nullable=True)
    published_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, nullable=True)
    content_revision = Column(Integer, nullable=False, default=1)
