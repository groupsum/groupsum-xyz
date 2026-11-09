import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import { resolve, sep } from "node:path";
import { createServer } from "node:http";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const path = "/catalog/repositories/groupsum/groupsum-xyz/";
const dist = resolve(process.env.REPOSITORY_DIST || "pkgs/frontend/dist");
const types = { html: "text/html", js: "text/javascript", css: "text/css", json: "application/json", svg: "image/svg+xml" };
const server = createServer(async (req, res) => {
  const pathname = decodeURI(new URL(req.url, "http://localhost").pathname);
  const file = resolve(dist, "." + pathname + (pathname.endsWith("/") ? "index.html" : ""));
  if (!file.startsWith(dist + sep)) { res.writeHead(404).end(); return; }
  try {
    const data = await readFile(file);
    res.writeHead(200, { "Content-Type": types[file.split(".").at(-1)] || "application/octet-stream" }).end(data);
  } catch {
    res.writeHead(404).end();
  }
});
const live = process.env.REPOSITORY_VERIFY_URL;
if (!live) await new Promise((done) => server.listen(0, "127.0.0.1", done));
const origin = live || `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: true, executablePath: process.env.BROWSER_EXECUTABLE });
try {
  for (const [width, height] of [[1440, 960], [360, 800], [320, 800]]) {
    const page = await browser.newPage({ viewport: { width, height }, isMobile: width < 600, hasTouch: width < 600 });
    const errors = [];
    const requests = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => requests.push(new URL(request.url()).pathname));
    if (!live) {
      await page.route("**/api/v1/catalog/version", (route) => route.abort());
      await page.route("**/api/v1/entities/**/metrics?*", (route) => route.fulfill({ json: { points: [
        { metric_key: "stars", observed_at: "2026-10-17T12:00:00Z", numeric_value: 2 },
        { metric_key: "stars", observed_at: "2026-11-02T12:00:00Z", numeric_value: 0 },
      ] } }));
    }
    const response = await page.goto(origin + path);
    assert.ok(response.ok());
    const document = await response.text();
    assert.match(document, /Latest observed events/);
    assert.match(document, /Release activity/);
    assert.match(document, /application\/ld\+json/);
    const header = page.locator("article header").first();
    await header.getByRole("heading", { name: "groupsum-xyz", exact: true }).waitFor();
    assert.equal(await header.getByText("License & notices", { exact: true }).count(), 1);
    await header.getByRole("link", { name: /Open on GitHub/ }).waitFor();
    await header.getByRole("heading", { name: "Latest observed events" }).waitFor();
    assert.deepEqual(await page.locator("article section[id]").evaluateAll((sections) => sections.slice(0, 5).map((section) => section.id)),
      ["observed-activity", "release-activity", "contributors", "contained-packages", "governance-evidence"]);
    await page.getByText("GitHub releases", { exact: true }).waitFor();
    await page.getByText("Package-registry releases", { exact: true }).waitFor();
    assert.ok(await page.locator("#contained-packages tbody a").count());
    assert.ok(!requests.some((url) => /\/snapshots$|\/observations$/.test(url)));
    const chart = header.getByRole("button", { name: "Inspect Daily commits" });
    assert.equal(await page.getByRole("button", { name: "Inspect Daily commits" }).count(), 1);
    await chart.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name: "Daily commits observed activity" });
    await dialog.waitFor();
    await dialog.getByText("Exact values", { exact: true }).click();
    assert.ok(await dialog.locator("tbody tr").count());
    await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "hidden" });
    if (!live) {
      await page.getByLabel("Exact observations for Stars").click();
      assert.match(await page.getByRole("row", { name: /^Stars/ }).textContent(), /-2/);
    }
    const noOverflow = () => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
    for (const theme of ["paper", "coal", "mist", "midnight", "parchment", "evergreen"]) {
      await page.getByRole("combobox", { name: "Color theme" }).selectOption(theme);
      assert.ok(await noOverflow(), `${width}px overflow in ${theme}`);
    }
    assert.deepEqual(errors, []);
    await page.close();
    console.log(`Repository layout verified at ${width}px in six themes`);
  }
} finally {
  await browser.close();
  server.close();
}
