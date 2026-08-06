from __future__ import annotations

from ..database import Connection
from ..ontology import RESOURCE_TYPES
from .common import upsert
from .graph_core import project_core
from .graph_edges import project_edges
from .graph_ssot import project_ssot
from .graph_taxonomy import project_taxonomies_and_dependencies
from .graph_writer import GraphWriter


def rebuild_entity_graph(connection: Connection, generated_at: str) -> dict[str, int]:
    if connection.postgres:
        connection.execute("ALTER TABLE entity_relationships ALTER COLUMN role TYPE VARCHAR(512)")
    for table in ("entity_relationships", "entity_urls", "entity_aliases", "catalog_entities"):
        connection.execute(f"DELETE FROM {table}")
    connection.execute("DELETE FROM entity_types")
    for type_id, definition in RESOURCE_TYPES.items():
        upsert(
            connection,
            "entity_types",
            {
                "id": type_id,
                "label": definition.label,
                "semantic_class": definition.family,
                "description": None,
                "parent_type_id": definition.family,
                "icon_key": definition.icon_key,
                "detail_schema_key": definition.detail_schema_key,
            },
        )
    writer = GraphWriter(connection, generated_at)
    (
        _,
        repository_entities,
        ssot_registry_entities,
        package_entities,
        package_by_key,
        projected_resource_entities,
    ) = project_core(connection, writer)
    project_ssot(connection, writer, repository_entities, ssot_registry_entities)
    project_taxonomies_and_dependencies(connection, writer, package_entities, package_by_key)
    project_edges(connection, writer, projected_resource_entities)
    return {
        "entities": connection.execute("SELECT COUNT(*) FROM catalog_entities").fetchone()[0],
        "entity_relationships": connection.execute(
            "SELECT COUNT(*) FROM entity_relationships"
        ).fetchone()[0],
    }
