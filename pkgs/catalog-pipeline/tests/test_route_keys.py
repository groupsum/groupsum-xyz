from __future__ import annotations

import sys
import unittest
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "pkgs" / "catalog-pipeline"))

from groupsum_catalog_pipeline.renderers.packages import (  # noqa: E402
    PACKAGE_ROUTE_KEY_MAX_LENGTH,
    compile_packages,
)


class PackageRouteKeyTests(unittest.TestCase):
    def test_long_package_names_have_bounded_distinct_route_keys(self):
        common_prefix = "long-package-name-" * 8
        catalog = {
            "packages": [
                {"ecosystem": "pypi", "name": f"{common_prefix}alpha"},
                {"ecosystem": "pypi", "name": f"{common_prefix}beta"},
            ]
        }

        packages, _ = compile_packages(
            catalog,
            "2026-08-11T00:00:00Z",
            {},
            {},
            defaultdict(Counter),
            defaultdict(list),
            set(),
        )
        route_keys = [record["route"].rsplit("/", 1)[-1] for record in packages]

        self.assertTrue(
            all(len(key) <= PACKAGE_ROUTE_KEY_MAX_LENGTH for key in route_keys)
        )
        self.assertEqual(len(set(route_keys)), 2)


if __name__ == "__main__":
    unittest.main()
