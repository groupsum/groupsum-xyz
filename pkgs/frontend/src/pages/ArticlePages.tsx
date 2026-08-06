/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "../router";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { PortfolioCard, EvidenceLabel } from "../components/PortfolioCard";
import { InquiryForm } from "../components/InquiryForm";
import { portfolioItems } from "../data/portfolio";
import { portfolioEntities } from "../data/entities";
import { solutionsData } from "../data/solutions";
import { servicesData } from "../data/services";
import { featuredBlogPosts } from "../data/posts.featured.generated";
import { BlogPost, PortfolioItem, PortfolioEntity, SolutionItem, ServiceItem } from "../types";
import { MarkdownRenderer } from "mdwrk/renderer-core";
import { CapabilityBand } from "../components/CapabilityBand";
import { CatalogSnapshotBand, PublicCatalogDetail, PublicCatalogExplorer, PublicCatalogOverview } from "../features/catalog/PublicCatalog";
import { ProductCollectionPage, ProductRecordPage, productRecordPath } from "../features/products/ProductPortfolio";
import { groupSumVision, horizontalCapabilities } from "../data/vision";
import { catalogDatasetManifest, catalogSummary } from "../data/catalog.generated";
import { useCatalogFilters } from "../hooks/useCatalogFilters";
import { CatalogToolbar } from "../features/catalog/CatalogToolbar";
import { CatalogGroup } from "../features/catalog/CatalogGroup";
import { ExplorerAboutPage, ExplorerContactPage, ExplorerInsightsCollection, ExplorerPolicyPage, ExplorerServiceDetailPage, ExplorerServicesPage, ExplorerSolutionDetailPage, ExplorerSolutionsPage } from "../features/editorial/EditorialPages";
import { StructuredData } from "mdwrk/structured-data";
import {
  ArrowRight,
  ArrowLeft,
  Search,
  Filter,
  BookOpen,
  CheckCircle,
  ShieldCheck,
  Sliders,
  Layers,
  HelpCircle,
  FileText,
  Calendar,
  User,
  ExternalLink
} from "lucide-react";


interface ArticleLayoutProps {
  post: BlogPost;
  onBack: () => void;
  onNavigate: (path: string) => void;
}

export function AsyncArticleLayout({ post, onBack, onNavigate }: ArticleLayoutProps) {
  const [loadedPost, setLoadedPost] = useState<BlogPost | null>(post.content ? post : null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    setLoadedPost(post.content ? post : null);
    setFailed(false);

    if (!post.content) {
      import("../data/posts").then((module) => module.loadBlogPost(post.legacyPath))
        .then((article) => {
          if (!active) return;
          if (article) setLoadedPost(article);
          else setFailed(true);
        })
        .catch(() => {
          if (active) setFailed(true);
        });
    }

    return () => {
      active = false;
    };
  }, [post]);

  if (failed) {
    return (
      <section className="max-w-[var(--reading-max)] mx-auto px-4 sm:px-6 py-16 space-y-4" role="alert">
        <p className="text-xs font-mono uppercase tracking-wider text-[var(--color-signal)]">Archive load failed</p>
        <h1 className="font-serif text-3xl font-bold text-ink">This article could not be loaded.</h1>
        <p className="text-sm text-ink-muted">The archive index is available, but the full article payload failed to load. Try again or return to Insights.</p>
        <button onClick={onBack} className="text-sm font-semibold text-accent hover:text-accent-hover underline underline-offset-4">
          Return to Insights
        </button>
      </section>
    );
  }

  if (!loadedPost) {
    return (
      <section className="max-w-[var(--reading-max)] mx-auto px-4 sm:px-6 py-16 space-y-4" aria-busy="true" aria-live="polite">
        <p className="text-xs font-mono uppercase tracking-wider text-accent">Loading archive article</p>
        <div className="h-10 w-4/5 rounded-[var(--radius-sm)] bg-[var(--color-border-soft)] animate-pulse" />
        <div className="h-4 w-2/5 rounded-[var(--radius-sm)] bg-[var(--color-border-soft)] animate-pulse" />
      </section>
    );
  }

  return <ArticleLayout post={loadedPost} onBack={onBack} onNavigate={onNavigate} />;
}

