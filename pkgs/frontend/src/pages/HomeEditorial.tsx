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


export function HomeEditorial({ onNavigate }: { onNavigate: (path: string) => void }) {
  const featuredPosts = featuredBlogPosts.slice(0, 3);
  return <>
      {/* METHODOLOGY SECTION */}
      <section className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-2xl text-center mx-auto">
          <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold block mb-1">
            Methodology
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-ink">
            Verifiable claims-first architecture
          </h2>
          <p className="text-ink-muted text-base mt-2 leading-relaxed">
            We keep claims close to their evidence. Source, tests, package publication, deployment health, and public reachability are reported as separate states.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-[var(--radius-md)] space-y-3">
            <div className="w-8 h-8 rounded bg-accent/10 flex items-center justify-center text-accent font-mono text-sm font-bold">
              01
            </div>
            <h3 className="text-sm font-mono uppercase tracking-wider font-semibold text-ink">
              Decision Declarations
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              We translate system choices into formal schemas, ADR documents, and strict validation patterns stored directly inside secure git workspaces.
            </p>
          </div>

          <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-[var(--radius-md)] space-y-3">
            <div className="w-8 h-8 rounded bg-accent/10 flex items-center justify-center text-accent font-mono text-sm font-bold">
              02
            </div>
            <h3 className="text-sm font-mono uppercase tracking-wider font-semibold text-ink">
              Gate Remediations
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              We add repository checks that make unsupported changes visible before release. Enforcement and response time depend on the target workflow.
            </p>
          </div>

          <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-[var(--radius-md)] space-y-3">
            <div className="w-8 h-8 rounded bg-accent/10 flex items-center justify-center text-accent font-mono text-sm font-bold">
              03
            </div>
            <h3 className="text-sm font-mono uppercase tracking-wider font-semibold text-ink">
              Evidence Closures
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Where a workflow needs durable evidence, we design explicit receipts, verification records, and boundaries between source validation and runtime state.
            </p>
          </div>
        </div>
      </section>

      {/* RECENT INSIGHTS / RESEARCH */}
      <section className="bg-[var(--color-surface)] border-y border-[var(--color-border-soft)] py-16 md:py-20">
        <div className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold block mb-1">
                Insights
              </span>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-ink">
                Historical article archive
              </h2>
            </div>
            <button
              onClick={() => onNavigate("/insights")}
              className="text-sm font-mono text-accent hover:text-accent-hover font-semibold inline-flex items-center gap-1 group hover:underline cursor-pointer"
            >
              Search complete archive
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <p className="max-w-3xl text-sm text-ink-muted leading-relaxed">
            These imported articles are preserved for historical continuity. They have not been revalidated against current packages or product state and must not be treated as current Groupsum guidance, evidence, or product claims.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <article
                key={post.slug}
                onClick={() => onNavigate(`/insights?slug=${post.slug}`)}
                className="group p-6 bg-canvas border border-[var(--color-border-soft)] rounded-[var(--radius-md)] hover:border-accent hover:shadow-[var(--shadow-soft)] transition-all duration-150 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3 text-xs font-mono text-ink-muted">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                    {post.isLegacy && (
                      <span className="px-1.5 py-0.5 bg-ink/5 rounded uppercase text-[10px] font-bold">Archive</span>
                    )}
                  </div>
                  <h3 className="font-serif text-lg font-bold tracking-tight text-ink mb-2 group-hover:text-accent transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-ink-muted leading-relaxed line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                </div>
                <span className="text-xs font-mono text-accent font-semibold inline-flex items-center gap-1 group-hover:underline">
                  Read Article
                  <ArrowRight className="w-3 h-3" />
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL INQUIRY CALL TO ACTION */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-ink">
          Let's verify your systems together.
        </h2>
        <p className="text-ink-muted text-base max-w-lg mx-auto leading-relaxed">
          Describe the system, available evidence, constraints, and outcome you want to review. Groupsum will confirm fit and scope separately.
        </p>
        <div>
          <button
            onClick={() => onNavigate("/contact")}
            className="px-6 py-3 bg-accent hover:bg-accent-hover text-white text-sm font-mono font-semibold rounded-[var(--radius-sm)] shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            Discuss a project
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
  </>;
}
