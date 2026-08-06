from __future__ import annotations

from ..table_base import *  # noqa: F403


class Release(RestOlapTable):
    __tablename__ = "releases"
    __allow_unmapped__ = True
    id = Column(String(300), primary_key=True)
    package_id = Column(String(260), ForeignKey("packages.id"), nullable=True, index=True)
    repository_id = Column(String(240), ForeignKey("repositories.id"), nullable=True, index=True)
    release_kind = Column(String(40), nullable=False)
    version = Column(String(160), nullable=False)
    route_key = Column(String(80), nullable=True, unique=True, index=True)
    url = Column(String(2048), nullable=False)
    published_at = Column(DateTime, nullable=True)
    downloads = Column(Numeric(24, 4), nullable=True)
    prerelease = Column(Boolean, nullable=False, default=False)
    draft = Column(Boolean, nullable=False, default=False)
    observed_at = Column(DateTime, nullable=True)


class LegalEvidence(RestTable):
    __tablename__ = "legal_evidence"
    __allow_unmapped__ = True
    TABLE_PROFILE = INTERNAL_TABLE_PROFILE
    id = Column(String(320), primary_key=True)
    subject_kind = Column(String(40), nullable=False, index=True)
    subject_id = Column(String(300), nullable=False, index=True)
    evidence_kind = Column(String(60), nullable=False)
    name = Column(String(300), nullable=False)
    expression = Column(String(200), nullable=True)
    path = Column(String(1000), nullable=True)
    url = Column(String(2048), nullable=False)
    scope = Column(String(40), nullable=False, default="direct")
    origin_kind = Column(String(80), nullable=False, default="repository.file")
    # Deprecated compatibility field. Legal file discovery is an observation.
    evidence_type = Column(String(80), nullable=False)
    observed_at = Column(DateTime, nullable=True)
