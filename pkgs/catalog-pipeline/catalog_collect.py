#!/usr/bin/env python3
"""Compatibility CLI for the modular catalog collection package."""

from groupsum_catalog_pipeline.collect_cli import main
from groupsum_catalog_pipeline.collector_common import (
    ApiClient,
    Observation,
    last_page_count,
    parse_next_link,
)
from groupsum_catalog_pipeline.github_collection import (
    collect_owner_packages,
    collect_repository,
    discover_github_downstream,
)
from groupsum_catalog_pipeline.normalization import relation_rows, summarize
from groupsum_catalog_pipeline.package_collection import manifest_package, registry_record
from groupsum_catalog_pipeline.resource_discovery import (
    collect_ssot_governance,
    discover_related_resources,
    filter_repositories,
    normalize_license_expression,
    repository_legal_evidence,
    summarize_ssot_registry,
)

__all__ = [
    "ApiClient", "Observation", "collect_owner_packages", "collect_repository",
    "collect_ssot_governance", "discover_github_downstream", "discover_related_resources",
    "filter_repositories", "last_page_count", "manifest_package",
    "normalize_license_expression", "parse_next_link", "registry_record",
    "relation_rows", "repository_legal_evidence", "summarize", "summarize_ssot_registry",
]

if __name__ == "__main__":
    raise SystemExit(main())
