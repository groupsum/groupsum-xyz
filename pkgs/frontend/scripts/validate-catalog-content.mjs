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

const requireMarkers = (markers, concern) => {
  for (const marker of markers) {
    if (!source.includes(marker)) throw new Error(`${concern} marker missing: ${marker}`);
  }
};

requireMarkers(
  ["CatalogToolbar", "CatalogGroup", "CatalogRow", "useCatalogFilters", "products, applications, packages", "Public packages attached"],
  "catalog implementation",
);
requireMarkers(
  ["MetricBand", "MemberSectionNav", "DependencyTable", "RepositorySignalStrip", "Contained packages"],
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
  ["ReleaseTimeline", "Package release statistics", "Repository release summary", "isCurrentPageLink"],
  "release and evidence UIX",
);
requireMarkers(
  ["LegalContext", "license_url", "notice_count", "Its license belongs with the package"],
  "ownership-aware legal UIX",
);
requireMarkers(
  ["CatalogRecordNavigation", "Ownership hierarchy", "Back to {collection} Collection", "PackageIdentityCard", "Owning repository", "Manifest path"],
  "member navigation and package identity UIX",
);

if (!source.includes("portfolioEntities.filter")) throw new Error("portfolio pages do not use the approved entity catalog");
if (!source.includes("ContainedPackageList") || !source.includes("href={route}")) throw new Error("repository package navigation is not canonical");
if (!source.includes('timeZone: "UTC"')) throw new Error("catalog timestamps are not deterministic across SSR hydration");
if (!source.includes('aria-label="Package technology stack"')) throw new Error("technology tags are not package-scoped");
if (!source.includes("cursor-default select-none")) throw new Error("catalog tags lack stable cursor semantics");
if (source.includes("function LegalSection") || source.includes('<DetailSection title="License and notices"')) throw new Error("legal data remains detached from its owner");
if (source.includes("border-b border-r")) throw new Error("metric summaries draw unnecessary inner cell borders");
if (/[ÃÂâ�]/u.test(source)) throw new Error("catalog frontend source contains mojibake");
if ((collectionTables.match(/<table className="[^"]*text-xs"/g) || []).length !== 2) throw new Error("repository and package tables must use text-xs body typography");
if ((collectionTables.match(/<thead className="[^"]*text-\[11px\]/g) || []).length !== 2) throw new Error("repository and package table headers must match the 11px prototype scale");
if (source.includes('aria-label="Ownership hierarchy" className="overflow-x-auto')) throw new Error("record breadcrumbs must wrap instead of scrolling");

console.log(`catalog content ok: ${sourceFiles.length} modular source files checked`);
