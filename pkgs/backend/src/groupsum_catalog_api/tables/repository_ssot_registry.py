from __future__ import annotations

from .base import *  # noqa: F403


class RepositorySsotRegistry(CatalogTable):
    __tablename__ = "repository_ssot_registries"
    __allow_unmapped__ = True
    id = Column(String(300), primary_key=True)
    registry_url = Column(String(2048), nullable=False)
    schema_version = Column(String(60), nullable=True)
    source_sha256 = Column(String(64), nullable=True)
    valid = Column(Boolean, nullable=False, default=False)
    observed_at = Column(DateTime, nullable=False, index=True)
