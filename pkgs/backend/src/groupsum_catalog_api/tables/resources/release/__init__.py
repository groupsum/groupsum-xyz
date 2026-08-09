from .binary import ReleaseBinary
from .bundle import ReleaseBundle
from .container import ReleaseContainer
from .package import ReleasePackage
from .repository import ReleaseRepository

RESOURCE_TABLES = {
    "release.binary": ReleaseBinary,
    "release.bundle": ReleaseBundle,
    "release.container": ReleaseContainer,
    "release.package": ReleasePackage,
    "release.repository": ReleaseRepository,
}

__all__ = ["RESOURCE_TABLES"]
