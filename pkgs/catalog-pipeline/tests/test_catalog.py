import datetime as dt
import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "pkgs" / "catalog-pipeline"))

from catalog_collect import (
    Observation,
    discover_related_resources,
    filter_repositories,
    manifest_package,
    parse_next_link,
    relation_rows,
    summarize_ssot_registry,
)
from catalog_render import compile_catalog, related_resource_url, repair_text
from catalog_validate import validate


class CatalogCollectorTests(unittest.TestCase):
    def setUp(self):
        self.repo = {
            "name": "example-com",
            "full_name": "groupsum/example-com",
            "html_url": "https://github.com/groupsum/example-com",
            "homepage": "https://example.com",
            "default_branch": "master",
        }

    def test_next_link(self):
        link = '<https://api.github.com/example?page=2>; rel="next", <https://api.github.com/example?page=9>; rel="last"'
        self.assertEqual(parse_next_link(link), "https://api.github.com/example?page=2")

    def test_npm_manifest(self):
        package, dependencies = manifest_package(
            "package.json",
            json.dumps({"name": "@groupsum/example", "version": "1.2.3", "dependencies": {"react": "^19"}}),
            self.repo,
        )
        self.assertEqual(package["ecosystem"], "npm")
        self.assertEqual(dependencies, [{"name": "react", "requirement": "^19", "scope": "dependencies"}])

    def test_python_manifest(self):
        package, dependencies = manifest_package(
            "pyproject.toml",
            '[project]\nname = "example"\nversion = "0.1.0"\ndependencies = ["httpx>=0.27"]\n',
            self.repo,
        )
        self.assertEqual(package["name"], "example")
        self.assertEqual(dependencies[0]["name"], "httpx")

    def test_cargo_structured_dependency_is_encoded_as_json(self):
        package, dependencies = manifest_package(
            "Cargo.toml",
            '[package]\nname = "fasttokenizer"\nversion = "0.1.0"\n'
            '[dependencies]\npyo3 = { version = "0.29.0", features = ["extension-module"] }\n',
            self.repo,
        )
        self.assertEqual(package["ecosystem"], "crates")
        self.assertEqual(
            dependencies,
            [
                {
                    "name": "pyo3",
                    "requirement": '{"features":["extension-module"],"version":"0.29.0"}',
                    "scope": "dependencies",
                }
            ],
        )

    def test_repository_exclusions_are_applied_before_collection(self):
        repositories = [self.repo, {**self.repo, "name": ".github", "full_name": "groupsum/.github"}]
        filtered = filter_repositories(repositories, {"excluded_repository_names": [".github"]})
        self.assertEqual([item["full_name"] for item in filtered], ["groupsum/example-com"])

    def test_ssot_registry_summary_is_source_rooted(self):
        from catalog_collect import Observation

        registry = {
            "schema_version": "0.8.0",
            "adrs": [{"id": "adr:1", "status": "accepted"}],
            "specs": [],
            "features": [{"id": "feature:1", "implementation_status": "implemented"}],
            "tests": [{"id": "test:1", "status": "active"}],
            "claims": [
                {"id": "claim:1", "status": "supported", "evidence_ids": ["evidence:1"], "test_ids": ["test:1"]},
                {"id": "claim:2", "status": "planned", "evidence_ids": [], "test_ids": []},
            ],
            "evidence": [{"id": "evidence:1", "status": "current", "claim_ids": ["claim:1"]}],
            "issues": [], "boundaries": [], "profiles": [], "releases": [],
        }
        observation = Observation(
            "https://raw.githubusercontent.com/groupsum/example-com/master/.ssot/registry.json",
            "observed",
            "2026-08-03T00:00:00Z",
            url="https://raw.githubusercontent.com/groupsum/example-com/master/.ssot/registry.json",
        )
        summary = summarize_ssot_registry(self.repo, registry, observation, json.dumps(registry))
        self.assertTrue(summary["governed"])
        self.assertEqual(summary["counts"]["claims"], 2)
        self.assertEqual(summary["coverage"]["claims_without_evidence"], 1)
        self.assertEqual(summary["status_counts"]["features"], {"implemented": 1})
        self.assertEqual(summary["inventory"]["claims"][0]["id"], "claim:1")
        self.assertEqual(
            summary["inventory"]["claims"][0]["evidence_ids"], ["evidence:1"]
        )
        self.assertEqual(summary["inventory_truncated"]["claims"], 0)
        self.assertEqual(
            summary["registry_url"],
            "https://github.com/groupsum/example-com/blob/master/.ssot/registry.json",
        )

    def test_numeric_ssot_schema_version_is_valid(self):
        observation = Observation(
            source="ssot.registry",
            url="https://raw.githubusercontent.com/groupsum/example-com/master/.ssot/registry.json",
            observed_at="2026-08-03T00:00:00Z",
            status="observed",
        )
        summary = summarize_ssot_registry(
            self.repo,
            {"schema_version": 9, "claims": []},
            observation,
            '{"schema_version":9,"claims":[]}',
        )
        self.assertTrue(summary["governed"])
        self.assertEqual(summary["schema_version"], "9")

    def test_dependency_scope_and_registry_dependents_are_preserved(self):
        relations = relation_rows([], [{
            "ecosystem": "crates",
            "name": "example",
            "repository": "groupsum/example",
            "dependencies": [{"name": "serde", "requirement": "1", "scope": "dependencies"}],
            "downstream": ["example-user"],
            "downstream_completeness": "first_100_registry_reverse_dependencies",
        }])
        dependency = next(item for item in relations if item["kind"] == "package_depends_on_external")
        dependent = next(item for item in relations if item["kind"] == "package_has_registry_dependent")
        self.assertEqual(dependency["scope"], "dependencies")
        self.assertEqual(dependent["target"], "crates:example-user")

    def test_related_resources_are_attached_to_the_repository(self):
        resources = discover_related_resources(
            self.repo,
            [
                "examples/quickstart.py",
                "docs/openapi.yaml",
                "showcases/admin/index.tsx",
                ".ssot/evidence/openapi-selection-tests.json",
            ],
            {"examples", "docs", "showcases"},
        )
        self.assertEqual(
            {item["resource_type"] for item in resources},
            {
                "contract.openapi",
                "documentation.collection",
                "implementation.example",
                "implementation.showcase",
                "interface.website",
            },
        )
        self.assertFalse(any(str(item.get("path", "")).startswith(".ssot/") for item in resources))

    def test_cached_file_resource_links_are_normalized(self):
        item = {
            "path": "examples/quickstart.py",
            "url": "https://github.com/groupsum/example-com/tree/master/examples/quickstart.py",
        }
        self.assertEqual(
            related_resource_url(item),
            "https://github.com/groupsum/example-com/blob/master/examples/quickstart.py",
        )

    def test_repeated_utf8_mojibake_is_repaired(self):
        self.assertEqual(repair_text("RFC 9110 Ãƒâ€šÃ‚Â§8"), "RFC 9110 §8")
        self.assertEqual(repair_text({"label": "Packages Â· releases"}), {"label": "Packages · releases"})

    def test_minimal_catalog_validation(self):
        now = dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
        catalog = {
            "schema_version": "1.0.0", "generated_at": now,
            "scope": {"owners": ["groupsum"], "owner_definitions": [{"login": "groupsum", "expect_public_repositories": True}]}, "completeness": {},
            "repositories": [{
                "full_name": "groupsum/example", "owner": "groupsum", "visibility": "public",
                "metrics": {"stars": 0, "watchers": 0, "forks": 0, "open_issues": 0, "size_kb": 1},
                "activity": {"commit_count": 1, "commit_history": [{"sha": "a"}], "contributor_count": 1, "contributors": [{"login": "x"}]},
                "observations": [{"source": "github", "status": "observed", "observed_at": now}],
            }],
            "packages": [], "relationships": [], "observations": [],
        }
        self.assertEqual(validate(catalog), [])

    def test_relationship_validation_distinguishes_dependency_scopes(self):
        now = dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
        catalog = {
            "schema_version": "1.0.0", "generated_at": now,
            "scope": {"owners": [], "owner_definitions": []}, "completeness": {},
            "repositories": [], "packages": [], "observations": [],
            "relationships": [
                {"kind": "package_depends_on_external", "source": "npm:example", "target": "react", "scope": "dependencies", "evidence": [{"source_url": "https://example.test/package.json"}]},
                {"kind": "package_depends_on_external", "source": "npm:example", "target": "react", "scope": "devDependencies", "evidence": [{"source_url": "https://example.test/package.json"}]},
            ],
        }
        self.assertEqual(validate(catalog), [])

    def test_display_catalog_compilation(self):
        now = "2026-08-03T00:00:00Z"
        catalog = {
            "generated_at": now,
            "scope": {"owners": ["groupsum"], "owner_definitions": [{"login": "groupsum", "role": "primary"}]},
            "repositories": [{
                "full_name": "groupsum/example", "name": "example", "owner": "groupsum", "url": "https://github.com/groupsum/example",
                "description": "Example repository", "visibility": "public", "metrics": {"stars": 2},
                "activity": {"commit_count": 3, "commit_history": [{"committed_at": now}], "contributor_count": 1, "contributors": [{"login": "dev", "contributions": 3, "url": "https://github.com/dev"}]},
                "technologies": {"languages_bytes": {"Python": 100}}, "github_releases": [], "deployments": [], "environments": [],
                "related_resources": [
                    {"kind": "documentation", "name": "docs", "path": "docs", "url": "https://github.com/groupsum/example/tree/master/docs", "evidence": "repository.tree"},
                    {"kind": "api_definition", "name": "openapi.json", "path": "openapi.json", "url": "https://github.com/groupsum/example/blob/master/openapi.json", "evidence": "repository.api_definition"},
                    {"kind": "api_source", "name": "api", "path": "src/api", "url": "https://github.com/groupsum/example/tree/master/src/api", "evidence": "repository.tree"},
                ],
                "observations": [{"observed_at": now}],
            }],
            "packages": [{
                "ecosystem": "pypi", "name": "example", "owner": "groupsum", "manifest_path": "pyproject.toml",
                "published": True, "registry_url": "https://pypi.org/project/example/", "releases": ["1.0.0"], "dependencies": [],
            }],
            "relationships": [],
        }
        datasets = compile_catalog(catalog, {"entities": {}, "organizations": {}})
        self.assertEqual(datasets["repositories"][0]["metrics"]["packages"], 1)
        self.assertEqual(datasets["repositories"][0]["contributors"][0]["login"], "dev")
        self.assertEqual(len(datasets["repositories"][0]["commit_activity"]), 30)
        self.assertEqual(datasets["repositories"][0]["commit_activity"][-1]["count"], 1)
        self.assertEqual(
            set(datasets),
            {"organizations", "repositories", "packages", "resources", "technologies"},
        )
        self.assertEqual(
            {item["resource_type"] for item in datasets["resources"]},
            {"contract.openapi", "documentation.collection"},
        )
        self.assertIn("relationship_counts", datasets["repositories"][0])
        self.assertEqual(datasets["repositories"][0]["language_bytes"], {"Python": 100})
        self.assertEqual(datasets["organizations"][0]["package_releases"], 1)
        self.assertTrue(datasets["packages"][0]["route"].startswith("/catalog/packages/pypi/example-"))
        self.assertEqual(datasets["packages"][0]["releases"][0]["version"], "1.0.0")
        self.assertEqual(datasets["packages"][0]["releases"][0]["release_kind"], "pypi")
        self.assertEqual(datasets["packages"][0]["package_kind"], "published-package")
        self.assertEqual(datasets["packages"][0]["repository"], "groupsum/example")
        self.assertEqual(datasets["repositories"][0]["packages"][0]["route"], datasets["packages"][0]["route"])
        self.assertEqual(datasets["repositories"][0]["packages"][0]["release_count"], 1)
        self.assertEqual(datasets["repositories"][0]["packages"][0]["latest_version"], None)
        self.assertIn("license_expression", datasets["repositories"][0]["packages"][0])
        self.assertIn("notice_count", datasets["repositories"][0]["packages"][0])
        self.assertEqual(datasets["technologies"][0]["repository_count"], 1)


if __name__ == "__main__":
    unittest.main()
