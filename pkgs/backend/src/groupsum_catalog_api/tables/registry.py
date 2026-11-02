from .association import Association
from .catalog_deployment_request import CatalogDeploymentRequest
from .catalog_snapshot import CatalogSnapshot
from .catalog_snapshot_source import CatalogSnapshotSource
from .metric_observation import MetricObservation
from .observation import CatalogObservation
from .organization import Organization
from .package import Package
from .portfolio import Portfolio
from .product import Product
from .repository import Repository
from .repository_ssot_registry import RepositorySsotRegistry
from .resources import RESOURCE_ENTITY_TABLES, RESOURCE_TABLES
from .technology import Technology

CORE_ENTITY_TABLES = (
    Organization,
    Product,
    Portfolio,
    Repository,
    Package,
    Technology,
    RepositorySsotRegistry,
)

ALL_TABLES = (
    *CORE_ENTITY_TABLES,
    *RESOURCE_ENTITY_TABLES,
    Association,
    CatalogSnapshot,
    CatalogObservation,
    MetricObservation,
    CatalogSnapshotSource,
    CatalogDeploymentRequest,
)

COLLECTIBLE_ENTITY_TABLES = (
    *CORE_ENTITY_TABLES,
    *RESOURCE_ENTITY_TABLES,
)

COLLECTION_FACT_TABLES = (Association, CatalogObservation, MetricObservation)
SNAPSHOT_TABLES = (CatalogSnapshot, CatalogSnapshotSource, CatalogDeploymentRequest)

ENTITY_TABLES = {
    Organization.ENTITY_TYPE: Organization,
    Product.ENTITY_TYPE: Product,
    Portfolio.ENTITY_TYPE: Portfolio,
    Repository.ENTITY_TYPE: Repository,
    Package.ENTITY_TYPE: Package,
    Technology.ENTITY_TYPE: Technology,
    RepositorySsotRegistry.ENTITY_TYPE: RepositorySsotRegistry,
    **RESOURCE_TABLES,
}

PUBLISH_ENTITY_TABLES = {
    **ENTITY_TABLES,
    CatalogSnapshotSource.ENTITY_TYPE: CatalogSnapshotSource,
}

__all__ = [
    "ALL_TABLES",
    "COLLECTIBLE_ENTITY_TABLES",
    "COLLECTION_FACT_TABLES",
    "CORE_ENTITY_TABLES",
    "ENTITY_TABLES",
    "RESOURCE_TABLES",
    "PUBLISH_ENTITY_TABLES",
    "SNAPSHOT_TABLES",
]
