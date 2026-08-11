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


export function HomeHero({ onNavigate }: { onNavigate: (path: string) => void }) {
  return <>
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
  </>;
}
