import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const frontendRoot = path.join(repoRoot, "pkgs", "frontend");
const source = fs.readFileSync(path.join(frontendRoot, "src", "data", "entities.ts"), "utf8");
const match = source.match(/export const portfolioEntities[^=]*=\s*(\[[\s\S]*\]);\s*$/);
if (!match) throw new Error("Unable to locate portfolioEntities in src/data/entities.ts");
const checkedAt = source.match(/const checkedAt = "([^"]+)";/)?.[1];
if (!checkedAt) throw new Error("Unable to locate checkedAt in src/data/entities.ts");

const entities = vm.runInNewContext(`(${match[1]})`, { checkedAt }, { timeout: 1_000 });
const languageLabels = new Set(["python", "rust", "typescript", "javascript", "html", "css", "markdown", "yaml", "json"]);
const productRecords = entities.map((entity) => ({
  id: entity.id,
  slug: entity.slug,
  organization_id: entity.organization,
  record_type: entity.kind === "project" ? "portfolio" : "product",
  artifact_type: entity.kind,
  title: entity.displayName,
  summary: entity.summary,
  maturity: entity.maturity,
  visibility: entity.approved ? "public" : "review",
  featured: Boolean(entity.featured),
  updated_at: checkedAt,
  canonical_url: `https://groupsum.xyz/${entity.kind === "project" ? "portfolio" : "products"}/records/${entity.slug}`,
  source_name: entity.sourceName,
  parent_id: entity.parentId ?? null,
  audience: entity.audience ?? [],
  ecosystems: (entity.ecosystem ?? []).filter((value) => !languageLabels.has(value.toLowerCase())),
  technologies: (entity.technologies ?? []).filter((value) => !languageLabels.has(value.toLowerCase())),
  languages: [...new Set([
    ...(entity.ecosystem ?? []),
    ...(entity.technologies ?? []),
  ].filter((value) => languageLabels.has(value.toLowerCase())))],
  capabilities: entity.capabilityIds ?? [],
  evidence: entity.evidence ?? [],
  limitations: entity.limitations ?? [],
  links: entity.links ?? [],
  claim_boundary: entity.claimBoundary ?? null,
  content: {},
  related_slugs: entity.parentId
    ? [entities.find((candidate) => candidate.id === entity.parentId)?.slug].filter(Boolean)
    : [],
}));

const evaluateExportedArray = (relativePath, exportName) => {
  const moduleSource = fs.readFileSync(path.join(frontendRoot, relativePath), "utf8");
  const expression = moduleSource.match(
    new RegExp(`export const ${exportName}[^=]*=\\s*(\\[[\\s\\S]*\\]);\\s*$`),
  );
  if (!expression) throw new Error(`Unable to locate ${exportName} in ${relativePath}`);
  return vm.runInNewContext(`(${expression[1]})`, Object.create(null), { timeout: 1_000 });
};

const solutionRecords = evaluateExportedArray("src/data/solutions.ts", "solutionsData").map(
  (solution) => ({
    id: `solution-${solution.id}`,
    slug: solution.slug,
    organization_id: "groupsum",
    record_type: "solution",
    artifact_type: "solution",
    title: solution.title,
    summary: solution.problem,
    maturity: "reviewed",
    visibility: "public",
    featured: false,
    canonical_url: `https://groupsum.xyz/solutions/${solution.slug}`,
    source_name: solution.slug,
    parent_id: null,
    audience: [solution.audience],
    ecosystems: [],
    technologies: [],
    languages: [],
    capabilities: [],
    evidence: solution.evidence.map((label) => ({ kind: "reviewed", label, checkedAt })),
    limitations: solution.limitations,
    links: [],
    claim_boundary: "Evidence-scoped solution guidance; not a fixed offer or outcome guarantee.",
    content: solution,
    related_slugs: solution.suites,
  }),
);

const serviceRecords = evaluateExportedArray("src/data/services.ts", "servicesData").map(
  (service) => ({
    id: `service-${service.id}`,
    slug: service.slug,
    organization_id: "groupsum",
    record_type: "service",
    artifact_type: "service",
    title: service.title,
    summary: service.engagementShape,
    maturity: "reviewed",
    visibility: "public",
    featured: false,
    canonical_url: `https://groupsum.xyz/services/${service.slug}`,
    source_name: service.slug,
    parent_id: null,
    audience: [service.audience],
    ecosystems: [],
    technologies: [],
    languages: [],
    capabilities: [],
    evidence: [],
    limitations: service.exclusions,
    links: [],
    claim_boundary: "Engagement shape only; scope and terms follow discovery.",
    content: service,
    related_slugs: service.relatedWorkSlugs,
  }),
);

const records = [...productRecords, ...solutionRecords, ...serviceRecords];

const organizations = [...new Set(records.map((record) => record.organization_id))]
  .sort()
  .map((id) => ({ id, slug: id, name: id[0].toUpperCase() + id.slice(1) }));

const target = path.join(repoRoot, "catalog", "content", "records.json");
fs.writeFileSync(
  target,
  `${JSON.stringify({ schema_version: "1.0.0", organizations, records }, null, 2)}\n`,
  "utf8",
);
console.log(`wrote ${target} (${records.length} records)`);
