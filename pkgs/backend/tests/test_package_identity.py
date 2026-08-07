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
