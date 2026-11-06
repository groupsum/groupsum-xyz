import assert from "node:assert/strict";
import test from "node:test";
import { hasPageAssetMarker } from "./page-assets.mjs";

test("finds markers in lazy chunks, handles Vite preload paths and cycles", async () => {
  const assets = {
    "/assets/main.js": 'const deps=["assets/catalog.js"];import("./catalog.js")',
    "/assets/catalog.js": 'import "./main.js"; import("./tables.js")',
    "/assets/tables.js": '"Repository catalog records"',
  };
  const fetched = [];
  const fetchAsset = async (path) => { fetched.push(path); assert.ok(path in assets); return assets[path]; };
  assert.equal(await hasPageAssetMarker('<script src="/assets/main.js"></script>', "Repository catalog records", "https://example.com", fetchAsset), true);
  assert.deepEqual(fetched, Object.keys(assets));
  assert.equal(await hasPageAssetMarker('<script src="/assets/main.js"></script>', "missing", "https://example.com", fetchAsset), false);
});

test("never fetches cross-origin dependencies", async () => {
  assert.equal(await hasPageAssetMarker('<script src="https://elsewhere.test/a.js"></script>', "marker", "https://example.com", () => { throw new Error("unexpected fetch"); }), false);
});
