/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ShieldCheck } from "lucide-react";
import { useCatalogOverview } from "../hooks/useCatalogOverview";

interface SiteFooterProps { onNavigate: (path: string) => void; }

const footerLinks = [
  ["Solutions", "/solutions"],
  ["Services", "/services"],
  ["Insights", "/insights"],
  ["About", "/about"],
  ["Contact", "/contact"],
  ["Privacy", "/privacy-policy"],
  ["Terms", "/terms-of-service"],
  ["OpenAPI", "/openapi.json"],
  ["Dataset manifest", "/catalog/site/manifest.json"],
] as const;

export const SiteFooter: React.FC<SiteFooterProps> = ({ onNavigate }) => {
  const overview = useCatalogOverview();
  const navigate = (path: string, event: React.MouseEvent) => {
    if (path.endsWith(".json")) return;
    event.preventDefault();
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="type-body-sm mt-auto border-t border-[var(--color-border-soft)] bg-surface py-8 text-ink-muted">
      <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 border-b border-[var(--color-border-soft)] pb-6 md:flex-row md:items-start">
          <div className="min-w-0 max-w-2xl space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <img src="/favicon.svg" alt="" width={24} height={24} className="h-6 w-6 shrink-0 rounded-md ring-1 ring-[var(--color-border-soft)]" />
              <strong className="type-heading-sm">GroupSum Catalog Explorer</strong>
              <span className="type-technical rounded-[3px] border border-[var(--color-border-muted)] bg-canvas px-2 py-0.5 font-semibold text-ink">v0.1.0</span>
            </div>
            <p className="type-body-sm text-ink-muted">Explore what we build, find packages and docs, and meet the contributors behind the work.</p>
          </div>

          <div className="type-control flex max-w-xl flex-wrap items-center gap-x-4 gap-y-2">
            <a href="https://groupsum.xyz" className="hover:text-accent hover:underline">groupsum.xyz</a>
            <a href="https://github.com/groupsum" target="_blank" rel="noreferrer" className="hover:text-accent hover:underline">GitHub</a>
            <a href="mailto:partner@groupsum.xyz" className="hover:text-accent hover:underline">Email</a>
            <a href="/insights" onClick={(event) => navigate("/insights", event)} className="hover:text-accent hover:underline">Insights</a>
            <span aria-hidden="true" className="hidden text-[var(--color-border-muted)] sm:inline">|</span>
            <span className="inline-flex items-center gap-1.5 text-success"><ShieldCheck className="h-3.5 w-3.5" />Evidence boundaries published</span>
          </div>
        </div>

        <nav aria-label="Footer navigation" className="type-control flex flex-wrap items-center gap-x-4 gap-y-2">
          {footerLinks.map(([label, href]) => <a key={href} href={href} onClick={(event) => navigate(href, event)} className="hover:text-accent hover:underline">{label}</a>)}
        </nav>

        <div className="type-technical flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <span>&copy; {new Date().getFullYear()} GroupSum LLC</span>
          <span className="flex flex-wrap gap-x-5 gap-y-1"><span>Observation Window: 30-Day Rolling</span>{overview.data?.generated_at && <span>Refreshed: {overview.data.generated_at.slice(0, 10)}</span>}</span>
        </div>
      </div>
    </footer>
  );
};
