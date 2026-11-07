"""Shared public read models for Tigrbl operations, frozen exports and static HTML."""

from typing import Any

from ..tables.view_common import package_resource, repository_resource


def repository_model(value: dict[str, Any]) -> dict[str, Any]:
    item = repository_resource(value)
    governance = item.pop("ssot_governance", None) or item.get("governance") or {}
    item.pop("governance", None)
    implementation = {
        "packages": item.pop("packages", []),
        "resources": item.pop("related_resources", []),
        "releases": item.pop("github_releases", item.pop("releases", [])),
        "languages": [
            {"name": key, "bytes": size} for key, size in (item.get("language_bytes") or {}).items()
        ],
        "technologies": item.get("technologies", []),
    }
    item.pop("releases", None)
    return {
        "kind": "catalog_repository_record",
        "item": item,
        "graph": None,
        "linked_sections": [],
        "implementation": implementation,
        "governance": governance,
        "legal": {
            "license_expression": item.get("license_expression") or item.get("license"),
            "status": item.get("license_status") or "not-observed",
            "observations": item.get("legal_evidence", []),
        },
    }


def package_model(value: dict[str, Any]) -> dict[str, Any]:
    item = package_resource(value)
    implementation = {
        key: item.pop(key, []) for key in ("repositories", "releases", "dependencies", "dependents")
    }
    implementation["downloads"] = {"value": item.get("downloads")}
    return {
        "kind": "catalog_package_record",
        "item": item,
        "resource_type": "distribution.package",
        "graph": None,
        "linked_sections": [],
        "parent": {"repository": item.get("repository")},
        "implementation": implementation,
        "legal": {
            "license_expression": item.get("license_expression"),
            "status": item.get("license_status"),
            "observations": item.get("legal_evidence", []),
        },
    }
