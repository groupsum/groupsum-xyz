from __future__ import annotations

from .base import *  # noqa: F403


class Association(CatalogTable):
    """A directed, typed edge between two catalog entities.

    Entity references are intentionally polymorphic and therefore are not SQL
    foreign-key constraints. Import-time validation guarantees that each
    ``(entity_type, entity_id)`` endpoint exists.
    """

    __tablename__ = "associations"

    id = Column(String(360), primary_key=True)
    source_type = Column(String(60), nullable=False, index=True)
    source_id = Column(String(360), nullable=False, index=True)
    relationship_type = Column(String(80), nullable=False, index=True)
    target_type = Column(String(60), nullable=False, index=True)
    target_id = Column(String(360), nullable=False, index=True)
    role = Column(String(60), nullable=False, default="", index=True)
    sort_order = Column(Integer, nullable=False, default=0)
    attributes = Column(JSON, nullable=True)
    observed_at = Column(DateTime, nullable=True)

    __table_args__ = (
        UniqueConstraint(
            "source_type",
            "source_id",
            "relationship_type",
            "target_type",
            "target_id",
            "role",
            name="uq_association_edge",
        ),
    )
