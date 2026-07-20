import fs from "node:fs";
import { importedArticles } from "../packages/site-content-pack/dist/articles.generated.js";

const outputPath = new URL("../src/data/posts.generated.ts", import.meta.url);

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
}));

const source = `export type LegacyPostIndexEntry = {
  slug: string;
  legacyPath: string;
  canonicalUrl: string;
  title: string;
  excerpt: string;
  date: string;
  modified: string;
  categories: string[];
  tags: string[];
  featuredImage?: string;
  authorName: string;
};

export const legacyPostIndex: LegacyPostIndexEntry[] = ${JSON.stringify(articles, null, 2)};
`;

fs.writeFileSync(outputPath, source, "utf8");
console.log(`Generated compact Insights index for ${articles.length} legacy articles.`);
