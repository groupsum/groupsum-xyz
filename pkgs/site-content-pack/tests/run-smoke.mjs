import { articles, siteContent } from "../dist/index.js";

if (!siteContent.product?.canonicalUrl) throw new Error("canonicalUrl missing");
if (!Array.isArray(siteContent.pages) || siteContent.pages.length < 1) throw new Error("pages missing");
if (!siteContent.pages[0].schema?.length) throw new Error("structured data intents missing");
const articlePaths = new Set();
for (const article of articles) {
  if (!article.legacyPath?.startsWith("/") || !article.legacyPath.endsWith("/")) {
    throw new Error(`invalid article legacyPath: ${article.legacyPath}`);
  }
  if (articlePaths.has(article.legacyPath)) {
    throw new Error(`duplicate article legacyPath: ${article.legacyPath}`);
  }
  articlePaths.add(article.legacyPath);
}
console.log(`content-pack ok: ${siteContent.product.name} (${siteContent.pages.length} pages, ${articles.length} articles)`);
