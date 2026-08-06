#!/usr/bin/env python3
"""Compatibility CLI for deterministic catalog snapshot export."""

from groupsum_catalog_pipeline.renderers.common import (
    canonical_package_name,
    daily_commit_activity,
    evidence,
    normalized_releases,
    observed_at,
    package_key,
    related_resource_url,
    release_activity,
    release_url,
    repair_text,
    slug,
    stable_hash,
)
from groupsum_catalog_pipeline.renderers.compiler import compile_catalog
from groupsum_catalog_pipeline.renderers.exporter import main

__all__ = [
    "canonical_package_name", "compile_catalog", "daily_commit_activity", "evidence",
    "normalized_releases", "observed_at", "package_key", "related_resource_url",
    "release_activity", "release_url", "repair_text", "slug", "stable_hash",
]

if __name__ == "__main__":
    raise SystemExit(main())
