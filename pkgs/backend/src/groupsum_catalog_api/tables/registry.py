from .association import Association
from .catalog_entry import CatalogEntry
from .organization import Organization
from .package import Package
from .portfolio import Portfolio
from .product import Product
from .repository import Repository
from .repository_ssot_item import RepositorySsotItem
from .repository_ssot_registry import RepositorySsotRegistry
from .technology import Technology
from .typed_resource import TypedResource

ALL_TABLES = (
    Organization,
    Product,
    Portfolio,
    Repository,
    Package,
    TypedResource,
    Technology,
    CatalogEntry,
    RepositorySsotRegistry,
    RepositorySsotItem,
    Association,
)

ENTITY_TABLES = {
    "organization": Organization,
    "product": Product,
    "portfolio": Portfolio,
    "repository": Repository,
    "package": Package,
    "typed_resource": TypedResource,
    "technology": Technology,
    "ssot_registry": RepositorySsotRegistry,
    "ssot_item": RepositorySsotItem,
}

__all__ = ["ALL_TABLES", "ENTITY_TABLES"]
