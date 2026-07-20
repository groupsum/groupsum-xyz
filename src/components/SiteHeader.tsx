/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Logo } from "./Logo";
import { Menu, X, ArrowRight } from "lucide-react";

interface SiteHeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({ currentPath, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { label: "Products", path: "/products" },
    { label: "Portfolio", path: "/portfolio" },
    { label: "Solutions", path: "/solutions" },
    { label: "Services", path: "/services" },
    { label: "Insights", path: "/insights" },
    { label: "About", path: "/about" },
  ];

  const handleLinkClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-surface/80 backdrop-blur-md border-b border-[var(--color-border-soft)]">
      <div className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Logo brand home link */}
        <a
          href="/"
          onClick={(e) => handleLinkClick("/", e)}
          className="flex items-center gap-2 shrink-0 focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-4 rounded"
          aria-label="Groupsum Home"
        >
          <Logo />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex flex-1 items-center justify-end gap-5 xl:gap-8" aria-label="Primary Navigation">
          {navItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              onClick={(e) => handleLinkClick(item.path, e)}
              className={`text-xs font-semibold tracking-widest uppercase transition-colors duration-150 focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-2 rounded px-1.5 py-0.5 ${
                isActive(item.path)
                  ? "text-accent font-bold opacity-100"
                  : "text-ink opacity-60 hover:opacity-100"
              }`}
              aria-current={isActive(item.path) ? "page" : undefined}
            >
              {item.label}
            </a>
          ))}

          <a
            href="/contact"
            onClick={(e) => handleLinkClick("/contact", e)}
            className="shrink-0 whitespace-nowrap px-5 py-2.5 bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-wider rounded-md transition-all duration-150 focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-2"
          >
            <span className="hidden lg:inline">Discuss a project</span>
            <span className="lg:hidden">Discuss</span>
          </a>
        </nav>

        {/* Mobile menu trigger button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          className="p-2 -mr-2 text-ink-muted hover:text-ink lg:hidden focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-2 rounded"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Accessible Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="fixed inset-0 top-16 z-30 w-full h-[calc(100vh-4rem)] bg-[var(--color-canvas)] border-t border-[var(--color-border-soft)] lg:hidden transition-all duration-200"
        >
          <nav className="flex flex-col p-6 h-full justify-between" aria-label="Mobile Navigation">
            <div className="space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => handleLinkClick(item.path, e)}
                  className={`block text-lg font-serif tracking-tight py-2 border-b border-[var(--color-border-soft)] ${
                    isActive(item.path) ? "text-accent font-semibold" : "text-ink hover:text-accent"
                  }`}
                  aria-current={isActive(item.path) ? "page" : undefined}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="pt-6 border-t border-[var(--color-border-soft)]">
              <a
                href="/contact"
                onClick={(e) => handleLinkClick("/contact", e)}
                className="w-full inline-flex items-center justify-center gap-2 py-3 bg-accent hover:bg-accent-hover text-white text-sm font-mono font-semibold rounded-[var(--radius-sm)] transition-all"
              >
                <span>Discuss project</span>
                <span className="sr-only">Discuss a project</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <p className="text-center text-xs font-mono text-ink-muted/60 mt-4">
                © {new Date().getFullYear()} Groupsum LLC
              </p>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
