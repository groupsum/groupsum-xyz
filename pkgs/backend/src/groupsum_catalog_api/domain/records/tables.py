from __future__ import annotations

from ..table_base import *  # noqa: F403


class Record(RestTable):
    __tablename__ = "records"
    __allow_unmapped__ = True
    id = Column(String(200), primary_key=True)
    slug = Column(String(200), nullable=False, unique=True, index=True)
    organization_id = Column(
        String(160), ForeignKey("organizations.id"), nullable=False, index=True
    )
    record_type = Column(String(40), nullable=False, index=True)
    title = Column(String(240), nullable=False)
    eyebrow = Column(String(160), nullable=True)
    summary = Column(Text, nullable=False)
    body_markdown = Column(Text, nullable=True)
    content = Column(JSON, nullable=True)
    maturity = Column(String(60), nullable=True)
    visibility = Column(String(40), nullable=False, default="public")
    featured = Column(Boolean, nullable=False, default=False)
    canonical_url = Column(String(2048), nullable=True)
    source_url = Column(String(2048), nullable=True)
    published_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, nullable=True)
    content_revision = Column(Integer, nullable=False, default=1)


class RecordAlias(RestTable):
    __tablename__ = "record_aliases"
    __allow_unmapped__ = True
    id = Column(String(240), primary_key=True)
    record_id = Column(String(200), ForeignKey("records.id"), nullable=False, index=True)
    alias_kind = Column(String(40), nullable=False)
    alias = Column(String(500), nullable=False)
    __table_args__ = (UniqueConstraint("alias_kind", "alias", name="uq_record_alias"),)


class RecordRelation(RestTable):
    __tablename__ = "record_relations"
    __allow_unmapped__ = True
    id = Column(String(240), primary_key=True)
    source_record_id = Column(String(200), ForeignKey("records.id"), nullable=False, index=True)
    target_record_id = Column(String(200), ForeignKey("records.id"), nullable=False, index=True)
    relation_type = Column(String(60), nullable=False)
    note = Column(Text, nullable=True)
    __table_args__ = (
        UniqueConstraint(
            "source_record_id", "target_record_id", "relation_type", name="uq_record_relation"
        ),
    )


class RecordAuthor(RestTable):
    __tablename__ = "record_authors"
    __allow_unmapped__ = True
    id = Column(String(240), primary_key=True)
    record_id = Column(String(200), ForeignKey("records.id"), nullable=False, index=True)
    person_id = Column(String(160), ForeignKey("people.id"), nullable=False)
    role = Column(String(60), nullable=False, default="author")
    __table_args__ = (UniqueConstraint("record_id", "person_id", "role", name="uq_record_author"),)


class Taxonomy(RestTable):
    __tablename__ = "taxonomies"
    __allow_unmapped__ = True
    id = Column(String(200), primary_key=True)
    taxonomy_type = Column(String(40), nullable=False, index=True)
    slug = Column(String(160), nullable=False)
    label = Column(String(200), nullable=False)
    category = Column(String(120), nullable=True)
    description = Column(Text, nullable=True)
    __table_args__ = (UniqueConstraint("taxonomy_type", "slug", name="uq_taxonomy_slug"),)


class RecordTaxonomy(RestTable):
    __tablename__ = "record_taxonomies"
    __allow_unmapped__ = True
    id = Column(String(240), primary_key=True)
    record_id = Column(String(200), ForeignKey("records.id"), nullable=False, index=True)
    taxonomy_id = Column(String(200), ForeignKey("taxonomies.id"), nullable=False, index=True)
    __table_args__ = (UniqueConstraint("record_id", "taxonomy_id", name="uq_record_taxonomy"),)


class RecordRepository(RestTable):
    __tablename__ = "record_repositories"
    __allow_unmapped__ = True
    id = Column(String(260), primary_key=True)
    record_id = Column(String(200), ForeignKey("records.id"), nullable=False, index=True)
    repository_id = Column(String(240), ForeignKey("repositories.id"), nullable=False, index=True)
    role = Column(String(60), nullable=False, default="implementation")
    __table_args__ = (
        UniqueConstraint("record_id", "repository_id", "role", name="uq_record_repository"),
    )


class RecordPackage(RestTable):
    __tablename__ = "record_packages"
    __allow_unmapped__ = True
    id = Column(String(280), primary_key=True)
    record_id = Column(String(200), ForeignKey("records.id"), nullable=False, index=True)
    package_id = Column(String(260), ForeignKey("packages.id"), nullable=False, index=True)
    role = Column(String(60), nullable=False, default="distribution")
    __table_args__ = (
        UniqueConstraint("record_id", "package_id", "role", name="uq_record_package"),
    )


class RecordFeature(RestTable):
    __tablename__ = "record_features"
    __allow_unmapped__ = True
    TABLE_PROFILE = INTERNAL_TABLE_PROFILE
    id = Column(String(300), primary_key=True)
    record_id = Column(String(200), ForeignKey("records.id"), nullable=False, index=True)
    feature_id = Column(String(240), ForeignKey("features.id"), nullable=False, index=True)
    claim_id = Column(String(260), ForeignKey("claims.id"), nullable=True)
    status = Column(String(60), nullable=False, default="observed")
    __table_args__ = (UniqueConstraint("record_id", "feature_id", name="uq_record_feature"),)


class Limitation(RestTable):
    __tablename__ = "limitations"
    __allow_unmapped__ = True
    id = Column(String(280), primary_key=True)
    record_id = Column(String(200), ForeignKey("records.id"), nullable=False, index=True)
    title = Column(String(300), nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(String(40), nullable=True)
    evidence_id = Column(String(280), ForeignKey("evidence.id"), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)


class Deployment(RestTable):
    __tablename__ = "deployments"
    __allow_unmapped__ = True
    id = Column(String(260), primary_key=True)
    record_id = Column(String(200), ForeignKey("records.id"), nullable=False, index=True)
    name = Column(String(240), nullable=False)
    url = Column(String(2048), nullable=False)
    environment = Column(String(60), nullable=True)
    reachability = Column(String(60), nullable=False, default="unverified")
    observed_at = Column(DateTime, nullable=True)
