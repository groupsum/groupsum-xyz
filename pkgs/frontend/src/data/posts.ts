import type { BlogPost } from "../types";
import { getInsightContent, getInsightsIndex } from "../api/content";

type LegacyPostIndexEntry = {
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
  contentPath: string;
};

const decodeEntities = (value: string) =>
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
    .replace(/&#(\d+);/g, (_match, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_match, code: string) => String.fromCodePoint(Number.parseInt(code, 16)));

const stripHtml = (value: string) =>
  decodeEntities(
    value
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();

const siteRelativeUrl = (value: string) => {
  try {
    const url = new URL(value, "https://groupsum.xyz");
    return url.origin === "https://groupsum.xyz"
      ? `${url.pathname}${url.search}${url.hash}`
      : url.toString();
  } catch {
    return value;
  }
};

const htmlToMarkdown = (html: string) => {
  const codeBlocks: string[] = [];
  let value = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<pre\b[^>]*>([\s\S]*?)<\/pre>/gi, (_match, body: string) => {
      const code = stripHtml(body.replace(/<br\s*\/?>/gi, "\n"));
      const index = codeBlocks.push(`\n\`\`\`\n${code}\n\`\`\`\n`) - 1;
      return `\n@@LEGACY_CODE_${index}@@\n`;
    })
    .replace(/<h[12]\b[^>]*>([\s\S]*?)<\/h[12]>/gi, (_match, body: string) => `\n## ${stripHtml(body)}\n`)
    .replace(/<h3\b[^>]*>([\s\S]*?)<\/h3>/gi, (_match, body: string) => `\n### ${stripHtml(body)}\n`)
    .replace(/<h[4-6]\b[^>]*>([\s\S]*?)<\/h[4-6]>/gi, (_match, body: string) => `\n#### ${stripHtml(body)}\n`)
    .replace(/<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/gi, (_match, body: string) => `\n> ${stripHtml(body)}\n`)
    .replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (_match, body: string) => `\n- ${stripHtml(body)}`)
    .replace(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_match, href: string, body: string) =>
      `[${stripHtml(body) || href}](${siteRelativeUrl(decodeEntities(href))})`,
    )
    .replace(/<img\b[^>]*src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi, (_match, src: string, alt: string) =>
      `\n[Image${alt ? `: ${decodeEntities(alt)}` : ""}](${siteRelativeUrl(decodeEntities(src))})\n`,
    )
    .replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_match, _tag: string, body: string) => `**${stripHtml(body)}**`)
    .replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_match, _tag: string, body: string) => `*${stripHtml(body)}*`)
    .replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, (_match, body: string) => `\`${stripHtml(body)}\``)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|section|article|ul|ol|table|tr|figure)>/gi, "\n")
    .replace(/<(p|div|section|article|ul|ol|table|tbody|thead|tr|figure)\b[^>]*>/gi, "\n")
    .replace(/<\/?(td|th)\b[^>]*>/gi, " | ")
    .replace(/<[^>]+>/g, " ");

  value = decodeEntities(value);
  codeBlocks.forEach((block, index) => {
    value = value.replace(`@@LEGACY_CODE_${index}@@`, block);
  });

  return value
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const metadataPost = (article: LegacyPostIndexEntry): BlogPost => ({
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
});

let indexPromise: Promise<LegacyPostIndexEntry[]> | undefined;

async function loadIndex(): Promise<LegacyPostIndexEntry[]> {
  indexPromise ||= getInsightsIndex<LegacyPostIndexEntry[]>();
  return indexPromise;
}

export async function loadBlogPosts(): Promise<BlogPost[]> {
  const index = await loadIndex();
  return index.map(metadataPost).sort((left, right) => right.date.localeCompare(left.date));
}

export async function loadBlogPost(legacyPath: string): Promise<BlogPost | null> {
  const index = await loadIndex();
  const metadata = index.find((candidate) => candidate.legacyPath === legacyPath);
  if (!metadata) return null;
  const article = await getInsightContent<LegacyPostIndexEntry & { contentHtml: string }>(metadata.contentPath);

  return {
    slug: article.slug,
    legacyPath: article.legacyPath,
    canonicalUrl: article.canonicalUrl,
    title: stripHtml(article.title),
    date: article.date,
    modified: article.modified,
    author: article.authorName || "Groupsum",
    excerpt: article.excerpt || stripHtml(article.contentHtml).slice(0, 320),
    content: htmlToMarkdown(article.contentHtml),
    tags: [...article.categories, ...article.tags],
    category: article.categories[0] || "Legacy archive",
    featuredImage: article.featuredImage,
    isLegacy: true,
  };
}
