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


export interface RouteProps {
  onNavigate: (path: string) => void;
}

export function PortfolioDetailPage({ slug, onNavigate }: { slug: string; onNavigate: (path: string) => void }) {
  const item = useMemo(() => {
    return portfolioItems.find((p) => p.slug === slug && p.approved);
  }, [slug]);

  if (!item) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-ink">Artifact Not Found</h2>
        <p className="text-sm text-ink-muted">The requested portfolio artifact may be unapproved, in drafting stages, or moved.</p>
        <button
          onClick={() => onNavigate("/portfolio")}
          className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-mono font-semibold rounded-[var(--radius-sm)] transition-all"
        >
          Return to Portfolio
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Back button */}
      <div>
        <button
          onClick={() => onNavigate("/portfolio")}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:text-accent-hover hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Portfolio Index
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Detail Left (Metadata & Evidence Panel) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-[var(--radius-md)] space-y-5">
            <h3 className="font-mono text-xs uppercase tracking-wider text-ink font-bold border-b border-[var(--color-border-soft)] pb-2">
              System Metadata
            </h3>

            <div>
              <span className="text-[10px] font-mono uppercase text-ink-muted block">Artifact Name</span>
              <span className="text-sm font-serif font-semibold text-ink">{item.name}</span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-ink-muted block">Maturity Phase</span>
              <span className="text-xs font-mono text-ink bg-canvas px-2 py-0.5 rounded border border-[var(--color-border-soft)] capitalize inline-block mt-0.5">
                {item.maturity}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-ink-muted block">Evidence Log</span>
              <span className="text-xs font-mono text-accent font-semibold">{item.evidenceLabel}</span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-ink-muted block">Evidence Authority</span>
              <span className="text-xs font-mono text-ink-muted">{item.evidenceOwner}</span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-ink-muted block">Primary Tech Stack</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {item.technologies.map((t) => (
                  <span key={t} className="text-[10px] font-mono bg-canvas border border-[var(--color-border-soft)] text-ink-muted px-1.5 py-0.5 rounded">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--color-border-soft)] space-y-2">
              {item.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="w-full text-center px-4 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-mono font-semibold rounded-[var(--radius-sm)] transition-all inline-flex items-center justify-center gap-1"
                >
                  {link.label}
                  {link.href.startsWith("http") && <ExternalLink className="w-3.5 h-3.5 ml-1" />}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Detail Right (Technical Specs Case Study) */}
        <div className="lg:col-span-8 space-y-6">
          <span className="text-xs font-mono uppercase text-accent font-bold tracking-widest block">
            Technical Specification // {item.capabilityFamily.toUpperCase()}
          </span>
          <h2 className="font-serif text-3.5xl font-bold tracking-tight text-ink">
            {item.name}
          </h2>
          <p className="text-ink-muted text-lg leading-relaxed border-b border-[var(--color-border-soft)] pb-6">
            {item.summary}
          </p>

          <MarkdownRenderer
            content={`### Architectural goals

${item.description}

### How it works

${item.summary}

> BucketWarden-style portfolio work is presented with explicit boundaries, evidence, and an honest maturity label.

### Verifiable deliverables

- **Implementation boundary:** The published artifact describes the work that exists today.
- **Evidence trail:** Maturity, evidence, and limitations remain visible beside the description.
- **Next step:** Use the linked source, specification, or product surface to continue evaluation.

_Evidence reviewed: August 2, 2026 Â· Document ref: CATALOG-${item.slug.toUpperCase()}_`}
          />

          <div className="mt-8 pt-6 border-t border-[var(--color-border-soft)]">
            <StructuredData type="portfolio" data={item} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   SOLUTIONS PAGE
   ========================================================================== */
