from groupsum_catalog_api.domain.resources.ontology import RESOURCE_TYPES
from groupsum_catalog_api.projections.resource_types import resource_type_descriptors
from groupsum_catalog_api.tables.registry import RESOURCE_TABLES


def test_resource_type_descriptors_cover_every_registered_table() -> None:
    descriptors = resource_type_descriptors({"governance.adr": 7})

    assert len(descriptors) == len(RESOURCE_TABLES) == 150
    assert {item["resource_type"] for item in descriptors} == set(RESOURCE_TABLES)
    assert set(RESOURCE_TABLES) <= set(RESOURCE_TYPES)
    assert len({item["table_name"] for item in descriptors}) == len(descriptors)
    assert len({item["family"] for item in descriptors}) == 21

    adr = next(item for item in descriptors if item["resource_type"] == "governance.adr")
    assert adr["count"] == 7
    assert adr["populated"] is True
    empty = next(item for item in descriptors if item["resource_type"] == "runtime.gateway")
    assert empty["count"] == 0
    assert empty["populated"] is False


def test_descriptor_counts_preserve_current_snapshot_total() -> None:
    counts = {"governance.adr": 3, "documentation.site": 2}
    descriptors = resource_type_descriptors(counts)

    assert sum(int(item["count"]) for item in descriptors) == sum(counts.values())
    assert sum(bool(item["populated"]) for item in descriptors) == 2
