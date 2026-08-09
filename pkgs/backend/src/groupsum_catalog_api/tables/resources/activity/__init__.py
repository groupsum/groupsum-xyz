from .build_run import ActivityBuildRun
from .deployment_run import ActivityDeploymentRun
from .publication_run import ActivityPublicationRun
from .test_run import ActivityTestRun
from .workflow_run import ActivityWorkflowRun

RESOURCE_TABLES = {
    "activity.build_run": ActivityBuildRun,
    "activity.deployment_run": ActivityDeploymentRun,
    "activity.publication_run": ActivityPublicationRun,
    "activity.test_run": ActivityTestRun,
    "activity.workflow_run": ActivityWorkflowRun,
}

__all__ = ["RESOURCE_TABLES"]
