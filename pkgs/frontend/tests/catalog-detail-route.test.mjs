import assert from "node:assert/strict";
import test from "node:test";

import { catalogDetailSegments } from "../src/features/catalog/catalog-detail-route.mjs";
import { staticMemberHref } from "../src/features/catalog/static-member-href.mjs";

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

test("static member links use the document URL without changing encoded keys or suffixes", () => {
  assert.equal(staticMemberHref("/catalog/repositories/groupsum/groupsum-xyz"), "/catalog/repositories/groupsum/groupsum-xyz/");
  assert.equal(staticMemberHref("/catalog/packages/npm/%40org%2Fpkg/?q=x#dependencies"), "/catalog/packages/npm/%40org%2Fpkg/?q=x#dependencies");
  assert.equal(staticMemberHref("/catalog/packages/pypi/6w-a78d1072#release-history"), "/catalog/packages/pypi/6w-a78d1072/#release-history");
  for (const href of ["/catalog/repositories", "/contributors/github/cobycloud", "https://groupsum.xyz/catalog/packages/pypi/6w", "//example.com/catalog/packages/pypi/6w"]) {
    assert.equal(staticMemberHref(href), href);
  }
});
