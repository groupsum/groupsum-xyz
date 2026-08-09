from __future__ import annotations

from ...base import *  # noqa: F403


class AutomationScript(CatalogTable):
    __tablename__ = "resource_automation_script"
    ENTITY_TYPE = "automation.script"

    id = Column(String(360), primary_key=True)
    name = Column(String(300), nullable=False)
    description = Column(Text, nullable=True)
    source_url = Column(String(2048), nullable=True)
    observed_at = Column(DateTime, nullable=True)
    source_payload = Column(JSON, nullable=True)
