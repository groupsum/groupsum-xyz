from __future__ import annotations

import hashlib

from ..database import Connection
from .graph_writer import GraphWriter


def project_taxonomies_and_dependencies(
    connection: Connection,
    writer: GraphWriter,
    package_entities: dict[str, str],
    package_by_key: dict[str, str],
) -> None:
    for row in connection.execute(
        "SELECT id, taxonomy_type, slug, label, category, description FROM taxonomies"
    ).fetchall():
        item = dict(row)
        taxonomy_type = str(item["taxonomy_type"])
        resource_type = {
            "technology": "taxonomy.technology",
            "language": "taxonomy.language",
            "ecosystem": "taxonomy.ecosystem",
            "audience": "taxonomy.audience",
            "capability": "taxonomy.capability",
            "domain": "taxonomy.domain",
            "topic": "taxonomy.topic",
            "category": "taxonomy.category",
        }.get(taxonomy_type)
        if not resource_type:
            continue
        taxonomy_route = (
            f"https://groupsum.xyz/catalog/technologies/{item['slug']}"
            if resource_type == "taxonomy.technology"
            else f"https://groupsum.xyz/catalog/resources/{resource_type}/{item['slug']}"
        )
        writer.entity(
            "taxonomies",
            item["id"],
            resource_type,
            item["slug"],
            item["label"],
            summary=item.get("description"),
            canonical_url=taxonomy_route,
        )

    for row in connection.execute("SELECT * FROM dependencies").fetchall():
        item = dict(row)
        source_entity = package_entities.get(str(item.get("source_id")))
        if not source_entity:
            continue
        target_package_id = package_by_key.get(str(item.get("target_id")))
        if target_package_id:
            target_entity = package_entities[target_package_id]
        else:
            target_id = str(item.get("target_id") or "unknown")
            route_key = hashlib.sha256(target_id.encode()).hexdigest()[:20]
            target_entity = writer.entity(
                "external_packages",
                target_id,
                "distribution.package",
                route_key,
                target_id.split(":", 1)[-1],
                canonical_url=(
                    f"https://groupsum.xyz/catalog/resources/distribution.package/{route_key}"
                ),
                visibility="public",
                observed_at=item.get("observed_at"),
                source_url=item.get("source_url"),
            )
        writer.link(
            source_entity,
            target_entity,
            "depends_on",
            role=item.get("scope"),
            origin_kind="repository_manifest",
            source_url=item.get("source_url"),
            observed_at=item.get("observed_at"),
        )
