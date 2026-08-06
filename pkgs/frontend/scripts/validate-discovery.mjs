import fs from "node:fs";
import path from "node:path";

const root = "https://groupsum.xyz";
const dist = "pkgs/frontend/dist";
const required = ["robots.txt", "sitemap.xml", "sitemap.xsl", "llms.txt", "llms-full.txt", "full-llms.txt", "social/groupsum-default.svg", "catalog/catalog.json", "catalog/summary.json", "catalog/schema.json", "catalog/site/schema.json", "catalog/site/manifest.json", "catalog/site/repositories.json", "catalog/site/packages.json", "catalog/site/resources.json", "catalog/site/technologies.json"];
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
for (const file of jsonLdSamples) { const html = fs.readFileSync(file, "utf8"); const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/); if (!match) fail(`${file} missing JSON-LD`); else { try { const graph = JSON.parse(match[1]); if (graph["@context"] !== "https://schema.org" || !Array.isArray(graph["@graph"])) fail(`${file} has invalid JSON-LD graph`); } catch { fail(`${file} has unparsable JSON-LD`); } } }
const manifest = JSON.parse(fs.readFileSync(path.join(dist, "catalog/site/manifest.json"), "utf8"));
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
if (!process.exitCode) console.log(`discovery ok: ${childFiles.length} child sitemaps, ${fs.readFileSync(path.join(dist, "llms-full.txt"), "utf8").split("\n").length} full-index lines`);
