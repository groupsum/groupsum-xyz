from .api import RuntimeApi
from .deployment import RuntimeDeployment
from .deployment_target import RuntimeDeploymentTarget
from .endpoint import RuntimeEndpoint
from .environment import RuntimeEnvironment
from .gateway import RuntimeGateway
from .scheduled_job import RuntimeScheduledJob
from .service import RuntimeService
from .webhook import RuntimeWebhook
from .worker import RuntimeWorker

RESOURCE_TABLES = {
    "runtime.api": RuntimeApi,
    "runtime.deployment": RuntimeDeployment,
    "runtime.deployment_target": RuntimeDeploymentTarget,
    "runtime.endpoint": RuntimeEndpoint,
    "runtime.environment": RuntimeEnvironment,
    "runtime.gateway": RuntimeGateway,
    "runtime.scheduled_job": RuntimeScheduledJob,
    "runtime.service": RuntimeService,
    "runtime.webhook": RuntimeWebhook,
    "runtime.worker": RuntimeWorker,
}

__all__ = ["RESOURCE_TABLES"]