function ArticleLayout({ post, onBack, onNavigate }: ArticleLayoutProps) {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(featuredBlogPosts);
  useEffect(() => {
    let active = true;
    import("../data/posts").then((module) => module.loadBlogPosts()).then((posts) => {
      if (active) setBlogPosts(posts);
    });
    return () => { active = false; };
  }, []);
  // Simple related posts matcher based on tags
  const relatedPosts = useMemo(() => {
    return blogPosts
      .filter((p) => p.slug !== post.slug && p.tags?.some((t) => post.tags?.includes(t)))
      .slice(0, 2);
  }, [post]);

  return (
    <article className="max-w-[var(--reading-max)] mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Back to archive links */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:text-accent-hover hover:underline cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Insights Archive
      </button>

      {/* Legacy Notice Block */}
      {post.isLegacy && (
        <div className="p-4 bg-[var(--color-signal-soft)]/25 border border-[var(--color-border-soft)] rounded-[var(--radius-sm)] text-xs text-ink-muted flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-[var(--color-signal)] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block text-ink">Historical Archive Content</span>
            This imported article was published {new Date(post.date).toLocaleDateString()} and has not been revalidated. Package details, links, APIs, security guidance, and conclusions may be inaccurate or obsolete. Do not treat it as current Groupsum guidance or product evidence.
          </div>
        </div>
      )}

      {/* Header Info */}
      <header className="space-y-4 border-b border-[var(--color-border-soft)] pb-6">
        <h1 className="font-serif text-3xl sm:text-4.5xl font-bold tracking-tight text-ink leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-ink-muted">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            {post.author}
          </span>
          {post.category && (
            <>
              <span>•</span>
              <span className="text-accent font-semibold">{post.category}</span>
            </>
          )}
        </div>
      </header>

      {/* Render Markdown Content */}
      <div className="markdown-body">
        <MarkdownRenderer content={post.content} />
      </div>

      {/* Structured Data Verification Box (SEO/AEO/AIEO) */}
      <div className="pt-8 border-t border-[var(--color-border-soft)]">
        <span className="text-[10px] font-mono uppercase text-ink-muted block mb-3">
          Verification Integrity & Structured Engine Metadata
        </span>
        <StructuredData type="blog" data={post} />
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="pt-8 border-t border-[var(--color-border-soft)] space-y-4">
          <h3 className="font-serif text-xl font-bold text-ink">
            Related Research & Insights
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedPosts.map((p) => (
              <div
                key={p.slug}
                onClick={() => onNavigate(`/insights?slug=${p.slug}`)}
                className="p-4 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-[var(--radius-sm)] hover:border-accent transition-all cursor-pointer"
              >
                <h4 className="font-serif text-sm font-bold text-ink mb-1 group-hover:text-accent line-clamp-1">
                  {p.title}
                </h4>
                <p className="text-[11px] text-ink-muted line-clamp-2">
                  {p.excerpt}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

/* ==========================================================================
   LEGACY ARTICLE PAGE ROUTER (/{yyyy}/{mm}/{dd}/{slug}/)
   ========================================================================== */
interface LegacyArticlePageProps {
  year: string;
  month: string;
  day: string;
  slug: string;
  onNavigate: (path: string) => void;
}

export function LegacyArticlePage({ year, month, day, slug, onNavigate }: LegacyArticlePageProps) {
  const requestedPath = `/${year}/${month}/${day}/${slug}/`;
  const [post, setPost] = useState<BlogPost | undefined>(() =>
    featuredBlogPosts.find((candidate) => candidate.legacyPath === requestedPath),
  );
  useEffect(() => {
    let active = true;
    import("../data/posts").then((module) => module.loadBlogPosts()).then((posts) => {
      if (active) setPost(posts.find((candidate) => candidate.legacyPath === requestedPath));
    });
    return () => { active = false; };
  }, [requestedPath]);

  if (!post) {
    return <section className="max-w-[var(--reading-max)] mx-auto px-4 sm:px-6 py-16" aria-busy="true"><p className="text-sm text-ink-muted">Loading archived article…</p></section>;
  }

  return (
    <AsyncArticleLayout
      post={post}
      onBack={() => onNavigate("/insights")}
      onNavigate={onNavigate}
    />
  );
}

/* ==========================================================================
   ABOUT PAGE
   ========================================================================== */
function sanitizeRawHtml(rawHtml: string): string {
  // A resilient, robust, custom Markdown/HTML sanitizer that converts basic MD formatting
  // (like code blocks, headers, blockquotes, lists, tables) into clean HTML safe for rendering.
  // It escapes dangerous elements to protect the rendering boundary.

  let content = rawHtml
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/g, ""); // strip event listeners

  // Simple Markdown Parsing helper logic for high fidelity rendering
  // Code block parser with syntax highlighting styles
  content = content.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre><code class="language-${lang}">${code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")}</code></pre>`;
  });

  // Inline code parser
  content = content.replace(/`([^`\n]+)`/g, "<code>$1</code>");

  // Bold text
  content = content.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  // Math equations (simulated formatting for elegant render)
  content = content.replace(/\$\$([\s\S]+?)\$\$/g, '<div class="text-center font-mono my-4 text-xs select-none">$1</div>');
  content = content.replace(/\$([^$\n]+)\$/g, '<span class="font-mono text-xs select-none">$1</span>');

  return content;
}
