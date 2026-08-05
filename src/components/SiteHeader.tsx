/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Box,
  Compass,
  Cpu,
  FileCode2,
  FolderGit2,
  Layers,
  Lightbulb,
  Menu,
  Package,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

interface SiteHeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const navItems = [
  { label: "Products", path: "/products", icon: Box },
  { label: "Portfolio", path: "/portfolio", icon: Layers },
  { label: "Catalog", path: "/catalog", icon: Compass },
  { label: "Repositories", path: "/catalog/repositories", icon: FolderGit2 },
  { label: "Packages", path: "/catalog/packages", icon: Package },
  { label: "Typed resources", path: "/catalog/resources", icon: FileCode2 },
  { label: "Technologies", path: "/catalog/technologies", icon: Cpu },
  { label: "Solutions", path: "/solutions", icon: Lightbulb },
  { label: "Services", path: "/services", icon: SlidersHorizontal },
  { label: "Insights", path: "/insights", icon: BookOpen },
];

export const SiteHeader: React.FC<SiteHeaderProps> = ({ currentPath, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catalogQuery, setCatalogQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const navigate = (path: string, event?: React.SyntheticEvent) => {
    event?.preventDefault();
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  const searchCatalog = (event: React.FormEvent) => {
    event.preventDefault();
    const query = catalogQuery.trim();
    navigate(query ? `/catalog?q=${encodeURIComponent(query)}` : "/catalog");
  };

  const isActive = (path: string) => {
    if (path === "/catalog") return currentPath === path;
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  const renderNavItem = (item: (typeof navItems)[number], mobile = false) => {
    const Icon = item.icon;
    const active = isActive(item.path);
    return (
      <a
        key={item.path}
        href={item.path}
        onClick={(event) => navigate(item.path, event)}
        aria-current={active ? "page" : undefined}
        className={mobile
          ? `inline-flex min-h-11 items-center gap-3 rounded-[4px] border px-4 py-2.5 font-mono text-xs font-medium ${active ? "border-ink bg-ink text-white" : "border-[var(--color-border-soft)] bg-white text-ink"}`
          : `inline-flex min-h-9 items-center gap-1.5 whitespace-nowrap rounded-[4px] px-3 py-1.5 font-mono text-xs transition-all focus:outline-none focus:ring-1 focus:ring-[#1A73E8] ${active ? "bg-ink font-semibold text-white shadow-sm" : "text-ink-muted hover:bg-surface hover:text-ink"}`}
      >
        <Icon className={`h-3.5 w-3.5 ${active ? "text-white" : "text-[#7A827C]"}`} aria-hidden="true" />
        <span>{item.label}</span>
      </a>
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border-soft)] bg-canvas/95 backdrop-blur-md">
      <div className="mx-auto max-w-[var(--content-max)] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <a href="/" onClick={(event) => navigate("/", event)} className="flex min-w-0 shrink-0 items-center gap-3 rounded-[4px] focus-visible:outline-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[4px] bg-ink font-serif text-lg font-bold text-white shadow-sm" aria-hidden="true">G</span>
            <span className="min-w-0">
              <span className="block font-serif text-lg font-bold leading-none tracking-tight text-ink">GroupSum</span>
              <span className="mt-1 block font-mono text-[10px] tracking-wide text-ink-muted">groupsum.xyz</span>
            </span>
          </a>

          <div className="hidden min-w-0 flex-1 items-center justify-end gap-3 md:flex">
            <form onSubmit={searchCatalog} role="search" className="relative w-full max-w-64">
              <label htmlFor="catalog-search" className="sr-only">Search the public catalog</label>
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
              <input id="catalog-search" type="search" value={catalogQuery} onChange={(event) => setCatalogQuery(event.target.value)} placeholder="Search catalog..." className="min-h-9 w-full rounded-[4px] border border-[var(--color-border-soft)] bg-white py-1.5 pl-8 pr-3 font-mono text-xs text-ink placeholder:text-[#A3A8A2] focus:border-accent focus:outline-none" />
            </form>
            <a href="/contact" onClick={(event) => navigate("/contact", event)} className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-[3px] bg-ink px-4 font-mono text-xs font-semibold text-white transition-colors hover:bg-accent">
              Discuss a project <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>

          <button type="button" onClick={() => setMobileMenuOpen((open) => !open)} aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation" aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} className="rounded-[4px] p-2 text-ink-muted hover:bg-surface hover:text-ink md:hidden">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <nav className="hidden flex-wrap gap-1 border-t border-[var(--color-border-soft)] py-2 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => renderNavItem(item))}
        </nav>
      </div>

      {mobileMenuOpen && (
        <div id="mobile-navigation" className="fixed inset-x-0 top-16 h-[calc(100dvh-4rem)] overflow-y-auto border-t border-[var(--color-border-soft)] bg-canvas md:hidden">
          <nav className="mx-auto flex min-h-full max-w-[var(--content-max)] flex-col justify-between p-5" aria-label="Mobile navigation">
            <div className="space-y-4">
              <form onSubmit={searchCatalog} role="search" className="relative">
                <label htmlFor="mobile-catalog-search" className="sr-only">Search the public catalog</label>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
                <input id="mobile-catalog-search" type="search" value={catalogQuery} onChange={(event) => setCatalogQuery(event.target.value)} placeholder="Search catalog..." className="min-h-11 w-full rounded-[4px] border border-[var(--color-border-soft)] bg-white pl-9 pr-3 font-mono text-xs text-ink" />
              </form>
              <div className="grid gap-2">{navItems.map((item) => renderNavItem(item, true))}</div>
            </div>
            <div className="mt-8 border-t border-[var(--color-border-soft)] pt-5">
              <a href="/contact" onClick={(event) => navigate("/contact", event)} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[3px] bg-ink px-4 font-mono text-xs font-semibold text-white">Discuss a project <ArrowRight className="h-4 w-4" /></a>
              <p className="mt-4 text-center font-mono text-[10px] text-ink-muted">&copy; {new Date().getFullYear()} GroupSum LLC</p>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
