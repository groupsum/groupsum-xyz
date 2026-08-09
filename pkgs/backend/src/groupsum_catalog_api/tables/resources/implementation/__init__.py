from .adapter import ImplementationAdapter
from .demo import ImplementationDemo
from .example import ImplementationExample
from .notebook import ImplementationNotebook
from .plugin import ImplementationPlugin
from .recipe import ImplementationRecipe
from .reference import ImplementationReference
from .sample_application import ImplementationSampleApplication
from .showcase import ImplementationShowcase
from .template import ImplementationTemplate

RESOURCE_TABLES = {
    "implementation.adapter": ImplementationAdapter,
    "implementation.demo": ImplementationDemo,
    "implementation.example": ImplementationExample,
    "implementation.notebook": ImplementationNotebook,
    "implementation.plugin": ImplementationPlugin,
    "implementation.recipe": ImplementationRecipe,
    "implementation.reference": ImplementationReference,
    "implementation.sample_application": ImplementationSampleApplication,
    "implementation.showcase": ImplementationShowcase,
    "implementation.template": ImplementationTemplate,
}

__all__ = ["RESOURCE_TABLES"]
