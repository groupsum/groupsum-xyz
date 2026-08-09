from __future__ import annotations

from .base import *  # noqa: F403


class Repository(CatalogTable):
    __tablename__ = "repositories"
    ENTITY_TYPE = "source.repository"
    __allow_unmapped__ = True
    id = Column(String(240), primary_key=True)
    provider = Column(String(40), nullable=False)
    owner = Column(String(200), nullable=False)
    name = Column(String(240), nullable=False)
    url = Column(String(2048), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    default_branch = Column(String(160), nullable=True)
    is_archived = Column(Boolean, nullable=False, default=False)
    is_fork = Column(Boolean, nullable=False, default=False)
    license_expression = Column(String(200), nullable=True)
    ssot_governed = Column(Boolean, nullable=False, default=False)
    ssot_registry_url = Column(String(2048), nullable=True)
    ssot_registry_sha256 = Column(String(64), nullable=True)
    ssot_schema_version = Column(String(40), nullable=True)
    ssot_summary = Column(JSON, nullable=True)
    ssot_observed_at = Column(DateTime, nullable=True)
    observed_at = Column(DateTime, nullable=True)
    source_payload = Column(JSON, nullable=True)

    @op_ctx(
        alias="repository_collection",
        target="custom",
        arity="collection",
        persist="skip",
        rest=False,
    )
    def repository_collection(cls, ctx):
        from .views import catalog_collection

        return catalog_collection(cls, ctx, "repository")

    @op_ctx(alias="repository_detail", target="custom", arity="member", persist="skip", rest=False)
    def repository_detail(cls, ctx):
        from .views import repository_detail

        return repository_detail(cls, ctx)

    @op_ctx(
        alias="repository_metrics", target="custom", arity="collection", persist="skip", rest=False
    )
    def repository_metrics(cls, ctx):
        from .views import repository_metrics

        return repository_metrics(cls, ctx)
