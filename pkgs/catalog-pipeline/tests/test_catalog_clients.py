import sys
import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "pkgs" / "catalog-pipeline"))

from catalog_collect import Observation
from groupsum_catalog_pipeline.api_client import CatalogApiClient, CatalogApiError
from groupsum_catalog_pipeline.collect_cli import retained_owner_repositories
from groupsum_catalog_pipeline.collector_common import ApiClient


class CatalogClientTests(unittest.TestCase):
    def test_large_single_records_are_bounded_and_never_silently_exceed_hard_limit(self):
        client = object.__new__(CatalogApiClient)
        requests = []
        client._request = lambda method, path, body: requests.append(body) or {"accepted": len(body["records"])}
        rows = [{"id": "large", "payload": "x" * 250}, {"id": "small"}]
        self.assertEqual(client.publish_records("/test", "snapshot:test", rows, max_payload_bytes=100, max_request_bytes=400)["accepted"], 2)
        self.assertTrue(all(len(json.dumps(body, separators=(",", ":")).encode()) <= 400 for body in requests))
        requests.clear()
        with self.assertRaisesRegex(CatalogApiError, "record_id=large.*exceeds"):
            client.publish_records("/test", "snapshot:test", rows, max_request_bytes=200)
        self.assertEqual(requests, [])

    def test_encoded_envelope_and_unicode_are_included_in_limit(self):
        client = object.__new__(CatalogApiClient)
        requests = []
        client._request = lambda method, path, body: requests.append(body) or {"accepted": len(body["records"])}
        client.publish_records("/test", 'snapshot:"\\♥', [{"id": str(i), "value": "♥" * 10} for i in range(6)], max_payload_bytes=200)
        self.assertTrue(all(len(json.dumps(body, separators=(",", ":")).encode()) <= 200 for body in requests))

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


if __name__ == "__main__":
    unittest.main()
