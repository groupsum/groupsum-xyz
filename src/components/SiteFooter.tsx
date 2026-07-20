/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Logo } from "./Logo";
import { Mail, Github, BookOpen, ExternalLink } from "lucide-react";

interface SiteFooterProps {
  onNavigate: (path: string) => void;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({ onNavigate }) => {
  const handleLinkClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerGroups = [
    {
      title: "Ecosystems",
      links: [
        { label: "Groupsum Systems", href: "/products/groupsum" },
        { label: "Tigrbl ASGI", href: "/products/tigrbl" },
        { label: "Swarmauri AI", href: "/products/swarmauri" },
        { label: "Flagship Products", href: "/products" },
      ]
    },
    {
      title: "Core Services",
      links: [
        { label: "Target Solutions", href: "/solutions" },
        { label: "Engagement Models", href: "/services" },
        { label: "Active Portfolio", href: "/portfolio" },
        { label: "Insights Blog", href: "/insights" },
      ]
    },
    {
      title: "Governed Trust",
      links: [
        { label: "About Groupsum", href: "/about" },
        { label: "Contact Partners", href: "/contact" },
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Terms of Service", href: "/terms-of-service" },
      ]
    }
  ];

  return (
    <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border-soft)] py-12 md:py-16 mt-auto">
      <div className="max-w-[var(--content-max)] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-12">
          {/* Brand block */}
          <div className="md:col-span-5 space-y-4">
            <a
              href="/"
              onClick={(e) => handleLinkClick("/", e)}
              className="inline-block focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] rounded"
            >
              <Logo />
            </a>
            <p className="text-ink-muted text-[14px] leading-relaxed max-w-sm">
              Groupsum LLC builds governed developer systems for teams requiring source-controlled truth, traceable delivery, and reusable operations.
            </p>
            {/* Social / External Links */}
            <div className="flex gap-4 pt-2">
              <a
                href="mailto:partner@groupsum.xyz"
                className="p-1.5 rounded bg-canvas border border-[var(--color-border-soft)] hover:border-accent hover:text-accent text-ink-muted transition-all"
                title="Email Support"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/groupsum"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded bg-canvas border border-[var(--color-border-soft)] hover:border-accent hover:text-accent text-ink-muted transition-all"
                title="GitHub Organization"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="/insights"
                onClick={(e) => handleLinkClick("/insights", e)}
                className="p-1.5 rounded bg-canvas border border-[var(--color-border-soft)] hover:border-accent hover:text-accent text-ink-muted transition-all"
                title="Insights Archive"
              >
                <BookOpen className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Structured Link Blocks */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-ink mb-4">
                  {group.title}
                </h4>
                <ul className="space-y-2.5">
                  {group.links.map((link) => {
                    const isExternal = link.href.startsWith("http");
                    return (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noopener noreferrer" : undefined}
                          onClick={(e) => {
                            if (!isExternal) {
                              handleLinkClick(link.href, e);
                            }
                          }}
                          className="text-xs font-mono text-ink-muted hover:text-accent hover:underline inline-flex items-center gap-0.5"
                        >
                          {link.label}
                          {isExternal && <ExternalLink className="w-2.5 h-2.5 opacity-60" />}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer legal & boundary marker */}
        <div className="pt-8 border-t border-[var(--color-border-soft)] flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">
          <div>
            © {new Date().getFullYear()} Groupsum LLC. All rights reserved.
          </div>
          <div className="flex gap-6">
            <span>REF: GS-STABLE-2026</span>
            <span>STATUS: GOVERNED</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
