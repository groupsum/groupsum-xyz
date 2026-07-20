import fs from "node:fs";
import path from "node:path";

const root = "https://groupsum.xyz";
const required = ["robots.txt", "sitemap.xml", "sitemap.xsl", "llms.txt", "llms-full.txt", "full-llms.txt", "social/groupsum-default.svg"];
const fail = (message) => { console.error(`discovery validation failed: ${message}`); process.exitCode = 1; };
for (const file of required) if (!fs.existsSync(path.join("dist", file))) fail(`missing dist/${file}`);
const robots = fs.readFileSync("dist/robots.txt", "utf8");
if (!robots.includes(`Sitemap: ${root}/sitemap.xml`)) fail("robots.txt does not advertise the root sitemap");
const index = fs.readFileSync("dist/sitemap.xml", "utf8");
if (!index.includes("<sitemapindex") || !index.includes("sitemaps/")) fail("root sitemap is not a nested sitemap index");
const childFiles = fs.readdirSync(path.join("dist", "sitemaps")).filter((file) => file.endsWith(".xml"));
if (!childFiles.length) fail("no child sitemaps were generated");
for (const file of childFiles) {
  const xml = fs.readFileSync(path.join("dist", "sitemaps", file), "utf8");
  if (!xml.includes("<urlset") || !xml.includes("<url><loc>https://groupsum.xyz/")) fail(`invalid child sitemap ${file}`);
  if ((xml.match(/<url>/g) || []).length > 50000) fail(`child sitemap ${file} exceeds the URL limit`);
}
const home = fs.readFileSync("dist/index.html", "utf8");
for (const marker of ["og:title", "og:description", "og:image", "og:image:width", "twitter:image:alt", "canonical"]) if (!home.includes(marker)) fail(`home metadata missing ${marker}`);
const article = fs.readdirSync("dist").find((entry) => /^20\d\d$/.test(entry));
if (article) {
  const years = fs.readdirSync(path.join("dist", article));
  const month = years.find((entry) => /^\d\d$/.test(entry));
  const day = month && fs.readdirSync(path.join("dist", article, month)).find((entry) => /^\d\d$/.test(entry));
  if (day) {
    const dirs = fs.readdirSync(path.join("dist", article, month, day));
    const slug = dirs.find((entry) => fs.existsSync(path.join("dist", article, month, day, entry, "index.html")));
    if (slug) {
      const html = fs.readFileSync(path.join("dist", article, month, day, slug, "index.html"), "utf8");
      for (const marker of ["og:type\" content=\"article", "article:published_time", "og:image:alt"]) if (!html.includes(marker)) fail(`legacy article metadata missing ${marker}`);
    }
  }
}
if (!process.exitCode) console.log(`discovery ok: ${childFiles.length} child sitemaps, ${fs.readFileSync("dist/llms-full.txt", "utf8").split("\n").length} full-index lines`);
