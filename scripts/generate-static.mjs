import fs from "node:fs";
import path from "node:path";
import { articles } from "../packages/site-content-pack/dist/index.js";
import { jsonLdHtml } from "./structured-data.mjs";

const OUT = "dist";
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
const trim = (value, size = 180) => { const text = stripHtml(value); return text.length > size ? `${text.slice(0, size - 1).trimEnd()}ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¦` : text; };
const safeFile = (value) => String(value).replace(/[^a-z0-9_-]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
const defaultImage = { url: `${root}/social/groupsum-default.svg`, type: "image/svg+xml", width: "1200", height: "630", alt: "GroupSum structured software and clear decisions" };

const pages = [
  ["/", "GroupSum | Portfolio, Solutions, and Services", "GroupSum builds structured software, platforms, and services for teams that need clear decisions.", "website"],
  ["/products/", "Products | GroupSum", "Explore GroupSum, Tigrbl, and Swarmauri products, suites, packages, and specifications.", "website"],
  ["/products/groupsum/", "GroupSum products", "The GroupSum product family for structured collaboration, durable knowledge, and clear decisions.", "website"],
  ["/products/tigrbl/", "Tigrbl products", "Tigrbl packages and suites for durable data contracts, APIs, and storage-aware applications.", "website"],
  ["/products/swarmauri/", "Swarmauri products", "Swarmauri packages and suites for composable AI systems, agents, and evaluators.", "website"],
  ["/portfolio/", "Portfolio | GroupSum", "A browsable portfolio of Groupsum, Tigrbl, and Swarmauri projects, packages, suites, and specifications.", "website"],
  ["/solutions/", "Solutions | GroupSum", "Evidence-led solution paths for teams moving from ambiguity to an operable technical system.", "website"],
  ["/services/", "Services | GroupSum", "Focused services for architecture, product delivery, platform hardening, and technical decision support.", "website"],
  ["/insights/", "Insights | GroupSum", "Legacy articles and current field notes on software, systems, AI, and technical practice.", "website"],
  ["/about/", "About | GroupSum", "How GroupSum approaches software, product systems, evidence, and durable delivery.", "website"],
  ["/contact/", "Contact | GroupSum", "Start a conversation about a product, platform, solution, or service engagement.", "website"],
  ["/privacy-policy/", "Privacy policy | GroupSum", "GroupSum privacy policy.", "website"],
  ["/terms-of-service/", "Terms of service | GroupSum", "GroupSum terms of service.", "website"]
].map(([route, title, description, type]) => ({ route, title, description, type, url: absolute(route) }));
const slugsFrom = (file) => {
  const source = fs.readFileSync(file, "utf8");
  return [...source.matchAll(/slug:\s*["']([^"']+)["']/g)].map((match) => match[1]);
};
const detailRecords = [
  ...slugsFrom("src/data/portfolio.ts").flatMap((slug) => ["", "projects/", "packages/", "specifications/"].map((prefix) => ({ route: `/portfolio/${prefix}${slug}/`, url: absolute(`/portfolio/${prefix}${slug}/`), title: `${slug.replace(/[-_]/g, " ")} | GroupSum portfolio`, description: `Portfolio record for ${slug.replace(/[-_]/g, " ")}.`, type: "website" }))),
  ...slugsFrom("src/data/solutions.ts").map((slug) => ({ route: `/solutions/${slug}/`, url: absolute(`/solutions/${slug}/`), title: `${slug.replace(/[-_]/g, " ")} solution | GroupSum`, description: `Solution path for ${slug.replace(/[-_]/g, " ")}.`, type: "website" })),
  ...slugsFrom("src/data/services.ts").map((slug) => ({ route: `/services/${slug}/`, url: absolute(`/services/${slug}/`), title: `${slug.replace(/[-_]/g, " ")} service | GroupSum`, description: `Service detail for ${slug.replace(/[-_]/g, " ")}.`, type: "website" })),
  ...slugsFrom("src/data/entities.ts").filter((slug) => !["groupsum", "tigrbl", "swarmauri"].includes(slug)).map((slug) => ({ route: `/products/${slug}/`, url: absolute(`/products/${slug}/`), title: `${slug.replace(/[-_]/g, " ")} | GroupSum products`, description: `Product and package record for ${slug.replace(/[-_]/g, " ")}.`, type: "website" }))
];const articleRecords = articles.map((article) => { const route = normalizePath(article.legacyPath); return { route, url: article.canonicalUrl || absolute(route), title: trim(article.title, 160), description: trim(article.excerptHtml || article.contentHtml, 180) || "Legacy GroupSum article.", type: "article", image: article.featuredImage ? { ...defaultImage, url: article.featuredImage } : defaultImage, published: article.date, modified: article.modified, author: article.authorName, section: article.categories?.[0], tags: article.tags || [] }; });
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
function urlset(records) { return `<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="${root}/sitemap.xsl"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${records.map((record) => { const lastmod = record.modified || record.published; return `  <url><loc>${escapeXml(record.url)}</loc>${lastmod ? `<lastmod>${escapeXml(lastmod)}</lastmod>` : ""}</url>`; }).join("\n")}\n</urlset>\n`; }

function writeDiscovery() {
  const sitemapDir = path.join(OUT, "sitemaps"); fs.mkdirSync(sitemapDir, { recursive: true }); const sitemapRefs = [];
  for (const [key, records] of [...sitemapGroups.entries()].sort(([a], [b]) => a.localeCompare(b))) { const rel = `sitemaps/${safeFile(key)}.xml`; const target = path.join(OUT, rel); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, urlset(records)); sitemapRefs.push(`${root}/${rel}`); }
  const index = `<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="${root}/sitemap.xsl"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapRefs.map((loc) => `  <sitemap><loc>${escapeXml(loc)}</loc></sitemap>`).join("\n")}\n</sitemapindex>\n`; fs.writeFileSync(path.join(OUT, "sitemap.xml"), index);
  fs.writeFileSync(path.join(OUT, "sitemap.xsl"), `<?xml version="1.0" encoding="UTF-8"?><xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"><xsl:output method="html" encoding="UTF-8"/><xsl:template match="/"><html lang="en"><head><meta charset="utf-8"/><title>GroupSum sitemap</title><style>body{font:16px system-ui,sans-serif;color:#17211e;background:#faf8f2;margin:2rem}main{max-width:72rem;margin:auto}table{width:100%;border-collapse:collapse;background:#fff}th,td{text-align:left;padding:.7rem;border-bottom:1px solid #d9ded8}a{color:#176b5b}</style></head><body><main><h1>GroupSum sitemap</h1><p>This index lists public, crawlable GroupSum pages and legacy articles.</p><table><thead><tr><th>URL</th><th>Last modified</th></tr></thead><tbody><xsl:for-each select="s:sitemapindex/s:sitemap|s:urlset/s:url"><tr><td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td><td><xsl:value-of select="s:lastmod"/></td></tr></xsl:for-each></tbody></table></main></body></html></xsl:template></xsl:stylesheet>`);
  fs.writeFileSync(path.join(OUT, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${root}/sitemap.xml\n`);
  const llms = `# GroupSum\n\n> GroupSum builds structured software, platforms, and services for teams that need clear decisions.\n\n## Start here\n\n- [Home](${root}/)\n- [Products](${root}/products/)\n- [Portfolio](${root}/portfolio/)\n- [Solutions](${root}/solutions/)\n- [Services](${root}/services/)\n- [Insights](${root}/insights/)\n- [About](${root}/about/)\n- [Contact](${root}/contact/)\n\n## Machine-readable indexes\n\n- [Full content manifest](${root}/llms-full.txt)\n- [Legacy alias](${root}/full-llms.txt)\n- [XML sitemap](${root}/sitemap.xml)\n`; fs.writeFileSync(path.join(OUT, "llms.txt"), llms);
  const fullDir = path.join(OUT, "llms-full"); fs.mkdirSync(fullDir, { recursive: true }); const sections = [];
  for (const [key, records] of [...sitemapGroups.entries()].sort(([a], [b]) => a.localeCompare(b))) { const filename = `${safeFile(key)}.md`; const body = [`# ${key.replace(/-/g, " ")}`, "", ...records.map((record) => `- [${record.title}](${record.url})${record.modified || record.published ? ` ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ${record.modified || record.published}` : ""}${record.description ? `\n  ${record.description}` : ""}`), ""].join("\n"); fs.writeFileSync(path.join(fullDir, filename), body); sections.push(`- [${key}](${root}/llms-full/${filename})`); }
  const full = `# GroupSum full content manifest\n\nThis generated index covers public pages and legacy articles. Canonical URLs remain the source of truth for full HTML content.\n\n${sections.join("\n")}\n`; fs.writeFileSync(path.join(OUT, "llms-full.txt"), full); fs.writeFileSync(path.join(OUT, "full-llms.txt"), full);
  fs.writeFileSync(path.join(OUT, "site-content.json"), JSON.stringify({ generatedAt: new Date().toISOString(), routes: inventory.map(({ route, url, title, description, type }) => ({ route, url, title, description, type })) }, null, 2));
}

fs.mkdirSync(OUT, { recursive: true }); const shellHtml = fs.readFileSync(path.join(OUT, "index.html"), "utf8");
for (const record of inventory) { if (record.route === "/") continue; const outputDir = path.join(OUT, record.route); fs.mkdirSync(outputDir, { recursive: true }); fs.writeFileSync(path.join(outputDir, "index.html"), injectHeadMeta(shellHtml, record)); }
fs.writeFileSync(path.join(OUT, "index.html"), injectHeadMeta(shellHtml, pages[0])); writeDiscovery();
