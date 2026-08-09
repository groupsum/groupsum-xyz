from .benchmark_corpus import DataBenchmarkCorpus
from .dataset import DataDataset
from .fixture import DataFixture
from .mapping import DataMapping
from .model import DataModel
from .vocabulary import DataVocabulary

RESOURCE_TABLES = {
    "data.benchmark_corpus": DataBenchmarkCorpus,
    "data.dataset": DataDataset,
    "data.fixture": DataFixture,
    "data.mapping": DataMapping,
    "data.model": DataModel,
    "data.vocabulary": DataVocabulary,
}

__all__ = ["RESOURCE_TABLES"]
