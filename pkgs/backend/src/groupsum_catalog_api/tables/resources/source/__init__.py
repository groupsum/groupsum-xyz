from .branch import SourceBranch
from .commit import SourceCommit
from .tag import SourceTag
from .workspace import SourceWorkspace

RESOURCE_TABLES = {
    "source.branch": SourceBranch,
    "source.commit": SourceCommit,
    "source.tag": SourceTag,
    "source.workspace": SourceWorkspace,
}

__all__ = ["RESOURCE_TABLES"]
