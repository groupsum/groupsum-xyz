from .archive import DistributionArchive
from .binary import DistributionBinary
from .bundle import DistributionBundle
from .container_image import DistributionContainerImage

RESOURCE_TABLES = {
    "distribution.archive": DistributionArchive,
    "distribution.binary": DistributionBinary,
    "distribution.bundle": DistributionBundle,
    "distribution.container_image": DistributionContainerImage,
}

__all__ = ["RESOURCE_TABLES"]
