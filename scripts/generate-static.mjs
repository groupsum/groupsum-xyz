import fs from "node:fs";
import path from "node:path";
import { buildLlmsTxt, buildRobotsTxt, buildSitemap, compileLanderSite } from "@mdwrk/lander-core";
import siteContent, { articles } from "../packages/site-content-pack/dist/index.js";

const site = compileLanderSite(siteContent);
const normalizePath = (value) => {
  const pathname = value === "" ? "/" : String(value).split(/[?#]/)[0] ?? "/";
  if (pathname === "/" || pathname === "") return "/";
  return `/${pathname.replace(/^\/+|\/+$/g, "")}/`;
};
const articleUrls = articles.map((article) => ({
  loc: `${siteContent.product.canonicalUrl.replace(/\/+$/, "")}${normalizePath(article.legacyPath)}`
}));
const sitemapEntries = [...buildSitemap(site), ...articleUrls];
const root = siteContent.product.canonicalUrl.replace(/\/+$/, "");
const defaultEmbedImage = `${root}/assets/groupsum-wordmark.png`;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function stripHtml(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&hellip;/g, "...")
    .replace(/&#8217;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function pageMetaHtml({ title, description, url, image, type = "website" }) {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeUrl = escapeHtml(url);
  const safeImage = escapeHtml(image || defaultEmbedImage);

  return [
    `<title>${safeTitle}</title>`,
    `<meta name="description" content="${safeDescription}" />`,
    `<link rel="canonical" href="${safeUrl}" />`,
    `<meta property="og:type" content="${escapeHtml(type)}" />`,
    `<meta property="og:site_name" content="GroupSum" />`,
    `<meta property="og:title" content="${safeTitle}" />`,
    `<meta property="og:description" content="${safeDescription}" />`,
    `<meta property="og:url" content="${safeUrl}" />`,
    `<meta property="og:image" content="${safeImage}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${safeTitle}" />`,
    `<meta name="twitter:description" content="${safeDescription}" />`,
    `<meta name="twitter:image" content="${safeImage}" />`
  ].join("\n    ");
}

function injectHeadMeta(html, metaHtml) {
  return html
    .replace(/<title>.*?<\/title>/i, "")
    .replace(/\s*<meta name="description"[^>]*>\s*/gi, "")
    .replace(/\s*<link rel="canonical"[^>]*>\s*/gi, "")
    .replace(/\s*<meta property="og:[^"]+"[^>]*>\s*/gi, "")
    .replace(/\s*<meta name="twitter:[^"]+"[^>]*>\s*/gi, "")
    .replace("</head>", `    ${metaHtml}\n  </head>`);
}

fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync("dist/robots.txt", buildRobotsTxt(site));
fs.writeFileSync("dist/llms.txt", buildLlmsTxt(site));
fs.writeFileSync("dist/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries.map((entry) => `  <url><loc>${entry.loc}</loc></url>`).join("\n")}\n</urlset>\n`);
fs.writeFileSync("dist/site-content.json", JSON.stringify(siteContent, null, 2));

const shellHtml = fs.readFileSync("dist/index.html", "utf8");
for (const article of articles) {
  const articlePath = normalizePath(article.legacyPath);
  const outputDir = path.join("dist", articlePath);
  fs.mkdirSync(outputDir, { recursive: true });
  const title = stripHtml(article.title);
  const description = stripHtml(article.excerptHtml || article.contentHtml).slice(0, 180);
  const url = article.canonicalUrl || `${root}${articlePath}`;
  const image = article.featuredImage || defaultEmbedImage;
  fs.writeFileSync(
    path.join(outputDir, "index.html"),
    injectHeadMeta(shellHtml, pageMetaHtml({ title, description, url, image, type: "article" }))
  );
}
