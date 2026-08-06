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

export function NotFoundPage({ onNavigate }: RouteProps) {
  return (
    <div className="max-w-md mx-auto py-20 px-4 text-center space-y-6">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/5 border border-red-500/10 text-red-600 rounded-full font-serif text-3xl font-bold">
        404
      </div>
      <div className="space-y-2">
        <h2 className="font-serif text-2xl font-bold text-ink">Route Boundary Mismatch</h2>
        <p className="text-sm text-ink-muted leading-relaxed">
          The requested system path does not match any compiled or historical route. No contract evidence is available for this endpoint.
        </p>
      </div>
      <div className="flex flex-wrap gap-3 justify-center pt-2">
        <button
          onClick={() => onNavigate("/")}
          className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-mono font-semibold rounded-[var(--radius-sm)] transition-all cursor-pointer"
        >
          Return Home
        </button>
        <button
          onClick={() => onNavigate("/portfolio")}
          className="px-4 py-2 bg-canvas hover:bg-[var(--color-surface-raised)] border border-[var(--color-border-soft)] text-ink text-xs font-mono font-semibold rounded-[var(--radius-sm)] transition-all cursor-pointer"
        >
          View Portfolio
        </button>
        <button
          onClick={() => onNavigate("/insights")}
          className="px-4 py-2 bg-canvas hover:bg-[var(--color-surface-raised)] border border-[var(--color-border-soft)] text-ink text-xs font-mono font-semibold rounded-[var(--radius-sm)] transition-all cursor-pointer"
        >
          Search Insights
        </button>
      </div>
    </div>
  );
}

/* ==========================================================================
   SANITIZATION AND UTILS
   ========================================================================== */
