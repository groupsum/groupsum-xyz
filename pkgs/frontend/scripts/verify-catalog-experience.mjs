import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const browser = await chromium.launch({ headless: true, executablePath: process.env.BROWSER_EXECUTABLE });
const page = await browser.newPage();
const origin = process.env.DESIGN_VERIFY_URL || "http://127.0.0.1:5174";
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
await mkdir(".tmp/catalog-experience", { recursive: true });
const noOverflow = async () => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `horizontal overflow at ${page.url()}`);
try {
  for (const theme of ["paper", "coal", "mist", "midnight", "parchment", "evergreen"]) {
    for (const width of [320, 768, 1280, 1600]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${origin}/contributors`);
      await page.getByRole("combobox", { name: "Color theme" }).selectOption(theme);
      const directory = page.getByRole("table", { name: "Contributor directory" });
      if (width === 320) { await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; }); await noOverflow(); await page.evaluate(() => { document.documentElement.style.fontSize = ""; }); }
      await directory.getByRole("link", { name: "Fixture Developer", exact: true }).click();
      await page.getByRole("heading", { name: "Fixture Developer", exact: true }).waitFor();
      await noOverflow();
      if (width === 320) { await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; }); await noOverflow(); await page.evaluate(() => { document.documentElement.style.fontSize = ""; }); }
      await page.getByRole("table", { name: "Contributor repositories" }).getByRole("link", { name: "fixture/multi-package" }).click();
      const trigger = page.getByRole("button", { name: "Inspect Stars", exact: true });
      await trigger.click();
      const activity = page.getByRole("dialog", { name: "Stars observed activity", exact: true });
      await activity.getByRole("combobox", { name: "Range" }).selectOption("0");
      await activity.getByRole("checkbox", { name: "Interval changes" }).check();
      await activity.getByText("Exact values", { exact: true }).click();
      assert.ok((await activity.getByRole("table").textContent()).includes("-5"));
      const slider = activity.getByRole("slider", { name: "Stars observation" });
      await slider.focus(); await page.keyboard.press("Home"); assert.equal(await slider.inputValue(), "0");
      const box = await activity.boundingBox(); assert.ok(box.x >= 0 && box.x + box.width <= width + 1);
      await page.keyboard.press("Escape"); await activity.waitFor({ state: "hidden" });
      assert.ok(await trigger.evaluate((element) => element === document.activeElement));
      await page.goto(`${origin}/catalog/packages/pypi/fixture-0`);
      await page.getByRole("heading", { name: "package-00-with-a-long-name-for-truncation", exact: true }).waitFor();
      assert.equal(await page.getByRole("heading", { name: "Package overview", exact: true }).count(), 0);
      const table = page.getByRole("table", { name: "Dependencies for package", exact: true });
      await table.locator("tbody tr").first().waitFor(); assert.equal(await table.locator("tbody tr").count(), 25);
      await page.getByRole("navigation", { name: "Relationship pagination top" }).getByRole("button", { name: "Next", exact: true }).click();
      await page.getByRole("status").filter({ hasText: "Page 2 of 6" }).waitFor();
      await page.getByRole("searchbox", { name: "Search relationships" }).fill("package-01");
      await table.getByRole("link", { name: "package-01-with-a-long-name-for-truncation", exact: true }).click();
      await page.getByRole("heading", { name: "package-01-with-a-long-name-for-truncation", exact: true }).waitFor();
      await page.getByRole("tab", { name: /^Dependents/ }).click();
      await page.getByRole("table", { name: "Dependents for package" }).getByRole("link", { name: "package-00-with-a-long-name-for-truncation", exact: true }).click();
      await page.getByRole("heading", { name: "package-00-with-a-long-name-for-truncation", exact: true }).waitFor();
      await page.getByText("Details & evidence", { exact: true }).click();
      await noOverflow();
      if ([320, 1600].includes(width)) await page.screenshot({ path: `.tmp/catalog-experience/${theme}-${width}-package.png`, fullPage: true });
    }
    console.log(`${theme}: contributor/profile/repository, chart scrubbing and dependency round trips passed at four widths`);
  }
  await page.setViewportSize({ width: 1600, height: 900 });
  const requests = [];
  page.on("request", (request) => { if (request.url().includes("/relationships")) requests.push(request.url()); });
  await page.goto(`${origin}/catalog/packages`);
  const cell = page.getByRole("button", { name: "Inspect dependencies of package-00-with-a-long-name-for-truncation", exact: true });
  await cell.waitFor(); assert.equal(requests.length, 0);
  await cell.click(); const inspector = page.getByRole("dialog", { name: "Dependencies of package-00-with-a-long-name-for-truncation" });
  await inspector.getByRole("table").waitFor(); assert.equal(await inspector.locator("tbody tr").count(), 10);
  await inspector.getByRole("combobox", { name: "Requirement", exact: true }).selectOption("true");
  await inspector.getByRole("status").filter({ hasText: "65 matching" }).waitFor();
  await page.keyboard.press("Escape"); await inspector.waitFor({ state: "hidden" });
  assert.ok(await cell.evaluate((element) => element === document.activeElement));
  await page.goto(`${origin}/catalog/packages/pypi/fixture-1#dependents`);
  await page.getByRole("tab", { name: /^Dependents/, selected: true }).waitFor();
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  await page.setViewportSize({ width: 320, height: 900 }); await noOverflow();
  await page.goto(`${origin}/contributors/github/missing`);
  await page.getByRole("heading", { name: "Contributor not found" }).waitFor();
  assert.deepEqual(errors, []);
  console.log("PASS: 24 theme/viewport journeys, native package links, on-demand cells, pagination, deep anchors, 200% text and missing identity");
} finally { await browser.close(); }
