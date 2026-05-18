import { useEffect, useState } from "react";
import { LanderPage } from "@mdwrk/lander-react";
import siteContent from "../packages/site-content-pack/src/index";
import type { ImportedArticle } from "../packages/site-content-pack/src/articles.generated";

const root = siteContent.product.canonicalUrl.replace(/\/+$/, "");
const normalizePath = (value: string) => {
  const path = value === "" ? "/" : value.split(/[?#]/)[0] ?? "/";
  if (path === "/" || path === "") return "/";
  return `/${path.replace(/^\/+|\/+$/g, "")}/`;
};
function wordCount(value: string) { return value.trim().split(/\s+/).filter(Boolean).length; }
function titleCase(value: string) { return value.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()); }
function breadcrumbs(slug: string, h1: string) {
  const segments = normalizePath(slug).split("/").filter(Boolean);
  const items = [{ label: siteContent.product.name, href: "/" }];
  let href = "";
  for (const segment of segments) {
    href = `${href}/${segment}`;
    items.push({ label: titleCase(segment), href: `${href}/` });
  }
  if (items.length > 1) items[items.length - 1] = { label: h1, href: normalizePath(slug) };
  return items;
}
function compilePage(page: (typeof siteContent.pages)[number]) {
  const path = normalizePath(page.slug);
  return { ...page, path, canonicalUrl: `${root}${path}`, breadcrumbs: breadcrumbs(page.slug, page.h1), internalLinks: [], wordCount: wordCount([page.title, page.description, page.intro, JSON.stringify(page.sections)].join(" ")), componentIntents: [], schemaIntents: [] };
}
function currentPage() {
  const browserPath = typeof window === "undefined" ? "/" : window.location.pathname;
  const path = normalizePath(browserPath);
  return compilePage(siteContent.pages.find((candidate) => normalizePath(candidate.slug) === path) ?? siteContent.pages[0]);
}
function currentPath() {
  const browserPath = typeof window === "undefined" ? "/" : window.location.pathname;
  return normalizePath(browserPath);
}
function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
function escapeAttribute(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}
function relativeSiteUrl(value: string) {
  try {
    const site = new URL(root);
    const url = new URL(value, site);
    if (url.origin === site.origin) return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return value;
  }
  return value;
}
function htmlWithRelativeLinks(value: string) {
  return value.replace(/\s(href)=["']([^"']+)["']/gi, (_match, attr: string, url: string) => {
    return ` ${attr}="${escapeAttribute(relativeSiteUrl(url))}"`;
  });
}
function formatDate(value: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "UTC" }).format(new Date(value));
}
function ArticlePage({ article }: { article: ImportedArticle }) {
  return (
    <article className="article-page">
      <nav className="article-breadcrumb" aria-label="Breadcrumb"><a href="/">GroupSum</a><span>/</span><span>{article.title}</span></nav>
      <header className="article-hero">
        <p className="article-kicker">{formatDate(article.date)}</p>
        <h1 dangerouslySetInnerHTML={{ __html: article.title }} />
        {article.excerptHtml ? <div className="article-excerpt" dangerouslySetInnerHTML={{ __html: htmlWithRelativeLinks(article.excerptHtml) }} /> : null}
        <p className="article-meta">
          {article.authorName ? <>By {article.authorLink ? <a href={relativeSiteUrl(article.authorLink)}>{article.authorName}</a> : article.authorName} / </> : null}
          {[...article.categories, ...article.tags].slice(0, 8).join(" / ")}
        </p>
      </header>
      {article.featuredImage ? <img className="article-image" src={article.featuredImage} alt="" /> : null}
      <section className="article-content" dangerouslySetInnerHTML={{ __html: htmlWithRelativeLinks(article.contentHtml) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: stripHtml(article.title),
            datePublished: article.date,
            dateModified: article.modified,
            mainEntityOfPage: article.canonicalUrl,
            image: article.featuredImage ? [article.featuredImage] : undefined
          })
        }}
      />
    </article>
  );
}
export function App() {
  const path = currentPath();
  const pageMatch = siteContent.pages.find((candidate) => normalizePath(candidate.slug) === path);
  const [article, setArticle] = useState<ImportedArticle | null>(null);
  const [articleLoaded, setArticleLoaded] = useState(false);

  useEffect(() => {
    if (pageMatch) return;
    let active = true;
    import("../packages/site-content-pack/src/articles.generated").then((module) => {
      if (!active) return;
      setArticle(module.importedArticles.find((candidate) => normalizePath(candidate.legacyPath) === path) ?? null);
      setArticleLoaded(true);
    });
    return () => {
      active = false;
    };
  }, [pageMatch, path]);

  if (article) {
    return (
      <div className="site-shell" style={{ ["--accent" as string]: "#246BFE" }}>
        <header className="site-header">
          <a className="site-brand" href="/" aria-label={`${siteContent.product.name} home`}>
            <span className="site-brand-mark" aria-hidden="true">GS</span>
            <span><strong>{siteContent.product.name}</strong><small>{siteContent.product.tagline}</small></span>
          </a>
          <nav aria-label="Primary navigation">{siteContent.nav?.primary.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</nav>
        </header>
        <main><ArticlePage article={article} /></main>
        <footer><p>{siteContent.footer?.note}</p></footer>
      </div>
    );
  }
  if (!pageMatch && !articleLoaded) {
    return (
      <div className="site-shell" style={{ ["--accent" as string]: "#246BFE" }}>
        <header className="site-header">
          <a className="site-brand" href="/" aria-label={`${siteContent.product.name} home`}>
            <span className="site-brand-mark" aria-hidden="true">GS</span>
            <span><strong>{siteContent.product.name}</strong><small>{siteContent.product.tagline}</small></span>
          </a>
          <nav aria-label="Primary navigation">{siteContent.nav?.primary.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</nav>
        </header>
        <main><p className="article-kicker">Loading article...</p></main>
        <footer><p>{siteContent.footer?.note}</p></footer>
      </div>
    );
  }
  const page = currentPage();
  const compiledSite = { ...siteContent, pages: [page], pageByPath: new Map([[page.path, page]]), diagnostics: [] };
  return (
    <div className="site-shell" style={{ ["--accent" as string]: "#246BFE" }}>
      <header className="site-header">
        <a className="site-brand" href="/" aria-label={`${siteContent.product.name} home`}>
          <span className="site-brand-mark" aria-hidden="true">GS</span>
          <span><strong>{siteContent.product.name}</strong><small>{siteContent.product.tagline}</small></span>
        </a>
        <nav aria-label="Primary navigation">{siteContent.nav?.primary.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</nav>
      </header>
      <main><LanderPage site={compiledSite as any} page={page as any} /></main>
      <footer><p>{siteContent.footer?.note}</p></footer>
    </div>
  );
}
