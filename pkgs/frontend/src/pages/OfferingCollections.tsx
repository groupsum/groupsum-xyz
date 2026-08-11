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
import { useCatalogFilters } from "../hooks/useCatalogFilters";
import { CatalogToolbar } from "../features/catalog/CatalogToolbar";
import { CatalogGroup } from "../features/catalog/CatalogGroup";
import { ExplorerAboutPage, ExplorerContactPage, ExplorerInsightsCollection, ExplorerPolicyPage, ExplorerServiceDetailPage, ExplorerServicesPage, ExplorerSolutionDetailPage, ExplorerSolutionsPage } from "../features/editorial/EditorialPages";
import { StructuredData } from "mdwrk/structured-data";
import { AsyncArticleLayout } from "./ArticlePages";
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


export interface RouteProps {
  onNavigate: (path: string) => void;
}

export function InsightsPage({ onNavigate }: RouteProps) {
  const location = useLocation();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(featuredBlogPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  // Read URL query parameter for preselecting/loading specific posts
  const urlParams = new URLSearchParams(location.search);
  const selectedSlug = urlParams.get("slug");

  useEffect(() => {
    let active = true;
    import("../data/posts").then((module) => module.loadBlogPosts()).then((posts) => {
      if (active) setBlogPosts(posts);
    });
    return () => { active = false; };
  }, []);

  // Filter posts based on search query
  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchText = `${post.title} ${post.excerpt} ${post.tags?.join(" ")}`.toLowerCase();
      return matchText.includes(searchQuery.toLowerCase());
    });
  }, [blogPosts, searchQuery]);

  // Handle pagination calculation
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return filteredPosts.slice(startIndex, startIndex + postsPerPage);
  }, [filteredPosts, currentPage]);

  // Reset page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // If a specific article is requested via query param, render its detail!
  if (selectedSlug) {
    const matchedPost = blogPosts.find((p) => p.slug === selectedSlug);
    if (matchedPost) {
      return (
        <AsyncArticleLayout
          post={matchedPost}
          onBack={() => onNavigate("/insights")}
          onNavigate={onNavigate}
        />
      );
    }
  }

  return <ExplorerInsightsCollection
    posts={paginatedPosts}
    matchingCount={filteredPosts.length}
    legacyCount={filteredPosts.filter((post) => post.isLegacy).length}
    searchQuery={searchQuery}
    onSearch={setSearchQuery}
    currentPage={currentPage}
    totalPages={totalPages}
    onPage={setCurrentPage}
    onNavigate={onNavigate}
  />;

  return (
    <div className="max-w-[var(--reading-max)] mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="space-y-3">
        <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold block">
          Historic logs & papers
        </span>
        <h1 className="font-serif text-4xl font-bold tracking-tight text-ink">
          Insights Archive
        </h1>
        <p className="text-ink-muted text-base leading-relaxed">
          This imported archive preserves historical articles and URLs. Entries have not been revalidated against current packages, APIs, security guidance, or product state. They are not current Groupsum guidance or evidence.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${blogPosts.length.toLocaleString()} posts by topic, stack, keyword...`}
          className="w-full pl-10 pr-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border-muted)] rounded-[var(--radius-md)] text-sm text-ink focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
        />
      </div>

      {/* Posts list */}
      <div className="space-y-6">
        {paginatedPosts.length > 0 ? (
          paginatedPosts.map((post) => (
            <article
              key={post.slug}
              onClick={() => onNavigate(`/insights?slug=${post.slug}`)}
              className="p-6 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-[var(--radius-md)] hover:border-accent hover:shadow-[var(--shadow-soft)] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-3 text-xs font-mono text-ink-muted">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                  <span className="text-ink-muted/30">|</span>
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    {post.author}
                  </span>
                  {post.isLegacy && (
                    <>
                      <span className="text-ink-muted/30">|</span>
                      <span className="px-1.5 py-0.5 bg-ink/5 rounded uppercase text-[9px] font-bold">Legacy Archive</span>
                    </>
                  )}
                </div>

                <h2 className="font-serif text-xl font-bold tracking-tight text-ink mb-2">
                  {post.title}
                </h2>
                <p className="text-xs text-ink-muted leading-relaxed line-clamp-3 mb-4">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {post.tags?.map((tag) => (
                    <span key={tag} className="text-[9px] font-mono tracking-tight bg-canvas border border-[var(--color-border-soft)] text-ink-muted px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[var(--color-border-soft)] text-xs font-mono text-accent font-semibold hover:underline text-left">
                Read Full Paper →
              </div>
            </article>
          ))
        ) : (
          <div className="p-12 text-center bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-[var(--radius-md)]">
            <HelpCircle className="w-10 h-10 text-ink-muted mx-auto mb-3" />
            <p className="text-ink font-serif text-lg font-medium">No results found</p>
            <p className="text-xs text-ink-muted mt-1">Try modifying your query or looking for terms like "regression" or "microservices".</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav className="flex items-center justify-between border-t border-[var(--color-border-soft)] pt-6" aria-label="Pagination Navigation">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border-soft)] disabled:opacity-50 hover:border-accent text-xs font-mono rounded cursor-pointer transition-all flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Previous
          </button>

          <span className="text-xs font-mono text-ink-muted">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-3 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border-soft)] disabled:opacity-50 hover:border-accent text-xs font-mono rounded cursor-pointer transition-all flex items-center gap-1"
          >
            Next <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </nav>
      )}
    </div>
  );
}
