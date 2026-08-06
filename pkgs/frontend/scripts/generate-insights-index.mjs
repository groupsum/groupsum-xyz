import fs from "node:fs";
import { importedArticles } from "../../site-content-pack/dist/articles.generated.js";

const featuredOutputPath = new URL("../src/data/posts.featured.generated.ts", import.meta.url);
const publicIndexPath = new URL("../public/insights-index.json", import.meta.url);
const publicContentDirectory = new URL("../public/insights-content/", import.meta.url);

const decodeEntities = (value) =>
  value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;|&apos;/gi, "'")
    .replace(/&hellip;/gi, "...")
    .replace(/&mdash;/gi, "—")
    .replace(/&ndash;/gi, "–")
    .replace(/&#(\d+);/g, (_match, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_match, code) => String.fromCodePoint(Number.parseInt(code, 16)));

const stripHtml = (value) =>
  decodeEntities(
    value
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();

const articles = importedArticles.map((article) => ({
  slug: article.slug,
  legacyPath: article.legacyPath,
  canonicalUrl: article.canonicalUrl,
  title: stripHtml(article.title),
  excerpt: stripHtml(article.excerptHtml || article.contentHtml).slice(0, 240),
  date: article.date,
  modified: article.modified,
  categories: article.categories,
  tags: article.tags,
  featuredImage: article.featuredImage,
  authorName: article.authorName,
  contentPath: `/insights-content/${article.legacyPath.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()}.json`,
}));

fs.rmSync(publicContentDirectory, { recursive: true, force: true });
fs.mkdirSync(publicContentDirectory, { recursive: true });
for (const [index, article] of articles.entries()) {
  const imported = importedArticles[index];
  fs.writeFileSync(
    new URL(`../public${article.contentPath}`, import.meta.url),
    JSON.stringify({ ...article, contentHtml: imported.contentHtml }),
    "utf8",
  );
}
fs.writeFileSync(publicIndexPath, JSON.stringify(articles), "utf8");
fs.writeFileSync(
  featuredOutputPath,
  `import type { BlogPost } from "../types";\n\nexport const featuredBlogPosts: BlogPost[] = ${JSON.stringify(
    articles.slice(0, 6).map((article) => ({
      slug: article.slug,
      legacyPath: article.legacyPath,
      canonicalUrl: article.canonicalUrl,
      title: article.title,
      date: article.date,
      modified: article.modified,
      author: article.authorName || "Groupsum",
      excerpt: article.excerpt,
      content: "",
      tags: [...article.categories, ...article.tags],
      category: article.categories[0] || "Legacy archive",
      featuredImage: article.featuredImage,
      isLegacy: true,
    })),
    null,
    2,
  )};\n`,
  "utf8",
);
console.log(`Generated compact Insights index for ${articles.length} legacy articles.`);
