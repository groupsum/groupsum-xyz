import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}) });
const origin = process.env.DESIGN_VERIFY_URL || "http://127.0.0.1:5173";
const themes = ["paper", "coal", "mist", "midnight", "parchment", "evergreen"];
const routes = ["/products", "/portfolio", "/catalog/repositories", "/catalog/packages", "/catalog/resources", "/catalog/packages/pypi/tba-durability-webauthn-eccc01f2", "/about"];
const widths = [320, 360, 768, 1280, 1600];
const report = [];
const output = path.resolve(process.env.DESIGN_EVIDENCE_DIR || ".tmp/design-evidence");
await mkdir(output, { recursive: true });
const page = await browser.newPage();
// Optional direct API transport for local previews behind a remote edge. Cache
// actual responses for this run, so theme permutations share identical evidence.
if (process.env.DESIGN_API_ORIGIN) {
  const cache = new Map();
  const run = promisify(execFile);
  await page.route((url) => url.pathname.startsWith("/api/"), async (route) => {
    const url = new URL(route.request().url());
    const key = url.pathname + url.search;
    if (!cache.has(key)) cache.set(key, run("curl.exe", ["-fsS", "--max-time", "90", `${process.env.DESIGN_API_ORIGIN}${key}`], { encoding: "buffer", maxBuffer: 100 * 1024 * 1024 }).then(({ stdout }) => stdout));
    await route.fulfill({ status: 200, contentType: "application/json", body: await cache.get(key) });
  });
}
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
function contrast(a, b) {
  const luminance = (color) => {
    const rgb = color.match(/[\d.]+/g).slice(0, 3).map(Number).map((v) => v / 255).map((v) => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
    return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
  };
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + .05) / (values[1] + .05);
}
try {
  await page.goto(origin);
  for (const theme of themes) {
    for (const width of widths) {
      await page.setViewportSize({ width, height: 1000 });
      for (const route of routes) {
        console.log(`Checking ${theme} ${width} ${route}`);
        await page.goto(`${origin}${route}`, { waitUntil: "domcontentloaded" });
        await page.getByRole("combobox", { name: "Color theme" }).selectOption(theme);
        if (/catalog\/(repositories|packages)$/.test(route)) await page.locator("main table tbody tr").first().waitFor({ timeout: 45000 });
        if (route.includes("/packages/pypi/")) await page.locator(".record-header").waitFor({ timeout: 45000 });
        if (route === "/catalog/resources") await page.getByRole("heading", { name: "Resource type directory" }).waitFor({ timeout: 45000 });
        await page.waitForFunction(() => !/Loading (catalog|persisted|product|portfolio)/i.test(document.querySelector("main")?.textContent || ""), undefined, { timeout: 45000 });
        const result = await page.evaluate(() => {
          const root = document.documentElement;
          const style = getComputedStyle(document.body);
          const probe = document.createElement("span");
          document.body.append(probe);
          const roles = Object.fromEntries(["ink", "ink-muted", "accent", "signal", "success", "danger"].map((role) => {
            probe.style.color = `var(--color-${role})`;
            return [role, getComputedStyle(probe).color];
          }));
          probe.remove();
          return { theme: root.dataset.theme, width: innerWidth, scrollWidth: root.scrollWidth, background: style.backgroundColor, roles, text: document.querySelector("main")?.textContent?.slice(0, 160) };
        });
        assert.equal(result.theme, theme);
        assert.ok(result.scrollWidth <= width + 1, `${theme} ${width} ${route}: horizontal overflow ${result.scrollWidth}`);
        assert.ok(!/unavailable|could not be loaded/i.test(result.text), `${route}: ${result.text}`);
        for (const [role, color] of Object.entries(result.roles)) assert.ok(contrast(color, result.background) >= 4.5, `${theme} ${role}: contrast ${contrast(color, result.background)}`);
        if (/catalog\/(repositories|packages)$/.test(route)) assert.ok(await page.locator("main table tbody tr").count() > 0, `${route}: no records`);
        if (route === "/products") await page.screenshot({ path: path.join(output, `${theme}-${width}.png`), fullPage: true, animations: "disabled" });
        if (width === 360 || width === 1600) await page.screenshot({ path: path.join(output, `${theme}-${width}-${route.replace(/\W+/g, "-")}.png`), animations: "disabled" });
        report.push({ route, ...result });
      }
    }
    console.log(`${theme}: ${routes.length * widths.length} responsive cases passed`);
  }
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.goto(`${origin}/catalog/repositories`, { waitUntil: "domcontentloaded" });
  const chart = page.getByLabel("Inspect Daily commits").first();
  await chart.waitFor({ timeout: 45000 });
  await chart.click();
  const slider = page.getByRole("slider").first();
  await slider.focus();
  await page.keyboard.press("Home");
  assert.equal(await slider.inputValue(), "0");
  const more = page.getByRole("group").locator("summary").filter({ hasText: /^\+\d+ more$/ }).first();
  if (await more.count()) { await more.click(); assert.ok(await page.getByRole("list", { name: "Other observed contributors" }).first().isVisible()); }
  await page.reload({ waitUntil: "domcontentloaded" });
  assert.equal(await page.locator("html").getAttribute("data-theme"), "evergreen");
  for (const theme of themes) {
    await page.setViewportSize({ width: 768, height: 1000 });
    await page.goto(`${origin}/catalog/packages`, { waitUntil: "domcontentloaded" });
    await page.locator("main table tbody tr").first().waitFor();
    await page.getByRole("combobox", { name: "Color theme" }).selectOption(theme);
    await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${theme}: 200% text overflow`);
    await page.evaluate(() => { document.documentElement.style.fontSize = ""; });
  }
  assert.deepEqual(errors, []);
  console.log(`All ${report.length} theme/route/viewport cases and disclosure/persistence checks passed.`);
} finally {
  await writeFile(path.join(output, "report.json"), JSON.stringify({ origin, report, errors }, null, 2));
  await browser.close();
}
