import { useEffect, useState } from "react";
import siteContent from "../packages/site-content-pack/src/index";
import type { ImportedArticle } from "../packages/site-content-pack/src/articles.generated";

const root = siteContent.product.canonicalUrl.replace(/\/+$/, "");
const defaultEmbedImage = `${root}/assets/groupsum-wordmark.png`;

const normalizePath = (value: string) => {
  const path = value === "" ? "/" : value.split(/[?#]/)[0] ?? "/";
  if (path === "/" || path === "") return "/";
  return `/${path.replace(/^\/+|\/+$/g, "")}/`;
};

function stripHtml(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&hellip;/g, "...")
    .replace(/&#8217;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
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
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(value));
}

function excerptText(article: ImportedArticle) {
  const value = stripHtml(article.excerptHtml || article.contentHtml);
  return value.length > 180 ? `${value.slice(0, 177).trim()}...` : value;
}

const homeArticles = [
  {
    date: "2023-12-21T23:57:55",
    title: "A Benchmark for Sparse Logistic Regression",
    href: "/2023/12/21/a-benchmark-for-sparse-logistic-regression/",
    excerpt: "A compact note on transparent, reproducible optimization benchmarks for sparse logistic regression."
  },
  {
    date: "2023-12-21T23:07:17",
    title: "A Beginner-friendly Offline Chess Game for Console",
    href: "/2023/12/21/a-beginner-friendly-offline-chess-game-for-console/",
    excerpt: "A short product-style review of a console chess project, its installation path, and its user experience."
  },
  {
    date: "2023-12-21T20:47:56",
    title: "A 3D Focal Mechanism Visualization Tool",
    href: "/2023/12/21/a-3d-focal-mechanism-visualization-tool/",
    excerpt: "A technical summary of a Python visualization tool for focal mechanism and seismic analysis workflows."
  },
  {
    date: "2023-12-15T08:54:42",
    title: "Securing the Mjolnir System Configuration Package for HAMMA",
    href: "/2023/12/15/securing-the-mjolnir-system-configuration-package-for-hamma/",
    excerpt: "A security-oriented review of configuration risks, validation tools, and hardening steps."
  },
  {
    date: "2023-12-01T20:40:20",
    title: "Evaluating the Security Risks of Millipede-Python",
    href: "/2023/12/01/evaluating-the-security-risks-of-millipede-python/",
    excerpt: "A practical security readout for a small Python project, including threat and hardening notes."
  }
];

function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="site-brand" href="/" aria-label="GroupSum home">
          <img src="/assets/groupsum-brand-horizontal.png" alt="GroupSum" />
        </a>
        <nav aria-label="Primary navigation">
          <a href="/">Home</a>
          <a href="/about/">About</a>
          <a href="/contact/">Contact</a>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <p>GroupSum keeps product notes, research summaries, and technical articles readable in one durable archive.</p>
        <div>
          <a href="/">Home</a>
          <a href="/privacy-policy/">Privacy</a>
          <a href="/terms-of-service/">Terms</a>
        </div>
      </footer>
    </div>
  );
}

function HomePage() {
  return (
    <SiteChrome>
      <section className="home-hero" aria-labelledby="hero-title">
        <p className="eyebrow">GroupSum</p>
        <h1 id="hero-title">Structured notes for technical decisions.</h1>
        <p>
          A compact archive for summaries, technical writeups, and research notes that make comparison and review easier
          for teams.
        </p>
      </section>

      <section className="article-list" aria-labelledby="articles-title">
        <div className="section-heading">
          <p className="eyebrow">Archive</p>
          <h2 id="articles-title">Recent articles</h2>
        </div>
        <div className="articles">
          {homeArticles.map((article) => (
            <a className="article-link" key={article.href} href={article.href}>
              <span>{formatDate(article.date)}</span>
              <strong>{article.title}</strong>
              <p>{article.excerpt}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="compact-links" aria-label="Site links">
        <a href="/about/">About</a>
        <a href="/contact/">Contact</a>
        <a href="/2023/12/21/a-benchmark-for-sparse-logistic-regression/">Sample article</a>
      </section>
    </SiteChrome>
  );
}

function ArticlePage({ article }: { article: ImportedArticle }) {
  return (
    <SiteChrome>
      <article className="article-page">
        <nav className="article-breadcrumb" aria-label="Breadcrumb">
          <a href="/">GroupSum</a>
          <span>/</span>
          <span>{stripHtml(article.title)}</span>
        </nav>
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
              mainEntityOfPage: article.canonicalUrl || `${root}${normalizePath(article.legacyPath)}`,
              image: [article.featuredImage || defaultEmbedImage]
            })
          }}
        />
      </article>
    </SiteChrome>
  );
}

export function App() {
  const path = typeof window === "undefined" ? "/" : normalizePath(window.location.pathname);
  const [article, setArticle] = useState<ImportedArticle | null>(null);
  const [loaded, setLoaded] = useState(path === "/");

  useEffect(() => {
    if (path === "/") return;
    let active = true;
    import("../packages/site-content-pack/src/articles.generated").then((module) => {
      if (!active) return;
      setArticle(module.importedArticles.find((candidate) => normalizePath(candidate.legacyPath) === path) ?? null);
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, [path]);

  if (path === "/") return <HomePage />;
  if (article) return <ArticlePage article={article} />;
  if (!loaded) return <SiteChrome><p className="article-kicker">Loading...</p></SiteChrome>;

  return (
    <SiteChrome>
      <section className="not-found">
        <p className="eyebrow">Not found</p>
        <h1>That page is not available.</h1>
        <a href="/">Return home</a>
      </section>
    </SiteChrome>
  );
}
