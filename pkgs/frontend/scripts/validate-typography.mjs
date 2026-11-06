import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const source = (relativePath) => readFileSync(resolve(root, relativePath), "utf8");
const failures = [];

const indexCss = source("src/index.css");
const typographyCss = source("src/typography.css");
const header = source("src/components/SiteHeader.tsx");
const explorer = source("src/features/catalog/CatalogExplorerUI.tsx");
const visuals = source("src/features/catalog/CatalogVisuals.tsx");

for (const role of [
  "type-display-xl",
  "type-display-lg",
  "type-heading-md",
  "type-heading-sm",
  "type-body-lg",
  "type-body-md",
  "type-body-sm",
  "type-ui-label",
  "type-control",
  "type-technical",
  "type-metric",
]) {
  if (!typographyCss.includes(`.${role}`)) failures.push(`Missing semantic typography role: ${role}`);
}

for (const [label, contents] of [["SiteHeader", header], ["index.css", indexCss]]) {
  for (const deprecated of ["Catalog & Evidence Explorer", "groupsum-catalog-density", "data-catalog-density"]) {
    if (contents.includes(deprecated)) failures.push(`${label} still contains deprecated density/header contract: ${deprecated}`);
  }
}

if (!indexCss.includes(".catalog-density-card") || !indexCss.includes(".catalog-density-table th")) {
  failures.push("Compact catalog spacing is not defined unconditionally.");
}

if (!typographyCss.includes("nav button") || !typographyCss.includes("font-family: var(--font-sans) !important")) {
  failures.push("Interactive controls are not globally pinned to the interface typeface.");
}

if (!indexCss.includes('--font-mono: "JetBrains Mono"')) {
  failures.push("Legacy technical utilities do not resolve to the canonical code typeface.");
}

for (const [label, contents] of [["SiteHeader", header], ["CatalogExplorerUI", explorer]]) {
  if (/\bfont-mono\b/.test(contents)) failures.push(`${label} uses a technical font for interface controls.`);
  if (!contents.includes("type-control")) failures.push(`${label} is missing the shared control type role.`);
}

if ((!visuals.includes("<PageTitle") && !visuals.includes("type-display-lg")) || !visuals.includes("type-ui-label") || !visuals.includes("type-technical")) {
  failures.push("CatalogVisuals is not wired to display, label, and technical type roles.");
}

if (existsSync(resolve(root, "src/styles.css"))) failures.push("Unused legacy src/styles.css still exists.");

if (failures.length) {
  console.error("Typography validation failed:\n" + failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log("Typography validation passed.");
