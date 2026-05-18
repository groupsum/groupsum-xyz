import fs from "node:fs";
import { buildLlmsTxt, buildRobotsTxt, buildSitemap, compileLanderSite } from "@mdwrk/lander-core";
import siteContent from "../packages/site-content-pack/dist/index.js";

const site = compileLanderSite(siteContent);
fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync("dist/robots.txt", buildRobotsTxt(site));
fs.writeFileSync("dist/llms.txt", buildLlmsTxt(site));
fs.writeFileSync("dist/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${buildSitemap(site).map((entry) => `  <url><loc>${entry.loc}</loc></url>`).join("\n")}\n</urlset>\n`);
fs.writeFileSync("dist/site-content.json", JSON.stringify(siteContent, null, 2));
