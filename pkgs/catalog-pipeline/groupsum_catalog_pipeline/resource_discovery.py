from __future__ import annotations


import argparse
import concurrent.futures
import dataclasses
import datetime as dt
import hashlib
import json
import os
import re
import subprocess
import sys
import threading
import time
import tomllib
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any, Iterable

from .collector_common import *  # noqa: F403

def filter_repositories(repositories: Iterable[dict[str, Any]], config: dict[str, Any]) -> list[dict[str, Any]]:
    """Apply configured repository scope before any expensive collection work."""
    excluded_names = {str(name).casefold() for name in config.get("excluded_repository_names", [])}
    result = [repo for repo in repositories if str(repo.get("name") or "").casefold() not in excluded_names]
    if not config.get("include_archived_repositories", True):
        result = [repo for repo in result if not repo.get("archived")]
    if not config.get("include_forks", True):
        result = [repo for repo in result if not repo.get("fork")]
    return result


def discover_related_resources(
    repo: dict[str, Any], paths: Iterable[str], markers: set[str], limit: int = 200
) -> list[dict[str, Any]]:
    """Find typed resources from direct source evidence without guessing live surfaces."""
    resources: dict[tuple[str, str], dict[str, Any]] = {}
    homepage = str(repo.get("homepage") or "").strip()
    if homepage:
        resources[("interface.website", homepage)] = {
            "resource_type": "interface.website", "name": repo["name"], "url": homepage,
            "evidence": "repository.homepage",
        }
    kind_by_marker = {
        "demo": "implementation.demo", "demos": "implementation.demo",
        "docs": "documentation.collection",
        "example": "implementation.example", "examples": "implementation.example",
        "showcase": "implementation.showcase", "showcases": "implementation.showcase",
        "website": "interface.website", "websites": "interface.website",
    }
    for path in sorted(paths):
        path_parts = list(Path(path).parts)
        lower_parts = [part.lower() for part in path_parts]
        filename = Path(path).name.lower()
        if lower_parts and lower_parts[0] == ".ssot":
            # Governance artifacts are projected from the canonical SSOT registry,
            # never reclassified as documentation, examples, or API contracts.
            continue
        api_definition_names = {
            "openapi.json", "openapi.yaml", "openapi.yml",
            "openrpc.json", "openrpc.yaml", "openrpc.yml",
            "asyncapi.json", "asyncapi.yaml", "asyncapi.yml",
        }
        if filename in api_definition_names or Path(path).suffix.lower() == ".proto":
            contract_type = (
                "contract.asyncapi" if "asyncapi" in filename else
                "contract.openrpc" if "openrpc" in filename else
                "contract.protobuf" if filename.endswith(".proto") else
                "contract.openapi"
            )
            resources[(contract_type, path)] = {
                "resource_type": contract_type, "name": path, "path": path,
                "url": f"{repo['html_url']}/blob/{repo['default_branch']}/{path}",
                "evidence": "repository.api_definition",
            }
        matching_indexes = [index for index, part in enumerate(lower_parts) if part in markers]
        if not matching_indexes:
            continue
        index = matching_indexes[0]
        marker = lower_parts[index]
        if marker not in kind_by_marker:
            continue
        root = "/".join(path_parts[: min(index + 2, len(path_parts))])
        resource_type = kind_by_marker[marker]
        route_kind = "blob" if Path(root).suffix else "tree"
        resources[(resource_type, root)] = {
            "resource_type": resource_type, "name": root, "path": root,
            "url": f"{repo['html_url']}/{route_kind}/{repo['default_branch']}/{root}",
            "evidence": f"repository.{route_kind}",
        }
        if len(resources) >= limit:
            break
    return sorted(
        resources.values(), key=lambda item: (item["resource_type"], item["name"])
    )[:limit]


def normalize_license_expression(value: Any) -> str | None:
    """Keep concise license identifiers/expressions without copying license text."""
    if isinstance(value, dict):
        value = value.get("type") or value.get("name")
    if isinstance(value, list):
        values = [normalize_license_expression(item) for item in value]
        return " OR ".join(item for item in values if item) or None
    if not isinstance(value, str):
        return None
    candidate = value.strip()
    if not candidate or len(candidate) > 200 or "\n" in candidate or "\r" in candidate:
        return None
    return candidate


SSOT_ENTITY_KEYS = (
    "adrs",
    "specs",
    "features",
    "tests",
    "claims",
    "evidence",
    "issues",
    "boundaries",
    "profiles",
    "releases",
)


