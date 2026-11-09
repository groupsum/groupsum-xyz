import fs from "node:fs";
import path from "node:path";

const frontend = "pkgs/frontend/src";
const sourceFiles = [];
const visit = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) visit(target);
    else if (/\.(ts|tsx)$/.test(entry.name) && !entry.name.includes(".generated.")) sourceFiles.push(target);
  }
};
visit(frontend);
const source = sourceFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");
const collectionTables = fs.readFileSync(path.join(frontend, "features/catalog/CatalogCollectionTables.tsx"), "utf8");
const typography = fs.readFileSync(path.join(frontend, "typography.css"), "utf8");

const requireMarkers = (markers, concern) => {
  for (const marker of markers) {
    if (!source.includes(marker)) throw new Error(`${concern} marker missing: ${marker}`);
  }
};

requireMarkers(
  ["CatalogToolbar", "CatalogGroup", "CatalogRow", "useCatalogFilters", "ExplorerProductPortfolioCollection", "Reviewed records", "Public packages attached"],
  "catalog implementation",
);
requireMarkers(
  ["MetricBand", "MemberSectionNav", "PackageRelationships", "RepositorySignalStrip", "Contained packages"],
  "catalog UIX",
);
requireMarkers(
  ["CollectionHeader", "MemberRowCard", "RecordIdentityCard", "SurfaceCard", "ContextRailCard", "lg:grid-cols-12"],
  "catalog composition",
);
requireMarkers(
  ["PublicCatalogOverview", "fixedDataset?: DatasetName", '"repositories", "packages", "resources", "technologies"'],
  "catalog collection routing",
);
requireMarkers(
  ["ReleaseTimeline", "Package release statistics", "GitHub releases", "Package-registry releases", "isCurrentPageLink"],
  "release and evidence UIX",
);
requireMarkers(
  ["LegalContext", "No repository license observed", "Packages report their own licenses"],
  "ownership-aware legal UIX",
);
requireMarkers(
  ["CatalogRecordNavigation", "Ownership hierarchy", "Back to {collection} Collection", "PackageIdentityCard", "Last observed:", "Technologies:", 'id="package-overview"'],
  "member navigation and package identity UIX",
);

if (!source.includes("portfolioEntities.filter")) throw new Error("portfolio pages do not use the approved entity catalog");
if (!source.includes("ContainedPackageList") || !source.includes("href={route}")) throw new Error("repository package navigation is not canonical");
if (!source.includes('timeZone: "UTC"')) throw new Error("catalog timestamps are not deterministic across SSR hydration");
if (!source.includes('valueStrings(record.technologies)')) throw new Error("technology tags are not package-scoped");
if (!source.includes("cursor-default select-none")) throw new Error("catalog tags lack stable cursor semantics");
if (source.includes("function LegalSection") || source.includes('<DetailSection title="License and notices"')) throw new Error("legal data remains detached from its owner");
if (source.includes("border-b border-r")) throw new Error("metric summaries draw unnecessary inner cell borders");
if (/[ÃÂâ�]/u.test(source)) throw new Error("catalog frontend source contains mojibake");
for (const table of ["catalog-repository-table", "catalog-package-table"]) {
  const classes = [...collectionTables.matchAll(/<table className="([^"]+)"/g)]
    .map(([, value]) => value.split(/\s+/))
    .find((tokens) => tokens.includes(table));
  if (!classes?.includes("type-record-table")) throw new Error(`${table} must use the shared type-record-table role`);
}
const tableTypography = typography.match(/(?:^|\n)\.type-record-table\s*\{([^}]+)\}/)?.[1] ?? "";
if (!/\bfont-size:\s*var\(--type-body-sm-size\)\s*;/.test(tableTypography) ||
    !/--type-body-sm-size:\s*0\.75rem\s*;/.test(typography)) {
  throw new Error("type-record-table must use the compact 0.75rem body size token");
}
if ((collectionTables.match(/<thead className="[^"]*type-ui-label/g) || []).length !== 2) throw new Error("repository and package table headers must use the semantic UI label role");
if (!collectionTables.includes("function HyphenBreakText") || !collectionTables.includes("<wbr />")) throw new Error("repository names lack explicit hyphen-aware wrapping");
if (source.includes('aria-label="Ownership hierarchy" className="overflow-x-auto')) throw new Error("record breadcrumbs must wrap instead of scrolling");
if (!source.includes('aria-label="Package relationships"') || !source.includes("Relationship pagination ${placement}")) throw new Error("package relationships lack tabs and bounded pagination");
if (!source.includes("scopeLabel") || !source.includes('aria-label={item.optional ? "Optional requirement" : "Required dependency"}')) throw new Error("dependency relationship icons lack tooltip and accessible labels");
if (source.includes('>Ecosystem</dt><dd className="mt-1 text-xs text-ink-muted"') || source.includes('>Scope</dt><dd className="mt-1 break-words')) throw new Error("dependency rows still repeat implied ecosystem or scope labels");

console.log(`catalog content ok: ${sourceFiles.length} modular source files checked`);
