import datetime as dt
import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

from catalog_collect import (
    discover_related_resources,
    filter_repositories,
    manifest_package,
    parse_next_link,
    relation_rows,
)
from catalog_render import compile_catalog, related_resource_url
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

    def test_repository_exclusions_are_applied_before_collection(self):
        repositories = [self.repo, {**self.repo, "name": ".github", "full_name": "groupsum/.github"}]
        filtered = filter_repositories(repositories, {"excluded_repository_names": [".github"]})
        self.assertEqual([item["full_name"] for item in filtered], ["groupsum/example-com"])

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
            ["examples/quickstart.py", "docs/openapi.yaml", "showcases/admin/index.tsx"],
            {"examples", "docs", "showcases"},
        )
        self.assertEqual({item["kind"] for item in resources}, {"api", "documentation", "example", "showcase", "website"})

    def test_cached_file_resource_links_are_normalized(self):
        item = {
            "path": "examples/quickstart.py",
            "url": "https://github.com/groupsum/example-com/tree/master/examples/quickstart.py",
        }
        self.assertEqual(
            related_resource_url(item),
            "https://github.com/groupsum/example-com/blob/master/examples/quickstart.py",
        )

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
                "technologies": {"languages_bytes": {"Python": 100}}, "github_releases": [], "deployments": [], "environments": [], "related_resources": [],
                "observations": [{"observed_at": now}],
            }],
            "packages": [{
                "ecosystem": "pypi", "name": "example", "repository": "groupsum/example", "manifest_path": "pyproject.toml",
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
        self.assertIn("relationship_counts", datasets["repositories"][0])
        self.assertEqual(datasets["organizations"][0]["package_releases"], 1)
        self.assertTrue(datasets["packages"][0]["route"].startswith("/catalog/packages/pypi/example-"))
        self.assertEqual(datasets["packages"][0]["releases"][0]["version"], "1.0.0")
        self.assertEqual(datasets["packages"][0]["releases"][0]["release_kind"], "pypi")
        self.assertEqual(datasets["technologies"][0]["repository_count"], 1)


if __name__ == "__main__":
    unittest.main()
