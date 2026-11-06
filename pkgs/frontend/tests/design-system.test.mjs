import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = (name) => readFileSync(new URL(`../${name}`, import.meta.url), "utf8");
const css = source("src/design/themes.css");
const names = ["paper", "coal", "mist", "midnight", "parchment", "evergreen"];
const luminance = (hex) => {
  const values = hex.match(/[a-f\d]{2}/gi).map((value) => parseInt(value, 16) / 255).map((v) => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  return values[0] * .2126 + values[1] * .7152 + values[2] * .0722;
};
const contrast = (a, b) => {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + .05) / (values[1] + .05);
};
for (const name of names) test(`${name}: complete palette with readable role pairs`, () => {
  const block = css.match(new RegExp(`\\[data-theme="${name}"\\] \\{([^}]+)\\}`))[1];
  const tokens = Object.fromEntries([...block.matchAll(/--palette-([\w-]+):\s*(#[a-f\d]{6})/gi)].map((match) => [match[1], match[2]]));
  for (const token of ["canvas", "surface", "raised", "ink", "muted", "border", "accent", "hover", "on-accent", "signal", "info", "success", "danger"]) assert.ok(tokens[token], `${name}: ${token}`);
  for (const foreground of ["ink", "muted", "accent", "signal", "info", "success", "danger"]) for (const background of ["canvas", "surface", "raised"]) {
    assert.ok(contrast(tokens[foreground], tokens[background]) >= 4.5, `${name}: ${foreground}/${background} ${contrast(tokens[foreground], tokens[background]).toFixed(2)}`);
  }
  for (const background of ["accent", "hover"]) assert.ok(contrast(tokens["on-accent"], tokens[background]) >= 4.5, `${name}: action contrast`);
});
test("theme initialization precedes client boot and accepts only known preferences", () => {
  const html = source("index.html");
  assert.ok(html.indexOf("groupsum-theme") < html.indexOf('src="/src/main.tsx"'));
  for (const name of names) assert.ok(html.includes(`'${name}'`));
});
test("document and table primitives do not regress to nested cards or mobile card substitution", () => {
  const visuals = source("src/features/catalog/CatalogVisuals.tsx");
  assert.ok(visuals.includes('className="record-header space-y-4"'));
  assert.ok(visuals.includes('className="metric-strip pt-2"'));
  assert.ok(!source("src/features/catalog/CatalogCollectionTables.tsx").includes("PackageMobileCard"));
  assert.ok(source("src/features/catalog/ActivityInspector.tsx").includes('type="range"'));
});

test("remote fonts cannot cause a late layout-changing swap", () => {
  const html = source("index.html");
  assert.ok(html.includes("display=optional"));
  assert.ok(!html.includes("display=swap"));
});

test("ownership breadcrumbs constrain long repository names at enlarged text sizes", () => {
  const navigation = source("src/features/catalog/CatalogRecordNavigation.tsx");
  assert.ok(navigation.includes('className="flex min-w-0 max-w-full items-center gap-1.5"'));
  assert.ok(navigation.includes('className="min-w-0 [overflow-wrap:anywhere] font-medium'));
  assert.ok(navigation.includes('className="min-w-0 [overflow-wrap:anywhere] font-semibold'));
});
