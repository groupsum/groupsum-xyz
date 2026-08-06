import React from "react";
import { ArrowRight } from "lucide-react";
import { HorizontalCapability } from "../data/vision";

interface CapabilityBandProps {
  capability: HorizontalCapability;
  onNavigate: (path: string) => void;
}

export const CapabilityBand: React.FC<CapabilityBandProps> = ({ capability, onNavigate }) => (
  <article className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-8 p-6 md:p-8 bg-[var(--color-surface)] border border-[var(--color-border-soft)] rounded-[var(--radius-md)]">
    <div>
      <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold">{capability.eyebrow}</span>
      <h3 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-ink mt-3">{capability.title}</h3>
    </div>
    <div className="space-y-5">
      <p className="text-sm md:text-base leading-relaxed text-ink-muted">{capability.summary}</p>
      <div className="flex flex-wrap gap-2">
        {capability.proofPointSlugs.map((slug) => (
          <button key={slug} type="button" onClick={() => onNavigate(`/portfolio/${slug}`)} className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-ink-muted bg-canvas border border-[var(--color-border-soft)] rounded hover:text-accent hover:border-[var(--color-border-accent-soft)] transition-colors">
            {slug.replace(/-/g, " ")}
          </button>
        ))}
      </div>
      <button type="button" onClick={() => onNavigate(`/solutions/${capability.solutionSlugs[0]}`)} className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-accent hover:text-accent-hover hover:underline">
        Explore the solution pattern <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  </article>
);
