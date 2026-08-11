import assert from "node:assert/strict";
import test from "node:test";

import { catalogDetailSegments } from "../src/features/catalog/catalog-detail-route.mjs";

test("catalog detail paths decode route segments exactly once", () => {
  assert.deepEqual(
    catalogDetailSegments(
      "/catalog/resources/governance.boundary/ssot-item%3A9c3fc4bf9e2fc0938a65",
    ),
    [
      "catalog",
      "resources",
      "governance.boundary",
      "ssot-item:9c3fc4bf9e2fc0938a65",
    ],
  );
  assert.equal(
    catalogDetailSegments("/catalog/resources/example/literal%253Avalue").at(-1),
    "literal%3Avalue",
  );
});

test("catalog detail paths ignore query and fragment state", () => {
  assert.deepEqual(
    catalogDetailSegments("/catalog/packages/pypi/example?tab=history#releases"),
    ["catalog", "packages", "pypi", "example"],
  );
});
