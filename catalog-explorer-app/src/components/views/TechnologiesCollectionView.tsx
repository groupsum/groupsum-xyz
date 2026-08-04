import React from 'react';
import { TechnologyRecord, FilterState } from '../../types/catalog';
import { CollectionHeader } from '../common/CollectionHeader';
import { FilterToolbar } from '../common/FilterToolbar';
import { MemberRowCard } from '../common/MemberRowCard';
import { Cpu, Layers, ShieldCheck } from 'lucide-react';

interface TechnologiesCollectionViewProps {
  technologies: TechnologyRecord[];
  filterState: FilterState;
  onUpdateFilter: (updates: Partial<FilterState>) => void;
  onNavigate: (route: string) => void;
  onExportJSON: () => void;
}

export const TechnologiesCollectionView: React.FC<TechnologiesCollectionViewProps> = ({
  technologies,
  filterState,
  onUpdateFilter,
  onNavigate,
  onExportJSON,
}) => {
  const filtered = technologies.filter((tech) => {
    if (filterState.search) {
      const q = filterState.search.toLowerCase();
      const matchName = tech.name.toLowerCase().includes(q);
      const matchCat = tech.category.toLowerCase().includes(q);
      const matchSum = tech.summary.toLowerCase().includes(q);
      if (!matchName && !matchCat && !matchSum) return false;
    }
    return true;
  });

  const summaryFacts = [
    { label: 'Categorical Technologies', value: technologies.length, icon: <Cpu className="w-4 h-4 text-[#B45309]" /> },
    { label: 'Technology Categories', value: Array.from(new Set(technologies.map(t => t.category))).length, icon: <Layers className="w-4 h-4 text-[#2E6B9E]" /> },
    { label: 'Language Distinction', value: 'Strictly Separate', icon: <ShieldCheck className="w-4 h-4 text-[#166534]" />, hint: 'Languages kept in language composition' },
  ];

  return (
    <div className="space-y-6">
      <CollectionHeader
        eyebrow="Supporting Catalog Collection"
        title="Categorical Technologies"
        description="Infrastructure, frameworks, databases, and AI platforms utilized across GroupSum entities (explicitly separated from programming languages)."
        observationTime="2026-08-03T18:00:00Z"
        summaryFacts={summaryFacts}
        onDownloadExport={onExportJSON}
      />

      <FilterToolbar
        filterState={filterState}
        onUpdateFilter={onUpdateFilter}
        totalMatches={filtered.length}
      />

      <div className="space-y-3">
        {filtered.map((tech) => (
          <MemberRowCard
            key={tech.slug}
            id={tech.slug}
            name={tech.name}
            summary={tech.summary}
            ownerPath={`Category: ${tech.category}`}
            type="technology"
            route={`/catalog/technologies/${tech.slug}`}
            onNavigate={onNavigate}
            density={filterState.density}
          />
        ))}

        {filtered.length === 0 && (
          <div className="p-8 text-center bg-white border border-[#E5E3DC] rounded-xl font-mono text-xs text-[#7A827C]">
            No technology tags match the active filter criteria.
          </div>
        )}
      </div>
    </div>
  );
};
