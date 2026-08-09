from .service import OfferingService
from .solution import OfferingSolution

RESOURCE_TABLES = {
    "offering.service": OfferingService,
    "offering.solution": OfferingSolution,
}

__all__ = ["RESOURCE_TABLES"]
