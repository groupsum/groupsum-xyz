from __future__ import annotations

from ..database import Connection
from ..ontology import RECORD_RESOURCE_TYPES, normalize_legacy_resource_type
from .common import catalog_entity_id, package_key
from .graph_writer import GraphWriter


def project_core(connection: Connection, writer: GraphWriter):
    organization_entities: dict[str, str] = {}
    for row in connection.execute("SELECT * FROM organizations").fetchall():
        item = dict(row)
        organization_entities[item["id"]] = writer.entity(
            "organizations",
            item["id"],
            "party.organization",
            item["slug"],
            item["name"],
            organization_id=item["id"],
            summary=item.get("summary"),
            canonical_url=f"https://groupsum.xyz/products/{item['slug']}",
            observed_at=item.get("observed_at"),
            source_url=item.get("source_url"),
        )

    for row in connection.execute("SELECT * FROM records").fetchall():
        item = dict(row)
        entity_id = writer.entity(
            "records",
            item["id"],
            RECORD_RESOURCE_TYPES[item["record_type"]],
            item["slug"],
            item["title"],
            organization_id=item["organization_id"],
            summary=item.get("summary"),
            canonical_url=item.get("canonical_url"),
            visibility=item.get("visibility") or "public",
            maturity=item.get("maturity"),
            observed_at=item.get("updated_at"),
            source_url=item.get("source_url"),
        )
        owner = organization_entities.get(item["organization_id"])
        if owner:
            writer.link(
                entity_id,
                owner,
                "owned_by",
                origin_kind="editorial",
                source_url=item.get("canonical_url"),
                observed_at=item.get("updated_at"),
            )

    repository_entities: dict[str, str] = {}
    ssot_registry_entities: dict[str, str] = {}
    for row in connection.execute("SELECT * FROM repositories").fetchall():
        item = dict(row)
        canonical = f"https://groupsum.xyz/catalog/repositories/{item['owner']}/{item['name']}"
        entity_id = writer.entity(
            "repositories",
            item["id"],
            "source.repository",
            f"{item['owner']}/{item['name']}",
            f"{item['owner']}/{item['name']}",
            organization_id=item.get("organization_id"),
            summary=item.get("description"),
            canonical_url=canonical,
            maturity="archived" if item.get("is_archived") else "observed-public-source",
            observed_at=item.get("observed_at"),
            source_url=item.get("url"),
        )
        repository_entities[item["id"]] = entity_id
        owner = organization_entities.get(item.get("organization_id"))
        if owner:
            writer.link(
                entity_id,
                owner,
                "owned_by",
                origin_kind="provider_api",
                source_url=item.get("url"),
                observed_at=item.get("observed_at"),
            )
        if item.get("ssot_governed") and item.get("ssot_registry_url"):
            registry_id = writer.entity(
                "ssot_registries",
                item["id"],
                "governance.registry",
                f"{item['owner']}/{item['name']}/ssot-registry",
                f"{item['owner']}/{item['name']} SSOT registry",
                organization_id=item.get("organization_id"),
                summary="Canonical repository governance registry.",
                canonical_url=item["ssot_registry_url"],
                observed_at=item.get("ssot_observed_at"),
                source_url=item["ssot_registry_url"],
            )
            for registry_row in connection.execute(
                "SELECT id FROM repository_ssot_registries WHERE repository_id = ?",
                (item["id"],),
            ).fetchall():
                ssot_registry_entities[str(registry_row[0])] = registry_id
            writer.link(
                entity_id,
                registry_id,
                "governed_by",
                origin_kind="ssot_registry",
                source_url=item["ssot_registry_url"],
                observed_at=item.get("ssot_observed_at"),
            )

    for row in connection.execute("SELECT * FROM packages").fetchall():
        item = dict(row)
        route = (
            f"https://groupsum.xyz/catalog/packages/{item['ecosystem']}/{item['route_key']}"
            if item.get("route_key")
            else item.get("registry_url")
        )
        writer.entity(
            "packages",
            item["id"],
            "distribution.package",
            f"{item['ecosystem']}:{item['name']}",
            item["name"],
            summary=item.get("description"),
            canonical_url=route,
            maturity=item.get("publication_status"),
            observed_at=item.get("observed_at"),
            source_url=item.get("registry_url") or item.get("source_url"),
        )

    package_entities = {
        str(row[0]): catalog_entity_id("packages", str(row[0]))
        for row in connection.execute("SELECT id FROM packages").fetchall()
    }
    package_by_key = {
        package_key(str(row[1]), str(row[2])): str(row[0])
        for row in connection.execute("SELECT id, ecosystem, name FROM packages").fetchall()
    }

    projected_resource_entities: dict[str, str] = {}
    for row in connection.execute("SELECT * FROM resources").fetchall():
        item = dict(row)
        legacy_type = item.get("resource_type") or ""
        resource_type = normalize_legacy_resource_type(legacy_type, item.get("path"))
        if resource_type is None:
            continue
        route = (
            f"https://groupsum.xyz/catalog/resources/{resource_type}/{item['route_key']}"
            if item.get("route_key")
            else item.get("url")
        )
        projected_resource_entities[item["id"]] = writer.entity(
            "resources",
            item["id"],
            resource_type,
            item.get("route_key") or item["id"],
            item["title"],
            summary=item.get("summary"),
            canonical_url=route,
            observed_at=item.get("observed_at"),
            source_url=item.get("url"),
        )

    for row in connection.execute("SELECT * FROM releases").fetchall():
        item = dict(row)
        route = (
            f"https://groupsum.xyz/catalog/releases/{item['route_key']}"
            if item.get("route_key")
            else item.get("url")
        )
        release_type = (
            "release.container"
            if str(item.get("release_kind") or "").lower() in {"ghcr", "docker", "container"}
            else "release.package"
            if item.get("package_id")
            else "release.repository"
        )
        release_entity = writer.entity(
            "releases",
            item["id"],
            release_type,
            item.get("route_key") or item["id"],
            str(item.get("version") or "Release"),
            canonical_url=route,
            observed_at=item.get("observed_at"),
            source_url=item.get("url"),
        )
        parent_entity = (
            package_entities.get(str(item.get("package_id")))
            if item.get("package_id")
            else repository_entities.get(str(item.get("repository_id")))
        )
        if parent_entity:
            writer.link(
                release_entity,
                parent_entity,
                "release_of",
                origin_kind="provider_api",
                source_url=item.get("url"),
                observed_at=item.get("observed_at"),
            )

    return (
        organization_entities,
        repository_entities,
        ssot_registry_entities,
        package_entities,
        package_by_key,
        projected_resource_entities,
    )
