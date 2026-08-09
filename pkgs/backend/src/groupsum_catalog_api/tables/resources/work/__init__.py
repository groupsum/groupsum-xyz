from .discussion import WorkDiscussion
from .issue import WorkIssue
from .milestone import WorkMilestone
from .project import WorkProject
from .pull_request import WorkPullRequest

RESOURCE_TABLES = {
    "work.discussion": WorkDiscussion,
    "work.issue": WorkIssue,
    "work.milestone": WorkMilestone,
    "work.project": WorkProject,
    "work.pull_request": WorkPullRequest,
}

__all__ = ["RESOURCE_TABLES"]
