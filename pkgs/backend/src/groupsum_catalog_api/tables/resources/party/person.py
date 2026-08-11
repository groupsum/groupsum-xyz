from __future__ import annotations

from ...base import *  # noqa: F403


class PartyPerson(CatalogTable):
    __tablename__ = "resource_party_person"
    ENTITY_TYPE = "party.person"

    id = Column(String(360), primary_key=True)
    name = Column(String(300), nullable=False)
    description = Column(Text, nullable=True)
    provider = Column(String(60), nullable=True, index=True)
    provider_id = Column(String(200), nullable=True, index=True)
    login = Column(String(240), nullable=True, index=True)
    profile_url = Column(String(2048), nullable=True)
    avatar_url = Column(String(2048), nullable=True)
    account_type = Column(String(80), nullable=True, index=True)
    anonymous = Column(Boolean, nullable=False, default=False, index=True)
    source_url = Column(String(2048), nullable=True)
    observed_at = Column(DateTime, nullable=True)
    source_payload = Column(JSON, nullable=True)
