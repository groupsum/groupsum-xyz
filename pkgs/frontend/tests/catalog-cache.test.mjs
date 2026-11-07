import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import { createRequire } from "node:module";
import { buildSync } from "esbuild";
import { readFileSync } from "node:fs";
const require = createRequire(import.meta.url);
const code = buildSync({ entryPoints: ["pkgs/frontend/src/api/client.ts"], bundle: true, write: false, format: "cjs", platform: "node", external: ["react"] }).outputFiles[0].text;
function client(fetcher, available = true) {
  let clock = 1_000_000;
  const nativeRequest = Request;
  class BrowserRequest extends nativeRequest { constructor(input, init) { super(typeof input === "string" ? new URL(input, "https://catalog.test") : input, init); } }
  const context = { module: { exports: {} }, exports: {}, require, Request: BrowserRequest, Response, Headers, URL, TextEncoder, AbortSignal,
    setTimeout, clearTimeout, location: { origin: "https://catalog.test" }, window: { dispatchEvent() {} }, Event,
    Date: class extends Date { static now() { return clock; } },
    __GROUPSUM_CATALOG_VERSION__: { snapshot_id: "snapshot:one", public_projection_available: available, projection_version: "1" }, fetch: fetcher };
  vm.runInNewContext(code, context);
  return { fetch: context.module.exports.catalogFetch, context, advance: () => { clock += 31_000; } };
}
const json = (value, snapshot = "snapshot:one") => new Response(JSON.stringify(value), { headers: { "Content-Type": "application/json", ETag: 'W/"stable"', "X-Catalog-Snapshot": snapshot } });
test("anonymous frozen reads pin their snapshot and reuse the body without a second request", async () => {
  const calls = []; const cache = client(async (url, init) => { calls.push([String(url), init]); return json({ count: 3 }); });
  assert.deepEqual(await (await cache.fetch("/api/v1/catalog/packages?page=1")).json(), { count: 3 });
  assert.deepEqual(await (await cache.fetch("/api/v1/catalog/packages?page=1")).json(), { count: 3 });
  assert.equal(calls.length, 1); assert.ok(calls[0][0].includes("snapshot_id=snapshot%3Aone"));
  assert.equal(calls[0][1].credentials, "omit");
  cache.context.__GROUPSUM_CATALOG_VERSION__ = { snapshot_id: "snapshot:two", public_projection_available: true, projection_version: "1" };
  await cache.fetch("/api/v1/catalog/packages?page=1"); assert.equal(calls.length, 2);
});
test("credentials, writes and unknown/private endpoints never use the public cache", async () => {
  let calls = 0; const cache = client(async () => { calls++; return json({}); });
  for (const [path, init] of [["/api/v1/catalog/packages", { headers: { Authorization: "secret" } }], ["/api/v1/catalog/packages", { credentials: "include" }], ["/api/v1/admin", {}], ["/internal/v1/catalog/snapshots", { method: "POST", body: "{}" }]]) {
    await cache.fetch(path, init); await cache.fetch(path, init);
  }
  assert.equal(calls, 8);
});
test("conditional 304 retains data; expired data can be labeled as saved when network fails", async () => {
  let calls = 0; const cache = client(async (_url, init) => { calls++; if (calls === 1) return json({ name: "saved" }); if (calls === 2) { assert.equal(init.headers.get("If-None-Match"), 'W/"stable"'); return new Response(null, { status: 304 }); } throw new Error("offline"); }, false);
  await cache.fetch("/api/v1/catalog/packages"); cache.advance();
  assert.equal((await (await cache.fetch("/api/v1/catalog/packages")).json()).name, "saved"); cache.advance();
  const fallback = await cache.fetch("/api/v1/catalog/packages"); assert.equal(fallback.headers.get("X-Catalog-Stale"), "true");
  assert.equal((await fallback.json()).name, "saved");
});
test("simultaneous identical public reads share work and errors are not cached", async () => {
  let calls = 0; const cache = client(async () => { calls++; await new Promise(resolve => setTimeout(resolve, 10)); return json({}); });
  await Promise.all([cache.fetch("/api/v1/catalog/packages"), cache.fetch("/api/v1/catalog/packages")]); assert.equal(calls, 1);
  let failed = 0; const bad = client(async () => { failed++; return new Response("missing", { status: 404 }); });
  await assert.rejects(bad.fetch("/api/v1/catalog/packages"), /404/); await assert.rejects(bad.fetch("/api/v1/catalog/packages"), /404/); assert.equal(failed, 2);
});
test("decode-normalized cached responses do not retain compressed wire headers", async () => {
  const cache = client(async () => new Response('{"ok":true}', { headers: { "Content-Encoding": "gzip", "Content-Length": "999" } }));
  const response = await cache.fetch("/api/v1/catalog/packages"); assert.equal(response.headers.get("content-encoding"), null); assert.equal(response.headers.get("content-length"), null); assert.equal((await response.json()).ok, true);
});
test("static seeds retain their original snapshot identity and the generator awaits suspense", () => {
  for (const path of ["features/catalog/CatalogDetail.tsx", "features/catalog/ContributorProfile.tsx", "features/catalog/ContributorDirectory.tsx", "hooks/useCatalogCollection.ts"]) {
    assert.match(readFileSync(`pkgs/frontend/src/${path}`, "utf8"), /version\.snapshot_id === (?:staticModel|snapshot)\.static_snapshot_id/);
  }
  assert.match(readFileSync("pkgs/frontend/src/entry-server.tsx", "utf8"), /renderToPipeableStream/);
  assert.match(readFileSync("pkgs/frontend/scripts/generate-static.mjs", "utf8"), /await render\(record\.route\)/);
});
