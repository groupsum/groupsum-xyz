from __future__ import annotations

from collections import Counter, defaultdict
from typing import Any

from .common import *  # noqa: F403

PACKAGE_ROUTE_KEY_MAX_LENGTH = 80


def package_route_key(name: str, package_id: str) -> str:
    suffix = f"-{stable_hash(package_id, 8)}"
    prefix = slug(name)[: PACKAGE_ROUTE_KEY_MAX_LENGTH - len(suffix)].rstrip("-")
    return f"{prefix}{suffix}"


def compile_packages(catalog: dict[str, Any], generated_at: str, overrides: dict[str, Any], source_repositories: dict[str, Any], relationship_counts: dict[str, Counter[str]], dependents_by_key: dict[str, list[dict[str, Any]]], known_package_keys: set[str]) -> tuple[list[dict[str, Any]], dict[str, list[str]]]:
    package_records: list[dict[str, Any]] = []
    packages_by_repo: dict[str, list[str]] = defaultdict(list)
    for package in catalog.get("packages", []):
        ecosystem = str(package.get("ecosystem") or "unknown")
        name = str(package.get("name") or "unnamed")
        repository = package.get("repository")
        if not repository and package.get("owner") and package.get("name"):
            candidate = f"{package['owner']}/{package['name']}"
            if candidate in source_repositories:
                repository = candidate
        legal_repository = repository
        package_identity = f"{ecosystem}:{name}:{repository or package.get('owner') or 'registry'}:{package.get('manifest_path') or 'package'}"
        package_id = f"package:{package_identity}"
        package_slug = package_route_key(name, package_id)
        checked_at = package.get("updated_at") or observed_at(package, generated_at)
        override = overrides.get(package_id, {})
        registry_url = package.get("registry_url") or package.get("url")
        source_repository = source_repositories.get(str(repository), {})
        source_branch = str(source_repository.get("default_branch") or "HEAD")
        source_url = f"https://github.com/{repository}/blob/{source_branch}/{package.get('manifest_path')}" if repository and package.get("manifest_path") else None
        release_records = normalized_releases(package, checked_at)
        for release in release_records:
            release_id = f"release:{stable_hash(f'{package_id}:{release['release_kind']}:{release['version']}', 16)}"
            release["id"] = release_id
            release["route"] = (
                f"/catalog/releases/{release['release_kind']}/"
                f"{slug(name)}-{stable_hash(release_id, 10)}"
            )
        source_repository = source_repositories.get(str(legal_repository), source_repository)
        package_technologies = sorted(
            ((source_repository.get("technologies") or {}).get("languages_bytes") or {}).keys()
        )
        manifest_directory = str(package.get("manifest_path") or "").rsplit("/", 1)[0]
        license_expression = (
            package.get("license_expression")
            or package.get("registry_license_expression")
            or source_repository.get("license")
        )
        legal_evidence: list[dict[str, Any]] = []
        if package.get("license_expression"):
            legal_evidence.append(
                {
                    "kind": "license-expression",
                    "name": "Package manifest license",
                    "expression": package["license_expression"],
                    "url": source_url,
                    "scope": "direct",
                    "evidence_type": "repository.manifest",
                }
            )
        if package.get("registry_license_expression"):
            legal_evidence.append(
                {
                    "kind": "license-expression",
                    "name": "Registry license metadata",
                    "expression": package["registry_license_expression"],
                    "url": registry_url,
                    "scope": "direct",
                    "evidence_type": f"{ecosystem}.registry",
                }
            )
        if package.get("license_file") and repository:
            license_path = "/".join(
                item for item in (manifest_directory, str(package["license_file"])) if item
            )
            legal_evidence.append(
                {
                    "kind": "license-file",
                    "name": str(package["license_file"]),
                    "path": license_path,
                    "url": f"https://github.com/{repository}/blob/{source_branch}/{license_path}",
                    "scope": "direct",
                    "evidence_type": "repository.manifest",
                }
            )
        for item in source_repository.get("legal_evidence") or []:
            legal_path = str(item.get("path") or "")
            is_root_evidence = bool(legal_path) and "/" not in legal_path
            is_package_evidence = bool(manifest_directory) and (
                legal_path == manifest_directory
                or legal_path.startswith(f"{manifest_directory}/")
            )
            if legal_path and not (is_root_evidence or is_package_evidence):
                continue
            legal_evidence.append(
                {
                    "kind": item.get("kind"),
                    "name": item.get("name"),
                    "expression": item.get("expression"),
                    "path": item.get("path"),
                    "url": item.get("url"),
                    "scope": "inherited",
                    "evidence_type": item.get("evidence"),
                }
            )
        deduplicated_legal_evidence: list[dict[str, Any]] = []
        seen_legal_evidence: set[tuple[str, str]] = set()
        for item in legal_evidence:
            identity = (
                str(item.get("kind") or "legal-evidence"),
                str(item.get("path") or item.get("expression") or item.get("url") or ""),
            )
            if identity in seen_legal_evidence:
                continue
            seen_legal_evidence.add(identity)
            deduplicated_legal_evidence.append(item)
        legal_evidence = deduplicated_legal_evidence
        for release in release_records:
            release["license_expression"] = license_expression
            release["license_status"] = "observed" if license_expression else "not-observed"
            release["legal_evidence"] = []
            release["legal_inherits_from"] = package_id
        dependencies = [
            {
                "name": str(item.get("name") or "unknown"),
                "ecosystem": ecosystem,
                "package_key": package_key(ecosystem, str(item.get("name") or "unknown")),
                "requirement": item.get("requirement"),
                "scope": item.get("scope"),
                "internal": package_key(ecosystem, str(item.get("name") or "unknown"))
                in known_package_keys,
                "evidence": "repository.manifest",
            }
            for item in package.get("dependencies") or []
        ]
        dependent_records = sorted(
            {
                (
                    item["package_key"],
                    str(item.get("scope") or ""),
                    str(item.get("requirement") or ""),
                ): item
                for item in dependents_by_key.get(package_key(ecosystem, name), [])
            }.values(),
            key=lambda item: (item["ecosystem"], item["name"], str(item.get("scope") or "")),
        )
        manifest_path = str(package.get("manifest_path") or "")
        package_directory = manifest_path.rsplit("/", 1)[0] if "/" in manifest_path else ""
        is_package_directory = package_directory.split("/", 1)[0] in {
            "packages",
            "pkgs",
            "libs",
            "crates",
        }
        if package.get("published") is True:
            package_kind = "published-package"
        elif package.get("private") and is_package_directory:
            package_kind = "private-package"
        elif package.get("private") and not package_directory:
            package_kind = "workspace-project"
        else:
            package_kind = "package-candidate"
        record = {
            "id": package_id,
            "kind": "package",
            "route": f"/catalog/packages/{ecosystem}/{package_slug}",
            "name": name,
            "display_name": override.get("display_name") or name,
            "description": override.get("description") or f"Observed {ecosystem} package record for {name}.",
            "description_source": "reviewed-editorial" if override.get("description") else "generated-factual",
            "reviewed": bool(override),
            "ecosystem": ecosystem,
            "owner": package.get("owner") or (str(repository).split("/", 1)[0] if repository else None),
            "repository": repository,
            "legal_repository": legal_repository,
            "manifest_path": package.get("manifest_path"),
            "package_kind": package_kind,
            "technologies": package_technologies,
            "private": bool(package.get("private")),
            "published": package.get("published") is True,
            "publication_status": package.get("publication_status") or ("published" if package.get("published") else "not-confirmed"),
            "latest_version": package.get("latest_version") or package.get("version_declared"),
            "version_declared": package.get("version_declared"),
            "release_count": len(release_records),
            "releases": release_records,
            "dependency_count": len(dependencies),
            "dependencies": dependencies,
            "dependent_count": len(dependent_records),
            "dependents": dependent_records,
            "downstream_count": len(package.get("downstream") or []),
            "relationship_count": sum(relationship_counts[f"{ecosystem}:{name}"].values()),
            "relationship_counts": dict(sorted(relationship_counts[f"{ecosystem}:{name}"].items())),
            "downstream_completeness": package.get("downstream_completeness") or "not-observed",
            "downloads": package.get("downloads"),
            "license_expression": license_expression,
            "license_status": "observed" if license_expression else "not-observed",
            "license_classifiers": package.get("license_classifiers") or [],
            "legal_evidence": legal_evidence,
            "registry_url": registry_url,
            "source_url": source_url,
            "observed_at": checked_at,
            "evidence": evidence("registry" if registry_url else "source", registry_url or source_url, checked_at),
            "claim_boundary": override.get("claim_boundary") or "Publication is reported only when confirmed by the named public registry.",
        }
        package_records.append(record)
        if repository:
            packages_by_repo[repository].append(package_id)

    return package_records, packages_by_repo
