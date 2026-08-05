/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Box,
  Building2,
  Compass,
  Layers,
  Menu,
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
  { label: "Solutions", path: "/solutions", icon: Compass },
  { label: "Services", path: "/services", icon: SlidersHorizontal },
  { label: "Insights", path: "/insights", icon: BookOpen },
  { label: "About", path: "/about", icon: Building2 },
];

export const SiteHeader: React.FC<SiteHeaderProps> = ({ currentPath, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const navigate = (path: string, event: React.MouseEvent) => {
    event.preventDefault();
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(`${path}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border-soft)] bg-canvas/95 backdrop-blur-md">
      <div className="mx-auto max-w-[var(--content-max)] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-5">
          <a href="/" onClick={(event) => navigate("/", event)} className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink font-serif text-lg font-bold text-white shadow-sm" aria-hidden="true">G</span>
            <span className="min-w-0">
              <span className="block font-serif text-lg font-bold leading-none tracking-tight text-ink">GroupSum</span>
              <span className="mt-1 block font-mono text-[10px] tracking-wide text-ink-muted">groupsum.xyz</span>
            </span>
          </a>

          <div className="hidden min-w-0 items-center gap-3 md:flex">
            <span className="rounded-full border border-[var(--color-border-soft)] bg-surface px-3 py-1 font-mono text-[10px] text-ink-muted">Products, evidence &amp; systems</span>
            <a href="/contact" onClick={(event) => navigate("/contact", event)} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-ink px-4 font-mono text-xs font-semibold text-white transition-colors hover:bg-accent">
              Discuss a project <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>

          <button type="button" onClick={() => setMobileMenuOpen((open) => !open)} aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation" aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} className="rounded-lg p-2 text-ink-muted hover:bg-surface hover:text-ink md:hidden">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <nav className="hidden flex-wrap gap-1 border-t border-[var(--color-border-soft)] py-2 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <a key={item.path} href={item.path} onClick={(event) => navigate(item.path, event)} aria-current={active ? "page" : undefined} className={`inline-flex min-h-9 items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 font-mono text-xs transition-all focus:outline-none focus:ring-1 focus:ring-[#1A73E8] ${active ? "bg-ink font-semibold text-white shadow-sm" : "text-ink-muted hover:bg-surface hover:text-ink"}`}>
                <Icon className={`h-3.5 w-3.5 ${active ? "text-white" : "text-[#7A827C]"}`} aria-hidden="true" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
      </div>

      {mobileMenuOpen && (
        <div id="mobile-navigation" className="fixed inset-x-0 top-16 h-[calc(100dvh-4rem)] overflow-y-auto border-t border-[var(--color-border-soft)] bg-canvas md:hidden">
          <nav className="mx-auto flex min-h-full max-w-[var(--content-max)] flex-col justify-between p-5" aria-label="Mobile navigation">
            <div className="grid gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <a key={item.path} href={item.path} onClick={(event) => navigate(item.path, event)} aria-current={active ? "page" : undefined} className={`inline-flex items-center gap-3 rounded-xl border px-4 py-3 font-mono text-sm font-medium ${active ? "border-[var(--color-border-accent-soft)] bg-[color-mix(in_srgb,var(--color-accent)_7%,white)] text-accent" : "border-[var(--color-border-soft)] bg-white text-ink"}`}>
                    <Icon className={`h-4 w-4 ${active ? "text-accent" : "text-[#7A827C]"}`} aria-hidden="true" />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </div>
            <div className="mt-8 border-t border-[var(--color-border-soft)] pt-5">
              <a href="/contact" onClick={(event) => navigate("/contact", event)} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 font-mono text-xs font-semibold text-white">Discuss a project <ArrowRight className="h-4 w-4" /></a>
              <p className="mt-4 text-center font-mono text-[10px] text-ink-muted">© {new Date().getFullYear()} GroupSum LLC</p>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
