/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { PortfolioItem } from "../types";
import { ArrowUpRight, ShieldCheck, Box, Milestone, Terminal } from "lucide-react";

interface PortfolioCardProps {
  item: PortfolioItem;
  onNavigate: (path: string) => void;
}

export const EvidenceLabel: React.FC<{ item: PortfolioItem }> = ({ item }) => {
  const getMaturityStyle = (m: PortfolioItem["maturity"]) => {
    switch (m) {
      case "released":
        return "bg-accent/10 text-accent border-[var(--color-border-accent-soft)]";
      case "active":
        return "bg-[var(--color-signal-soft)] text-[var(--color-signal)] border-[var(--color-border-soft)]";
      case "exploratory":
        return "bg-ink/5 text-ink-muted border-[var(--color-border-soft)]";
      default:
        return "bg-ink/5 text-ink-muted border-[var(--color-border-soft)] border-dashed";
    }
  };

  const getArtifactIcon = (t: PortfolioItem["artifactType"]) => {
    switch (t) {
      case "product":
        return <Box className="w-3.5 h-3.5 mr-1 inline-block" />;
      case "platform":
        return <Terminal className="w-3.5 h-3.5 mr-1 inline-block" />;
      case "specification":
        return <Milestone className="w-3.5 h-3.5 mr-1 inline-block" />;
      default:
        return <ShieldCheck className="w-3.5 h-3.5 mr-1 inline-block" />;
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
      <span className={`inline-flex items-center px-2 py-0.5 rounded border ${getMaturityStyle(item.maturity)}`}>
        {getArtifactIcon(item.artifactType)}
        <span className="capitalize">{item.maturity}</span>
      </span>
      <span className="text-ink-muted text-[11px] bg-canvas px-2 py-0.5 rounded border border-[var(--color-border-soft)]">
        EVID. OWNER: {item.evidenceOwner}
      </span>
    </div>
  );
};

export const PortfolioCard: React.FC<PortfolioCardProps> = ({ item, onNavigate }) => {
  const handleCardClick = (e: React.MouseEvent) => {
    // If user clicked an external link, do not intercept
    const target = e.target as HTMLElement;
    if (target.closest("a") && target.closest("a")?.getAttribute("target") === "_blank") {
      return;
    }
    e.preventDefault();
    onNavigate(`/portfolio/${item.slug}`);
  };

  return (
    <article 
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between p-6 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-[var(--radius-md)] hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-hover)] transition-all duration-200 cursor-pointer"
    >
      <div>
        {/* Type & Maturity Badge Row */}
        <div className="mb-4">
          <EvidenceLabel item={item} />
        </div>

        {/* Title / Slug */}
        <h3 className="font-serif text-xl font-semibold tracking-tight text-ink mb-2 group-hover:text-accent transition-colors duration-150">
          <a 
            href={`/portfolio/${item.slug}`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(`/portfolio/${item.slug}`);
            }}
            className="focus:outline-none after:absolute after:inset-0"
          >
            {item.name}
          </a>
        </h3>

        {/* Short Summary */}
        <p className="text-ink-muted text-[14px] leading-relaxed mb-4">
          {item.summary}
        </p>

        {/* Technical Stack Tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {item.technologies.map((tech) => (
            <span 
              key={tech} 
              className="text-[10px] font-mono tracking-tight bg-canvas border border-[var(--color-border-soft)] text-ink-muted px-1.5 py-0.5 rounded"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Details & Active Link Triggers */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border-soft)] text-xs font-mono text-ink-muted z-10">
        <span className="text-[11px] uppercase tracking-wider text-accent font-semibold">
          {item.evidenceLabel.split(",")[0]}
        </span>
        <div className="flex items-center gap-3">
          {item.links.map((link) => {
            const isExternal = link.href.startsWith("http");
            return (
              <a
                key={link.label}
                href={link.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                onClick={(e) => {
                  if (!isExternal) {
                    e.preventDefault();
                    onNavigate(link.href);
                  }
                }}
                className="inline-flex items-center gap-0.5 text-accent hover:text-accent-hover font-semibold hover:underline"
              >
                {link.label}
                {isExternal && <ArrowUpRight className="w-3 h-3" />}
              </a>
            );
          })}
        </div>
      </div>
    </article>
  );
};
