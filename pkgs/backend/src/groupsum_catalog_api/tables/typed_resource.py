from __future__ import annotations

from .base import *  # noqa: F403


class TypedResource(CatalogTable):
    __tablename__ = "typed_resources"

    id = Column(String(280), primary_key=True)
    resource_type = Column(String(80), nullable=False, index=True)
    title = Column(String(300), nullable=False)
    summary = Column(Text, nullable=True)
    url = Column(String(2048), nullable=False, unique=True)
    canonical_path = Column(String(1000), nullable=True, unique=True)
    source_url = Column(String(2048), nullable=True)
    repository_path = Column(String(1000), nullable=True)
    reachability = Column(String(60), nullable=False, default="unverified", index=True)
    http_status = Column(Integer, nullable=True)
    last_checked_at = Column(DateTime, nullable=True)
    observed_at = Column(DateTime, nullable=True)
    source_payload = Column(JSON, nullable=True)

    @op_ctx(
        alias="resource_collection", target="custom", arity="collection", persist="skip", rest=False
    )
    def resource_collection(cls, ctx):
        from .views import catalog_collection

        return catalog_collection(cls, ctx, "resource")

    @op_ctx(alias="resource_detail", target="custom", arity="member", persist="skip", rest=False)
    def resource_detail(cls, ctx):
        from .views import resource_detail

        return resource_detail(cls, ctx)
