from __future__ import annotations

from ...base import *  # noqa: F403


class DataBenchmarkCorpus(CatalogTable):
    __tablename__ = "resource_data_benchmark_corpus"
    ENTITY_TYPE = "data.benchmark_corpus"

    id = Column(String(360), primary_key=True)
    name = Column(String(300), nullable=False)
    description = Column(Text, nullable=True)
    source_url = Column(String(2048), nullable=True)
    observed_at = Column(DateTime, nullable=True)
    source_payload = Column(JSON, nullable=True)
