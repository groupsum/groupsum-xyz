import assert from "node:assert/strict";
import { createRequire } from "node:module";
import fs from "node:fs";
import { buildSync } from "esbuild";
// Run against the disposable Nginx fixture, never a production write endpoint.
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const origin = process.env.CACHE_TEST_ORIGIN || "http://127.0.0.1:5187";
const site = process.env.CACHE_TEST_SITE || ".tmp/cache-build/catalog/generated/site";
const models = JSON.parse(fs.readFileSync(`${site}/read-models.json`, "utf8"));
const manifest = JSON.parse(fs.readFileSync(`${site}/manifest.json`, "utf8"));
const code = buildSync({ entryPoints: ["pkgs/frontend/src/api/client.ts"], bundle: true, write: false, format: "iife", globalName: "cacheTest", platform: "browser" }).outputFiles[0].text;
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
try {
  const context = await browser.newContext();
  const page = await context.newPage(); let wire = 0;
  page.on("request", request => { if (request.url().includes("cache-browser-probe")) wire++; });
  await page.goto(`${origin}/`);
  const boot = async () => {
    await page.evaluate(() => { globalThis.__GROUPSUM_CATALOG_VERSION__ = { snapshot_id: "browser-check", public_projection_available: true, projection_version: "1" }; });
    await page.addScriptTag({ content: code });
  };
  const read = () => page.evaluate(async () => (await cacheTest.catalogFetch("/api/v1/catalog/packages?cache-browser-probe=1")).json());
  await boot(); await read(); await read(); assert.equal(wire, 1);
  await page.waitForFunction(() => new Promise(resolve => {
    const request = indexedDB.open("groupsum-public-v1", 1);
    request.onsuccess = () => { const tx = request.result.transaction("responses"); const rows = tx.objectStore("responses").getAll(); rows.onsuccess = () => { request.result.close(); resolve(rows.result.length > 0); }; };
  }));
  await page.reload(); await boot(); await read(); assert.equal(wire, 1, "reload must reuse IndexedDB");
  await page.evaluate(() => { globalThis.__GROUPSUM_CATALOG_VERSION__ = { snapshot_id: "browser-next", public_projection_available: true, projection_version: "1" }; });
  await read(); assert.equal(wire, 2, "new version must use a different cache identity");
  const second = await browser.newContext(); const another = await second.newPage();
  const shared = await another.request.get(`${origin}/api/v1/catalog/packages?cache-browser-probe=1&projection_version=1&snapshot_id=browser-next`);
  assert.equal(shared.headers()["x-catalog-proxy-cache"], "HIT", "shared across browser contexts");
  await second.close(); await context.close();
  const privateContext = await browser.newContext(); const privatePage = await privateContext.newPage();
  await privatePage.addInitScript(() => Object.defineProperty(globalThis, "indexedDB", { value: undefined }));
  await privatePage.goto(`${origin}/`); await privatePage.addScriptTag({ content: code });
  await privatePage.evaluate(async () => { await cacheTest.catalogFetch("/api/v1/catalog/packages?storage-disabled=1"); await cacheTest.catalogFetch("/api/v1/catalog/packages?storage-disabled=1"); });
  await privateContext.close();
  console.log("PASS browser memory, reload persistence, snapshot cache identity, shared contexts and disabled storage");

  const ui = await browser.newContext(); const screen = await ui.newPage(); const errors = [];
  screen.on("pageerror", error => errors.push(error.message));
  let nextVersion = false; let memberRequests = 0;
  await screen.route("**/api/v1/**", async route => {
    const url = new URL(route.request().url()); let body = {};
    if (url.pathname === "/api/v1/catalog/version") body = { ...manifest.snapshot, snapshot_id: nextVersion ? "browser-transition" : manifest.snapshot.snapshot_id, public_projection_available: true, projection_version: "1" };
    else if (url.pathname.startsWith("/api/v1/catalog/repositories/")) {
      memberRequests++; body = models.details[url.pathname.replace("/api/v1", "")];
      if (nextVersion && body) body = { ...body, snapshot_id: "browser-transition", item: { ...body.item, name: "Updated repository", full_name: "Updated repository", display_name: "Updated repository" } };
    } else if (url.pathname.startsWith("/api/v1/catalog/packages/") && !url.pathname.endsWith("/relationships")) body = models.details[Object.keys(models.details).find(key => key.endsWith("/" + url.pathname.split("/").at(-1)))] || {};
    else if (url.pathname.endsWith("/relationships")) body = { records: [], count: 0, dependency_count: 0, dependent_count: 0, page: 1, page_count: 1, page_size: 50, direction: "dependency", facets: { scope: {} } };
    else if (url.pathname.includes("/metrics")) body = { points: [] };
    else if (url.pathname.includes("snapshots")) body = { snapshots: [] };
    else if (url.pathname.includes("observations")) body = { observations: [], records: [] };
    await route.fulfill({ json: body || {}, headers: { "X-Catalog-Snapshot": nextVersion ? "browser-transition" : manifest.snapshot.snapshot_id } });
  });
  const repository = "/catalog/repositories/groupsum/markdown_workspace";
  const packageRoute = Object.keys(models.details).find(key => key.includes("/packages/pypi/tba-durability-webauthn-"));
  for (const path of [repository, packageRoute]) {
    const html = await (await screen.request.get(origin + path + "/")).text();
    assert.ok(html.includes('id="groupsum-api-snapshot"') && !html.includes("Loading catalog record…"));
    await screen.goto(origin + path + "/"); await screen.locator("h1").first().waitFor();
    for (const theme of ["paper", "coal", "mist", "midnight", "parchment", "evergreen"]) {
      await screen.evaluate(theme => { document.documentElement.dataset.theme = theme; }, theme);
      for (const width of [320, 768, 1280, 1600]) {
        await screen.setViewportSize({ width, height: 900 });
        for (const size of ["", "200%"] ) {
          await screen.evaluate(size => { document.documentElement.style.fontSize = size; }, size);
          await screen.waitForTimeout(20);
          assert.ok(await screen.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${path} ${theme} ${width} ${size}`);
        }
        await screen.evaluate(() => { document.documentElement.style.fontSize = ""; });
      }
    }
  }
  await screen.goto(origin + repository + "/"); await screen.locator("h1").first().waitFor();
  const before = memberRequests; nextVersion = true;
  await screen.evaluate(() => window.dispatchEvent(new Event("focus")));
  await screen.getByRole("heading", { name: "Updated repository", exact: true }).waitFor();
  assert.ok(memberRequests > before, "new snapshot must not reseed stale static model");
  assert.deepEqual(errors, []);
  console.log("PASS populated static details, snapshot transition, six themes, four widths, 200% text and no browser errors");
  await ui.close();
} finally { await browser.close(); }
