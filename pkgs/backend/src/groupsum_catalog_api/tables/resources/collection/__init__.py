from .catalog import CollectionCatalog
from .ecosystem import CollectionEcosystem
from .suite import CollectionSuite

RESOURCE_TABLES = {
    "collection.catalog": CollectionCatalog,
    "collection.ecosystem": CollectionEcosystem,
    "collection.suite": CollectionSuite,
}

__all__ = ["RESOURCE_TABLES"]
