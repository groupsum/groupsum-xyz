import datetime as dt
import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

from catalog_collect import classify_surfaces, manifest_package, parse_next_link  # noqa: E402
from catalog_validate import validate  # noqa: E402


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

    def test_surface_classification(self):
        surfaces = classify_surfaces(self.repo, ["apps/admin-ui/src/main.tsx", "examples/quickstart.py"], {"apps", "examples", "ui"})
        self.assertIn("website", {surface["kind"] for surface in surfaces})
        self.assertIn("app", {surface["kind"] for surface in surfaces})
        self.assertIn("example", {surface["kind"] for surface in surfaces})

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


if __name__ == "__main__":
    unittest.main()
