from __future__ import annotations

from ..table_base import *  # noqa: F403


class Feature(RestTable):
    __tablename__ = "features"
    __allow_unmapped__ = True
    TABLE_PROFILE = INTERNAL_TABLE_PROFILE
    id = Column(String(240), primary_key=True)
    slug = Column(String(200), nullable=False, unique=True)
    name = Column(String(240), nullable=False)
    description = Column(Text, nullable=True)
    ssot_feature_id = Column(String(240), nullable=True, unique=True)


class Claim(RestTable):
    __tablename__ = "claims"
    __allow_unmapped__ = True
    TABLE_PROFILE = INTERNAL_TABLE_PROFILE
    id = Column(String(260), primary_key=True)
    record_id = Column(String(200), ForeignKey("records.id"), nullable=True, index=True)
    claim_type = Column(String(60), nullable=False)
    statement = Column(Text, nullable=False)
    status = Column(String(60), nullable=False, default="unverified")
    ssot_claim_id = Column(String(260), nullable=True, unique=True)
    reviewed_at = Column(DateTime, nullable=True)


class Evidence(RestTable):
    __tablename__ = "evidence"
    __allow_unmapped__ = True
    TABLE_PROFILE = INTERNAL_TABLE_PROFILE
    id = Column(String(280), primary_key=True)
    evidence_type = Column(String(60), nullable=False)
    title = Column(String(300), nullable=False)
    source_url = Column(String(2048), nullable=False)
    locator = Column(String(1000), nullable=True)
    excerpt = Column(Text, nullable=True)
    observed_at = Column(DateTime, nullable=False)
    expires_at = Column(DateTime, nullable=True)


class ClaimEvidence(RestTable):
    __tablename__ = "claim_evidence"
    __allow_unmapped__ = True
    TABLE_PROFILE = INTERNAL_TABLE_PROFILE
    id = Column(String(320), primary_key=True)
    claim_id = Column(String(260), ForeignKey("claims.id"), nullable=False, index=True)
    evidence_id = Column(String(280), ForeignKey("evidence.id"), nullable=False, index=True)
    support = Column(String(40), nullable=False, default="supports")
    __table_args__ = (UniqueConstraint("claim_id", "evidence_id", name="uq_claim_evidence"),)


class ResourceEvidence(RestTable):
    __tablename__ = "resource_evidence"
    __allow_unmapped__ = True
    TABLE_PROFILE = INTERNAL_TABLE_PROFILE
    id = Column(String(340), primary_key=True)
    resource_id = Column(String(280), ForeignKey("resources.id"), nullable=False, index=True)
    evidence_id = Column(String(280), ForeignKey("evidence.id"), nullable=False, index=True)
    role = Column(String(60), nullable=False, default="supports")
    __table_args__ = (
        UniqueConstraint("resource_id", "evidence_id", "role", name="uq_resource_evidence"),
    )


class RepositorySsotRegistry(RestTable):
    __tablename__ = "repository_ssot_registries"
    __allow_unmapped__ = True
    id = Column(String(300), primary_key=True)
    repository_id = Column(String(240), ForeignKey("repositories.id"), nullable=False, index=True)
    registry_url = Column(String(2048), nullable=False)
    schema_version = Column(String(60), nullable=True)
    source_sha256 = Column(String(64), nullable=True)
    valid = Column(Boolean, nullable=False, default=False)
    observed_at = Column(DateTime, nullable=False, index=True)


class RepositorySsotInventory(RestTable):
    __tablename__ = "repository_ssot_inventory"
    __allow_unmapped__ = True
    id = Column(String(360), primary_key=True)
    registry_id = Column(
        String(300), ForeignKey("repository_ssot_registries.id"), nullable=False, index=True
    )
    entity_kind = Column(String(60), nullable=False, index=True)
    entity_id = Column(String(260), nullable=False)
    title = Column(Text, nullable=True)
    status = Column(String(60), nullable=True)
    implementation_status = Column(String(60), nullable=True)
    payload = Column(JSON, nullable=True)
    __table_args__ = (
        UniqueConstraint("registry_id", "entity_kind", "entity_id", name="uq_ssot_inventory"),
    )
