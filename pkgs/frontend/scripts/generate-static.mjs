import fs from "node:fs";
import path from "node:path";
import { articles } from "../../site-content-pack/dist/index.js";
import { jsonLdHtml } from "./structured-data.mjs";
import { getApiSnapshot, render } from "../dist-server/entry-server.js";

const OUT = "pkgs/frontend/dist";
const root = "https://groupsum.xyz";
const normalizePath = (value) => {
  const pathname = String(value || "/").split(/[?#]/)[0] || "/";
  if (pathname === "/") return "/";
  return `/${pathname.replace(/^\/+|\/+$/g, "")}/`;
};
const absolute = (value) => `${root}${normalizePath(value)}`;
const escapeHtml = (value) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const escapeXml = (value) => escapeHtml(value).replace(/'/g, "&apos;");
const stripHtml = (value) => String(value || "").replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/&hellip;/g, "...").replace(/&#8217;/g, "'").replace(/&#8211;/g, "-").replace(/\s+/g, " ").trim();
const trim = (value, size = 180) => { const text = stripHtml(value); return text.length > size ? `${text.slice(0, size - 1).trimEnd()}…` : text; };
const safeFile = (value) => String(value).replace(/[^a-z0-9_-]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
// Keep published discovery text Unicode-clean even when legacy imported copy is malformed.
const cleanTrim = (value, size = 180) => {
  const text = stripHtml(value);
  return text.length > size ? `${text.slice(0, size - 1).trimEnd()}…` : text;
};
const defaultImage = { url: `${root}/social/groupsum-default.svg`, type: "image/svg+xml", width: "1200", height: "630", alt: "GroupSum structured software and clear decisions" };
const readCatalogDataset = (name) => JSON.parse(fs.readFileSync(`catalog/generated/site/${name}.json`, "utf8"));
const catalogRepositories = readCatalogDataset("repositories");
const catalogPackages = readCatalogDataset("packages");
const catalogResources = readCatalogDataset("resources");
const catalogTechnologies = readCatalogDataset("technologies");

const pages = [
  ["/", "GroupSum | Portfolio, Solutions, and Services", "GroupSum builds structured software, platforms, and services for teams that need clear decisions.", "website"],
  ["/products/", "Products | GroupSum", "Explore GroupSum, Tigrbl, and Swarmauri products, suites, packages, and specifications.", "website"],
  ["/products/groupsum/", "GroupSum products", "The GroupSum product family for structured collaboration, durable knowledge, and clear decisions.", "website"],
  ["/products/tigrbl/", "Tigrbl products", "Tigrbl packages and suites for durable data contracts, APIs, and storage-aware applications.", "website"],
  ["/products/swarmauri/", "Swarmauri products", "Swarmauri packages and suites for composable AI systems, agents, and evaluators.", "website"],
  ["/portfolio/", "Portfolio | GroupSum", "A browsable portfolio of Groupsum, Tigrbl, and Swarmauri projects, packages, suites, and specifications.", "website"],
  ["/catalog/", "Public ecosystem catalog | GroupSum", "Generated public repositories, packages, typed resources, technologies, and release evidence aggregated on their canonical parent records.", "website"],
  ["/solutions/", "Solutions | GroupSum", "Evidence-led solution paths for teams moving from ambiguity to an operable technical system.", "website"],
  ["/services/", "Services | GroupSum", "Focused services for architecture, product delivery, platform hardening, and technical decision support.", "website"],
  ["/insights/", "Insights | GroupSum", "Legacy articles and current field notes on software, systems, AI, and technical practice.", "website"],
  ["/about/", "About | GroupSum", "How GroupSum approaches software, product systems, evidence, and durable delivery.", "website"],
  ["/contact/", "Contact | GroupSum", "Start a conversation about a product, platform, solution, or service engagement.", "website"],
  ["/privacy-policy/", "Privacy policy | GroupSum", "GroupSum privacy policy.", "website"],
  ["/terms-of-service/", "Terms of service | GroupSum", "GroupSum terms of service.", "website"]
].map(([route, title, description, type]) => ({ route, title, description, type, url: absolute(route) }));
pages.push(
  { route: "/catalog/repositories/", title: "Repositories | GroupSum catalog", description: "Public source repositories with repository-owned activity, packages, governance, and typed resources.", type: "website", url: absolute("/catalog/repositories/"), schemaFamily: "catalog-collection" },
  { route: "/catalog/packages/", title: "Packages | GroupSum catalog", description: "Manifest and registry-backed packages with releases, dependencies, dependents, license, and notice evidence.", type: "website", url: absolute("/catalog/packages/"), schemaFamily: "catalog-collection" },
  { route: "/catalog/resources/", title: "Typed resources | GroupSum catalog", description: "Public APIs, documentation, demos, examples, websites, showcases, and user interfaces attached to their source owners.", type: "website", url: absolute("/catalog/resources/"), schemaFamily: "catalog-collection" },
  { route: "/catalog/technologies/", title: "Technologies | GroupSum catalog", description: "Categorical stack evidence observed from public source and package metadata.", type: "website", url: absolute("/catalog/technologies/"), schemaFamily: "catalog-collection" },
);
const slugsFrom = (file) => {
  const source = fs.readFileSync(file, "utf8");
  return [...source.matchAll(/slug:\s*["']([^"']+)["']/g)].map((match) => match[1]);
};
const productRecordsFrom = (file) => {
  const source = fs.readFileSync(file, "utf8");
  return [...source.matchAll(/\{\s*id:\s*["'][^"']+["'],\s*slug:\s*["']([^"']+)["'][\s\S]*?displayName:\s*["']([^"']+)["'][\s\S]*?summary:\s*["']([^"']+)["']/g)]
    .map((match) => ({ slug: match[1], name: match[2], summary: match[3] }));
};
const productMetadataRecords = productRecordsFrom("pkgs/frontend/src/data/entities.ts");
const readApiSnapshot = (family, name) => JSON.parse(fs.readFileSync(`pkgs/backend/generated/api-snapshots/${family}/${name}.json`, "utf8"));
const readOptionalApiSnapshot = (family, name) => {
  const target = `pkgs/backend/generated/api-snapshots/${family}/${name}.json`;
  return fs.existsSync(target) ? JSON.parse(fs.readFileSync(target, "utf8")) : null;
};
const generatedPortfolioCollection = readApiSnapshot("portfolio", "index");
const generatedPortfolioRecords = generatedPortfolioCollection.records.map((item) => {
  const model = readApiSnapshot("portfolio", item.slug);
  const signals = model.implementation?.signals?.metrics || {};
  return {
    route: `/portfolio/records/${item.slug}/`,
    url: absolute(`/portfolio/records/${item.slug}/`),
    title: `${item.title} | GroupSum portfolio`,
    description: cleanTrim(item.summary),
    type: "website",
    modified: item.updated_at,
    schemaFamily: "portfolio-evidence",
    sourceUrl: model.record.source_url,
    repositoryCount: item.repository_count,
    packageCount: item.package_count,
    releaseCount: item.release_count,
    resourceCount: item.resource_count,
    dependencyCount: item.dependency_count,
    dependentCount: item.dependent_count,
    stars: signals.stars,
    forks: signals.forks,
    contributors: signals.contributors,
    commits: signals.commits,
    organizationName: model.record.organization_name,
    organizationUrl: model.record.organization_url,
    organizationId: `${root}/products/${model.record.organization_slug}/#organization`,
  };
});
const detailRecords = [
  ...slugsFrom("pkgs/frontend/src/data/portfolio.ts").flatMap((slug) => ["", "projects/", "packages/", "specifications/"].map((prefix) => ({ route: `/portfolio/${prefix}${slug}/`, url: absolute(`/portfolio/${prefix}${slug}/`), title: `${slug.replace(/[-_]/g, " ")} | GroupSum portfolio`, description: `Portfolio record for ${slug.replace(/[-_]/g, " ")}.`, type: "website" }))),
  ...slugsFrom("pkgs/frontend/src/data/solutions.ts").map((slug) => ({ route: `/solutions/${slug}/`, url: absolute(`/solutions/${slug}/`), title: `${slug.replace(/[-_]/g, " ")} solution | GroupSum`, description: `Solution path for ${slug.replace(/[-_]/g, " ")}.`, type: "website" })),
  ...slugsFrom("pkgs/frontend/src/data/services.ts").map((slug) => ({ route: `/services/${slug}/`, url: absolute(`/services/${slug}/`), title: `${slug.replace(/[-_]/g, " ")} service | GroupSum`, description: `Service detail for ${slug.replace(/[-_]/g, " ")}.`, type: "website" })),
  ...productMetadataRecords.map((item) => {
    const model = readOptionalApiSnapshot("product", item.slug);
    const signals = model?.implementation?.signals?.metrics || {};
    return { route: `/products/records/${item.slug}/`, url: absolute(`/products/records/${item.slug}/`), title: `${item.name} | GroupSum products`, description: cleanTrim(item.summary), type: "website", schemaFamily: "product-detail", stars: signals.stars, forks: signals.forks, contributors: signals.contributors, commits: signals.commits, organizationName: model?.record?.organization_name, organizationUrl: model?.record?.organization_url, organizationId: model?.record?.organization_slug ? `${root}/products/${model.record.organization_slug}/#organization` : undefined };
  }),
  ...generatedPortfolioRecords
];
const catalogDetailRecords = [
  ...catalogRepositories.map((item) => ({ route: normalizePath(item.route), url: absolute(item.route), title: `${item.display_name} repository | GroupSum catalog`, description: cleanTrim(item.description), type: "website", modified: item.observed_at, schemaFamily: "catalog-repository", sourceUrl: item.url })),
  ...catalogPackages.map((item) => ({ route: normalizePath(item.route), url: absolute(item.route), title: `${item.display_name} package | GroupSum catalog`, description: cleanTrim(item.description), type: "website", modified: item.observed_at, schemaFamily: "catalog-package", sourceUrl: item.registry_url || item.source_url })),
  ...catalogResources.map((item) => ({ route: normalizePath(item.route), url: absolute(item.route), title: `${item.display_name} ${item.resource_type} | GroupSum catalog`, description: cleanTrim(item.description), type: "website", modified: item.observed_at, schemaFamily: "catalog-resource", sourceUrl: item.url })),
  ...catalogTechnologies.map((item) => ({ route: normalizePath(item.route), url: absolute(item.route), title: `${item.name} technology evidence | GroupSum catalog`, description: `${item.name} was observed through GitHub language data in ${item.repository_count} public repositories.`, type: "website", modified: item.observed_at, schemaFamily: "catalog-technology" }))
];
detailRecords.push(...catalogDetailRecords);
const articleRecords = articles.map((article) => { const route = normalizePath(article.legacyPath); return { route, url: article.canonicalUrl || absolute(route), title: cleanTrim(article.title, 160), description: cleanTrim(article.excerptHtml || article.contentHtml, 180) || "Legacy GroupSum article.", type: "article", image: article.featuredImage ? { ...defaultImage, url: article.featuredImage } : defaultImage, published: article.date, modified: article.modified, author: article.authorName, section: article.categories?.[0], tags: article.tags || [] }; });
const inventory = [...pages, ...detailRecords, ...articleRecords];
const sitemapGroups = new Map();
for (const record of [...pages, ...detailRecords]) { const key = record.route === "/" ? "pages" : record.route.split("/")[1]; sitemapGroups.set(key, [...(sitemapGroups.get(key) || []), record]); }
for (const record of articleRecords) { const key = `insights-${record.route.split("/")[1] || "unknown"}`; sitemapGroups.set(key, [...(sitemapGroups.get(key) || []), record]); }

function pageMetaHtml(record) {
  const image = record.image || defaultImage;
  const lines = [`<title>${escapeHtml(record.title)}</title>`, `<meta name="description" content="${escapeHtml(record.description)}" />`, `<meta name="robots" content="index,follow" />`, `<link rel="canonical" href="${escapeHtml(record.url)}" />`, `<meta property="og:type" content="${escapeHtml(record.type || "website")}" />`, `<meta property="og:site_name" content="GroupSum" />`, `<meta property="og:locale" content="en_US" />`, `<meta property="og:title" content="${escapeHtml(record.title)}" />`, `<meta property="og:description" content="${escapeHtml(record.description)}" />`, `<meta property="og:url" content="${escapeHtml(record.url)}" />`, `<meta property="og:image" content="${escapeHtml(image.url)}" />`, `<meta property="og:image:secure_url" content="${escapeHtml(image.url)}" />`, `<meta property="og:image:type" content="${escapeHtml(image.type)}" />`, `<meta property="og:image:width" content="${escapeHtml(image.width)}" />`, `<meta property="og:image:height" content="${escapeHtml(image.height)}" />`, `<meta property="og:image:alt" content="${escapeHtml(image.alt)}" />`, `<meta name="twitter:card" content="summary_large_image" />`, `<meta name="twitter:title" content="${escapeHtml(record.title)}" />`, `<meta name="twitter:description" content="${escapeHtml(record.description)}" />`, `<meta name="twitter:image" content="${escapeHtml(image.url)}" />`, `<meta name="twitter:image:alt" content="${escapeHtml(image.alt)}" />`];
  if (record.type === "article") { if (record.published) lines.push(`<meta property="article:published_time" content="${escapeHtml(record.published)}" />`); if (record.modified) lines.push(`<meta property="article:modified_time" content="${escapeHtml(record.modified)}" />`); if (record.author) lines.push(`<meta property="article:author" content="${escapeHtml(record.author)}" />`); if (record.section) lines.push(`<meta property="article:section" content="${escapeHtml(record.section)}" />`); for (const tag of record.tags.slice(0, 12)) lines.push(`<meta property="article:tag" content="${escapeHtml(tag)}" />`); }
  return lines.join("\n    ");
}
function injectHeadMeta(html, record) { const replacement = "    " + pageMetaHtml(record) + "\n    " + jsonLdHtml(record) + "\n  </head>"; return html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, "").replace(/\s*<title>.*?<\/title>\s*/gis, "").replace(/\s*<meta (?:name|property)="(?:description|robots|og:[^"]+|twitter:[^"]+|article:[^"]+)"[^>]*>\s*/gi, "").replace(/\s*<link rel="canonical"[^>]*>\s*/gi, "").replace("</head>", replacement); }
function injectRenderedApp(html, record) {
  const model = getApiSnapshot(record.route);
  const serialized = model ? `<script id="groupsum-api-snapshot" type="application/json">${JSON.stringify(model).replace(/</g, "\\u003c")}</script>` : "";
  return html.replace('<div id="root"></div>', `<div id="root">${render(record.route)}</div>${serialized}`);
}
function urlset(records) { return `<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="${root}/sitemap.xsl"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${records.map((record) => { const lastmod = record.modified || record.published; return `  <url><loc>${escapeXml(record.url)}</loc>${lastmod ? `<lastmod>${escapeXml(lastmod)}</lastmod>` : ""}</url>`; }).join("\n")}\n</urlset>\n`; }

function writeDiscovery() {
  const sitemapDir = path.join(OUT, "sitemaps"); fs.mkdirSync(sitemapDir, { recursive: true }); const sitemapRefs = [];
  for (const [key, records] of [...sitemapGroups.entries()].sort(([a], [b]) => a.localeCompare(b))) { const rel = `sitemaps/${safeFile(key)}.xml`; const target = path.join(OUT, rel); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, urlset(records)); sitemapRefs.push(`${root}/${rel}`); }
  const index = `<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="${root}/sitemap.xsl"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapRefs.map((loc) => `  <sitemap><loc>${escapeXml(loc)}</loc></sitemap>`).join("\n")}\n</sitemapindex>\n`; fs.writeFileSync(path.join(OUT, "sitemap.xml"), index);
  fs.writeFileSync(path.join(OUT, "sitemap.xsl"), `<?xml version="1.0" encoding="UTF-8"?><xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"><xsl:output method="html" encoding="UTF-8"/><xsl:template match="/"><html lang="en"><head><meta charset="utf-8"/><title>GroupSum sitemap</title><style>body{font:16px system-ui,sans-serif;color:#17211e;background:#faf8f2;margin:2rem}main{max-width:72rem;margin:auto}table{width:100%;border-collapse:collapse;background:#fff}th,td{text-align:left;padding:.7rem;border-bottom:1px solid #d9ded8}a{color:#176b5b}</style></head><body><main><h1>GroupSum sitemap</h1><p>This index lists public, crawlable GroupSum pages and legacy articles.</p><table><thead><tr><th>URL</th><th>Last modified</th></tr></thead><tbody><xsl:for-each select="s:sitemapindex/s:sitemap|s:urlset/s:url"><tr><td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td><td><xsl:value-of select="s:lastmod"/></td></tr></xsl:for-each></tbody></table></main></body></html></xsl:template></xsl:stylesheet>`);
  fs.writeFileSync(path.join(OUT, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${root}/sitemap.xml\n`);
  const llms = `# GroupSum\n\n> GroupSum builds structured software, platforms, and services for teams that need clear decisions.\n\n## Start here\n\n- [Home](${root}/)\n- [Products](${root}/products/)\n- [Portfolio](${root}/portfolio/)\n- [Public catalog](${root}/catalog/)\n- [Solutions](${root}/solutions/)\n- [Services](${root}/services/)\n- [Insights](${root}/insights/)\n- [About](${root}/about/)\n- [Contact](${root}/contact/)\n\n## Machine-readable indexes\n\n- [Catalog dataset manifest](${root}/catalog/site/manifest.json)\n- [Full content manifest](${root}/llms-full.txt)\n- [Legacy alias](${root}/full-llms.txt)\n- [XML sitemap](${root}/sitemap.xml)\n`; fs.writeFileSync(path.join(OUT, "llms.txt"), llms);
  const fullDir = path.join(OUT, "llms-full"); fs.mkdirSync(fullDir, { recursive: true }); const sections = [];
  for (const [key, records] of [...sitemapGroups.entries()].sort(([a], [b]) => a.localeCompare(b))) { const filename = `${safeFile(key)}.md`; const body = [`# ${key.replace(/-/g, " ")}`, "", ...records.map((record) => `- [${record.title}](${record.url})${record.modified || record.published ? ` — ${record.modified || record.published}` : ""}${record.description ? `\n  ${record.description}` : ""}`), ""].join("\n"); fs.writeFileSync(path.join(fullDir, filename), body); sections.push(`- [${key}](${root}/llms-full/${filename})`); }
  const full = `# GroupSum full content manifest\n\nThis generated index covers public pages and legacy articles. Canonical URLs remain the source of truth for full HTML content.\n\n${sections.join("\n")}\n`; fs.writeFileSync(path.join(OUT, "llms-full.txt"), full); fs.writeFileSync(path.join(OUT, "full-llms.txt"), full);
  fs.writeFileSync(path.join(OUT, "site-content.json"), JSON.stringify({ generatedAt: new Date().toISOString(), routes: inventory.map(({ route, url, title, description, type }) => ({ route, url, title, description, type })) }, null, 2));
}

function writeCleanFullManifest() {
  const fullDir = path.join(OUT, "llms-full");
  fs.mkdirSync(fullDir, { recursive: true });
  const sections = [];
  for (const [key, records] of [...sitemapGroups.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const filename = `${safeFile(key)}.md`;
    const lines = [`# ${key.replace(/-/g, " ")}`, ""];
    for (const record of records) {
      const date = record.modified || record.published;
      lines.push(`- [${record.title}](${record.url})${date ? ` — ${date}` : ""}`);
      if (record.description) lines.push(`  ${record.description}`);
    }
    lines.push("");
    fs.writeFileSync(path.join(fullDir, filename), lines.join("\n"));
    sections.push(`- [${key}](${root}/llms-full/${filename})`);
  }
  const full = `# GroupSum full content manifest\n\nThis generated index covers public pages and legacy articles. Canonical URLs remain the source of truth for full HTML content.\n\n${sections.join("\n")}\n`;
  fs.writeFileSync(path.join(OUT, "llms-full.txt"), full);
  fs.writeFileSync(path.join(OUT, "full-llms.txt"), full);
}

fs.mkdirSync(OUT, { recursive: true }); const shellHtml = fs.readFileSync(path.join(OUT, "index.html"), "utf8");
for (const record of inventory) { if (record.route === "/") continue; const outputDir = path.join(OUT, record.route); fs.mkdirSync(outputDir, { recursive: true }); fs.writeFileSync(path.join(outputDir, "index.html"), injectRenderedApp(injectHeadMeta(shellHtml, record), record)); }
fs.writeFileSync(path.join(OUT, "index.html"), injectRenderedApp(injectHeadMeta(shellHtml, pages[0]), pages[0]));
for (const [family, apiFamily] of [["product", "products"], ["portfolio", "portfolio"]]) {
  const modelDir = path.join("pkgs", "backend", "generated", "api-snapshots", family);
  for (const filename of fs.readdirSync(modelDir).filter((name) => name.endsWith(".json"))) {
    if (filename === "index.json") continue;
    const apiName = filename.replace(/\.json$/, "");
    const apiTarget = path.join(OUT, "api", "v1", apiFamily, apiName);
    fs.mkdirSync(path.dirname(apiTarget), { recursive: true });
    fs.writeFileSync(apiTarget, fs.readFileSync(path.join(modelDir, filename)));
  }
}
const repositoryMetricsTarget = path.join(OUT, "api", "v1", "repository-metrics");
fs.mkdirSync(path.dirname(repositoryMetricsTarget), { recursive: true });
fs.copyFileSync(
  path.join("pkgs", "backend", "generated", "api-snapshots", "repository-metrics", "index.json"),
  repositoryMetricsTarget,
);
writeDiscovery();
writeCleanFullManifest();
const catalogOut = path.join(OUT, "catalog");
fs.mkdirSync(catalogOut, { recursive: true });
fs.copyFileSync("catalog/generated/catalog.json", path.join(catalogOut, "catalog.json"));
fs.copyFileSync("catalog/generated/summary.json", path.join(catalogOut, "summary.json"));
fs.copyFileSync("catalog/schema/catalog.schema.json", path.join(catalogOut, "schema.json"));
fs.cpSync("catalog/generated/site", path.join(catalogOut, "site"), { recursive: true });
fs.cpSync("catalog/generated/product-evidence", path.join(catalogOut, "product-evidence"), { recursive: true });
fs.copyFileSync("catalog/schema/site-catalog.schema.json", path.join(catalogOut, "site", "schema.json"));
