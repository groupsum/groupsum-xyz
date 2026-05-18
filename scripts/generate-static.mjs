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
  fs.writeFileSync(path.join(outputDir, "index.html"), shellHtml);
}