def summarize_ssot_registry(
    repo: dict[str, Any], registry: Any, observation: Observation, source_text: str
) -> dict[str, Any]:
    """Report only registry-authored governance facts with durable provenance."""
    registry_url = observation.url or ""
    source_url = (
        f"{repo.get('html_url') or repo.get('url')}/blob/"
        f"{repo.get('default_branch') or 'master'}/.ssot/registry.json"
    )
    schema_version = registry.get("schema_version") if isinstance(registry, dict) else None
    valid = isinstance(registry, dict) and isinstance(schema_version, (str, int, float))
    result: dict[str, Any] = {
        "present": True,
        "governed": valid,
        "valid": valid,
        "registry_url": source_url,
        "raw_url": registry_url,
        "observed_at": observation.observed_at,
        "source_sha256": hashlib.sha256(source_text.encode()).hexdigest(),
        "schema_version": str(schema_version) if schema_version is not None else None,
        "counts": {},
        "status_counts": {},
        "coverage": {},
        "evidence_type": "ssot.registry",
    }
    if not valid:
        result["limitation"] = "Registry file was observed but was not a recognized SSOT registry document."
        return result
    for key in SSOT_ENTITY_KEYS:
        values = registry.get(key)
        rows = values if isinstance(values, list) else []
        result["counts"][key] = len(rows)
        statuses: dict[str, int] = {}
        for item in rows:
            if not isinstance(item, dict):
                continue
            status = str(item.get("status") or item.get("implementation_status") or "unreported")
            statuses[status] = statuses.get(status, 0) + 1
        result["status_counts"][key] = dict(sorted(statuses.items()))
    # Preserve a compact, registry-authored inventory so consumers can group
    # governance by repository without publishing the raw registry payload.
    # Only identity, status, display text, and explicit linkage fields cross
    # this boundary; arbitrary registry extensions remain source-only.
    result["inventory"] = {}
    result["inventory_truncated"] = {}
    inventory_limit = 20
    for key in SSOT_ENTITY_KEYS:
        values = registry.get(key)
        rows = values if isinstance(values, list) else []
        result["inventory"][key] = [
            {
                field: item[field]
                for field in (
                    "id",
                    "status",
                    "implementation_status",
                    "title",
                    "name",
                    "statement",
                    "evidence_ids",
                    "test_ids",
                    "claim_ids",
                    "feature_ids",
                )
                if item.get(field) is not None
            }
            for item in rows[:inventory_limit]
            if isinstance(item, dict) and item.get("id")
        ]
        result["inventory_truncated"][key] = max(0, len(rows) - inventory_limit)
    claims = [item for item in registry.get("claims", []) if isinstance(item, dict)]
    evidence = [item for item in registry.get("evidence", []) if isinstance(item, dict)]
    result["coverage"] = {
        "claims_with_evidence": sum(bool(item.get("evidence_ids")) for item in claims),
        "claims_without_evidence": sum(not item.get("evidence_ids") for item in claims),
        "claims_with_tests": sum(bool(item.get("test_ids")) for item in claims),
        "evidence_linked_to_claims": sum(bool(item.get("claim_ids")) for item in evidence),
        "evidence_without_claims": sum(not item.get("claim_ids") for item in evidence),
    }
    return result


def collect_ssot_governance(
    client: ApiClient, repo: dict[str, Any]
) -> tuple[dict[str, Any], Observation]:
    full_name = str(repo["full_name"])
    branch = urllib.parse.quote(str(repo.get("default_branch") or "master"), safe="")
    raw_url = f"https://raw.githubusercontent.com/{full_name}/{branch}/.ssot/registry.json"
    text, observation = client.request_text(raw_url, allow_404=True)
    if text is None:
        return {
            "present": False,
            "governed": False,
            "valid": False,
            "registry_url": None,
            "observed_at": observation.observed_at,
            "observation_status": observation.status,
            "counts": {},
            "status_counts": {},
            "coverage": {},
        }, observation
    try:
        registry = json.loads(text)
    except json.JSONDecodeError:
        registry = None
    return summarize_ssot_registry(repo, registry, observation, text), observation


def repository_legal_evidence(
    repo: dict[str, Any], paths: Iterable[str]
) -> list[dict[str, Any]]:
    """Describe public license and notice evidence without embedding legal text."""
    evidence: list[dict[str, Any]] = []
    expression = normalize_license_expression((repo.get("license") or {}).get("spdx_id"))
    if expression and expression != "NOASSERTION":
        evidence.append(
            {
                "kind": "license-expression",
                "name": "GitHub detected license",
                "expression": expression,
                "url": repo.get("html_url"),
                "evidence": "github.repository.license",
            }
        )
    for path in sorted(paths):
        filename = Path(path).name.casefold()
        normalized = re.sub(r"[^a-z0-9]+", "_", filename).strip("_")
        if normalized == "license" or normalized.startswith("license_") or normalized == "copying" or normalized.startswith("copying_"):
            kind = "license-file"
        elif normalized == "notice" or normalized.startswith("notice_") or normalized.startswith("third_party_notice"):
            kind = "notice-file"
        else:
            continue
        evidence.append(
            {
                "kind": kind,
                "name": Path(path).name,
                "path": path,
                "url": f"{repo['html_url']}/blob/{repo['default_branch']}/{path}",
                "evidence": "repository.tree",
            }
        )
    return evidence[:100]
