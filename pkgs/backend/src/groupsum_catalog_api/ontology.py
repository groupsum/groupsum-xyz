"""Compatibility exports for the catalog resource ontology."""

from .domain.resources.ontology import (
    LEGACY_RESOURCE_TYPES,
    RECORD_RESOURCE_TYPES,
    RESOURCE_TYPES,
    SSOT_RESOURCE_TYPES,
    ResourceTypeDefinition,
    api_contract_type,
    normalize_legacy_resource_type,
)
from .domain.resources.relationship_types import RELATIONSHIP_TYPES

__all__ = [
    "LEGACY_RESOURCE_TYPES",
    "RECORD_RESOURCE_TYPES",
    "RELATIONSHIP_TYPES",
    "RESOURCE_TYPES",
    "SSOT_RESOURCE_TYPES",
    "ResourceTypeDefinition",
    "api_contract_type",
    "normalize_legacy_resource_type",
]
