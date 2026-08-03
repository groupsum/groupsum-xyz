from __future__ import annotations

from tigrbl import RestOlapTable, TableBase, TableProfileSpec
from tigrbl.types import (
    JSON,
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
)

# Canonical resources are queryable REST tables. Mutations are intentionally
# offline/importer-owned until an authenticated editorial control plane exists.
RestTable = RestOlapTable
INTERNAL_TABLE_PROFILE = TableProfileSpec(
    kind="groupsum.internal",
    ops=(),
    docs_exposure="none",
    runtime_exposure="none",
    custom=True,
    namespace="groupsum.internal",
)


class Organization(RestTable):
    __tablename__ = "organizations"
    __allow_unmapped__ = True
    id = Column(String(160), primary_key=True)
    slug = Column(String(160), nullable=False, unique=True, index=True)
    name = Column(String(240), nullable=False)
    summary = Column(Text, nullable=True)
    website_url = Column(String(2048), nullable=True)
    source_url = Column(String(2048), nullable=True)
    observed_at = Column(DateTime, nullable=True)


class Person(RestTable):
    __tablename__ = "people"
    __allow_unmapped__ = True
    id = Column(String(160), primary_key=True)
    name = Column(String(240), nullable=False)
    handle = Column(String(240), nullable=True)
    profile_url = Column(String(2048), nullable=True)


class EntityType(RestTable):
    __tablename__ = "entity_types"
    __allow_unmapped__ = True
    id = Column(String(80), primary_key=True)
    label = Column(String(160), nullable=False)
    semantic_class = Column(String(60), nullable=False, index=True)
    description = Column(Text, nullable=True)


class CatalogEntity(RestTable):
    __tablename__ = "catalog_entities"
    __allow_unmapped__ = True
    id = Column(String(360), primary_key=True)
    entity_type_id = Column(String(80), ForeignKey("entity_types.id"), nullable=False, index=True)
    organization_id = Column(String(160), ForeignKey("organizations.id"), nullable=True, index=True)
    slug = Column(String(300), nullable=False, index=True)
    name = Column(String(300), nullable=False)
    summary = Column(Text, nullable=True)
    canonical_url = Column(String(2048), nullable=True)
    source_table = Column(String(80), nullable=False, index=True)
    source_id = Column(String(320), nullable=False, index=True)
    visibility = Column(String(40), nullable=False, default="public")
    maturity = Column(String(60), nullable=True)
    observed_at = Column(DateTime, nullable=True)
    __table_args__ = (
        UniqueConstraint("source_table", "source_id", name="uq_catalog_entity_source"),
    )


class EntityAlias(RestTable):
    __tablename__ = "entity_aliases"
    __allow_unmapped__ = True
    id = Column(String(380), primary_key=True)
    entity_id = Column(String(360), ForeignKey("catalog_entities.id"), nullable=False, index=True)
    alias_kind = Column(String(40), nullable=False)
    alias = Column(String(1000), nullable=False)
    __table_args__ = (UniqueConstraint("alias_kind", "alias", name="uq_entity_alias"),)


class EntityUrl(RestTable):
    __tablename__ = "entity_urls"
    __allow_unmapped__ = True
    id = Column(String(380), primary_key=True)
    entity_id = Column(String(360), ForeignKey("catalog_entities.id"), nullable=False, index=True)
    url_role = Column(String(60), nullable=False)
    url = Column(String(2048), nullable=False)
    label = Column(String(240), nullable=True)
    evidence_type = Column(String(80), nullable=False)
    observed_at = Column(DateTime, nullable=True)
    __table_args__ = (
        UniqueConstraint("entity_id", "url_role", "url", name="uq_entity_url"),
    )


