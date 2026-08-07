from .catalog_entry import CatalogEntry
from .organization import Organization
from .package import Package
from .package_technology import PackageTechnology
from .portfolio import Portfolio
from .portfolio_product import PortfolioProduct
from .portfolio_repository import PortfolioRepository
from .product import Product
from .product_package import ProductPackage
from .product_repository import ProductRepository
from .product_resource import ProductResource
from .repository import Repository
from .repository_package import RepositoryPackage
from .repository_resource import RepositoryResource
from .repository_ssot_item import RepositorySsotItem
from .repository_ssot_registry import RepositorySsotRegistry
from .repository_technology import RepositoryTechnology
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
    PortfolioProduct,
    PortfolioRepository,
    ProductRepository,
    ProductPackage,
    ProductResource,
    RepositoryPackage,
    RepositoryResource,
    RepositoryTechnology,
    PackageTechnology,
    RepositorySsotRegistry,
    RepositorySsotItem,
)

__all__ = ["ALL_TABLES"]
