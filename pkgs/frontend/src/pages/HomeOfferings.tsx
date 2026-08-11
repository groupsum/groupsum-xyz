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


export function HomeOfferings({ onNavigate }: { onNavigate: (path: string) => void }) {
  const homepageSolutions = solutionsData.slice(0, 6);
  const homepageServices = servicesData.slice(0, 6);
  return <>
      {/* SOLUTIONS PREVIEW */}
      <section className="bg-[var(--color-surface)] border-y border-[var(--color-border-soft)] py-16 md:py-24">
        <div className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold block mb-1">
                Outcome-Led Solutions
              </span>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-ink">
                Problems we systematically resolve
              </h2>
              <p className="text-ink-muted text-base mt-2 leading-relaxed max-w-xl">
                We compose technologies across our divisions to build end-to-end solutions for operational integrity.
              </p>
            </div>
            <button
              onClick={() => onNavigate("/solutions")}
              className="text-sm font-mono text-accent hover:text-accent-hover font-semibold inline-flex items-center gap-1 group hover:underline cursor-pointer"
            >
              Explore all solutions
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {homepageSolutions.map((sol) => (
              <div
                key={sol.id}
                className="flex flex-col justify-between p-6 bg-canvas border border-[var(--color-border-soft)] rounded-[var(--radius-md)] hover:border-accent transition-all duration-200"
              >
                <div>
                  <h3 className="font-serif text-xl font-bold tracking-tight text-ink mb-3">
                    {sol.title}
                  </h3>
                  <div className="space-y-4 mb-6">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted block mb-0.5">The Friction</span>
                      <p className="text-xs text-ink-muted leading-relaxed line-clamp-3">{sol.problem}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-accent block mb-0.5">The Capability</span>
                      <p className="text-xs text-ink leading-relaxed font-medium line-clamp-3">{sol.capability}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate(`/solutions/${sol.slug}`)}
                  className="text-xs font-mono text-accent hover:text-accent-hover font-semibold inline-flex items-center gap-1 hover:underline text-left"
                >
                  Examine Solution Outcomes &rarr;
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold block mb-1">
              Services & Engagements
            </span>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-ink">
              Advisory and engineering delivery
            </h2>
            <p className="text-ink-muted text-sm leading-relaxed mt-1">
              Groupsum LLC provides hands-on implementation and high-integrity consulting around our core ecosystems.
            </p>
          </div>
          <button
            onClick={() => onNavigate("/services")}
            className="text-sm font-mono text-accent hover:text-accent-hover font-semibold inline-flex items-center gap-1 group hover:underline cursor-pointer"
          >
            Explore all services
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {homepageServices.map((srv) => (
            <div
              key={srv.id}
              className="p-6 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-[var(--radius-md)] flex flex-col justify-between"
            >
              <div>
                <h3 className="font-serif text-lg font-bold text-ink mb-2">
                  {srv.title}
                </h3>
                <p className="text-xs text-ink-muted leading-relaxed line-clamp-3 mb-4">
                  {srv.engagementShape}
                </p>
                <div className="space-y-2 mb-4">
                  <span className="text-[9px] font-mono uppercase text-ink-muted block">Typical Outputs</span>
                  <ul className="list-disc pl-4 space-y-1">
                    {srv.typicalOutputs.slice(0, 2).map((out, i) => (
                      <li key={i} className="text-xs text-ink-muted leading-tight">{out}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <button
                onClick={() => onNavigate(`/services/${srv.slug}`)}
                className="text-xs font-mono text-accent hover:text-accent-hover font-semibold inline-flex items-center gap-1 hover:underline text-left mt-2"
              >
                Request Engagement &rarr;
              </button>
            </div>
          ))}
        </div>
      </section>
  </>;
}
