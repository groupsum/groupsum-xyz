from __future__ import annotations

from ..table_base import *  # noqa: F403


class EntityType(RestTable):
    __tablename__ = "entity_types"
    __allow_unmapped__ = True
    id = Column(String(80), primary_key=True)
    label = Column(String(160), nullable=False)
    semantic_class = Column(String(60), nullable=False, index=True)
    description = Column(Text, nullable=True)
    parent_type_id = Column(String(80), nullable=True, index=True)
    icon_key = Column(String(80), nullable=True)
    detail_schema_key = Column(String(120), nullable=True)


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
    # Deprecated compatibility field. Generic catalog provenance is an origin,
    # never SSOT evidence.
    evidence_type = Column(String(80), nullable=False)
    origin_kind = Column(String(80), nullable=False, default="collector_observation")
    observation_id = Column(String(300), nullable=True, index=True)
    observed_at = Column(DateTime, nullable=True)
    __table_args__ = (UniqueConstraint("entity_id", "url_role", "url", name="uq_entity_url"),)


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
    # Deprecated compatibility field retained for existing deployments.
    evidence_type = Column(String(80), nullable=False)
    origin_kind = Column(String(80), nullable=False, default="collector_observation")
    observation_id = Column(String(300), nullable=True, index=True)
    ssot_entity_id = Column(String(360), nullable=True, index=True)
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


class ResourceType(RestTable):
    __tablename__ = "resource_types"
    __allow_unmapped__ = True
    id = Column(String(60), primary_key=True)
    label = Column(String(160), nullable=False)
    category = Column(String(80), nullable=False)
    description = Column(Text, nullable=True)
    icon_key = Column(String(80), nullable=True)
    detail_schema_key = Column(String(120), nullable=True)


class ResourceRepository(RestTable):
    __tablename__ = "resource_repositories"
    __allow_unmapped__ = True
    id = Column(String(340), primary_key=True)
    resource_id = Column(String(280), ForeignKey("resources.id"), nullable=False, index=True)
    repository_id = Column(String(240), ForeignKey("repositories.id"), nullable=False, index=True)
    role = Column(String(60), nullable=False, default="owner")
    path = Column(String(1000), nullable=True)
    observed_at = Column(DateTime, nullable=True)
    __table_args__ = (
        UniqueConstraint("resource_id", "repository_id", "role", name="uq_resource_repository"),
    )


class ResourceTaxonomy(RestTable):
    __tablename__ = "resource_taxonomies"
    __allow_unmapped__ = True
    id = Column(String(320), primary_key=True)
    resource_id = Column(String(280), ForeignKey("resources.id"), nullable=False, index=True)
    taxonomy_id = Column(String(200), ForeignKey("taxonomies.id"), nullable=False, index=True)
    __table_args__ = (UniqueConstraint("resource_id", "taxonomy_id", name="uq_resource_taxonomy"),)


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
