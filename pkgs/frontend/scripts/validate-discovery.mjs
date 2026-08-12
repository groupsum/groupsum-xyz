import fs from "node:fs";
import path from "node:path";

const root = "https://groupsum.xyz";
const dist = "pkgs/frontend/dist";
const required = ["robots.txt", "sitemap.xml", "sitemap.xsl", "llms.txt", "llms-full.txt", "full-llms.txt", "social/groupsum-default.svg", "catalog/catalog.json", "catalog/summary.json", "catalog/schema.json", "catalog/site/schema.json", "catalog/site/manifest.json", "catalog/site/repositories.json", "catalog/site/packages.json", "catalog/site/resources.json", "catalog/site/resource-types.json", "catalog/site/technologies.json"];
const fail = (message) => { console.error(`discovery validation failed: ${message}`); process.exitCode = 1; };
for (const file of required) if (!fs.existsSync(path.join(dist, file))) fail(`missing ${dist}/${file}`);
const robots = fs.readFileSync(path.join(dist, "robots.txt"), "utf8");
if (!robots.includes(`Sitemap: ${root}/sitemap.xml`)) fail("robots.txt does not advertise the root sitemap");
const index = fs.readFileSync(path.join(dist, "sitemap.xml"), "utf8");
if (!index.includes("<sitemapindex") || !index.includes("sitemaps/")) fail("root sitemap is not a nested sitemap index");
const childFiles = fs.readdirSync(path.join(dist, "sitemaps")).filter((file) => file.endsWith(".xml"));
if (!childFiles.length) fail("no child sitemaps were generated");
for (const file of childFiles) {
  const xml = fs.readFileSync(path.join(dist, "sitemaps", file), "utf8");
  if (!xml.includes("<urlset") || !xml.includes("<url><loc>https://groupsum.xyz/")) fail(`invalid child sitemap ${file}`);
  if ((xml.match(/<url>/g) || []).length > 50000) fail(`child sitemap ${file} exceeds the URL limit`);
}
const home = fs.readFileSync(path.join(dist, "index.html"), "utf8");
for (const marker of ["og:title", "og:description", "og:image", "og:image:width", "twitter:image:alt", "canonical"]) if (!home.includes(marker)) fail(`home metadata missing ${marker}`);
const article = fs.readdirSync(dist).find((entry) => /^20\d\d$/.test(entry));
if (article) {
  const years = fs.readdirSync(path.join(dist, article));
  const month = years.find((entry) => /^\d\d$/.test(entry));
  const day = month && fs.readdirSync(path.join(dist, article, month)).find((entry) => /^\d\d$/.test(entry));
  if (day) {
    const dirs = fs.readdirSync(path.join(dist, article, month, day));
    const slug = dirs.find((entry) => fs.existsSync(path.join(dist, article, month, day, entry, "index.html")));
    if (slug) {
      const html = fs.readFileSync(path.join(dist, article, month, day, slug, "index.html"), "utf8");
      for (const marker of ["og:type\" content=\"article", "article:published_time", "og:image:alt"]) if (!html.includes(marker)) fail(`legacy article metadata missing ${marker}`);
    }
  }
}
const jsonLdSamples = [path.join(dist, "index.html"), path.join(dist, "products/records/ssot-registry/index.html")];
for (const file of jsonLdSamples) { const html = fs.readFileSync(file, "utf8"); const match = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/); if (!match) fail(`${file} missing JSON-LD`); else { try { const graph = JSON.parse(match[1]); if (graph["@context"] !== "https://schema.org" || !Array.isArray(graph["@graph"])) fail(`${file} has invalid JSON-LD graph`); } catch { fail(`${file} has unparsable JSON-LD`); } } }
const manifest = JSON.parse(fs.readFileSync(path.join(dist, "catalog/site/manifest.json"), "utf8"));
if (!manifest.snapshot?.snapshot_id) fail("catalog manifest is not pinned to an immutable snapshot");
for (const dataset of ["repositories", "packages", "resources", "technologies"]) if (!manifest.counts[dataset]) fail(`catalog manifest missing ${dataset} count`);
for (const dataset of ["releases", "deployments", "relationships"]) if (manifest.source_counts?.[dataset] === undefined) fail(`catalog manifest missing ${dataset} source count`);
for (const dataset of ["releases", "deployments", "surfaces", "relationships"]) if (fs.existsSync(path.join(dist, "catalog/site", `${dataset}.json`))) fail(`catalog publishes standalone ${dataset} dataset`);
const productEvidenceFiles = fs.readdirSync(path.join(dist, "catalog/product-evidence"), { recursive: true }).filter((file) => String(file).endsWith(".json"));
if (productEvidenceFiles.length !== manifest.product_evidence?.records) fail("product evidence bundle count does not match manifest");
const catalogHtml = fs.readFileSync(path.join(dist, "catalog/index.html"), "utf8");
for (const marker of ["Public ecosystem catalog", "DataCatalog", "og:url\" content=\"https://groupsum.xyz/catalog/"]) if (!catalogHtml.includes(marker)) fail(`catalog metadata missing ${marker}`);
for (const collection of ["repositories", "packages", "resources", "technologies"]) {
  const html = fs.readFileSync(path.join(dist, "catalog", collection, "index.html"), "utf8");
  for (const marker of ["DataCatalog", "ItemList", `og:url\" content=\"https://groupsum.xyz/catalog/${collection}/`]) if (!html.includes(marker)) fail(`${collection} collection metadata missing ${marker}`);
}
const staticResources = JSON.parse(fs.readFileSync(path.join(dist, "catalog/site/resources.json"), "utf8"));
const resourceTypes = JSON.parse(fs.readFileSync(path.join(dist, "catalog/site/resource-types.json"), "utf8"));
if (staticResources.length !== manifest.counts.resources) fail("static resource count does not match manifest");
if (resourceTypes.length !== manifest.resource_table_count || resourceTypes.length !== manifest.counts.resource_types) fail("resource type directory count does not match manifest");
if (resourceTypes.filter((item) => item.populated).length !== manifest.populated_resource_type_count) fail("populated resource type count does not match manifest");
if (new Set(resourceTypes.map((item) => item.family)).size !== manifest.resource_family_count) fail("resource family count does not match manifest");
const staticResourceTypeCounts = Object.fromEntries(Object.entries(Object.groupBy(staticResources, (item) => item.resource_type)).sort(([left], [right]) => left.localeCompare(right)).map(([key, values]) => [key, values.length]));
if (JSON.stringify(staticResourceTypeCounts) !== JSON.stringify(manifest.resource_type_counts)) fail("static resource-type counts do not match manifest");
for (const descriptor of resourceTypes) if (Number(staticResourceTypeCounts[descriptor.resource_type] || 0) !== descriptor.count) fail(`resource type descriptor count mismatch: ${descriptor.resource_type}`);
const resourceCollectionHtml = fs.readFileSync(path.join(dist, "catalog/resources/index.html"), "utf8");
for (const descriptor of resourceTypes) if (!resourceCollectionHtml.includes(descriptor.resource_type)) fail(`resource type card missing from static HTML: ${descriptor.resource_type}`);
const resourceSitemap = fs.readFileSync(path.join(dist, "sitemaps/catalog.xml"), "utf8");
const resourceRoutes = new Set(staticResources.map((item) => `${root}${String(item.route).replace(/\/$/, "")}/`));
for (const item of staticResources) {
  const route = `${root}${String(item.route).replace(/\/$/, "")}/`;
  if (!resourceSitemap.includes(`<loc>${route.replace(/&/g, "&amp;")}</loc>`)) fail(`resource sitemap is missing ${item.id}`);
}
if (resourceRoutes.size !== staticResources.length) fail("static resource routes are not unique");
for (const item of new Map(staticResources.map((record) => [record.resource_type, record])).values()) {
  const file = path.join(dist, String(item.route).replace(/^\//, ""), "index.html");
  if (!fs.existsSync(file)) fail(`missing representative ${item.resource_type} static page`);
  else {
    const html = fs.readFileSync(file, "utf8");
    if (!html.includes(item.title) || html.includes("Loading catalog record")) fail(`incomplete representative ${item.resource_type} static page`);
  }
}
const graphTypes = (file) => {
  const html = fs.readFileSync(file, "utf8");
  const match = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
  if (!match) return [];
  return JSON.parse(match[1])["@graph"].map((node) => node["@type"]);
};
const repositoryRoot = path.join(dist, "catalog", "repositories");
const repositoryDetail = fs.readdirSync(repositoryRoot, { recursive: true }).find((entry) => String(entry).endsWith("index.html") && String(entry) !== "index.html");
if (!repositoryDetail) fail("no generated repository detail page");
else for (const marker of ["SoftwareSourceCode", "Person", "ComputerLanguage"]) if (!graphTypes(path.join(repositoryRoot, repositoryDetail)).includes(marker)) fail(`repository detail JSON-LD missing ${marker}`);
const contributorRoot = path.join(dist, "contributors");
const contributorDetail = fs.existsSync(contributorRoot) ? fs.readdirSync(contributorRoot, { recursive: true }).find((entry) => String(entry).endsWith("index.html")) : null;
if (!contributorDetail) fail("no generated contributor profile page");
else for (const marker of ["ProfilePage", "Person"]) if (!graphTypes(path.join(contributorRoot, contributorDetail)).includes(marker)) fail(`contributor JSON-LD missing ${marker}`);
if (!process.exitCode) console.log(`discovery ok: ${childFiles.length} child sitemaps, ${fs.readFileSync(path.join(dist, "llms-full.txt"), "utf8").split("\n").length} full-index lines`);
