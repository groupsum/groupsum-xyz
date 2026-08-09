from .audience import TaxonomyAudience
from .capability import TaxonomyCapability
from .category import TaxonomyCategory
from .domain import TaxonomyDomain
from .ecosystem import TaxonomyEcosystem
from .language import TaxonomyLanguage
from .topic import TaxonomyTopic

RESOURCE_TABLES = {
    "taxonomy.audience": TaxonomyAudience,
    "taxonomy.capability": TaxonomyCapability,
    "taxonomy.category": TaxonomyCategory,
    "taxonomy.domain": TaxonomyDomain,
    "taxonomy.ecosystem": TaxonomyEcosystem,
    "taxonomy.language": TaxonomyLanguage,
    "taxonomy.topic": TaxonomyTopic,
}

__all__ = ["RESOURCE_TABLES"]
