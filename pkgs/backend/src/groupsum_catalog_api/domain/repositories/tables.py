from __future__ import annotations

from ..table_base import *  # noqa: F403


class Repository(RestTable):
    __tablename__ = "repositories"
    __allow_unmapped__ = True
    id = Column(String(240), primary_key=True)
    organization_id = Column(String(160), ForeignKey("organizations.id"), nullable=True, index=True)
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


class RepositoryContributor(RestTable):
    __tablename__ = "repository_contributors"
    __allow_unmapped__ = True
    id = Column(String(300), primary_key=True)
    repository_id = Column(String(240), ForeignKey("repositories.id"), nullable=False, index=True)
    login = Column(String(240), nullable=False, index=True)
    profile_url = Column(String(2048), nullable=True)
    contributions = Column(Integer, nullable=False, default=0)
    observed_at = Column(DateTime, nullable=False, index=True)
    __table_args__ = (UniqueConstraint("repository_id", "login", name="uq_repository_contributor"),)


class RepositoryLanguage(RestTable):
    __tablename__ = "repository_languages"
    __allow_unmapped__ = True
    id = Column(String(300), primary_key=True)
    repository_id = Column(String(240), ForeignKey("repositories.id"), nullable=False, index=True)
    language = Column(String(120), nullable=False, index=True)
    bytes = Column(Integer, nullable=False, default=0)
    percentage = Column(Numeric(8, 4), nullable=False, default=0)
    observed_at = Column(DateTime, nullable=False, index=True)
    __table_args__ = (UniqueConstraint("repository_id", "language", name="uq_repository_language"),)