class EntityRelationship(RestTable):
    __tablename__ = "entity_relationships"
    __allow_unmapped__ = True
    id = Column(String(400), primary_key=True)
    source_entity_id = Column(
        String(360), ForeignKey("catalog_entities.id"), nullable=False, index=True
    )
    target_entity_id = Column(
        String(360), ForeignKey("catalog_entities.id"), nullable=False, index=True
    )
    relationship_type = Column(String(80), nullable=False, index=True)
    role = Column(String(512), nullable=True)
    evidence_type = Column(String(80), nullable=False)
    source_url = Column(String(2048), nullable=True)
    confidence = Column(String(40), nullable=False, default="observed")
    status = Column(String(40), nullable=False, default="active")
    observed_at = Column(DateTime, nullable=True)
    __table_args__ = (
        UniqueConstraint(
            "source_entity_id",
            "target_entity_id",
            "relationship_type",
            "role",
            name="uq_entity_relationship",
        ),
    )


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


class RepositoryContributor(RestTable):
    __tablename__ = "repository_contributors"
    __allow_unmapped__ = True
    id = Column(String(300), primary_key=True)
    repository_id = Column(
        String(240), ForeignKey("repositories.id"), nullable=False, index=True
    )
    login = Column(String(240), nullable=False, index=True)
    profile_url = Column(String(2048), nullable=True)
    contributions = Column(Integer, nullable=False, default=0)
    observed_at = Column(DateTime, nullable=False, index=True)
    __table_args__ = (
        UniqueConstraint(
            "repository_id", "login", name="uq_repository_contributor"
        ),
    )


class Package(RestTable):
    __tablename__ = "packages"
    __allow_unmapped__ = True
    id = Column(String(260), primary_key=True)
    ecosystem = Column(String(60), nullable=False, index=True)
    name = Column(String(300), nullable=False)
    registry_url = Column(String(2048), nullable=False)
    source_url = Column(String(2048), nullable=True)
    manifest_path = Column(String(1000), nullable=True)
    description = Column(Text, nullable=True)
    latest_version = Column(String(120), nullable=True)
    published = Column(Boolean, nullable=True)
    publication_status = Column(String(60), nullable=True)
    route_key = Column(String(80), nullable=True, unique=True, index=True)
    license_expression = Column(String(200), nullable=True)
    license_status = Column(String(60), nullable=True)
    published_at = Column(DateTime, nullable=True)
    observed_at = Column(DateTime, nullable=True)


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


class Resource(RestTable):
    __tablename__ = "resources"
    __allow_unmapped__ = True
    id = Column(String(280), primary_key=True)
    resource_type = Column(String(60), nullable=False, index=True)
    route_key = Column(String(80), nullable=True, unique=True, index=True)
    repository_id = Column(String(240), ForeignKey("repositories.id"), nullable=True, index=True)
    path = Column(String(1000), nullable=True)
    title = Column(String(300), nullable=False)
    url = Column(String(2048), nullable=False, unique=True)
    summary = Column(Text, nullable=True)
    source_url = Column(String(2048), nullable=True)
    observed_at = Column(DateTime, nullable=True)


class LegalEvidence(RestTable):
    __tablename__ = "legal_evidence"
    __allow_unmapped__ = True
    id = Column(String(320), primary_key=True)
    subject_kind = Column(String(40), nullable=False, index=True)
    subject_id = Column(String(300), nullable=False, index=True)
    evidence_kind = Column(String(60), nullable=False)
    name = Column(String(300), nullable=False)
    expression = Column(String(200), nullable=True)
    path = Column(String(1000), nullable=True)
    url = Column(String(2048), nullable=False)
    scope = Column(String(40), nullable=False, default="direct")
    evidence_type = Column(String(80), nullable=False)
    observed_at = Column(DateTime, nullable=True)


class RecordResource(RestTable):
    __tablename__ = "record_resources"
    __allow_unmapped__ = True
    id = Column(String(300), primary_key=True)
    record_id = Column(String(200), ForeignKey("records.id"), nullable=False, index=True)
    resource_id = Column(String(280), ForeignKey("resources.id"), nullable=False, index=True)
    role = Column(String(60), nullable=False)
    sort_order = Column(Integer, nullable=False, default=0)
    __table_args__ = (
        UniqueConstraint("record_id", "resource_id", "role", name="uq_record_resource"),
    )


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
    evidence_type = Column(String(80), nullable=False, default="repository.manifest")
    source_url = Column(String(2048), nullable=True)
    completeness = Column(String(80), nullable=False, default="catalog-observed")
    observed_at = Column(DateTime, nullable=True)
    __table_args__ = (
        UniqueConstraint(
            "source_kind", "source_id", "target_kind", "target_id", "scope", name="uq_dependency"
        ),
    )


