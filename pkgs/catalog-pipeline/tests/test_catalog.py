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
from groupsum_catalog_pipeline.api_client import CatalogApiClient
from groupsum_catalog_pipeline.api_records import publish_catalog
from groupsum_catalog_pipeline.collect_cli import retained_owner_repositories
from groupsum_catalog_pipeline.collector_common import ApiClient
from groupsum_catalog_pipeline.snapshots import (
    normalized_measurements,
    normalized_observations,
    snapshot_descriptor,
)


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

    def test_github_pages_stops_at_observation_limit(self):
        client = object.__new__(ApiClient)
        calls = []

        def request_json(url, **_kwargs):
            calls.append(url)
            return (
                [{"id": 1}, {"id": 2}, {"id": 3}],
                {"link": '<https://api.github.com/example?page=2>; rel="next"'},
                Observation(url, "observed", "2026-08-09T12:00:00Z"),
            )

        client.request_json = request_json
        rows, observations = client.github_pages("example?per_page=100", limit=2)
        self.assertEqual(rows, [{"id": 1}, {"id": 2}])
        self.assertEqual(len(observations), 1)
        self.assertEqual(calls, ["https://api.github.com/example?per_page=100"])

    def test_owner_listing_error_retains_unobserved_baseline_records(self):
        previous = {
            "groupsum/current": {"full_name": "groupsum/current", "owner": "groupsum"},
            "groupsum/missing": {"full_name": "groupsum/missing", "owner": "groupsum"},
            "tigrbl/example": {"full_name": "tigrbl/example", "owner": "tigrbl"},
        }
        retained = retained_owner_repositories(
            previous, "groupsum", {"groupsum/current"}, "HTTP 403"
        )
        self.assertEqual([item["full_name"] for item in retained], ["groupsum/missing"])
        self.assertEqual(retained[0]["collection_status"], "retained-after-owner-error")
        self.assertEqual(retained[0]["collection_error"], "HTTP 403")

    def test_api_publication_batches_records_by_encoded_size(self):
        client = object.__new__(CatalogApiClient)
        requests = []

        def request(method, path, body):
            requests.append((method, path, body))
            return {"accepted": len(body["records"]), "created": 0, "existing": 0}

        client._request = request
        totals = client.publish_records(
            "/internal/v1/catalog/entities/source.repository",
            "snapshot:test",
            [{"id": str(index), "payload": "x" * 100} for index in range(3)],
            max_payload_bytes=200,
        )
        self.assertEqual(totals["accepted"], 3)
        self.assertEqual([len(item[2]["records"]) for item in requests], [1, 1, 1])

    def test_snapshot_facts_use_canonical_entity_identity(self):
        catalog = {
            "schema_version": "1.0.0",
            "generated_at": "2026-08-09T12:00:00Z",
            "completeness": {},
            "repositories": [{
                "full_name": "groupsum/example",
                "url": "https://github.com/groupsum/example",
                "metrics": {"stars": 3, "size_kb": 10},
                "activity": {"commit_count": 4, "contributor_count": 2},
                "technologies": {"languages_bytes": {"JavaScript": 50, "Python": 100}},
            }],
            "packages": [{
                "ecosystem": "pypi", "name": "example",
                "repository": "groupsum/example", "manifest_path": "pyproject.toml",
                "downloads": 20, "releases": ["1.0.0"], "dependencies": [],
            }],
            "observations": [{
                "source": "github.repository:groupsum/example", "status": "observed",
                "observed_at": "2026-08-09T12:00:00Z",
                "url": "https://api.github.com/repos/groupsum/example",
            }],
        }
        measurements = normalized_measurements(catalog, "snapshot:test")
        identities = {(row["subject_type"], row["subject_id"]) for row in measurements}
        self.assertIn(("source.repository", "repository:groupsum/example"), identities)
        self.assertIn(
            (
                "distribution.package",
                "package:pypi:example:groupsum/example:pyproject.toml",
            ),
            identities,
        )
        measurement_ids = [row["measurement_id"] for row in measurements]
        self.assertEqual(len(measurement_ids), len(set(measurement_ids)))
        language_measurements = [
            row for row in measurements if row["metric_key"] == "language_bytes"
        ]
        self.assertEqual(len(language_measurements), 2)
        self.assertNotEqual(
            language_measurements[0]["measurement_id"],
            language_measurements[1]["measurement_id"],
        )
        observations = normalized_observations(catalog, "snapshot:test")
        self.assertEqual(observations[0]["snapshot_id"], "snapshot:test")
        self.assertEqual(observations[0]["subject_type"], "source.repository")
        self.assertEqual(observations[0]["subject_id"], "repository:groupsum/example")
        self.assertEqual(len(observations[0]["content_hash"]), 64)

    def test_snapshot_descriptor_is_deterministic_and_has_no_filesystem_side_effects(self):
        catalog = {
            "schema_version": "1.0.0",
            "generated_at": "2026-08-09T12:00:00Z",
            "completeness": {"repositories": "fixture"},
            "repositories": [], "packages": [], "observations": [],
        }
        first = snapshot_descriptor(catalog)
        second = snapshot_descriptor(catalog)
        self.assertEqual(first, second)
        self.assertEqual(first["observation_count"], 0)
        self.assertEqual(first["measurement_count"], 0)
        self.assertNotIn("status", first)

    def test_snapshot_finalizer_is_last_and_not_called_after_record_failure(self):
        class Client:
            def __init__(self, fail_at=None):
                self.calls = []
                self.fail_at = fail_at

            def publish_entities(self, snapshot_id, records):
                self.calls.append("entities")
                return {}

            def publish_records(self, path, snapshot_id, records):
                name = path.rsplit("/", 1)[-1]
                self.calls.append(name)
                if name == self.fail_at:
                    raise RuntimeError(name)
                return {}

            def create_snapshot(self, descriptor):
                self.calls.append("snapshot")
                return {}

        descriptor = {"snapshot_id": "snapshot:test"}
        client = Client()
        publish_catalog(client, descriptor, {}, [], [], [])
        self.assertEqual(
            client.calls, ["entities", "associations", "observations", "metrics", "snapshot"]
        )
        failing = Client("metrics")
        with self.assertRaises(RuntimeError):
            publish_catalog(failing, descriptor, {}, [], [], [])
        self.assertNotIn("snapshot", failing.calls)

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
