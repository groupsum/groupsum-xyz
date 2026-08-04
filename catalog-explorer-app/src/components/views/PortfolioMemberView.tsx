import React from 'react';
import { PortfolioRecord, ProductRecord } from '../../types/catalog';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { StateBadge } from '../common/StateBadge';
import { EvidenceBoundaryCallout } from '../common/EvidenceBoundaryCallout';
import { Layers, Box, ArrowLeft, Globe, Shield } from 'lucide-react';

interface PortfolioMemberViewProps {
  portfolio: PortfolioRecord;
  products: ProductRecord[];
  onNavigate: (route: string) => void;
}

export const PortfolioMemberView: React.FC<PortfolioMemberViewProps> = ({
  portfolio,
  products,
  onNavigate,
}) => {
  const attachedProducts = products.filter((p) =>
    portfolio.products.some((ref) => ref.slug === p.slug)
  );

  return (
    <div className="space-y-8">
      {/* Top Back Navigation & Breadcrumb */}
      <div className="space-y-3">
        <button
          onClick={() => onNavigate('/portfolio/')}
          className="inline-flex items-center space-x-1.5 text-xs font-mono text-[#5B4699] hover:underline font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Portfolio Collection</span>
        </button>

        <Breadcrumbs
          organization={portfolio.organization}
          portfolio={{ name: portfolio.name, slug: portfolio.slug }}
          onNavigate={onNavigate}
        />
      </div>

      {/* Identity Header */}
      <div className="p-6 bg-white border border-[#E5E3DC] rounded-2xl shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="p-3.5 rounded-xl bg-[#F3E8FF] border border-[#DDD6FE] text-[#5B4699] shrink-0">
              <Layers className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#5B4699] bg-[#F4F3EF] px-2.5 py-0.5 rounded border border-[#E5E3DC]">
                  Portfolio Record
                </span>
                <StateBadge type="maturity" value={portfolio.maturity} />
              </div>

              <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1F2421] tracking-tight">
                {portfolio.name}
              </h1>

              <p className="text-sm sm:text-base text-[#5C635E] max-w-3xl leading-relaxed">
                {portfolio.summary}
              </p>
            </div>
          </div>
        </div>

        {/* Strategic Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#E5E3DC]">
          {portfolio.keyMetrics.map((km, idx) => (
            <div key={idx} className="p-3.5 bg-[#FAF9F6] border border-[#E5E3DC] rounded-lg">
              <span className="text-[11px] font-mono text-[#7A827C] block">{km.label}</span>
              <span className="text-lg font-mono font-bold text-[#1F2421]">{km.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <section className="p-6 bg-white border border-[#E5E3DC] rounded-2xl space-y-4">
            <h2 className="font-editorial text-2xl font-bold text-[#1F2421]">
              Strategic Focus &amp; Domain
            </h2>
            <div className="text-xs font-mono text-[#5C635E] bg-[#FAF9F6] p-4 rounded-xl border border-[#E5E3DC] space-y-2">
              <div>Domain: <strong className="text-[#1F2421]">{portfolio.domain}</strong></div>
              <div>Strategic Focus: <p className="text-[#1F2421] font-sans text-sm mt-1">{portfolio.strategicFocus}</p></div>
            </div>
          </section>

          <section className="p-6 bg-white border border-[#E5E3DC] rounded-2xl space-y-4">
            <h2 className="font-editorial text-2xl font-bold text-[#1F2421] flex items-center gap-2">
              <Box className="w-5 h-5 text-[#2E6B9E]" />
              Attached Products in Portfolio
            </h2>

            <div className="space-y-3 font-mono text-xs">
              {attachedProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onNavigate(`/products/records/${p.slug}`)}
                  className="p-4 bg-[#FAF9F6] border border-[#E5E3DC] hover:border-[#1A73E8] rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all"
                >
                  <div>
                    <h3 className="font-bold text-[#1F2421] text-sm">{p.name}</h3>
                    <p className="text-xs text-[#5C635E] font-sans line-clamp-1">{p.summary}</p>
                  </div>
                  <span className="text-[#1A73E8] font-semibold shrink-0">
                    Inspect Product &rarr;
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <EvidenceBoundaryCallout
            evidenceState="reviewed"
            observedAt={portfolio.observedAt}
          />
        </div>
      </div>
    </div>
  );
};
