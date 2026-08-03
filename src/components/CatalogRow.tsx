import React from "react";
import { ArrowRight } from "lucide-react";
import { PortfolioEntity } from "../types";
import { productRecordPath } from "./ProductPortfolio";

export const CatalogRow: React.FC<{ entity: PortfolioEntity; onNavigate: (path: string) => void }> = ({ entity, onNavigate }) => {
  const evidence = entity.evidence[0]?.kind || "source";
  return <button type="button" onClick={() => onNavigate(productRecordPath(entity.slug))} className="catalog-grid w-full text-left gap-2 lg:gap-4 px-3 py-3 bg-surface border-b border-[var(--color-border-soft)] hover:bg-canvas transition-colors focus-visible:outline-2 focus-visible:outline-accent">
    <span className="min-w-0"><span className="block font-serif font-semibold text-sm text-ink truncate">{entity.displayName}</span><span className="block text-[11px] text-ink-muted truncate">{entity.role || entity.summary}</span></span>
    <span className="min-w-0 truncate whitespace-nowrap text-[10px] font-mono uppercase text-accent">{entity.kind}</span>
    <span className="hidden min-w-0 truncate lg:block text-[10px] font-mono text-ink-muted">{entity.capabilityIds[0] || "catalog"}</span>
    <span className="hidden whitespace-nowrap lg:block text-[10px] font-mono text-ink-muted">{entity.maturity}</span>
    <span className="flex min-w-0 items-center justify-end gap-2 text-[10px] font-mono text-ink-muted"><span className="hidden min-w-0 truncate sm:inline">{evidence}</span><ArrowRight className="w-3.5 h-3.5 text-accent" /></span>
  </button>;
};
