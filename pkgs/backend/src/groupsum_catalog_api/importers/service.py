from __future__ import annotations

import json
from datetime import UTC, datetime
from pathlib import Path

from ..domain.resources.ontology import normalize_legacy_resource_type
from ..tables.organization import Organization
from ..tables.package import Package
from ..tables.portfolio_repository import PortfolioRepository
from ..tables.product_package import ProductPackage
from ..tables.product_repository import ProductRepository
from ..tables.repository import Repository
from ..tables.repository_package import RepositoryPackage
from ..tables.repository_resource import RepositoryResource
from ..tables.repository_ssot_item import RepositorySsotItem
from ..tables.repository_ssot_registry import RepositorySsotRegistry
from ..tables.repository_technology import RepositoryTechnology
from ..tables.technology import Technology
from ..tables.typed_resource import TypedResource
from .common import (
    clear_catalog,
    import_editorial,
    import_organizations,
    load_inputs,
    merge_catalog_entry,
    parse_datetime,
    route_slug,
    stable_id,
)


def _import_repositories(session, rows: list[dict], organizations: set[str], observed_at: datetime):
    by_full_name: dict[str, Repository] = {}
    for row in rows:
        repository = Repository(
            id=row["id"],
            organization_id=row["owner"] if row["owner"] in organizations else None,
            provider="github",
            owner=row["owner"],
            name=row["name"],
            url=row["url"],
            description=row.get("description"),
            default_branch=row.get("default_branch"),
            is_archived=bool(row.get("archived")),
            is_fork=bool(row.get("fork")),
            license_expression=row.get("license"),
            ssot_governed=bool((row.get("ssot_governance") or {}).get("governed")),
            ssot_registry_url=(row.get("ssot_governance") or {}).get("registry_url"),
            ssot_registry_sha256=(row.get("ssot_governance") or {}).get("source_sha256"),
            ssot_schema_version=(row.get("ssot_governance") or {}).get("schema_version"),
            ssot_summary=row.get("ssot_governance"),
            ssot_observed_at=parse_datetime((row.get("ssot_governance") or {}).get("observed_at")),
            observed_at=parse_datetime(row.get("observed_at")) or observed_at,
        )
        session.merge(repository)
        repository.slug = route_slug(row.get("route"), row["name"])
        repository.summary = repository.description
        merge_catalog_entry(session, kind="repository", item=repository, observed_at=observed_at)
        by_full_name[row["full_name"]] = repository

        governance = row.get("ssot_governance") or {}
        if governance.get("present"):
            registry_id = stable_id(
                "ssot-registry", repository.id, governance.get("source_sha256")
            )
            session.merge(
                RepositorySsotRegistry(
                    id=registry_id,
                    repository_id=repository.id,
                    registry_url=governance["registry_url"],
                    schema_version=governance.get("schema_version"),
                    source_sha256=governance.get("source_sha256"),
                    valid=bool(governance.get("valid")),
                    observed_at=parse_datetime(governance.get("observed_at")) or observed_at,
                )
            )
            for kind, items in (governance.get("inventory") or {}).items():
                for item in items:
                    session.merge(
                        RepositorySsotItem(
                            id=stable_id("ssot-item", registry_id, kind, item["id"]),
                            registry_id=registry_id,
                            entity_kind=kind,
                            entity_id=item["id"],
                            title=item.get("title"),
                            status=item.get("status"),
                            implementation_status=item.get("implementation_status"),
                            payload=item,
                        )
                    )
    return by_full_name


def _import_packages(session, rows: list[dict], repositories: dict[str, Repository], observed_at):
    by_id: dict[str, Package] = {}
    for row in rows:
        package = Package(
            id=row["id"],
            ecosystem=row["ecosystem"],
            name=row["name"],
            registry_url=row["registry_url"],
            source_url=row.get("source_url"),
            manifest_path=row.get("manifest_path"),
            package_kind=row.get("package_kind", "package-candidate"),
            private=bool(row.get("private")),
            description=row.get("description"),
            latest_version=row.get("latest_version"),
            published=row.get("published"),
            publication_status=row.get("publication_status"),
            route_key=route_slug(row.get("route"), row["id"].rsplit(":", 1)[-1]),
            license_expression=row.get("license_expression"),
            license_status=row.get("license_status"),
            observed_at=parse_datetime(row.get("observed_at")) or observed_at,
        )
        session.merge(package)
        package.slug = package.route_key
        package.summary = package.description
        merge_catalog_entry(session, kind="package", item=package, observed_at=observed_at)
        by_id[package.id] = package
        repository = repositories.get(str(row.get("repository", "")))
        if repository:
            session.merge(
                RepositoryPackage(
                    id=stable_id("repository-package", repository.id, package.id),
                    repository_id=repository.id,
                    package_id=package.id,
                    role="source",
                    repository_path=row.get("manifest_path"),
                    observed_at=observed_at,
                )
            )
    return by_id


