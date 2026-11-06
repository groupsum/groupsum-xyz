import io
import json
import sys
import unittest
import urllib.error
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from groupsum_catalog_pipeline.collector_common import ApiClient
from groupsum_catalog_pipeline.publication_quality import publication_quality_errors


class PublicationQualityTests(unittest.TestCase):
    def test_failed_tree_and_paginated_contributors_block_publication(self):
        for path in ("repos/example/repo/git/trees/master", "repositories/42/contributors?page=2", "repos/example/repo/commits?page=5"):
            catalog = {"repositories": [{"full_name": "example/repo", "observations": [
                {"source": f"https://api.github.com/{path}", "status": "error", "detail": "HTTP 403"}
            ]}]}
            self.assertEqual(len(publication_quality_errors(catalog)), 1)

    def test_optional_environment_permissions_do_not_block_publication(self):
        catalog = {"repositories": [{"full_name": "example/repo", "observations": [
            {"source": "https://api.github.com/repos/example/repo/environments", "status": "error", "detail": "HTTP 403"}
        ]}]}
        self.assertEqual(publication_quality_errors(catalog), [])

    def test_truncated_tree_and_failed_manifest_block_publication(self):
        catalog = {"repositories": [{"full_name": "example/repo", "tree": {"truncated": True},
            "manifests": [{"path": "pkgs/example/pyproject.toml", "parsed": False}], "observations": [
                {"url": "https://raw.githubusercontent.com/example/repo/master/pkgs/example/pyproject.toml", "status": "error"}
            ]}]}
        self.assertEqual(len(publication_quality_errors(catalog)), 2)

    def test_owner_discovery_failure_blocks_publication(self):
        catalog = {"observations": [{"source": "https://api.github.com/orgs/example/repos?per_page=100", "status": "error"}]}
        self.assertEqual(len(publication_quality_errors(catalog)), 1)

    def test_error_diagnostics_include_quota_not_credentials(self):
        client = object.__new__(ApiClient)
        client.token = "private-test-token"
        client.timeout = 10
        error = urllib.error.HTTPError("https://api.github.com/test", 403, "Forbidden",
            {"X-RateLimit-Remaining": "0", "X-RateLimit-Reset": "12345"},
            io.BytesIO(json.dumps({"message": "API rate limit exceeded private-test-token"}).encode()))
        with patch("urllib.request.urlopen", side_effect=error):
            _, _, observation = client.request_json("https://api.github.com/test", github=True, retries=1, use_cache=False)
        self.assertIn("X-RateLimit-Remaining=0", observation.detail)
        self.assertIn("API rate limit exceeded", observation.detail)
        self.assertNotIn("private-test-token", observation.detail)


if __name__ == "__main__":
    unittest.main()
