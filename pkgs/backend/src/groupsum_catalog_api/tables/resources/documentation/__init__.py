from .changelog import DocumentationChangelog
from .collection import DocumentationCollection
from .concept import DocumentationConcept
from .cookbook import DocumentationCookbook
from .faq import DocumentationFaq
from .guide import DocumentationGuide
from .how_to import DocumentationHowTo
from .quickstart import DocumentationQuickstart
from .reference import DocumentationReference
from .runbook import DocumentationRunbook
from .site import DocumentationSite
from .tutorial import DocumentationTutorial

RESOURCE_TABLES = {
    "documentation.changelog": DocumentationChangelog,
    "documentation.collection": DocumentationCollection,
    "documentation.concept": DocumentationConcept,
    "documentation.cookbook": DocumentationCookbook,
    "documentation.faq": DocumentationFaq,
    "documentation.guide": DocumentationGuide,
    "documentation.how_to": DocumentationHowTo,
    "documentation.quickstart": DocumentationQuickstart,
    "documentation.reference": DocumentationReference,
    "documentation.runbook": DocumentationRunbook,
    "documentation.site": DocumentationSite,
    "documentation.tutorial": DocumentationTutorial,
}

__all__ = ["RESOURCE_TABLES"]
