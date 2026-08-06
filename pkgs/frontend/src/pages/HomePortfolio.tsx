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


export function HomePortfolio({ onNavigate }: { onNavigate: (path: string) => void }) {
  const flagshipSuites = portfolioEntities.filter((entity) => entity.kind === "suite" || entity.id === "groupsum-bucketwarden");
  const homepagePortfolio = portfolioEntities.filter((entity) => entity.featured && entity.approved).slice(0, 6);
  return <>
      {/* FLAGSHIP PRODUCT SUITES */}
      <section className="bg-[var(--color-surface)] border-y border-[var(--color-border-soft)] py-16 md:py-24">
        <div className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold block mb-1">
              Flagship Suite Catalog
            </span>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-ink">
              Core suites in active distribution
            </h2>
            <p className="text-ink-muted text-base mt-2 leading-relaxed">
              These approved flagship product suites represent the core functional layers of our technology ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {flagshipSuites.map((suite) => (
              <div
                key={suite.id}
                className="bg-canvas border border-[var(--color-border-soft)] rounded-[var(--radius-md)] p-6 space-y-4 hover:border-accent transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[9px] font-mono uppercase text-ink-muted">
                    <span className="font-bold text-accent">{suite.organization}</span>
                    <span>{suite.kind === "suite" ? "Suite" : "Product"}</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-ink leading-tight">
                    {suite.displayName}
                  </h3>
                  <p className="text-xs text-ink-muted leading-relaxed">
                    {suite.summary}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="border-t border-[var(--color-border-soft)] pt-2">
                    <span className="text-[8px] font-mono uppercase tracking-wider text-ink-muted block">Evidence Verified</span>
                    <span className="text-[10px] font-mono text-ink font-semibold line-clamp-1">
                      {suite.evidence[0]?.label || "Maturity Tracked"}
                    </span>
                  </div>
                  <button
                    onClick={() => onNavigate(productRecordPath(suite.slug))}
                    className="text-xs font-mono text-accent hover:text-accent-hover font-semibold inline-flex items-center gap-1 group"
                  >
                    Examine Suite Specs &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SELECTED PORTFOLIO */}
      <section className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold block mb-1">
              Representative Artifacts
            </span>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-ink">
              Selected catalog releases
            </h2>
            <p className="text-ink-muted text-sm leading-relaxed mt-1">
              A curated selection of approved packages, specifications, and applications across our three divisions.
            </p>
          </div>
          <button
            onClick={() => onNavigate("/portfolio")}
            className="text-sm font-mono text-accent hover:text-accent-hover font-semibold inline-flex items-center gap-1 group hover:underline cursor-pointer"
          >
            Browse complete portfolio
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {homepagePortfolio.map((entity) => (
            <div
              key={entity.id}
              className="p-6 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-[var(--radius-md)] flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between text-[9px] font-mono uppercase text-ink-muted mb-2">
                  <span className="text-accent font-bold">{entity.organization}</span>
                  <span>{entity.kind}</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-ink tracking-tight mb-2">
                  {entity.displayName}
                </h3>
                <p className="text-xs text-ink-muted leading-relaxed line-clamp-3">
                  {entity.summary}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-[var(--color-border-soft)]">
                <div className="flex justify-between text-[9px] font-mono">
                  <span className="text-ink-muted">Maturity:</span>
                  <span className="font-semibold uppercase text-accent">{entity.maturity}</span>
                </div>
                <button
                  onClick={() => {
                    if (entity.kind === "package") {
                      onNavigate(`/portfolio/packages/${entity.slug}`);
                    } else if (entity.kind === "specification-pack") {
                      onNavigate(`/portfolio/specifications/${entity.slug}`);
                    } else {
                      onNavigate(`/portfolio/projects/${entity.slug}`);
                    }
                  }}
                  className="text-xs font-mono text-accent font-semibold inline-flex items-center gap-1 group hover:underline"
                >
                  View Detail &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
  </>;
}
