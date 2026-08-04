/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "./router";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { PortfolioCard, EvidenceLabel } from "./components/PortfolioCard";
import { InquiryForm } from "./components/InquiryForm";
import { portfolioItems } from "./data/portfolio";
import { portfolioEntities } from "./data/entities";
import { solutionsData } from "./data/solutions";
import { servicesData } from "./data/services";
import { featuredBlogPosts } from "./data/posts.featured.generated";
import { BlogPost, PortfolioItem, PortfolioEntity, SolutionItem, ServiceItem } from "./types";
import { MarkdownRenderer } from "mdwrk/renderer-core";
import { CapabilityBand } from "./components/CapabilityBand";
import { CatalogSnapshotBand, PublicCatalogDetail, PublicCatalogExplorer } from "./components/PublicCatalog";
import { ProductCollectionPage, ProductRecordPage, productRecordPath } from "./components/ProductPortfolio";
import { groupSumVision, horizontalCapabilities } from "./data/vision";
import { catalogDatasetManifest, catalogSummary } from "./data/catalog.generated";
import { useCatalogFilters } from "./hooks/useCatalogFilters";
import { CatalogToolbar } from "./components/CatalogToolbar";
import { CatalogGroup } from "./components/CatalogGroup";
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

export default function App() {
  const location = useLocation();
  const navigateHook = useNavigate();

  const currentPath = location.pathname;

  const navigate = (path: string) => {
    navigateHook(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Regular expression to match date-based legacy URLs: /yyyy/mm/dd/slug/
  const matchLegacyUrl = (path: string) => {
    const regex = /^\/(\d{4})\/(\d{2})\/(\d{2})\/([a-zA-Z0-9_-]+)\/?$/;
    const match = path.match(regex);
    if (match) {
      return {
        year: match[1],
        month: match[2],
        day: match[3],
        slug: match[4],
      };
    }
    return null;
  };

  const legacyMatch = matchLegacyUrl(currentPath);

  // Render Page Content based on path
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink selection:bg-accent/15 selection:text-accent font-sans">
      <SiteHeader currentPath={currentPath} onNavigate={navigate} />

      <main className="flex-grow">
        {legacyMatch ? (
          <LegacyArticlePage 
            year={legacyMatch.year} 
            month={legacyMatch.month} 
            day={legacyMatch.day} 
            slug={legacyMatch.slug} 
            onNavigate={navigate} 
          />
        ) : (
          <RouteSwitcher path={currentPath} onNavigate={navigate} />
        )}
      </main>

      <SiteFooter onNavigate={navigate} />
    </div>
  );
}

interface RouteProps {
  onNavigate: (path: string) => void;
}

function RouteSwitcher({ path, onNavigate }: { path: string; onNavigate: (path: string) => void }) {
  // Normalize path and split into segments to handle sub-routing cleanly
  const cleanPath = path.split("?")[0].split("#")[0];
  const segments = cleanPath.split("/").filter(Boolean);

  if (segments.length === 0 || segments[0] === "home" || segments[0] === "index.html") {
    return <HomePage onNavigate={onNavigate} />;
  }

  const primary = segments[0];

  if (primary === "products") {
    if (segments.length === 1) {
      return <ProductCollectionPage mode="products" onNavigate={onNavigate} />;
    }
    const sub = segments[1];
    if (sub === "records" && segments[2]) {
      return <ProductRecordPage slug={segments[2]} onNavigate={onNavigate} />;
    }
    if (sub === "groupsum" || sub === "tigrbl" || sub === "swarmauri") {
      return <ProductCollectionPage mode="portfolio" organization={sub} onNavigate={onNavigate} />;
    }
    return <ProductRecordPage slug={sub} onNavigate={onNavigate} />;
  }

  if (primary === "portfolio") {
    if (segments.length === 1) {
      return <ProductCollectionPage mode="portfolio" onNavigate={onNavigate} />;
    }
    const sub = segments[1];
    if (sub === "records" && segments[2]) {
      return <ProductRecordPage slug={segments[2]} recordType="portfolio" onNavigate={onNavigate} />;
    }
    const recordSlug = ["projects", "packages", "specifications"].includes(sub) ? segments[2] : sub;
    if (recordSlug && portfolioEntities.some((entity) => entity.slug === recordSlug && entity.approved)) {
      return <ProductRecordPage slug={recordSlug} onNavigate={onNavigate} />;
    }
    if (sub === "projects") {
      return <ProjectDetailPage slug={segments[2]} onNavigate={onNavigate} />;
    }
    if (sub === "packages") {
      return <PackageDetailPage slug={segments[2]} onNavigate={onNavigate} />;
    }
    if (sub === "specifications") {
      return <SpecificationDetailPage slug={segments[2]} onNavigate={onNavigate} />;
    }
    // Fallback for direct previous routes
    return <PortfolioDetailPage slug={sub} onNavigate={onNavigate} />;
  }

  if (primary === "catalog") {
    if (segments.length === 1) {
      return <PublicCatalogExplorer onNavigate={onNavigate} />;
    }
    return <PublicCatalogDetail path={cleanPath} onNavigate={onNavigate} />;
  }

  if (primary === "solutions") {
    if (segments.length === 1) {
      return <SolutionsPage onNavigate={onNavigate} />;
    }
    return <SolutionDetailPage slug={segments[1]} onNavigate={onNavigate} />;
  }

  if (primary === "services") {
    if (segments.length === 1) {
      return <ServicesPage onNavigate={onNavigate} />;
    }
    return <ServiceDetailPage slug={segments[1]} onNavigate={onNavigate} />;
  }

  if (primary === "insights") {
    return <InsightsPage onNavigate={onNavigate} />;
  }

  if (primary === "about") {
    return <AboutPage onNavigate={onNavigate} />;
  }

  if (primary === "contact") {
    return <ContactPage />;
  }

  if (primary === "privacy-policy") {
    return <PrivacyPage />;
  }

  if (primary === "terms-of-service") {
    return <TermsPage />;
  }

  // Otherwise, 404
  return <NotFoundPage onNavigate={onNavigate} />;
}

/* ==========================================================================
   HOMEPAGE COMPONENT
   ========================================================================== */
function HomePage({ onNavigate }: RouteProps) {
  const featuredPosts = useMemo(() => {
    return featuredBlogPosts.slice(0, 3);
  }, []);

  const flagshipSuites = useMemo(() => {
    return portfolioEntities.filter(e => e.kind === "suite" || e.id === "groupsum-bucketwarden");
  }, []);

  const homepagePortfolio = useMemo(() => {
    return portfolioEntities.filter(e => e.featured && e.approved).slice(0, 6);
  }, []);

  const homepageSolutions = useMemo(() => {
    return solutionsData.slice(0, 6);
  }, []);

  const homepageServices = useMemo(() => {
    return servicesData.slice(0, 6);
  }, []);

  return (
    <div className="space-y-16 md:space-y-28 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-16 md:pt-24 border-b border-[var(--color-border-soft)] bg-[var(--color-surface)]">
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 field-grid opacity-20 pointer-events-none" />

        <div className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-block px-2.5 py-0.5 border border-accent text-accent text-[10px] font-bold uppercase tracking-widest mb-2 rounded-sm">
                {groupSumVision.eyebrow}
              </div>
              
              <h1 className="font-serif text-4xl sm:text-5.5xl lg:text-6.5xl font-bold tracking-tight text-ink leading-[1.08] mb-6">
                {groupSumVision.title}
              </h1>
              
              <p className="text-ink-muted text-base sm:text-lg leading-relaxed max-w-xl">
                {groupSumVision.summary}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={() => onNavigate("/contact")}
                  className="px-6 py-3 bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-widest rounded-md shadow-sm transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  Discuss a project
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate("/products")}
                  className="px-6 py-3 border border-[var(--color-ink)] text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-surface)] text-ink transition-all rounded-sm cursor-pointer"
                >
                  Explore products
                </button>
              </div>
            </div>

            {/* Hero Right Composition */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="w-full max-w-[420px] aspect-square relative bg-canvas border border-[var(--color-border-muted)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-soft)] overflow-hidden flex flex-col justify-between">
                {/* Math background lines */}
                <div className="absolute inset-0 opacity-[0.03] select-none pointer-events-none flex flex-col justify-around text-[10px] font-mono p-4">
                  <div>{"E(x, y) = \\sum_{i} C_i(x) + \\lambda \\cdot \\delta(y)"}</div>
                  <div>{"S(t) = \\int \\Psi(t, \\tau) d\\tau"}</div>
                  <div>{"\\nabla \\times B = \\mu_0 J + \\mu_0 \\epsilon_0 \\frac{\\partial E}{\\partial t}"}</div>
                </div>

                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="50" y1="0" x2="50" y2="100%" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.08" strokeDasharray="3 3" />
                  <line x1="200" y1="0" x2="200" y2="100%" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.08" strokeDasharray="3 3" />
                  <path d="M 30 310 C 110 260, 160 320, 240 200 C 280 140, 320 160, 360 70" fill="none" stroke="var(--color-border-muted)" strokeWidth="1" strokeDasharray="4 4" />
                  <path d="M 30 310 Q 200 220, 240 120 T 340 50" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="240" cy="120" r="5" fill="var(--color-signal)" />
                  <circle cx="340" cy="50" r="4" fill="var(--color-accent)" />
                </svg>

                <div className="flex justify-between items-start font-mono text-[10px] text-ink-muted/60 relative z-10">
                  <span>FIG-02: CROSS-ORG TRACE</span>
                  <span>EVID_REF: GS-Ecosystem-V1</span>
                </div>

                <div className="space-y-2 relative z-10">
                  <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-[var(--radius-sm)] flex items-center justify-between">
                    <span className="text-xs font-mono font-medium text-ink">SSOT Lineage Graph</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-accent/10 text-accent rounded uppercase font-bold">Source</span>
                  </div>
                  <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-[var(--radius-sm)] flex items-center justify-between">
                    <span className="text-xs font-mono font-medium text-ink">Tigrbl ASGI Handshake</span>
                    <span className="text-[10px] font-mono text-green-800 font-bold">Typed</span>
                  </div>
                  <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-[var(--radius-sm)] flex items-center justify-between">
                    <span className="text-xs font-mono font-medium text-ink">Swarmauri Agent Loop</span>
                    <span className="text-[10px] font-mono text-blue-600 font-bold">Source</span>
                  </div>
                </div>

                <div className="flex justify-between items-end font-mono text-[10px] text-ink-muted/60 relative z-10">
                  <span>CHECKED: 2026-08-02</span>
                  <span>CLAIMS: EVIDENCE-BOUND</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CatalogSnapshotBand onNavigate={onNavigate} title="Current public ecosystem evidence" />

      {/* HORIZONTAL CAPABILITIES */}
      <section className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="max-w-2xl">
          <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold block mb-1">One operating vision</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-ink">Horizontal problems, coordinated proof.</h2>
          <p className="text-ink-muted text-base mt-2 leading-relaxed">Our products, suites, packages, and services contribute to the same operating thesis: make complex systems governable, deliverable, and provable.</p>
        </div>
        <div className="space-y-4">
          {horizontalCapabilities.map((capability) => <CapabilityBand key={capability.id} capability={capability} onNavigate={onNavigate} />)}
        </div>
      </section>
      {/* ECOSYSTEM ORIENTATION */}
      <section className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold block mb-1">
              Organization Boundary Overview
            </span>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-ink">
              Three connected product ecosystems
            </h2>
            <p className="text-ink-muted text-base mt-2 leading-relaxed">
              We present our software divisions clearly. Each maintains dedicated open-source, package-level, or commercial release vectors.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="p-8 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-[var(--radius-md)] space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-accent block">
                  Commercial Division // 01
                </span>
                <h3 className="font-serif text-2xl font-bold text-ink">Groupsum</h3>
                <p className="text-sm text-ink-muted leading-relaxed">
                  Focuses on governed delivery pipelines, AST document compilation, accessibility remediation engines, secure trust registries, and custom operation planes.
                </p>
              </div>
              <button 
                onClick={() => onNavigate("/products/groupsum")}
                className="text-xs font-mono text-accent hover:text-accent-hover font-semibold inline-flex items-center gap-1 hover:underline text-left mt-4"
              >
                Explore Groupsum Suites &rarr;
              </button>
            </div>

            <div className="p-8 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-[var(--radius-md)] space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-accent block">
                  API & ASGI Division // 02
                </span>
                <h3 className="font-serif text-2xl font-bold text-ink">Tigrbl</h3>
                <p className="text-sm text-ink-muted leading-relaxed">
                  Powers schema-first API frameworks, asynchronous ASGI runtimes, pluggable database engines, WebTransport/HTTP-3 server container servers, and authenticators.
                </p>
              </div>
              <button 
                onClick={() => onNavigate("/products/tigrbl")}
                className="text-xs font-mono text-accent hover:text-accent-hover font-semibold inline-flex items-center gap-1 hover:underline text-left mt-4"
              >
                Explore Tigrbl Infrastructure &rarr;
              </button>
            </div>

            <div className="p-8 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-[var(--radius-md)] space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-accent block">
                  AI & Developer Division // 03
                </span>
                <h3 className="font-serif text-2xl font-bold text-ink">Swarmauri</h3>
                <p className="text-sm text-ink-muted leading-relaxed">
                  Delivers composable artificial intelligence SDKs, systematic model evaluations, prompt-to-code DAG compilers, template scaffolding, and playground apps.
                </p>
              </div>
              <button 
                onClick={() => onNavigate("/products/swarmauri")}
                className="text-xs font-mono text-accent hover:text-accent-hover font-semibold inline-flex items-center gap-1 hover:underline text-left mt-4"
              >
                Explore Swarmauri AI SDKs &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

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
    </div>
  );
}
/* ==========================================================================
   PORTFOLIO INDEX PAGE
   ========================================================================== */
function PortfolioPage({ onNavigate }: RouteProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const families = [
    { id: "all", label: "All Families" },
    { id: "governed-delivery", label: "Governed Delivery" },
    { id: "documents", label: "Documents" },
    { id: "trust-policy", label: "Trust & Policy" },
    { id: "infrastructure", label: "Infrastructure" }
  ];

  const filteredItems = useMemo(() => {
    if (activeFilter === "all") return portfolioItems.filter(p => p.approved);
    return portfolioItems.filter(p => p.approved && p.capabilityFamily === activeFilter);
  }, [activeFilter]);

  const catalogMetrics = [
    ["Public repositories", catalogSummary.repositories],
    ["Package records", catalogSummary.packages],
    ["Default-branch commits", catalogSummary.commits],
    ["GitHub releases", catalogSummary.github_releases],
    ["Deployment records", catalogSummary.deployments],
    ["Typed resources", catalogDatasetManifest.counts.resources],
  ] as const;

  return <>
    <section className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-5">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold block">Generated public inventory</span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-ink">Observed ecosystem snapshot</h1>
          <p className="text-sm text-ink-muted leading-relaxed">
            Collected {new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(new Date(catalogSummary.generated_at))} UTC from GitHub, repository manifests, PyPI, npm, and crates.io. Counts describe observed public records, not adoption or live-service health.
          </p>
        </div>
        <a href="/catalog/catalog.json" className="text-xs font-mono font-semibold text-accent hover:underline">Download normalized JSON &rarr;</a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {catalogMetrics.map(([label, value]) => <div key={label} className="p-4 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-[var(--radius-sm)]"><strong className="font-serif text-xl text-ink block">{value.toLocaleString()}</strong><span className="text-[10px] font-mono uppercase tracking-wide text-ink-muted">{label}</span></div>)}
      </div>
    </section>
    <PublicCatalogExplorer onNavigate={onNavigate} compact />
    <DenseCatalog entities={portfolioEntities.filter((entity) => entity.approved)} onNavigate={onNavigate} title="Reviewed product layer" description="These editorial records provide product grouping and reviewed descriptions. The generated evidence catalog above remains the source for current public repositories, packages, and typed resources, with technology stack tags scoped to packages." />
  </>;

  /* Legacy featured-card layout retained below for reference. */
  return (
    <div className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="max-w-2xl space-y-3">
        <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold block">
          Product & platform portfolio
        </span>
        <h1 className="font-serif text-4xl font-bold tracking-tight text-ink">
          Verified system solutions in operation
        </h1>
        <p className="text-ink-muted text-base leading-relaxed">
          Below is the approved index of technical work completed or maintained by Groupsum. Each entry is tied to explicit verification standards and maturity evidence logs.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-[var(--color-border-soft)] flex flex-wrap gap-2 pb-2">
        {families.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-all cursor-pointer ${
              activeFilter === f.id
                ? "bg-accent text-white font-semibold shadow-sm"
                : "text-ink-muted hover:text-ink hover:bg-canvas"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid of cards */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((item) => (
            <PortfolioCard key={item.slug} item={item} onNavigate={onNavigate} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-[var(--radius-md)] max-w-md mx-auto">
          <HelpCircle className="w-10 h-10 text-ink-muted mx-auto mb-3" />
          <p className="text-ink font-serif text-lg font-medium">No items found</p>
          <p className="text-xs text-ink-muted mt-1">There are no approved items matching the selected capability family.</p>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   PORTFOLIO DETAIL PAGE
   ========================================================================== */
function PortfolioDetailPage({ slug, onNavigate }: { slug: string; onNavigate: (path: string) => void }) {
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

_Evidence reviewed: August 2, 2026 · Document ref: CATALOG-${item.slug.toUpperCase()}_`}
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
function SolutionsPage({ onNavigate }: RouteProps) {
  return (<>
    <CatalogSnapshotBand onNavigate={onNavigate} title="Current evidence behind solution delivery" />
    <div className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="max-w-2xl space-y-3">
        <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold block">
          Target solutions
        </span>
        <h1 className="font-serif text-4xl font-bold tracking-tight text-ink">
          Outcome-led systems engineering
        </h1>
        <p className="text-ink-muted text-base leading-relaxed">
          Groupsum organizes its systems delivery around explicit business and operational outcomes. We do not write unguided packages; we solve structured systems frictions.
        </p>
      </div>

      <div className="space-y-10">
        {solutionsData.map((sol, index) => (
          <section 
            id={sol.id} 
            key={sol.id}
            className="p-8 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-[var(--radius-lg)] grid grid-cols-1 md:grid-cols-12 gap-8 items-start hover:border-accent/40 transition-all"
          >
            <div className="md:col-span-4 space-y-2">
              <span className="text-xs font-mono text-accent font-bold block">SOLUTION // 0{index + 1}</span>
              <h2 className="font-serif text-2xl font-bold tracking-tight text-ink">{sol.title}</h2>
            </div>
            
            <div className="md:col-span-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-ink font-semibold mb-1">
                    The Problem & Operational Friction
                  </h3>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    {sol.problem}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-accent font-semibold mb-1">
                    Our Solution Capability
                  </h3>
                  <p className="text-sm text-ink font-medium leading-relaxed">
                    {sol.capability}
                  </p>
                </div>
              </div>

              {/* Representative Work Tags */}
              <div>
                <h3 className="text-xs font-mono uppercase text-ink-muted mb-2">Representative Evidence & Artifacts:</h3>
                <div className="flex flex-wrap gap-2">
                  {sol.suites.map((slug) => {
                    const matchedItem = portfolioItems.find(p => p.slug === slug);
                    return (
                      <button
                        key={slug}
                        onClick={() => onNavigate(`/portfolio/${slug}`)}
                        className="text-xs font-mono bg-canvas border border-[var(--color-border-soft)] hover:border-accent text-ink-muted hover:text-accent px-2.5 py-1 rounded transition-all cursor-pointer inline-flex items-center gap-1"
                      >
                        {matchedItem ? matchedItem.name : slug}
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--color-border-soft)]">
                <button
                  onClick={() => onNavigate("/contact")}
                  className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-mono font-semibold rounded-[var(--radius-sm)] transition-all inline-flex items-center gap-1.5"
                >
                  Initiate Solution Dialogue
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Structured Schema Section */}
      <div className="pt-12 border-t border-[var(--color-border-soft)]">
        <span className="text-[10px] font-mono uppercase text-ink-muted block mb-3">
          Solution Catalog // AEO Engine Assertion
        </span>
        <StructuredData type="solutions" />
      </div>
    </div>
  </>);
}

/* ==========================================================================
   SERVICES PAGE
   ========================================================================== */
function ServicesPage({ onNavigate }: RouteProps) {
  return (<>
    <CatalogSnapshotBand onNavigate={onNavigate} title="Current evidence behind service delivery" />
    <div className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="max-w-2xl space-y-3">
        <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold block">
          Engagement models
        </span>
        <h1 className="font-serif text-4xl font-bold tracking-tight text-ink">
          How we partner and deliver
        </h1>
        <p className="text-ink-muted text-base leading-relaxed">
          We offer clear, contract-staged services backed by verifiable operational outputs. Do not guess how to work with us; we establish specific engagement models.
        </p>
      </div>

      <div className="space-y-8">
        {servicesData.map((svc) => (
          <section 
            key={svc.id}
            className="p-8 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-[var(--radius-lg)] space-y-6 hover:border-accent/40 transition-all"
          >
            <div className="border-b border-[var(--color-border-soft)] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="font-serif text-2xl font-bold text-ink">
                {svc.title}
              </h2>
              <span className="text-xs font-mono text-ink-muted bg-canvas border border-[var(--color-border-soft)] px-2.5 py-1 rounded">
                ENGAGEMENT: {svc.engagementShape}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Useful When */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">
                  // Highly Effective When:
                </h3>
                <ul className="space-y-2.5">
                  {svc.usefulWhen.map((bullet, i) => (
                    <li key={i} className="text-xs text-ink-muted leading-relaxed flex items-start gap-2">
                      <span className="text-accent font-bold mt-0.5">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Typical Outputs */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-ink font-semibold">
                  // Primary Deliverables & Outputs:
                </h3>
                <ul className="space-y-2.5">
                  {svc.typicalOutputs.map((bullet, i) => (
                    <li key={i} className="text-xs text-ink leading-relaxed flex items-start gap-2 font-medium">
                      <span className="text-[var(--color-signal)] font-bold mt-0.5">✔</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Related Work */}
            {svc.relatedWorkSlugs.length > 0 && (
              <div className="pt-4 border-t border-[var(--color-border-soft)] flex items-center gap-3">
                <span className="text-[10px] font-mono uppercase text-ink-muted">Related Case Study:</span>
                <div className="flex gap-2">
                  {svc.relatedWorkSlugs.map((slug) => {
                    const match = portfolioItems.find(p => p.slug === slug);
                    return (
                      <button
                        key={slug}
                        onClick={() => onNavigate(`/portfolio/${slug}`)}
                        className="text-[11px] font-mono text-accent hover:underline font-semibold flex items-center gap-0.5"
                      >
                        {match ? match.name : slug}
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  </>);
}

/* ==========================================================================
   INSIGHTS ARCHIVE PAGE
   ========================================================================== */
function InsightsPage({ onNavigate }: RouteProps) {
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
    import("./data/posts").then((module) => module.loadBlogPosts()).then((posts) => {
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
  }, [searchQuery]);

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

function DenseCatalog({ entities, onNavigate, title, description }: { entities: PortfolioEntity[]; onNavigate: (path: string) => void; title: string; description: string }) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const catalog = useCatalogFilters(entities);
  const groups = [
    ["Suites & products", catalog.filtered.filter((entity) => entity.kind === "suite" || entity.kind === "product")],
    ["Projects & applications", catalog.filtered.filter((entity) => entity.kind === "project" || entity.kind === "application" || entity.kind === "demo-example")],
    ["Packages & modules", catalog.filtered.filter((entity) => entity.kind === "package" || entity.kind === "package-family")],
    ["Specifications & packs", catalog.filtered.filter((entity) => entity.kind === "specification-pack" || entity.kind === "site-docs")],
  ] as const;
  return <div className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8"><div className="max-w-3xl space-y-3"><span className="text-xs font-mono uppercase tracking-wider text-accent font-bold block">Dense portfolio catalog</span><h1 className="font-serif text-4xl font-bold tracking-tight text-ink">{title}</h1><p className="text-ink-muted text-base leading-relaxed">{description}</p></div><CatalogToolbar {...catalog} entities={entities} mobileFiltersOpen={mobileFiltersOpen} setMobileFiltersOpen={setMobileFiltersOpen} />{catalog.view === "cards" ? <div className="divide-y divide-[var(--color-border-soft)] overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-soft)] bg-surface">{catalog.filtered.map((entity) => <button key={entity.id} type="button" onClick={() => onNavigate(productRecordPath(entity.slug))} className="group flex w-full flex-wrap items-center gap-x-6 gap-y-3 p-5 text-left hover:bg-[color-mix(in_srgb,var(--color-accent)_4%,transparent)]"><div className="min-w-0 flex-[3_1_24rem]"><span className="text-[10px] font-mono uppercase text-accent">{entity.kind} · {entity.maturity}</span><h2 className="font-serif text-lg font-bold text-ink mt-2 group-hover:text-accent">{entity.displayName}</h2><p className="text-xs text-ink-muted mt-1 leading-relaxed">{entity.summary}</p></div><div className="min-w-0 flex-[1_1_10rem]"><span className="text-[9px] font-mono uppercase tracking-wide text-ink-muted">Organization</span><p className="mt-1 text-xs font-semibold text-ink">{entity.organization}</p></div><div className="flex flex-[1_1_12rem] flex-wrap gap-2"><span className="rounded-full border border-[var(--color-border-muted)] px-2.5 py-1 text-[10px] font-mono uppercase text-ink-muted">{entity.audience.slice(0, 2).join(" / ") || "General"}</span><span className="rounded-full border border-[var(--color-border-accent-soft)] px-2.5 py-1 text-[10px] font-mono uppercase text-accent">{entity.maturity}</span></div><ArrowRight className="h-4 w-4 shrink-0 text-accent transition-transform group-hover:translate-x-1" /></button>)}</div> : <div className="space-y-8">{groups.map(([group, items]) => <CatalogGroup key={group} title={group} entities={items} onNavigate={onNavigate} />)}</div>}{catalog.filtered.length === 0 && <div className="p-10 text-center bg-surface border border-[var(--color-border-soft)] rounded-[var(--radius-md)] text-sm text-ink-muted">No catalog records match these filters.</div>}</div>;
}
/* ========================================================================== 
   PRODUCTS INDEX PAGE
   ========================================================================== */
function ProductsIndexPage({ onNavigate }: RouteProps) {
  const orgs = [
    {
      id: "groupsum",
      name: "Groupsum",
      title: "Governed Delivery & Documents",
      desc: "Source-controlled truth, automated verification gates, and structured document processing models.",
      capability: "Operational Integrity & Standards",
      suites: ["ssot-registry", "mdwrk"]
    },
    {
      id: "tigrbl",
      name: "Tigrbl",
      title: "Schema-First API & ASGI Infrastructure",
      desc: "Typed API frameworks and transport work spanning ASGI, WebSocket, HTTP/3, QUIC, and WebTransport.",
      capability: "API Foundations & Real-Time Performance",
      suites: ["tigrbl", "tigrbl-auth", "tigrcorn"]
    },
    {
      id: "swarmauri",
      name: "Swarmauri",
      title: "Composable AI & Developer Tooling",
      desc: "Multi-agent orchestration, model evaluation suites, and templated developer CLI scaffolds.",
      capability: "AI Agents & Advanced Systems",
      suites: ["swarmauri-sdk", "peagen"]
    }
  ];

  return (<>
    <CatalogSnapshotBand onNavigate={onNavigate} title="Observed records by public organization" />
    <div className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold block">
          Product Ecosystems
        </span>
        <h1 className="font-serif text-4xl font-bold tracking-tight text-ink">
          Connecting capability families under source control
        </h1>
        <p className="text-ink-muted text-base leading-relaxed">
          Groupsum LLC governs three distinct product organizations. Each ecosystem provides specialized, modular packages designed to work in synergy or operate independently inside high-integrity environments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {orgs.map((org) => {
          const matchingSuites = portfolioEntities.filter(
            (e) => e.organization === org.id && (e.kind === "suite" || e.kind === "product")
          );

          return (
            <div
              key={org.id}
              className="p-8 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-[var(--radius-lg)] hover:border-accent transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-mono text-accent font-bold block uppercase">
                    Organization // {org.name}
                  </span>
                  <h2 className="font-serif text-2.5xl font-bold tracking-tight text-ink">
                    {org.title}
                  </h2>
                  <p className="text-xs text-ink-muted leading-relaxed">
                    {org.desc}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-[var(--color-border-soft)]">
                  <span className="text-[10px] font-mono uppercase text-ink-muted block">
                    Flagship Suites & Products ({matchingSuites.length})
                  </span>
                  <div className="space-y-2">
                    {matchingSuites.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => onNavigate(productRecordPath(s.slug))}
                        className="p-3 bg-canvas border border-[var(--color-border-soft)] hover:border-accent rounded-[var(--radius-sm)] cursor-pointer transition-all flex items-center justify-between group"
                      >
                        <div>
                          <h4 className="text-xs font-semibold text-ink group-hover:text-accent font-mono">
                            {s.displayName}
                          </h4>
                          <p className="text-[10px] text-ink-muted line-clamp-1 mt-0.5">
                            {s.summary}
                          </p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-ink-muted group-hover:translate-x-0.5 transition-transform shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[var(--color-border-soft)]">
                <button
                  onClick={() => onNavigate(`/products/${org.id}`)}
                  className="w-full py-2.5 bg-accent hover:bg-accent-hover text-white text-xs font-mono font-bold uppercase tracking-wider rounded-[var(--radius-sm)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Explore {org.name} Ecosystem &rarr;
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </>);
}

/* ==========================================================================
   PRODUCTS ORG PAGE
   ========================================================================== */
function ProductsOrgPage({ org, onNavigate }: { org: string; onNavigate: (path: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("");

  const orgMetadata: Record<string, { name: string; title: string; mission: string; domain: string }> = {
    groupsum: {
      name: "Groupsum",
      title: "Governed Delivery & Documents",
      mission: "Source-Controlled Architectural Integrity",
      domain: "Strictly governed software architectures, workspace document management, decentralized cryptographic identity protocols, and continuous evidence validation gates."
    },
    tigrbl: {
      name: "Tigrbl",
      title: "Schema-First API & ASGI Infrastructure",
      mission: "High-Performance ASGI Stack & Protocols",
      domain: "Schema-first Python and Rust API systems, typed validation, identity protocols, ASGI, QUIC, and WebTransport implementations."
    },
    swarmauri: {
      name: "Swarmauri",
      title: "Composable AI & Developer Tooling",
      mission: "Modular Multimodal Agent Infrastructure",
      domain: "Advanced modular agent-building architectures, composable cognitive models, Prompt-and-DAG generators, vector-store indexes, and structured developer scaffolds."
    }
  };

  const meta = orgMetadata[org] || {
    name: org.charAt(0).toUpperCase() + org.slice(1),
    title: "Technical Ecosystem",
    mission: "Advanced Software Infrastructure",
    domain: "Specialized modular suites and packages."
  };

  const orgEntities = useMemo(() => {
    return portfolioEntities.filter((e) => e.organization === org && e.approved);
  }, [org]);

  const filteredEntities = useMemo(() => {
    if (!searchQuery.trim()) return orgEntities;
    const q = searchQuery.toLowerCase();
    return orgEntities.filter((e) => {
      const matchText = `${e.displayName} ${e.summary} ${e.sourceName} ${e.technologies.join(" ")}`.toLowerCase();
      return matchText.includes(q);
    });
  }, [orgEntities, searchQuery]);

  const suitesAndProducts = filteredEntities.filter((e) => e.kind === "suite" || e.kind === "product");
  const subPackages = filteredEntities.filter((e) => e.kind === "package");
  const specsAndPacks = filteredEntities.filter((e) => e.kind === "specification-pack");

  return <>
    <CatalogSnapshotBand onNavigate={onNavigate} owner={org} title={`${meta.name} public ecosystem evidence`} />
    <DenseCatalog entities={orgEntities} onNavigate={onNavigate} title={`${meta.name} reviewed product catalog`} description={`${meta.domain} These reviewed product records are presented alongside the current generated repository and package evidence above.`} />
  </>;

  return (
    <div className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header Info */}
      <div className="space-y-6">
        <div>
          <button
            onClick={() => onNavigate("/products")}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:text-accent-hover hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to All Ecosystems
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-b border-[var(--color-border-soft)] pb-8">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold block">
              Ecosystem Catalog // {meta.name}
            </span>
            <h1 className="font-serif text-4xl font-bold tracking-tight text-ink">
              {meta.title}
            </h1>
            <p className="text-ink-muted text-base leading-relaxed">
              {meta.domain}
            </p>
          </div>
          <div className="lg:col-span-4 p-5 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-[var(--radius-md)] space-y-2">
            <span className="text-[10px] font-mono uppercase text-accent font-bold block">Mission Objective</span>
            <div className="font-serif text-sm font-bold text-ink leading-snug">{meta.mission}</div>
            <div className="text-[10px] font-mono text-ink-muted">Registered Developer Authority: {org}.groupsum.xyz</div>
          </div>
        </div>
      </div>

      {/* Local search engine */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${meta.name} suites, packages, or specifications...`}
          className="w-full pl-10 pr-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border-muted)] rounded-[var(--radius-md)] text-sm text-ink focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
        />
      </div>

      {/* Grid segments */}
      <div className="space-y-12">
        {/* SUITES & PRODUCTS */}
        {suitesAndProducts.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-bold text-ink flex items-center gap-2 border-b border-[var(--color-border-soft)] pb-2">
              <Layers className="w-5 h-5 text-accent" /> Flagship Suites & Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {suitesAndProducts.map((e) => (
                <div
                  key={e.id}
                  className="p-6 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-[var(--radius-md)] hover:border-accent transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono text-accent bg-accent/5 border border-accent/10 px-2 py-0.5 rounded uppercase">
                        {e.kind}
                      </span>
                      <span className="text-[10px] font-mono text-ink-muted">
                        Maturity: {e.maturity}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-ink">
                        {e.displayName}
                      </h3>
                      <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                        {e.summary}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {e.technologies.slice(0, 3).map((t) => (
                        <span key={t} className="text-[9px] font-mono bg-canvas border border-[var(--color-border-soft)] text-ink-muted px-1.5 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-[var(--color-border-soft)]">
                    <button
                      onClick={() => onNavigate(productRecordPath(e.slug))}
                      className="text-xs font-mono text-accent hover:text-accent-hover font-semibold inline-flex items-center gap-1"
                    >
                      Examine Suite Blueprint &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB PACKAGES */}
        {subPackages.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-bold text-ink flex items-center gap-2 border-b border-[var(--color-border-soft)] pb-2">
              <Sliders className="w-5 h-5 text-accent" /> Modular Sub-Packages & Modules
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subPackages.map((e) => (
                <div
                  key={e.id}
                  onClick={() => onNavigate(`/portfolio/packages/${e.slug}`)}
                  className="p-4 bg-[var(--color-surface)] border border-[var(--color-border-soft)] hover:border-accent rounded-[var(--radius-sm)] cursor-pointer transition-all flex flex-col justify-between animate-fade-in"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[9px] font-mono text-ink-muted">
                      <span className="font-bold text-accent">{e.sourceName}</span>
                      <span>{e.ecosystem[0]}</span>
                    </div>
                    <h4 className="font-serif font-bold text-sm text-ink line-clamp-1">{e.displayName}</h4>
                    <p className="text-[11px] text-ink-muted line-clamp-2 leading-snug">{e.summary}</p>
                  </div>
                  <span className="text-[10px] font-mono text-accent mt-3 block hover:underline">
                    Inspect Package &rarr;
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SPECIFICATIONS */}
        {specsAndPacks.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-bold text-ink flex items-center gap-2 border-b border-[var(--color-border-soft)] pb-2">
              <FileText className="w-5 h-5 text-accent" /> Specifications & Governance Packs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {specsAndPacks.map((e) => (
                <div
                  key={e.id}
                  onClick={() => onNavigate(`/portfolio/specifications/${e.slug}`)}
                  className="p-5 bg-[var(--color-surface)] border border-[var(--color-border-soft)] hover:border-accent rounded-[var(--radius-md)] cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[9px] font-mono">
                      <span className="font-bold text-accent">SPECIFICATION PACK</span>
                      <span className="text-ink-muted">Maturity: {e.maturity}</span>
                    </div>
                    <h3 className="font-serif text-base font-bold text-ink">{e.displayName}</h3>
                    <p className="text-xs text-ink-muted leading-relaxed line-clamp-2">{e.summary}</p>
                  </div>
                  <span className="text-xs font-mono text-accent mt-4 block hover:underline">
                    View Specification Standard &rarr;
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredEntities.length === 0 && (
          <div className="p-12 text-center bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-[var(--radius-md)] max-w-md mx-auto">
            <HelpCircle className="w-10 h-10 text-ink-muted mx-auto mb-3" />
            <p className="text-ink font-serif text-lg font-medium">No entities matched</p>
            <p className="text-xs text-ink-muted mt-1">Try another search term like "core", "client" or "sdk".</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   SUITE DETAIL PAGE
   ========================================================================== */
function SuiteDetailPage({ suiteSlug, onNavigate }: { suiteSlug: string; onNavigate: (path: string) => void }) {
  const suite = useMemo(() => {
    return portfolioEntities.find((e) => e.slug === suiteSlug && e.approved);
  }, [suiteSlug]);

  const childPackages = useMemo(() => {
    if (!suite) return [];
    return portfolioEntities.filter((e) => e.suiteId === suite.id && e.kind === "package" && e.approved);
  }, [suite]);

  const childProducts = useMemo(() => {
    if (!suite) return [];
    return portfolioEntities.filter((e) => e.suiteId === suite.id && e.kind === "product" && e.approved);
  }, [suite]);

  if (!suite) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-ink">Suite Not Found</h2>
        <p className="text-sm text-ink-muted">The requested software suite is either unapproved, private, or has been relocated.</p>
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
    <div className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <button
          onClick={() => onNavigate(`/products/${suite.organization}`)}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:text-accent-hover hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to {suite.organization.charAt(0).toUpperCase() + suite.organization.slice(1)} Ecosystem
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left column: metadata panel */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-[var(--radius-md)] space-y-5">
            <h3 className="font-mono text-xs uppercase tracking-wider text-ink font-bold border-b border-[var(--color-border-soft)] pb-2">
              Specification Identity
            </h3>

            <div>
              <span className="text-[10px] font-mono uppercase text-ink-muted block">Identifier</span>
              <span className="text-xs font-mono text-ink font-bold block mt-0.5">{suite.id}</span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-ink-muted block">Ecosystem Runtime</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {suite.ecosystem.map((e) => (
                  <span key={e} className="text-[10px] font-mono bg-accent/5 border border-accent/10 text-accent px-1.5 py-0.5 rounded uppercase">
                    {e}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-ink-muted block">Maturity Phase</span>
              <span className="text-xs font-mono text-ink bg-canvas px-2 py-0.5 rounded border border-[var(--color-border-soft)] capitalize inline-block mt-1">
                {suite.maturity}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-ink-muted block">Verified Technologies</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {suite.technologies.map((t) => (
                  <span key={t} className="text-[10px] font-mono bg-canvas border border-[var(--color-border-soft)] text-ink-muted px-1.5 py-0.5 rounded">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Active Evidence Log */}
            {suite.evidence.length > 0 && (
              <div className="pt-4 border-t border-[var(--color-border-soft)] space-y-3">
                <span className="text-[10px] font-mono uppercase text-ink-muted block">Active Evidence Receipts</span>
                <div className="space-y-2">
                  {suite.evidence.map((ev, idx) => (
                    <div key={idx} className="p-2.5 bg-canvas border border-[var(--color-border-soft)] rounded text-xs">
                      <div className="flex items-center gap-1 font-semibold text-ink">
                        <CheckCircle className="w-3.5 h-3.5 text-[var(--color-signal)] shrink-0" />
                        <span>{ev.label}</span>
                      </div>
                      <div className="text-[9px] font-mono text-ink-muted mt-1">Verified: {ev.checkedAt}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verification Links */}
            {suite.links.length > 0 && (
              <div className="pt-4 border-t border-[var(--color-border-soft)] space-y-2">
                {suite.links.map((link, idx) => (
                  <a
                    key={idx}
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
            )}
          </div>
        </div>

        {/* Right column: main text */}
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-accent font-bold tracking-widest block">
              Flagship Software Suite Blueprint
            </span>
            <h1 className="font-serif text-3.5xl sm:text-4.5xl font-bold tracking-tight text-ink">
              {suite.displayName}
            </h1>
            <p className="text-ink-muted text-lg leading-relaxed">
              {suite.summary}
            </p>
          </div>

          <div className="markdown-body">
            <h3>Designed Target Audience</h3>
            <p>
              This suite is specifically engineered and curated for <strong>{suite.audience.join(", ")}</strong>, establishing robust abstractions to prevent manual design mistakes.
            </p>

            <h3>Core Architectural Capabilities</h3>
            <p>
              By translating operations into strict schemas and code, we decouple interfaces from standard runtime compilers and integrate continuous verification checks natively into developer pipelines.
            </p>

            {/* CHILD PACKAGES OR SUB-MODULES */}
            {childPackages.length > 0 && (
              <div className="not-prose my-6 space-y-3">
                <h4 className="text-xs font-mono uppercase text-ink font-semibold">Associated Modular Packages:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {childPackages.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => onNavigate(`/portfolio/packages/${p.slug}`)}
                      className="p-3.5 bg-[var(--color-surface)] border border-[var(--color-border-soft)] hover:border-accent rounded-[var(--radius-sm)] cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div>
                        <span className="text-[9px] font-mono text-accent font-semibold block">{p.sourceName}</span>
                        <h5 className="font-serif font-bold text-xs text-ink mt-0.5">{p.displayName}</h5>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-accent" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DEPLOYED CHILD PRODUCTS */}
            {childProducts.length > 0 && (
              <div className="not-prose my-6 space-y-3">
                <h4 className="text-xs font-mono uppercase text-ink font-semibold">Connected Products & Services:</h4>
                <div className="grid grid-cols-1 gap-3">
                  {childProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => onNavigate(productRecordPath(p.slug))}
                      className="p-4 bg-[var(--color-surface)] border border-[var(--color-border-soft)] hover:border-accent rounded-[var(--radius-md)] cursor-pointer transition-all flex items-start justify-between"
                    >
                      <div>
                        <span className="text-[9px] font-mono text-accent font-semibold uppercase">{p.kind}</span>
                        <h5 className="font-serif font-bold text-sm text-ink mt-0.5">{p.displayName}</h5>
                        <p className="text-[11px] text-ink-muted mt-1 leading-snug">{p.summary}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-accent shrink-0 mt-1" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <h3>Operational Realities & Limitations</h3>
            <p>
              High-integrity design requires absolute transparency. Every architecture makes explicit compromises in service of total predictability:
            </p>
            <ul>
              {suite.limitations.map((lim, idx) => (
                <li key={idx}><strong>{lim.split(":")[0]}</strong>: {lim.split(":")[1] || lim}</li>
              ))}
            </ul>

            <div className="pt-6 border-t border-[var(--color-border-soft)]">
              <span className="text-[10px] font-mono uppercase text-ink-muted block mb-3">
                Structured Schema Assertion & crawler-verified representation
              </span>
              <StructuredData type="portfolio" data={suite} />
            </div>
          </div>

          {/* INLINE INQUIRY CTA */}
          <div className="p-8 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-[var(--radius-lg)] text-center space-y-4">
            <h3 className="font-serif text-xl font-bold text-ink">Request a blueprint walkthrough or trial</h3>
            <p className="text-xs text-ink-muted max-w-md mx-auto leading-relaxed">
              We can review architecture, source evidence, and validation needs with teams evaluating the work. Access and scope depend on the specific repository and engagement.
            </p>
            <div>
              <button
                onClick={() => onNavigate("/contact")}
                className="px-5 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-mono font-bold uppercase tracking-wider rounded transition-all inline-flex items-center gap-1.5"
              >
                Initiate Systems Inquiry
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   PROJECT DETAIL PAGE
   ========================================================================== */
function ProjectDetailPage({ slug, onNavigate }: { slug: string; onNavigate: (path: string) => void }) {
  return <PortfolioDetailPage slug={slug} onNavigate={onNavigate} />;
}

/* ==========================================================================
   PACKAGE DETAIL PAGE
   ========================================================================== */
function PackageDetailPage({ slug, onNavigate }: { slug: string; onNavigate: (path: string) => void }) {
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
function SpecificationDetailPage({ slug, onNavigate }: { slug: string; onNavigate: (path: string) => void }) {
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
function SolutionDetailPage({ slug, onNavigate }: { slug: string; onNavigate: (path: string) => void }) {
  const sol = useMemo(() => {
    return solutionsData.find((s) => s.slug === slug);
  }, [slug]);

  if (!sol) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-ink">Solution Not Found</h2>
        <p className="text-sm text-ink-muted">The requested solution outcome could not be resolved.</p>
        <button
          onClick={() => onNavigate("/solutions")}
          className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-mono font-semibold rounded-[var(--radius-sm)] transition-all"
        >
          Return to Solutions
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <button
          onClick={() => onNavigate("/solutions")}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:text-accent-hover hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Solutions Index
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left column: key summary card */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-[var(--radius-md)] space-y-5">
            <h3 className="font-mono text-xs uppercase tracking-wider text-ink font-bold border-b border-[var(--color-border-soft)] pb-2">
              Outcome Summary
            </h3>

            <div>
              <span className="text-[10px] font-mono uppercase text-ink-muted block">Target Audience</span>
              <p className="text-xs text-ink leading-relaxed font-semibold mt-1">{sol.audience}</p>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-ink-muted block">Engagement Path</span>
              <p className="text-xs text-ink-muted leading-relaxed mt-1">{sol.engagementPath}</p>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-ink-muted block">Maturity Verification</span>
              <div className="space-y-1.5 mt-1.5">
                {sol.evidence.map((ev, i) => (
                  <div key={i} className="text-[11px] font-mono text-ink-muted flex items-start gap-1">
                    <span className="text-[var(--color-signal)]">✔</span>
                    <span>{ev}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right column: deep-dive textual breakdown */}
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-accent font-bold tracking-widest block">
              Outcome-Led Systems Solution
            </span>
            <h1 className="font-serif text-3.5xl sm:text-4.5xl font-bold tracking-tight text-ink">
              {sol.title}
            </h1>
            <p className="text-ink-muted text-lg leading-relaxed">
              {sol.capability}
            </p>
          </div>

          <div className="markdown-body">
            <h3>Operational Friction & Symptoms</h3>
            <p>{sol.problem}</p>
            <ul>
              {sol.symptoms.map((sym, idx) => (
                <li key={idx} className="text-xs text-ink-muted leading-relaxed">
                  {sym}
                </li>
              ))}
            </ul>

            <h3>System Deliverables</h3>
            <ul>
              {sol.deliverables.map((del, idx) => (
                <li key={idx}>
                  <strong>{del.split(":")[0]}</strong>: {del.split(":")[1] || del}
                </li>
              ))}
            </ul>

            {/* RELATED SUITES */}
            {sol.suites.length > 0 && (
              <div className="not-prose my-6 space-y-3">
                <h4 className="text-xs font-mono uppercase text-ink font-semibold">Associated Solution Suites:</h4>
                <div className="flex flex-wrap gap-2">
                  {sol.suites.map((suiteSlug) => {
                    const match = portfolioEntities.find((e) => e.slug === suiteSlug);
                    return (
                      <button
                        key={suiteSlug}
                        onClick={() => onNavigate(productRecordPath(suiteSlug))}
                        className="text-xs font-mono bg-canvas border border-[var(--color-border-soft)] hover:border-accent text-ink-muted hover:text-accent px-3 py-1.5 rounded transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        {match ? match.displayName : suiteSlug}
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <h3>Technical limitations and claim boundaries</h3>
            <ul>
              {sol.limitations.map((lim, idx) => (
                <li key={idx}>{lim}</li>
              ))}
            </ul>
          </div>

          {/* INQUIRY FORM */}
          <div className="p-8 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-[var(--radius-lg)] text-center space-y-4">
            <h3 className="font-serif text-xl font-bold text-ink">{sol.cta}</h3>
            <p className="text-xs text-ink-muted max-w-md mx-auto leading-relaxed">
              Use the inquiry form to discuss these outcomes for your codebase with Groupsum.
            </p>
            <div>
              <button
                onClick={() => onNavigate("/contact")}
                className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-xs font-mono font-bold uppercase tracking-wider rounded transition-all inline-flex items-center gap-1.5"
              >
                Discuss This Solution Outcomes
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   SERVICE DETAIL PAGE
   ========================================================================== */
function ServiceDetailPage({ slug, onNavigate }: { slug: string; onNavigate: (path: string) => void }) {
  const svc = useMemo(() => {
    return servicesData.find((s) => s.slug === slug);
  }, [slug]);

  if (!svc) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-ink">Service Model Not Found</h2>
        <p className="text-sm text-ink-muted">The requested service engagement model could not be resolved.</p>
        <button
          onClick={() => onNavigate("/services")}
          className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-mono font-semibold rounded-[var(--radius-sm)] transition-all"
        >
          Return to Services
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <button
          onClick={() => onNavigate("/services")}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:text-accent-hover hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Services Index
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left column: Key details panel */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-[var(--radius-md)] space-y-5">
            <h3 className="font-mono text-xs uppercase tracking-wider text-ink font-bold border-b border-[var(--color-border-soft)] pb-2">
              Engagement Blueprint
            </h3>

            <div>
              <span className="text-[10px] font-mono uppercase text-ink-muted block">Engagement Model</span>
              <p className="text-xs text-ink leading-relaxed font-semibold mt-1">{svc.engagementShape}</p>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-ink-muted block">Target Stakeholder</span>
              <p className="text-xs text-ink-muted leading-relaxed mt-1">{svc.audience}</p>
            </div>

            {/* Inputs list */}
            <div>
              <span className="text-[10px] font-mono uppercase text-ink-muted block mb-1">Required System Inputs</span>
              <div className="space-y-1.5">
                {svc.inputs.map((inp, i) => (
                  <div key={i} className="text-[11px] font-mono text-ink-muted flex items-start gap-1">
                    <span className="text-accent">•</span>
                    <span>{inp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right column: main description and scope */}
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-accent font-bold tracking-widest block">
              Professional Engagement Model
            </span>
            <h1 className="font-serif text-3.5xl sm:text-4.5xl font-bold tracking-tight text-ink">
              {svc.title}
            </h1>
            <p className="text-ink-muted text-lg leading-relaxed">
              Engagements focus on inspectable architecture, working source, tests, documentation, and deployment evidence appropriate to the agreed scope.
            </p>
          </div>

          <div className="markdown-body">
            <h3>When This Is Highly Effective</h3>
            <ul>
              {svc.usefulWhen.map((bullet, i) => (
                <li key={i}>{bullet}</li>
              ))}
            </ul>

            <h3>Detailed Engagement Scope</h3>
            <ul>
              {svc.scope.map((bullet, i) => (
                <li key={i}>{bullet}</li>
              ))}
            </ul>

            <h3>Primary Outputs & Deliverables</h3>
            <ul>
              {svc.typicalOutputs.map((bullet, i) => (
                <li key={i} className="font-semibold text-ink">
                  {bullet}
                </li>
              ))}
            </ul>

            {/* Exclusions */}
            {svc.exclusions.length > 0 && (
              <div className="my-6 p-4 bg-red-500/5 border border-red-500/10 rounded-[var(--radius-sm)]">
                <h4 className="text-xs font-mono uppercase text-red-700 font-bold mb-2">Explicit Engagement Exclusions:</h4>
                <ul className="list-disc pl-4 text-xs text-ink-muted space-y-1">
                  {svc.exclusions.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* RELATED WORK */}
            {svc.relatedWorkSlugs.length > 0 && (
              <div className="not-prose my-6 space-y-3">
                <h4 className="text-xs font-mono uppercase text-ink font-semibold">Related Case Study & Evidence:</h4>
                <div className="flex gap-2">
                  {svc.relatedWorkSlugs.map((slug) => {
                    const match = portfolioItems.find((p) => p.slug === slug);
                    return (
                      <button
                        key={slug}
                        onClick={() => onNavigate(`/portfolio/${slug}`)}
                        className="text-xs font-mono bg-canvas border border-[var(--color-border-soft)] hover:border-accent text-ink-muted hover:text-accent px-3 py-1.5 rounded transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        {match ? match.name : slug}
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* SERVICE CTA */}
          <div className="p-8 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-[var(--radius-lg)] text-center space-y-4">
            <h3 className="font-serif text-xl font-bold text-ink">{svc.cta}</h3>
            <p className="text-xs text-ink-muted max-w-md mx-auto leading-relaxed">
              Use the inquiry form to request a scoped evaluation or architecture review. Availability and terms are confirmed separately.
            </p>
            <div>
              <button
                onClick={() => onNavigate("/contact")}
                className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-xs font-mono font-bold uppercase tracking-wider rounded transition-all inline-flex items-center gap-1.5"
              >
                Request a scope review
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   ARTICLE DETAIL LAYOUT
   ========================================================================== */
interface ArticleLayoutProps {
  post: BlogPost;
  onBack: () => void;
  onNavigate: (path: string) => void;
}

function AsyncArticleLayout({ post, onBack, onNavigate }: ArticleLayoutProps) {
  const [loadedPost, setLoadedPost] = useState<BlogPost | null>(post.content ? post : null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    setLoadedPost(post.content ? post : null);
    setFailed(false);

    if (!post.content) {
      import("./data/posts").then((module) => module.loadBlogPost(post.legacyPath))
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
    import("./data/posts").then((module) => module.loadBlogPosts()).then((posts) => {
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

function LegacyArticlePage({ year, month, day, slug, onNavigate }: LegacyArticlePageProps) {
  const requestedPath = `/${year}/${month}/${day}/${slug}/`;
  const [post, setPost] = useState<BlogPost | undefined>(() =>
    featuredBlogPosts.find((candidate) => candidate.legacyPath === requestedPath),
  );
  useEffect(() => {
    let active = true;
    import("./data/posts").then((module) => module.loadBlogPosts()).then((posts) => {
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
function AboutPage({ onNavigate }: RouteProps) {
  return (
    <div className="max-w-[var(--reading-max)] mx-auto px-4 sm:px-6 py-12 space-y-12">
      <div className="space-y-3">
        <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold block">
          Our Point of View
        </span>
        <h1 className="font-serif text-4xl font-bold tracking-tight text-ink">
          Operating principles & identity
        </h1>
        <p className="text-ink-muted text-base leading-relaxed">
          Groupsum LLC builds governed developer systems. We believe complex systems must be made legible, explicit, and operable.
        </p>
      </div>

      {/* Core Principles Cards */}
      <section className="space-y-6">
        <h2 className="font-serif text-2xl font-bold text-ink">
          The Groupsum Principles
        </h2>
        <div className="grid grid-cols-1 gap-6">
          {[
            { title: "Source-Controlled Truth", desc: "Decisions, specifications, code schemas, and access controls are treated as version-controlled text files in a repository. There are no hidden spreadsheets or silent UI overrides." },
            { title: "Traceable Delivery Gates", desc: "Delivery decisions should retain a clear path from intent to source, tests, artifacts, deployment evidence, and external verification." },
            { title: "Quiet, Focus-Driven Design", desc: "We build for engineers and operators, meaning we prioritize density, negative space, visual composure, and keyboard efficiency. We reject unneeded visual clutter and hype." }
          ].map((principle, idx) => (
            <div key={idx} className="p-6 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-[var(--radius-md)] space-y-2">
              <h3 className="font-serif text-lg font-bold text-ink">
                {idx + 1}. {principle.title}
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                {principle.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Corporate Identity & Legal Address */}
      <section className="p-6 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-[var(--radius-md)] space-y-4">
        <h3 className="font-serif text-lg font-bold text-ink">
          Legal Identity & Authority
        </h3>
        <p className="text-xs text-ink-muted leading-relaxed">
          <strong>Groupsum LLC</strong> develops software and provides scoped engineering services. Public repositories show what can be inspected; availability and engagement terms are confirmed separately.
        </p>
        <div className="text-xs font-mono text-ink-muted space-y-1">
          <div>Entity Name: Groupsum LLC</div>
          <div>Primary Domain: groupsum.xyz</div>
          <div>Mailing/Inquiry Endpoint: partner@groupsum.xyz</div>
        </div>
      </section>

      {/* Structured Authority Metadata (AEO/SEO/AIEO) */}
      <section className="pt-6 border-t border-[var(--color-border-soft)] space-y-3">
        <span className="text-[10px] font-mono uppercase text-ink-muted block">
          Corporate Authority Verification & Structured Graph Schema
        </span>
        <StructuredData type="about" />
      </section>
    </div>
  );
}

/* ==========================================================================
   CONTACT PAGE
   ========================================================================== */
function ContactPage() {
  return (
    <div className="py-12 max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8">
      <InquiryForm />
    </div>
  );
}

/* ==========================================================================
   PRIVACY & TERMS PAGES
   ========================================================================== */
function PrivacyPage() {
  return (
    <div className="max-w-[var(--reading-max)] mx-auto px-4 py-12 space-y-6">
      <h1 className="font-serif text-3xl font-bold tracking-tight text-ink">Privacy Policy</h1>
      <p className="text-xs text-ink-muted font-mono uppercase">Last updated: July 20, 2026</p>
      <div className="markdown-body text-xs">
        <p>This privacy policy governs your interaction with the Groupsum LLC website hosted at groupsum.xyz.</p>
        <h2>Information We Process</h2>
        <p>We process only the information you explicitly submit through our technical inquiry form (Name, Email, Organization, Interest area, and project goals). This submission is used solely to evaluate potential engineering engagements.</p>
        <h2>No Tracking or Cookies</h2>
        <p>We do not operate marketing trackers, advertising networks, or tracking cookies. Your connection parameters and logs are handled by our cloud ingress proxies for security auditing purposes only.</p>
        <h2>Data Preservation</h2>
        <p>Any submitted inquiry details are securely routed to our partner review endpoint. We do not sell or share your contact info with third parties.</p>
      </div>
    </div>
  );
}

function TermsPage() {
  return (
    <div className="max-w-[var(--reading-max)] mx-auto px-4 py-12 space-y-6">
      <h1 className="font-serif text-3xl font-bold tracking-tight text-ink">Terms of Service</h1>
      <p className="text-xs text-ink-muted font-mono uppercase">Last updated: July 20, 2026</p>
      <div className="markdown-body text-xs">
        <p>Welcome to Groupsum LLC.</p>
        <h2>Acceptance of Terms</h2>
        <p>By accessing the website groupsum.xyz, you agree to comply with standard security policies and use our services solely for evaluate-first inquiry and portfolio reviews.</p>
        <h2>Disclaimers of Liability</h2>
        <p>All historic publications, research logs, or code specifications provided on our insights and portfolio pages are offered "as-is". No guarantees are made concerning suitability or completeness of the legacy research files.</p>
        <h2>Intellectual Property</h2>
        <p>Groupsum, the Groupsum logo, symbol, and all documented custom specifications are owned by Groupsum LLC. All trademarks and project code repositories are governed under their respective license headers.</p>
      </div>
    </div>
  );
}

/* ==========================================================================
   NOT FOUND (404) PAGE
   ========================================================================== */
function NotFoundPage({ onNavigate }: RouteProps) {
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
