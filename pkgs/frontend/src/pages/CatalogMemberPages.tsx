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
import { StructuredData } from "../discovery/StructuredData";
import { PortfolioDetailPage } from "./PortfolioPages";
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

export function ProjectDetailPage({ slug, onNavigate }: { slug: string; onNavigate: (path: string) => void }) {
  return <PortfolioDetailPage slug={slug} onNavigate={onNavigate} />;
}

/* ==========================================================================
   PACKAGE DETAIL PAGE
   ========================================================================== */
export function PackageDetailPage({ slug, onNavigate }: { slug: string; onNavigate: (path: string) => void }) {
  const pkg = useMemo(() => {
    return portfolioEntities.find((e) => e.slug === slug && e.kind === "package" && e.approved);
  }, [slug]);

  const parentSuite = useMemo(() => {
    if (!pkg || !pkg.suiteId) return null;
    return portfolioEntities.find((e) => e.id === pkg.suiteId);
  }, [pkg]);

  if (!pkg) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-ink">Package Not Found</h2>
        <p className="text-sm text-ink-muted">The requested software package is either unapproved, private, or has been relocated.</p>
        <button
          onClick={() => onNavigate("/products")}
          className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-mono font-semibold rounded-[var(--radius-sm)] transition-all"
        >
          Return to Ecosystems
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[var(--reading-max)] mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div>
        <button
          onClick={() => {
            if (parentSuite) {
              onNavigate(productRecordPath(parentSuite.slug));
            } else {
              onNavigate(`/products/${pkg.organization}`);
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:text-accent-hover hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to {parentSuite ? parentSuite.displayName : `${pkg.organization} Ecosystem`}
        </button>
      </div>

      <div className="space-y-6">
        <div className="space-y-2 border-b border-[var(--color-border-soft)] pb-4">
          <div className="flex items-center gap-2 text-[10px] font-mono text-ink-muted">
            <span className="font-bold text-accent uppercase">PACKAGE // {pkg.ecosystem[0]}</span>
            <span>•</span>
            <span>Maturity: {pkg.maturity}</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-ink leading-tight">
            {pkg.displayName}
          </h1>
          <p className="text-xs font-mono bg-canvas border border-[var(--color-border-soft)] text-ink-muted px-2 py-1 rounded inline-block">
            {pkg.ecosystem[0] === "npm" ? "npm install " : "pip install "}{pkg.sourceName}
          </p>
        </div>

        <div className="markdown-body">
          <h3>Abstract Description</h3>
          <p>{pkg.summary}</p>

          {parentSuite && (
            <blockquote>
              This package represents an integrated, modular submodule of the flagship <a href={productRecordPath(parentSuite.slug)} onClick={(e) => { e.preventDefault(); onNavigate(productRecordPath(parentSuite.slug)); }}>{parentSuite.displayName}</a> suite.
            </blockquote>
          )}

          <h3>Verified System Technologies</h3>
          <div className="flex flex-wrap gap-1.5 not-prose my-4">
            {pkg.technologies.map((t) => (
              <span key={t} className="text-xs font-mono bg-canvas border border-[var(--color-border-soft)] text-ink-muted px-2.5 py-1 rounded">
                {t}
              </span>
            ))}
          </div>

          <h3>Audit and Evidence Logs</h3>
          <p>
            All release versions are cryptographically anchored to repository states and validated against continuous test gates before publishing to target registries.
          </p>

          <div className="pt-6 border-t border-[var(--color-border-soft)]">
            <span className="text-[10px] font-mono uppercase text-ink-muted block mb-3">
              crawler-verified package representation
            </span>
            <StructuredData type="portfolio" data={pkg} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   SPECIFICATION DETAIL PAGE
   ========================================================================== */
export function SpecificationDetailPage({ slug, onNavigate }: { slug: string; onNavigate: (path: string) => void }) {
  const spec = useMemo(() => {
    return portfolioEntities.find((e) => e.slug === slug && e.kind === "specification-pack" && e.approved);
  }, [slug]);

  if (!spec) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-ink">Specification Not Found</h2>
        <p className="text-sm text-ink-muted">The requested specification standard is either unapproved, private, or has been relocated.</p>
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
    <div className="max-w-[var(--reading-max)] mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div>
        <button
          onClick={() => onNavigate(`/products/${spec.organization}`)}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:text-accent-hover hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to {spec.organization.charAt(0).toUpperCase() + spec.organization.slice(1)} Ecosystem
        </button>
      </div>

      <div className="space-y-6">
        <div className="space-y-2 border-b border-[var(--color-border-soft)] pb-4">
          <span className="text-[10px] font-mono text-accent font-bold block uppercase">
            SPECIFICATION STANDARD // {spec.id.toUpperCase()}
          </span>
          <h1 className="font-serif text-3xl font-bold text-ink leading-tight">
            {spec.displayName}
          </h1>
          <p className="text-ink-muted text-base">
            {spec.summary}
          </p>
        </div>

        <div className="markdown-body">
          <h3>Architectural Directives</h3>
          <p>
            This governance pack records version-controlled rules and metadata assertions. It supports repeatable review, but does not by itself establish regulatory, search-engine, or security compliance.
          </p>

          <h3>Target Audience & Application</h3>
          <p>
            Primarily designed for <strong>{spec.audience.join(", ")}</strong> to unify multi-brand corporate communications.
          </p>

          <h3>Verified Technologies & Formats</h3>
          <div className="flex flex-wrap gap-1.5 not-prose my-4">
            {spec.technologies.map((t) => (
              <span key={t} className="text-xs font-mono bg-canvas border border-[var(--color-border-soft)] text-ink-muted px-2.5 py-1 rounded">
                {t}
              </span>
            ))}
          </div>

          <div className="pt-6 border-t border-[var(--color-border-soft)]">
            <span className="text-[10px] font-mono uppercase text-ink-muted block mb-3">
              Source Integrity, AEO Optimization & Structured Entity Assertion
            </span>
            <StructuredData type="portfolio" data={spec} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   SOLUTION DETAIL PAGE
   ========================================================================== */