class Feature(RestTable):
    __tablename__ = "features"
    __allow_unmapped__ = True
    id = Column(String(240), primary_key=True)
    slug = Column(String(200), nullable=False, unique=True)
    name = Column(String(240), nullable=False)
    description = Column(Text, nullable=True)
    ssot_feature_id = Column(String(240), nullable=True, unique=True)


class Claim(RestTable):
    __tablename__ = "claims"
    __allow_unmapped__ = True
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
    id = Column(String(320), primary_key=True)
    claim_id = Column(String(260), ForeignKey("claims.id"), nullable=False, index=True)
    evidence_id = Column(String(280), ForeignKey("evidence.id"), nullable=False, index=True)
    support = Column(String(40), nullable=False, default="supports")
    __table_args__ = (UniqueConstraint("claim_id", "evidence_id", name="uq_claim_evidence"),)


class RecordFeature(RestTable):
    __tablename__ = "record_features"
    __allow_unmapped__ = True
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


class CollectionRun(TableBase):
    __tablename__ = "collection_runs"
    __allow_unmapped__ = True
    TABLE_PROFILE = INTERNAL_TABLE_PROFILE
    id = Column(String(200), primary_key=True)
    collector = Column(String(160), nullable=False)
    started_at = Column(DateTime, nullable=False)
    completed_at = Column(DateTime, nullable=True)
    status = Column(String(40), nullable=False)
    summary = Column(JSON, nullable=True)


class Observation(TableBase):
    __tablename__ = "observations"
    __allow_unmapped__ = True
    TABLE_PROFILE = INTERNAL_TABLE_PROFILE
    id = Column(String(300), primary_key=True)
    collection_run_id = Column(
        String(200), ForeignKey("collection_runs.id"), nullable=False, index=True
    )
    subject_kind = Column(String(60), nullable=False, index=True)
    subject_id = Column(String(280), nullable=False, index=True)
    evidence_type = Column(String(60), nullable=False)
    source_url = Column(String(2048), nullable=False)
    payload = Column(JSON, nullable=True)
    completeness = Column(String(60), nullable=False, default="observed")
    observed_at = Column(DateTime, nullable=False, index=True)


class MetricObservation(TableBase):
    __tablename__ = "metric_observations"
    __allow_unmapped__ = True
    TABLE_PROFILE = INTERNAL_TABLE_PROFILE
    id = Column(String(320), primary_key=True)
    subject_kind = Column(String(60), nullable=False, index=True)
    subject_id = Column(String(280), nullable=False, index=True)
    metric = Column(String(80), nullable=False, index=True)
    value = Column(Numeric(24, 4), nullable=False)
    unit = Column(String(40), nullable=False, default="count")
    period_start = Column(DateTime, nullable=True)
    period_end = Column(DateTime, nullable=True)
    source_url = Column(String(2048), nullable=False)
    observed_at = Column(DateTime, nullable=False, index=True)


ALL_TABLES = (
    Organization,
    Person,
    EntityType,
    CatalogEntity,
    EntityAlias,
    EntityUrl,
    EntityRelationship,
    Record,
    RecordAlias,
    RecordRelation,
    RecordAuthor,
    Taxonomy,
    RecordTaxonomy,
    Repository,
    RecordRepository,
    RepositoryContributor,
    Package,
    RecordPackage,
    PackageRepository,
    Release,
    Resource,
    LegalEvidence,
    RecordResource,
    Deployment,
    Dependency,
    Feature,
    Claim,
    Evidence,
    ClaimEvidence,
    RecordFeature,
    Limitation,
    CollectionRun,
    Observation,
)
