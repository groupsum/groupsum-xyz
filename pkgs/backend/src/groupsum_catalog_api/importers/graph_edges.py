from __future__ import annotations

from ..database import Connection
from ..ontology import normalize_legacy_resource_type
from .common import catalog_entity_id
from .graph_writer import GraphWriter


def project_edges(
    connection: Connection, writer: GraphWriter, projected_resource_entities: dict[str, str]
) -> None:
    record_repository_edges = connection.execute(
        "SELECT rr.*, repo.url FROM record_repositories rr "
        "JOIN repositories repo ON repo.id = rr.repository_id"
    ).fetchall()
    for row in record_repository_edges:
        item = dict(row)
        writer.link(
            catalog_entity_id("records", item["record_id"]),
            catalog_entity_id("repositories", item["repository_id"]),
            "implemented_by",
            role=item.get("role"),
            origin_kind="editorial",
            source_url=item.get("url"),
        )
    for row in connection.execute("SELECT * FROM record_packages").fetchall():
        item = dict(row)
        writer.link(
            catalog_entity_id("records", item["record_id"]),
            catalog_entity_id("packages", item["package_id"]),
            "distributed_as",
            role=item.get("role"),
            origin_kind="editorial",
        )
    for row in connection.execute(
        "SELECT rr.*, rs.resource_type, rs.path, rs.url FROM record_resources rr "
        "JOIN resources rs ON rs.id = rr.resource_id"
    ).fetchall():
        item = dict(row)
        resource_entity = projected_resource_entities.get(str(item["resource_id"]))
        if resource_entity is None:
            continue
        record_entity = catalog_entity_id("records", item["record_id"])
        resource_type = normalize_legacy_resource_type(
            str(item.get("resource_type") or ""), item.get("path")
        )
        relationship_type = "includes"
        source_entity, target_entity = record_entity, resource_entity
        if resource_type and resource_type.startswith("documentation."):
            source_entity, target_entity = resource_entity, record_entity
            relationship_type = "documents"
        elif resource_type == "implementation.demo":
            source_entity, target_entity = resource_entity, record_entity
            relationship_type = "demonstrates"
        elif resource_type == "implementation.showcase":
            source_entity, target_entity = resource_entity, record_entity
            relationship_type = "showcases"
        elif resource_type == "implementation.example":
            source_entity, target_entity = resource_entity, record_entity
            relationship_type = "example_of"
        elif resource_type and resource_type.startswith("contract."):
            relationship_type = "described_by"
        elif resource_type and resource_type.startswith(("interface.", "runtime.")):
            relationship_type = "provides"
        writer.link(
            source_entity,
            target_entity,
            relationship_type,
            role=item.get("role"),
            origin_kind="editorial",
            source_url=item.get("url"),
        )
    for row in connection.execute("SELECT * FROM package_repositories").fetchall():
        item = dict(row)
        writer.link(
            catalog_entity_id("repositories", item["repository_id"]),
            catalog_entity_id("packages", item["package_id"]),
            "contains",
            role=item.get("path"),
            origin_kind="repository_manifest",
        )
    for row in connection.execute(
        "SELECT id, repository_id, url, path FROM resources WHERE repository_id IS NOT NULL"
    ).fetchall():
        item = dict(row)
        resource_entity = projected_resource_entities.get(str(item["id"]))
        if resource_entity is None:
            continue
        writer.link(
            catalog_entity_id("repositories", item["repository_id"]),
            resource_entity,
            "contains",
            role=item.get("path"),
            origin_kind="collector_observation",
            source_url=item.get("url"),
        )
    for row in connection.execute("SELECT * FROM record_relations").fetchall():
        item = dict(row)
        relationship_type = {
            "part_of": "groups",
            "related": "references",
        }.get(str(item["relation_type"]), str(item["relation_type"]))
        source_entity = catalog_entity_id("records", item["source_record_id"])
        target_entity = catalog_entity_id("records", item["target_record_id"])
        # A parent groups a child; reverse the legacy child -> parent edge.
        if item["relation_type"] == "part_of":
            source_entity, target_entity = target_entity, source_entity
        writer.link(
            source_entity,
            target_entity,
            relationship_type,
            role=item.get("note"),
            origin_kind="editorial",
        )
