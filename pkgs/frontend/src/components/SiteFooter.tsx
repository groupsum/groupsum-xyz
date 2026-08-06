/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BookOpen, Github, Globe2, Mail, ShieldCheck } from "lucide-react";
import { catalogSummary } from "../data/catalog.generated";

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
  const navigate = (path: string, event: React.MouseEvent) => {
    if (path.endsWith(".json")) return;
    event.preventDefault();
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-auto border-t border-[var(--color-border-soft)] bg-surface py-6 font-mono text-xs text-ink-muted">
      <div className="mx-auto max-w-[var(--content-max)] space-y-5 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-5 border-b border-[var(--color-border-soft)] pb-5">
          <div className="min-w-0 flex-[1_1_28rem] space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <strong className="font-serif text-base text-ink">GroupSum Catalog Explorer</strong>
              <span className="rounded-[3px] border border-[var(--color-border-muted)] bg-canvas px-2 py-0.5 text-[9px] font-semibold text-ink">v0.1.0</span>
            </div>
            <p className="text-[11px] leading-relaxed text-ink-muted">Evidence-labeled public catalog for products, portfolio records, repositories, packages, typed resources, releases, and governance observations.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a href="mailto:partner@groupsum.xyz" className="grid h-8 w-8 place-items-center rounded-[3px] border border-[var(--color-border-soft)] bg-white hover:border-accent hover:text-accent" title="Email GroupSum"><Mail className="h-3.5 w-3.5" /></a>
            <a href="https://github.com/groupsum" target="_blank" rel="noreferrer" className="grid h-8 w-8 place-items-center rounded-[3px] border border-[var(--color-border-soft)] bg-white hover:border-accent hover:text-accent" title="GroupSum on GitHub"><Github className="h-3.5 w-3.5" /></a>
            <a href="/insights" onClick={(event) => navigate("/insights", event)} className="grid h-8 w-8 place-items-center rounded-[3px] border border-[var(--color-border-soft)] bg-white hover:border-accent hover:text-accent" title="Insights"><BookOpen className="h-3.5 w-3.5" /></a>
            <a href="https://groupsum.xyz" className="grid h-8 w-8 place-items-center rounded-[3px] border border-[var(--color-border-soft)] bg-white hover:border-accent hover:text-accent" title="groupsum.xyz"><Globe2 className="h-3.5 w-3.5" /></a>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-[10px]">
          <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {footerLinks.map(([label, href]) => <a key={href} href={href} onClick={(event) => navigate(href, event)} className="hover:text-accent hover:underline">{label}</a>)}
          </nav>
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-accent" />Catalog observed {catalogSummary.generated_at.slice(0, 10)}</span>
          <span>&copy; {new Date().getFullYear()} GroupSum LLC</span>
        </div>
      </div>
    </footer>
  );
};
