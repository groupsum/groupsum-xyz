import React from 'react';
import { PortfolioRecord, FilterState } from '../../types/catalog';
import { CollectionHeader } from '../common/CollectionHeader';
import { FilterToolbar } from '../common/FilterToolbar';
import { MemberRowCard } from '../common/MemberRowCard';
import { Layers, Box, Globe, Shield } from 'lucide-react';

interface PortfolioCollectionViewProps {
  portfolioItems: PortfolioRecord[];
  filterState: FilterState;
  onUpdateFilter: (updates: Partial<FilterState>) => void;
  onNavigate: (route: string) => void;
  onExportJSON: () => void;
}

export const PortfolioCollectionView: React.FC<PortfolioCollectionViewProps> = ({
  portfolioItems,
  filterState,
  onUpdateFilter,
  onNavigate,
  onExportJSON,
}) => {
  const filtered = portfolioItems.filter((item) => {
    if (filterState.search) {
      const q = filterState.search.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchSum = item.summary.toLowerCase().includes(q);
      const matchDomain = item.domain.toLowerCase().includes(q);
      if (!matchName && !matchSum && !matchDomain) return false;
    }
    if (filterState.organization && item.organization !== filterState.organization) return false;
    return true;
  });

  const summaryFacts = [
    { label: 'Portfolios', value: portfolioItems.length, icon: <Layers className="w-4 h-4 text-[#5B4699]" /> },
    { label: 'Strategic Domains', value: Array.from(new Set(portfolioItems.map(p => p.domain))).length, icon: <Globe className="w-4 h-4 text-[#2E6B9E]" /> },
    { label: 'Attached Products', value: portfolioItems.reduce((acc, p) => acc + p.products.length, 0), icon: <Box className="w-4 h-4 text-[#166534]" /> },
  ];

  return (
    <div className="space-y-6">
      <CollectionHeader
        eyebrow="Primary Portfolio Evaluation Collection"
        title="GroupSum Portfolios"
        description="Strategic groupings of products, infrastructure capabilities, and governance domain areas."
        observationTime="2026-08-03T18:00:00Z"
        summaryFacts={summaryFacts}
        onDownloadExport={onExportJSON}
      />

      <FilterToolbar
        filterState={filterState}
        onUpdateFilter={onUpdateFilter}
        organizationOptions={Array.from(new Set(portfolioItems.map((p) => p.organization)))}
        totalMatches={filtered.length}
      />

      <div className="space-y-3">
        {filtered.map((item) => (
          <MemberRowCard
            key={item.id}
            id={item.id}
            name={item.name}
            summary={item.summary}
            ownerPath={item.organization}
            type="portfolio"
            maturity={item.maturity}
            ecosystem={item.domain}
            route={`/portfolio/records/${item.slug}`}
            onNavigate={onNavigate}
            density={filterState.density}
          />
        ))}

        {filtered.length === 0 && (
          <div className="p-8 text-center bg-white border border-[#E5E3DC] rounded-xl font-mono text-xs text-[#7A827C]">
            No portfolio items match active constraints.
          </div>
        )}
      </div>
    </div>
  );
};
