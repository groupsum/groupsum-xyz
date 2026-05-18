import fs from "node:fs";
import path from "node:path";

const sourceBaseUrl = (process.env.WORDPRESS_BASE_URL ?? "https://groupsum.xyz").replace(/\/+$/, "");
const outputPath = path.resolve("packages/site-content-pack/src/articles.generated.ts");
const perPage = Number(process.env.WORDPRESS_PER_PAGE ?? "100");

function authHeaders() {
  if (process.env.WORDPRESS_AUTH_HEADER) {
    return { Authorization: process.env.WORDPRESS_AUTH_HEADER };
  }
  if (process.env.WORDPRESS_USERNAME && process.env.WORDPRESS_PASSWORD) {
    const token = Buffer.from(`${process.env.WORDPRESS_USERNAME}:${process.env.WORDPRESS_PASSWORD}`).toString("base64");
    return { Authorization: `Basic ${token}` };
  }
  return {};
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      ...authHeaders()
    }
  });
  if (!response.ok) {
    throw new Error(`WordPress request failed: ${response.status} ${response.statusText} ${url}`);
  }
  return {
    data: await response.json(),
    totalPages: Number(response.headers.get("x-wp-totalpages") ?? "1")
  };
}

function rendered(value) {
  return typeof value?.rendered === "string" ? value.rendered : "";
}

function legacyPathFromLink(link, fallbackSlug) {
  if (typeof link === "string" && link) {
    const parsed = new URL(link);
    const pathname = parsed.pathname.replace(/\/+$/, "");
    return pathname === "" ? `/${fallbackSlug}/` : `${pathname}/`;
  }
  return `/${fallbackSlug.replace(/^\/+|\/+$/g, "")}/`;
}

function termNames(post, taxonomy) {
  const termGroups = post?._embedded?.["wp:term"];
  if (!Array.isArray(termGroups)) return [];
  return termGroups
    .flat()
    .filter((term) => term?.taxonomy === taxonomy && typeof term.name === "string")
    .map((term) => term.name);
}

function featuredImage(post) {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];
  return typeof media?.source_url === "string" ? media.source_url : undefined;
}

function author(post) {
  const embeddedAuthor = post?._embedded?.author?.[0];
  return {
    authorId: Number(post.author ?? embeddedAuthor?.id ?? 0),
    authorName: typeof embeddedAuthor?.name === "string" ? embeddedAuthor.name : "",
    authorSlug: typeof embeddedAuthor?.slug === "string" ? embeddedAuthor.slug : "",
    authorLink: typeof embeddedAuthor?.link === "string" ? embeddedAuthor.link : ""
  };
}

function toArticle(post) {
  const slug = String(post.slug ?? post.id);
  const legacyPath = legacyPathFromLink(post.link, slug);
  return {
    wpId: Number(post.id),
    slug,
    legacyPath,
    canonicalUrl: `${sourceBaseUrl}${legacyPath}`,
    title: rendered(post.title),
    excerptHtml: rendered(post.excerpt),
    contentHtml: rendered(post.content),
    date: String(post.date_gmt || post.date || ""),
    modified: String(post.modified_gmt || post.modified || ""),
    categories: termNames(post, "category"),
    tags: termNames(post, "post_tag"),
    featuredImage: featuredImage(post),
    ...author(post)
  };
}

function writeArticles(articles) {
  const content = `export type ImportedArticle = {
  wpId: number;
  slug: string;
  legacyPath: string;
  canonicalUrl: string;
  title: string;
  excerptHtml: string;
  contentHtml: string;
  date: string;
  modified: string;
  categories: string[];
  tags: string[];
  featuredImage?: string;
  authorId: number;
  authorName: string;
  authorSlug: string;
  authorLink: string;
};

export const importedArticles: ImportedArticle[] = ${JSON.stringify(articles, null, 2)};

export default importedArticles;
`;
  fs.writeFileSync(outputPath, content);
}

const firstUrl = `${sourceBaseUrl}/wp-json/wp/v2/posts?status=publish&per_page=${perPage}&page=1&_embed=1`;
const first = await fetchJson(firstUrl);
const posts = [...first.data];

for (let page = 2; page <= first.totalPages; page += 1) {
  const url = `${sourceBaseUrl}/wp-json/wp/v2/posts?status=publish&per_page=${perPage}&page=${page}&_embed=1`;
  const pageResult = await fetchJson(url);
  posts.push(...pageResult.data);
}

const articles = posts.map(toArticle).sort((a, b) => a.legacyPath.localeCompare(b.legacyPath));
const seen = new Map();
for (const article of articles) {
  const existing = seen.get(article.legacyPath);
  if (existing) {
    throw new Error(`Duplicate legacy path ${article.legacyPath} for WordPress IDs ${existing} and ${article.wpId}`);
  }
  seen.set(article.legacyPath, article.wpId);
}

writeArticles(articles);
console.log(`Imported ${articles.length} WordPress articles into ${path.relative(process.cwd(), outputPath)}`);
