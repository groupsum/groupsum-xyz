from __future__ import annotations

from .base import *  # noqa: F403


class CatalogSnapshotSource(CatalogTable):
    """Immutable, chunked normalized catalog used to rebuild one snapshot."""

    __tablename__ = "catalog_snapshot_sources"
    ENTITY_TYPE = "catalog.snapshot_source"

    id = Column(String(240), primary_key=True)
    snapshot_id = Column(String(160), nullable=False, index=True)
    source_digest = Column(String(64), nullable=False, index=True)
    chunk_index = Column(Integer, nullable=False)
    chunk_count = Column(Integer, nullable=False)
    byte_count = Column(Integer, nullable=False)
    content_sha256 = Column(String(64), nullable=False)
    content_base64 = Column(Text, nullable=False)
    observed_at = Column(DateTime, nullable=False)

    __table_args__ = (
        UniqueConstraint(
            "snapshot_id",
            "chunk_index",
            name="uq_catalog_snapshot_source_chunk",
        ),
    )
