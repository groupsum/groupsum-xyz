from __future__ import annotations

from ..table_base import *  # noqa: F403


class Package(RestTable):
    __tablename__ = "packages"
    __allow_unmapped__ = True
    id = Column(String(260), primary_key=True)
    ecosystem = Column(String(60), nullable=False, index=True)
    name = Column(String(300), nullable=False)
    registry_url = Column(String(2048), nullable=False)
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


class PackageRepository(RestTable):
    __tablename__ = "package_repositories"
    __allow_unmapped__ = True
    id = Column(String(300), primary_key=True)
    package_id = Column(String(260), ForeignKey("packages.id"), nullable=False, index=True)
    repository_id = Column(String(240), ForeignKey("repositories.id"), nullable=False, index=True)
    path = Column(String(1000), nullable=True)
    __table_args__ = (
        UniqueConstraint("package_id", "repository_id", "path", name="uq_package_repository"),
    )


class PackageTaxonomy(RestTable):
    __tablename__ = "package_taxonomies"
    __allow_unmapped__ = True
    id = Column(String(300), primary_key=True)
    package_id = Column(String(260), ForeignKey("packages.id"), nullable=False, index=True)
    taxonomy_id = Column(String(200), ForeignKey("taxonomies.id"), nullable=False, index=True)
    __table_args__ = (UniqueConstraint("package_id", "taxonomy_id", name="uq_package_taxonomy"),)


class Dependency(RestTable):
    __tablename__ = "dependencies"
    __allow_unmapped__ = True
    id = Column(String(320), primary_key=True)
    source_kind = Column(String(40), nullable=False, index=True)
    source_id = Column(String(260), nullable=False, index=True)
    target_kind = Column(String(40), nullable=False)
    target_id = Column(String(260), nullable=False)
    requirement = Column(String(240), nullable=True)
    scope = Column(String(60), nullable=True)
    origin_kind = Column(String(80), nullable=False, default="repository.manifest")
    # Deprecated compatibility field. Dependency discovery is an observation.
    evidence_type = Column(String(80), nullable=False, default="repository.manifest")
    source_url = Column(String(2048), nullable=True)
    completeness = Column(String(80), nullable=False, default="catalog-observed")
    observed_at = Column(DateTime, nullable=True)
    __table_args__ = (
        UniqueConstraint(
            "source_kind", "source_id", "target_kind", "target_id", "scope", name="uq_dependency"
        ),
    )
