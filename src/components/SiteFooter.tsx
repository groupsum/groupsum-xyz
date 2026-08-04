/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BookOpen, Github, Globe2, Mail, ShieldCheck } from "lucide-react";
import { catalogSummary } from "../data/catalog.generated";

interface SiteFooterProps { onNavigate: (path: string) => void; }

const footerGroups = [
  { title: "GroupSum", links: [
    ["Products", "/products"], ["Portfolio", "/portfolio"], ["Solutions", "/solutions"],
    ["Services", "/services"], ["Insights", "/insights"], ["About", "/about"],
  ] },
  { title: "Public catalog", links: [
    ["Catalog overview", "/catalog"], ["Repositories", "/catalog/repositories"], ["Packages", "/catalog/packages"],
    ["Typed resources", "/catalog/resources"], ["Technologies", "/catalog/technologies"],
  ] },
  { title: "Governance", links: [
    ["Contact", "/contact"], ["Privacy policy", "/privacy-policy"], ["Terms of service", "/terms-of-service"],
    ["OpenAPI", "/openapi.json"], ["Dataset manifest", "/catalog/site/manifest.json"],
  ] },
] as const;

export const SiteFooter: React.FC<SiteFooterProps> = ({ onNavigate }) => {
  const navigate = (path: string, event: React.MouseEvent) => {
    if (path.endsWith(".json")) return;
    event.preventDefault();
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-auto border-t border-[var(--color-border-soft)] bg-surface py-10 font-mono text-xs text-ink-muted">
      <div className="mx-auto max-w-[var(--content-max)] space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-8 border-b border-[var(--color-border-soft)] pb-8">
          <div className="min-w-0 flex-[1_1_24rem] space-y-4">
            <a href="/" onClick={(event) => navigate("/", event)} className="inline-flex items-center gap-3 rounded-lg">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink font-serif text-lg font-bold text-white">G</span>
              <span><strong className="block font-serif text-lg text-ink">GroupSum</strong><span className="text-[10px]">Products, evidence &amp; systems</span></span>
            </a>
            <p className="max-w-xl text-xs leading-relaxed">Public product and portfolio records connected to repository, package, resource, release, and governance evidence. Editorial claims remain distinct from observed implementation data.</p>
            <p className="text-[10px] text-ink-muted">Organization → product or portfolio → repository → package or typed resource → release evidence</p>
            <div className="flex flex-wrap gap-2">
              <a href="mailto:partner@groupsum.xyz" className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--color-border-soft)] bg-white hover:border-accent hover:text-accent" title="Email GroupSum"><Mail className="h-4 w-4" /></a>
              <a href="https://github.com/groupsum" target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--color-border-soft)] bg-white hover:border-accent hover:text-accent" title="GroupSum on GitHub"><Github className="h-4 w-4" /></a>
              <a href="/insights" onClick={(event) => navigate("/insights", event)} className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--color-border-soft)] bg-white hover:border-accent hover:text-accent" title="Insights"><BookOpen className="h-4 w-4" /></a>
              <a href="https://groupsum.xyz" className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--color-border-soft)] bg-white hover:border-accent hover:text-accent" title="groupsum.xyz"><Globe2 className="h-4 w-4" /></a>
            </div>
          </div>

          <div className="grid min-w-0 flex-[1_1_32rem] grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
            {footerGroups.map((group) => <section key={group.title}><h2 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-ink">{group.title}</h2><ul className="space-y-2.5">{group.links.map(([label, href]) => <li key={href}><a href={href} onClick={(event) => navigate(href, event)} className="text-[11px] hover:text-accent hover:underline">{label}</a></li>)}</ul></section>)}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-[10px]">
          <span>© {new Date().getFullYear()} GroupSum LLC. All rights reserved.</span>
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-accent" /> Evidence-labeled public catalog</span>
          <span>Catalog observed: {catalogSummary.generated_at.slice(0, 10)}</span>
        </div>
      </div>
    </footer>
  );
};
