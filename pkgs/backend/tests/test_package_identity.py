import pytest

from groupsum_catalog_api.record_compiler import _serialized
from groupsum_catalog_api.tables.package import Package


def test_package_identity_is_the_catalog_source_id() -> None:
    package = Package(
        id="package:npm:@mdwrk/example-editor-basic:groupsum/mdwrk",
        ecosystem="npm",
        name="@mdwrk/example-editor-basic",
        registry_url="https://www.npmjs.com/package/@mdwrk/example-editor-basic",
        package_kind="published-package",
        private=False,
    )

    assert package.id.startswith("package:npm:")
    assert package.ecosystem == "npm"
    assert package.name == "@mdwrk/example-editor-basic"


def test_compiler_reports_string_fields_that_exceed_the_tigrbl_schema() -> None:
    package = Package(
        id="package:pypi:oversized",
        ecosystem="pypi",
        name="oversized",
        package_kind="package-candidate",
        private=False,
        route_key="x" * 81,
    )

    with pytest.raises(
        ValueError,
        match=r"distribution\.package package:pypi:oversized column route_key "
        r"has 81 characters; maximum is 80",
    ):
        _serialized(package)
