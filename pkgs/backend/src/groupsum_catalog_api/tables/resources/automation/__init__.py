from .collector import AutomationCollector
from .generator import AutomationGenerator
from .github_action import AutomationGithubAction
from .pipeline import AutomationPipeline
from .script import AutomationScript
from .workflow import AutomationWorkflow

RESOURCE_TABLES = {
    "automation.collector": AutomationCollector,
    "automation.generator": AutomationGenerator,
    "automation.github_action": AutomationGithubAction,
    "automation.pipeline": AutomationPipeline,
    "automation.script": AutomationScript,
    "automation.workflow": AutomationWorkflow,
}

__all__ = ["RESOURCE_TABLES"]
