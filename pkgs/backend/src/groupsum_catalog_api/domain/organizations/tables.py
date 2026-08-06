from __future__ import annotations

from ..table_base import *  # noqa: F403


class Organization(RestTable):
    __tablename__ = "organizations"
    __allow_unmapped__ = True
    id = Column(String(160), primary_key=True)
    slug = Column(String(160), nullable=False, unique=True, index=True)
    name = Column(String(240), nullable=False)
    summary = Column(Text, nullable=True)
    website_url = Column(String(2048), nullable=True)
    source_url = Column(String(2048), nullable=True)
    observed_at = Column(DateTime, nullable=True)


class Person(RestTable):
    __tablename__ = "people"
    __allow_unmapped__ = True
    id = Column(String(160), primary_key=True)
    name = Column(String(240), nullable=False)
    handle = Column(String(240), nullable=True)
    profile_url = Column(String(2048), nullable=True)
