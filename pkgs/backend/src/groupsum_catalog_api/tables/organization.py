from __future__ import annotations

from .base import *  # noqa: F403


class Organization(CatalogTable):
    __tablename__ = "organizations"
    ENTITY_TYPE = "party.organization"
    __allow_unmapped__ = True
    id = Column(String(160), primary_key=True)
    slug = Column(String(160), nullable=False, unique=True, index=True)
    name = Column(String(240), nullable=False)
    summary = Column(Text, nullable=True)
    website_url = Column(String(2048), nullable=True)
    source_url = Column(String(2048), nullable=True)
    observed_at = Column(DateTime, nullable=True)

    @op_ctx(
        alias="organization_detail", target="custom", arity="member", persist="skip", rest=False
    )
    def organization_detail(cls, ctx):
        from .views import organization_detail

        return organization_detail(cls, ctx)
