from __future__ import annotations

from .base import *  # noqa: F403


class CatalogEntry(CatalogTable):
    """Materialized cross-catalog read index; never a typed-resource authority."""

    __tablename__ = "catalog_entries"

    id = Column(String(360), primary_key=True)
    kind = Column(String(60), nullable=False, index=True)
    source_id = Column(String(320), nullable=False, index=True)
    slug = Column(String(300), nullable=False, index=True)
    name = Column(String(300), nullable=False)
    summary = Column(Text, nullable=True)
    canonical_url = Column(String(2048), nullable=True)
    icon_key = Column(String(80), nullable=True)
    visibility = Column(String(40), nullable=False, default="public", index=True)
    maturity = Column(String(60), nullable=True, index=True)
    observed_at = Column(DateTime, nullable=True)
    __table_args__ = (UniqueConstraint("kind", "source_id", name="uq_catalog_entry_source"),)

    @op_ctx(
        alias="catalog_overview", target="custom", arity="collection", persist="skip", rest=False
    )
    def catalog_overview(cls, ctx):
        from .views import catalog_overview

        return catalog_overview(cls, ctx)

    @op_ctx(
        alias="entity_collection", target="custom", arity="collection", persist="skip", rest=False
    )
    def entity_collection(cls, ctx):
        from .views import entity_collection

        return entity_collection(cls, ctx)

    @op_ctx(alias="entity_detail", target="custom", arity="member", persist="skip", rest=False)
    def entity_detail(cls, ctx):
        from .views import entity_detail

        return entity_detail(cls, ctx)

    @op_ctx(
        alias="insight_collection", target="custom", arity="collection", persist="skip", rest=False
    )
    def insight_collection(cls, ctx):
        from .views import insight_collection

        return insight_collection(cls, ctx)
