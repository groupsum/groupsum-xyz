from __future__ import annotations

from .base import *  # noqa: F403


class Package(CatalogTable):
    __tablename__ = "packages"
    ENTITY_TYPE = "distribution.package"
    id = Column(String(260), primary_key=True)
    ecosystem = Column(String(60), nullable=False, index=True)
    name = Column(String(300), nullable=False)
    registry_url = Column(String(2048), nullable=True)
    source_url = Column(String(2048), nullable=True)
    manifest_path = Column(String(1000), nullable=True)
    package_kind = Column(String(60), nullable=False, default="package-candidate", index=True)
    private = Column(Boolean, nullable=False, default=False)
    description = Column(Text, nullable=True)
    latest_version = Column(String(120), nullable=True)
    published = Column(Boolean, nullable=True)
    publication_status = Column(String(60), nullable=True)
    route_key = Column(String(80), nullable=True, unique=True, index=True)
    license_expression = Column(String(200), nullable=True)
    license_status = Column(String(60), nullable=True)
    published_at = Column(DateTime, nullable=True)
    observed_at = Column(DateTime, nullable=True)
    source_payload = Column(JSON, nullable=True)

    @op_ctx(
        alias="package_collection", target="custom", arity="collection", persist="skip", rest=False
    )
    def package_collection(cls, ctx):
        from .views import catalog_collection

        return catalog_collection(cls, ctx, "package")

    @op_ctx(alias="package_detail", target="custom", arity="member", persist="skip", rest=False)
    def package_detail(cls, ctx):
        from .views import package_detail

        return package_detail(cls, ctx)
