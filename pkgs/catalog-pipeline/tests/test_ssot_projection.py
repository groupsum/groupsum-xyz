import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "pkgs" / "catalog-pipeline"))

from catalog_collect import Observation, summarize_ssot_registry


class SsotProjectionTests(unittest.TestCase):
    def test_inventory_is_complete_safe_and_relationship_closed(self):
        repository = {
            "name": "example-com",
            "full_name": "groupsum/example-com",
            "html_url": "https://github.com/groupsum/example-com",
            "default_branch": "master",
        }
        observation = Observation(
            source="ssot.registry",
            url="https://raw.githubusercontent.com/groupsum/example-com/master/.ssot/registry.json",
            observed_at="2026-08-03T00:00:00Z",
            status="observed",
        )
        registry = {
            "schema_version": "0.8.0",
            "features": [
                {"id": f"feat:{index:02d}", "title": f"Feature {index}"}
                for index in range(25)
            ],
            "boundaries": [
                {
                    "id": "bnd:complete",
                    "title": "Complete boundary",
                    "feature_ids": ["feat:24"],
                    "path": ".ssot/private-boundary.json",
                    "execution": {"env": {"TOKEN": "must-not-publish"}},
                },
                {"id": "bnd:unresolved", "feature_ids": ["feat:missing"]},
            ],
            "risks": [
                {"id": "risk:public", "severity": "high", "feature_ids": ["feat:24"]}
            ],
            **{
                key: []
                for key in (
                    "adrs",
                    "specs",
                    "tests",
                    "claims",
                    "evidence",
                    "issues",
                    "profiles",
                    "releases",
                    "scopes",
                )
            },
        }

        summary = summarize_ssot_registry(
            repository, registry, observation, json.dumps(registry)
        )

        self.assertEqual(len(summary["inventory"]["features"]), 25)
        self.assertEqual(summary["inventory_truncated"]["features"], 0)
        boundary = summary["inventory"]["boundaries"][0]
        self.assertEqual(boundary["feature_ids"], ["feat:24"])
        self.assertNotIn("path", boundary)
        self.assertNotIn("execution", boundary)
        self.assertEqual(boundary["relationship_integrity"]["unresolved_reference_count"], 0)
        unresolved = summary["inventory"]["boundaries"][1]["relationship_integrity"]
        self.assertEqual(unresolved["unresolved_reference_count"], 1)
        self.assertEqual(unresolved["unresolved_references"][0]["target_id"], "feat:missing")
        self.assertEqual(summary["relationship_integrity"]["reference_count"], 3)
        self.assertEqual(summary["relationship_integrity"]["resolved_reference_count"], 2)
        self.assertFalse(summary["relationship_integrity"]["relationship_closed"])
        self.assertEqual(summary["counts"]["risks"], 1)
        self.assertEqual(summary["inventory"]["risks"][0]["severity"], "high")


if __name__ == "__main__":
    unittest.main()
