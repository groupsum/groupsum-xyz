from __future__ import annotations

import json
from collections import defaultdict
from datetime import UTC, datetime
from pathlib import Path

from tigrbl import JSONResponse, Request, Response

from ..importer import connect

CACHE_CONTROL = "public, max-age=60, s-maxage=300, stale-while-revalidate=86400"

from .common import *  # noqa: F403
from .signals import *  # noqa: F403


def record_detail(
    database_path: Path,
    request: Request,
    slug: str,
    expected_type: str,
) -> JSONResponse | Response:
    with connect(database_path) as connection:
        record_row = connection.execute(
            """
            SELECT r.*, o.slug AS organization_slug, o.name AS organization_name,
                   o.website_url AS organization_url
              FROM records r JOIN organizations o ON o.id = r.organization_id
             WHERE r.slug = ? AND r.record_type = ? AND r.visibility = 'public'
            """,
            (slug, expected_type),
        ).fetchone()
        if record_row is None:
            return JSONResponse(
                {"detail": "Record not found", "slug": slug},
                status_code=404,
                headers={"Cache-Control": "public, max-age=30"},
            )
        record = dict(record_row)
        record["featured"] = bool(record["featured"])
        record["content"] = record.get("content") or {}
        taxonomy_rows = rows(
            connection,
            """
            SELECT t.taxonomy_type, t.slug, t.label, t.category
              FROM taxonomies t JOIN record_taxonomies rt ON rt.taxonomy_id = t.id
             WHERE rt.record_id = ? ORDER BY t.taxonomy_type, t.label COLLATE NOCASE
            """,
            (record["id"],),
        )
        taxonomies: dict[str, list[dict]] = defaultdict(list)
        for taxonomy in taxonomy_rows:
            taxonomies[taxonomy.pop("taxonomy_type")].append(taxonomy)
        repositories = rows(
            connection,
            """
            SELECT repo.id, repo.owner, repo.name, repo.url, repo.description,
                   repo.default_branch, repo.is_archived, repo.is_fork, repo.observed_at, rr.role,
                   repo.ssot_governed, repo.ssot_registry_url, repo.ssot_registry_sha256,
                   repo.ssot_schema_version, repo.ssot_summary, repo.ssot_observed_at
              FROM repositories repo
              JOIN record_repositories rr ON rr.repository_id = repo.id
             WHERE rr.record_id = ?
             ORDER BY CASE rr.role
                        WHEN 'primary-implementation' THEN 0
                        WHEN 'primary-public-evidence' THEN 0
                        ELSE 1
                      END,
                      rr.role, repo.owner, repo.name
            """,
            (record["id"],),
        )
        for repository in repositories:
            repository["is_archived"] = bool(repository["is_archived"])
            repository["is_fork"] = bool(repository["is_fork"])
            repository["ssot_governed"] = bool(repository["ssot_governed"])
            if isinstance(repository.get("ssot_summary"), str):
                repository["ssot_summary"] = json.loads(repository["ssot_summary"] or "{}")
            repository.update(repository_signals(connection, repository["id"]))
            repository["releases"] = rows(
                connection,
                """
                SELECT id, release_kind, route_key, version, url, published_at,
                       downloads, prerelease, draft, observed_at
                  FROM releases WHERE repository_id = ?
              ORDER BY COALESCE(published_at, observed_at) DESC LIMIT 100
                """,
                (repository["id"],),
            )
            for release in repository["releases"]:
                release["prerelease"] = bool(release["prerelease"])
                release["draft"] = bool(release["draft"])
            repository["release_count"] = connection.execute(
                "SELECT COUNT(*) FROM releases WHERE repository_id = ?",
                (repository["id"],),
            ).fetchone()[0]
            repository["governance"] = {
                "governed": repository.pop("ssot_governed"),
                "registry_url": repository.pop("ssot_registry_url"),
                "registry_sha256": repository.pop("ssot_registry_sha256"),
                "schema_version": repository.pop("ssot_schema_version"),
                "observed_at": repository.pop("ssot_observed_at"),
                "summary": repository.pop("ssot_summary") or {},
            }
        packages = rows(
            connection,
            """
            SELECT p.id, p.ecosystem, p.name, p.registry_url, p.description,
                   p.route_key, p.source_url, p.manifest_path, p.package_kind, p.private,
                   p.latest_version, p.published,
                   p.publication_status, p.published_at, p.observed_at, rp.role,
                   (SELECT COUNT(*) FROM releases rel WHERE rel.package_id = p.id)
                       AS release_count,
                   (SELECT COUNT(*) FROM dependencies dep
                     WHERE dep.source_kind = 'package' AND dep.source_id = p.id)
                       AS dependency_count,
                   (SELECT COUNT(*) FROM dependencies dep
                     WHERE dep.target_id = p.ecosystem || ':' || REPLACE(LOWER(p.name), '_', '-'))
                       AS dependent_count
              FROM packages p JOIN record_packages rp ON rp.package_id = p.id
             WHERE rp.record_id = ? ORDER BY p.ecosystem, p.name COLLATE NOCASE
            """,
            (record["id"],),
        )
        for package in packages:
            package["private"] = bool(package["private"])
            package["published"] = (
                bool(package["published"]) if package["published"] is not None else None
            )
            download_rows = analytics_rows(
                connection,
                """
                SELECT value FROM metric_observations
                 WHERE subject_kind = 'package' AND subject_id = ? AND metric = 'downloads'
              ORDER BY observed_at DESC LIMIT 1
                """,
                (package["id"],),
            )
            package["downloads"] = (
                metric_number(download_rows[0]["value"]) if download_rows else None
            )
            package["repositories"] = rows(
                connection,
                """
                SELECT repo.id, repo.owner, repo.name, repo.url, pr.path
                  FROM repositories repo JOIN package_repositories pr
                    ON pr.repository_id = repo.id
                 WHERE pr.package_id = ? ORDER BY repo.owner, repo.name, pr.path
                """,
                (package["id"],),
            )
            package_dependencies = rows(
                connection,
                """
                SELECT id, source_id, target_kind, target_id, requirement, scope,
                       origin_kind, source_url, completeness, observed_at
                  FROM dependencies
                 WHERE source_kind = 'package' AND source_id = ?
              ORDER BY scope, target_id
                """,
                (package["id"],),
            )
            natural_key = f"{package['ecosystem']}:{package['name'].lower().replace('_', '-')}"
            package_dependents = rows(
                connection,
                """
                SELECT dep.id, dep.source_kind, dep.source_id,
                       source.ecosystem AS source_ecosystem,
                       source.name AS source_name, dep.target_id,
                       dep.requirement, dep.scope, dep.origin_kind, dep.source_url,
                       dep.completeness, dep.observed_at
                  FROM dependencies dep
             LEFT JOIN packages source ON source.id = dep.source_id
                 WHERE dep.target_id = ?
              ORDER BY COALESCE(source.ecosystem, dep.source_kind),
                       COALESCE(source.name, dep.source_id) COLLATE NOCASE
                """,
                (natural_key,),
            )
            scope_counts: dict[str, int] = defaultdict(int)
            for dependency in package_dependencies:
                scope_counts[str(dependency.get("scope") or "dependencies")] += 1
            completeness_counts: dict[str, int] = defaultdict(int)
            for dependent in package_dependents:
                completeness_counts[str(dependent.get("completeness") or "catalog-observed")] += 1
            package["dependencies"] = package_dependencies
            package["dependents"] = package_dependents
            package["dependency_summary"] = {
                "edge_count": len(package_dependencies),
                "unique_target_count": len({item["target_id"] for item in package_dependencies}),
                "internal_edge_count": sum(
                    item["target_kind"] == "package" for item in package_dependencies
                ),
                "external_edge_count": sum(
                    item["target_kind"] == "external-package" for item in package_dependencies
                ),
                "by_scope": dict(sorted(scope_counts.items())),
            }
            package["dependent_summary"] = {
                "edge_count": len(package_dependents),
                "unique_source_count": len({item["source_id"] for item in package_dependents}),
                "by_completeness": dict(sorted(completeness_counts.items())),
                "coverage": (
                    "All reverse edges within this collected catalog plus bounded registry "
                    "observations where a registry exposes them; not a complete global count."
                ),
            }
            package["releases"] = rows(
                connection,
                """
                SELECT id, release_kind, route_key, version, url, published_at,
                       downloads, prerelease, draft, observed_at
                  FROM releases WHERE package_id = ?
              ORDER BY COALESCE(published_at, observed_at) DESC LIMIT 100
                """,
                (package["id"],),
            )
            for release in package["releases"]:
                release["prerelease"] = bool(release["prerelease"])
                release["draft"] = bool(release["draft"])
        resources = rows(
            connection,
            """
            SELECT rs.id, rs.resource_type, rs.route_key, rs.title, rs.url, rs.summary,
                   rs.observed_at, rr.role
              FROM resources rs JOIN record_resources rr ON rr.resource_id = rs.id
             WHERE rr.record_id = ? ORDER BY rr.role, rr.sort_order, rs.title COLLATE NOCASE
            """,
            (record["id"],),
        )
        deployments = rows(
            connection,
            """
            SELECT id, name, url, environment, reachability, observed_at
              FROM deployments WHERE record_id = ? ORDER BY observed_at DESC
            """,
            (record["id"],),
        )
        relations = rows(
            connection,
            """
            SELECT rel.relation_type, rel.note, target.slug, target.title,
                   target.record_type, target.summary, target.canonical_url
              FROM record_relations rel JOIN records target ON target.id = rel.target_record_id
             WHERE rel.source_record_id = ?
             ORDER BY rel.relation_type, target.title COLLATE NOCASE
            """,
            (record["id"],),
        )
        observations = rows(
            connection,
            """
            SELECT id, observation_type, source_url, payload, completeness, observed_at
              FROM observations
             WHERE subject_kind = 'record' AND subject_id = ?
          ORDER BY observed_at DESC
            """,
            (record["id"],),
        )
        for observation in observations:
            if isinstance(observation.get("payload"), str):
                observation["payload"] = json.loads(observation["payload"])
        limitations = rows(
            connection,
            "SELECT id, title, description, severity, reviewed_at FROM limitations "
            "WHERE record_id = ? ORDER BY id",
            (record["id"],),
        )
        entity_graph = entity_graph_for_source(connection, "records", record["id"])
        linked_sections = linked_resource_sections_for_source(
            connection,
            "records",
            record["id"],
            excluded_types=frozenset(
                {
                    "party.organization",
                    "source.repository",
                    "distribution.package",
                }
            ),
        )
    return cacheable_json(
        request,
        {
            "kind": f"{expected_type}_record",
            "generated_at": record["updated_at"] or datetime.now(UTC).isoformat(),
            "record": record,
            "graph": entity_graph,
            "linked_sections": linked_sections,
            "taxonomies": dict(taxonomies),
            "implementation": {
                "repositories": repositories,
                "packages": packages,
                "resources": resources,
                "deployments": deployments,
            },
            "relations": relations,
            "editorial": {
                "observations": observations,
                "limitations": limitations,
                "ssot_claim_rooting": {
                    "status": "repository-scoped",
                    "limitation": (
                        "Claims and evidence are exposed only from linked repository SSOT "
                        "registries; inventory observations are not governance evidence."
                    ),
                },
            },
            "governance": {
                "repositories": [
                    {
                        "repository_id": repository["id"],
                        "repository": f"{repository['owner']}/{repository['name']}",
                        "role": repository["role"],
                        **repository["governance"],
                    }
                    for repository in repositories
                ],
            },
        },
    )
