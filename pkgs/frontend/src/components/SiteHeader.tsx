/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { ThemePicker } from "./ThemePicker";
import {
  Box,
  Compass,
  Cpu,
  FileCode2,
  FolderGit2,
  Layers,
  Menu,
  Package,
  Search,
  X,
  Users,
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
  { label: "Typed Resources", path: "/catalog/resources", icon: FileCode2 },
  { label: "Technologies", path: "/catalog/technologies", icon: Cpu },
  { label: "Contributors", path: "/contributors", icon: Users },
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
          ? `type-control inline-flex min-h-11 items-center gap-3 rounded-lg border px-4 py-2.5 ${active ? "border-ink bg-ink text-[var(--color-on-accent)]" : "border-[var(--color-border-soft)] bg-surface-raised text-ink"}`
          : `type-control inline-flex min-h-8 items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 transition-all focus:outline-none focus:ring-1 focus:ring-accent ${active ? "bg-ink text-[var(--color-on-accent)] shadow-sm" : "text-ink-muted hover:bg-surface hover:text-ink"}`}
      >
        <Icon className={`h-3.5 w-3.5 ${active ? "text-[var(--color-on-accent)]" : "text-ink-muted"}`} aria-hidden="true" />
        <span>{item.label}</span>
      </a>
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border-soft)] bg-canvas/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-12 flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 flex-[1_1_10rem] items-center gap-3">
          <a href="/" onClick={(event) => navigate("/", event)} className="flex min-w-0 max-w-full items-center gap-2 rounded-lg p-1 focus-visible:outline-3">
            <img src="/favicon.svg" alt="" width={32} height={32} className="h-8 w-8 shrink-0 rounded-lg ring-1 ring-[var(--color-border-soft)]" />
            <span className="min-w-0">
              <span className="type-heading-sm block truncate leading-none tracking-tight">GroupSum</span>
              <span className="type-technical mt-1 block truncate text-ink-muted">groupsum.xyz</span>
            </span>
          </a>
          </div>

          <div className="hidden min-w-0 items-center justify-end gap-3 md:flex">
            <form onSubmit={searchCatalog} role="search" className="relative w-36 sm:w-48">
              <label htmlFor="catalog-search" className="sr-only">Search the public catalog</label>
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
              <input id="catalog-search" type="search" value={catalogQuery} onChange={(event) => setCatalogQuery(event.target.value)} placeholder="Search catalog..." className="type-control w-full rounded-lg border border-[var(--color-border-soft)] bg-surface-raised py-1.5 pl-8 pr-3 text-ink placeholder:font-normal placeholder:text-ink-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
            </form>
          </div>

          <ThemePicker />
          <button type="button" onClick={() => setMobileMenuOpen((open) => !open)} aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation" aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} className="rounded-[4px] p-2 text-ink-muted hover:bg-surface hover:text-ink md:hidden">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <nav className="hidden flex-wrap gap-1 border-t border-[var(--color-border-soft)] pb-2 pt-2 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => renderNavItem(item))}
        </nav>
      </div>

      {mobileMenuOpen && (
        <div id="mobile-navigation" className="fixed inset-x-0 top-12 h-[calc(100dvh-3rem)] overflow-y-auto border-t border-[var(--color-border-soft)] bg-canvas md:hidden">
          <nav className="mx-auto flex min-h-full max-w-[var(--content-max)] flex-col justify-between p-5" aria-label="Mobile navigation">
            <div className="space-y-4">
              <form onSubmit={searchCatalog} role="search" className="relative">
                <label htmlFor="mobile-catalog-search" className="sr-only">Search the public catalog</label>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
                <input id="mobile-catalog-search" type="search" value={catalogQuery} onChange={(event) => setCatalogQuery(event.target.value)} placeholder="Search catalog..." className="type-control min-h-11 w-full rounded-[4px] border border-[var(--color-border-soft)] bg-surface-raised pl-9 pr-3 text-ink" />
              </form>
              <div className="grid gap-2">{navItems.map((item) => renderNavItem(item, true))}</div>
            </div>
            <div className="mt-8 border-t border-[var(--color-border-soft)] pt-5">
              <div className="type-control flex flex-wrap justify-center gap-4"><a href="/solutions" onClick={(event) => navigate("/solutions", event)} className="text-accent hover:underline">Solutions</a><a href="/services" onClick={(event) => navigate("/services", event)} className="text-accent hover:underline">Services</a><a href="/insights" onClick={(event) => navigate("/insights", event)} className="text-accent hover:underline">Insights</a><a href="/contact" onClick={(event) => navigate("/contact", event)} className="text-accent hover:underline">Contact</a></div>
              <p className="type-body-sm mt-4 text-center text-ink-muted">&copy; {new Date().getFullYear()} GroupSum LLC</p>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