def _import_technologies(
    session, rows: list[dict], repositories: dict[str, Repository], observed_at
):
    by_name: dict[str, Technology] = {}
    for row in rows:
        technology = Technology(
            id=row["id"],
            slug=route_slug(row.get("route"), row["id"].rsplit(":", 1)[-1]),
            name=row["name"],
            category="language",
            observed_at=parse_datetime(row.get("observed_at")) or observed_at,
        )
        session.merge(technology)
        merge_catalog_entry(session, kind="technology", item=technology, observed_at=observed_at)
        by_name[technology.name.lower()] = technology
        for full_name in row.get("repositories", []):
            repository = repositories.get(full_name)
            if repository:
                session.merge(
                    RepositoryTechnology(
                        id=stable_id("repository-technology", repository.id, technology.id),
                        repository_id=repository.id,
                        technology_id=technology.id,
                        role="implementation",
                        bytes=row.get("bytes"),
                        observed_at=technology.observed_at,
                    )
                )
    return by_name


def _import_resources(session, rows: list[dict], repositories: dict[str, Repository], observed_at):
    by_id: dict[str, TypedResource] = {}
    for repository_row in rows:
        repository = repositories.get(repository_row["full_name"])
        if not repository:
            continue
        for row in repository_row.get("related_resources", []):
            resource_type = normalize_legacy_resource_type(row.get("kind", ""), row.get("path"))
            if resource_type is None:
                continue
            route_key = route_slug(row.get("route"), row["id"].rsplit(":", 1)[-1])
            resource = TypedResource(
                id=row["id"],
                resource_type=resource_type,
                organization_id=repository.organization_id,
                repository_id=repository.id,
                title=row.get("name") or row.get("path") or row["url"],
                summary=None,
                url=row["url"],
                canonical_path=f"/catalog/resources/{resource_type}/{route_key}",
                source_url=row.get("url"),
                repository_path=row.get("path"),
                reachability="unverified",
                observed_at=parse_datetime(row.get("observed_at")) or observed_at,
            )
            session.merge(resource)
            resource.slug = route_key
            resource.name = resource.title
            merge_catalog_entry(session, kind="resource", item=resource, observed_at=observed_at)
            session.merge(
                RepositoryResource(
                    id=stable_id("repository-resource", repository.id, resource.id),
                    repository_id=repository.id,
                    resource_id=resource.id,
                    role="owner",
                    repository_path=row.get("path"),
                    observed_at=resource.observed_at,
                )
            )
            by_id[resource.id] = resource
    return by_id


def _attach_editorial(
    session, repo_root: Path, editorial: dict, repositories, packages, observed_at
):
    for row in editorial.get("records", []):
        if row.get("record_type") not in {"product", "portfolio"}:
            continue
        path = (
            repo_root
            / "catalog/generated/product-evidence"
            / row["organization_id"]
            / f"{row.get('source_name', row['slug'])}.json"
        )
        if not path.exists():
            continue
        bundle = json.loads(path.read_text(encoding="utf-8"))
        repository_rows = bundle["repository"].get("attached_repositories") or [
            bundle["repository"]
        ]
        for position, repository_row in enumerate(repository_rows):
            repository = repositories.get(repository_row.get("full_name"))
            if not repository:
                continue
            relation = (
                PortfolioRepository if row["record_type"] == "portfolio" else ProductRepository
            )
            values = {
                "id": stable_id(row["record_type"], row["id"], repository.id),
                f"{row['record_type']}_id": row["id"],
                "repository_id": repository.id,
                "role": "implementation",
                "sort_order": position,
                "observed_at": observed_at,
            }
            session.merge(relation(**values))
        if row["record_type"] == "product":
            for position, package_row in enumerate(bundle.get("packages", [])):
                package = packages.get(package_row.get("id"))
                if package:
                    session.merge(
                        ProductPackage(
                            id=stable_id("product-package", row["id"], package.id),
                            product_id=row["id"],
                            package_id=package.id,
                            role="distribution",
                            sort_order=position,
                            observed_at=observed_at,
                        )
                    )


def import_catalog_data(
    database_path: str | Path,
    repo_root: Path,
    analytics_path: Path | None = None,
) -> dict[str, int]:
    del database_path, analytics_path
    editorial, repository_rows, package_rows, technology_rows = load_inputs(repo_root)
    observed_at = datetime.now(UTC).replace(microsecond=0)
    session, release = Organization.acquire(op_alias="list")
    try:
        clear_catalog(session)
        organizations = import_organizations(session, editorial, observed_at)
        editorial_counts = import_editorial(session, editorial, observed_at)
        repositories = _import_repositories(
            session,
            repository_rows,
            {row["id"] for row in editorial.get("organizations", [])},
            observed_at,
        )
        packages = _import_packages(session, package_rows, repositories, observed_at)
        technologies = _import_technologies(session, technology_rows, repositories, observed_at)
        resources = _import_resources(session, repository_rows, repositories, observed_at)
        _attach_editorial(session, repo_root, editorial, repositories, packages, observed_at)
        session.commit()
        return {
            "organizations": organizations,
            "products": int(editorial_counts["products"]),
            "portfolios": int(editorial_counts["portfolios"]),
            "repositories": len(repositories),
            "packages": len(packages),
            "resources": len(resources),
            "technologies": len(technologies),
        }
    except Exception:
        session.rollback()
        raise
    finally:
        release()
