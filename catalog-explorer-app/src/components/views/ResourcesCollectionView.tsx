import React from 'react';
import { TypedResourceRecord, FilterState } from '../../types/catalog';
import { CollectionHeader } from '../common/CollectionHeader';
import { FilterToolbar } from '../common/FilterToolbar';
import { MemberRowCard } from '../common/MemberRowCard';
import { FileCode, Globe, BookOpen, Terminal, Sparkles } from 'lucide-react';

interface ResourcesCollectionViewProps {
  resources: TypedResourceRecord[];
  filterState: FilterState;
  onUpdateFilter: (updates: Partial<FilterState>) => void;
  onNavigate: (route: string) => void;
  onExportJSON: () => void;
}

export const ResourcesCollectionView: React.FC<ResourcesCollectionViewProps> = ({
  resources,
  filterState,
  onUpdateFilter,
  onNavigate,
  onExportJSON,
}) => {
  const filtered = resources.filter((res) => {
    if (filterState.search) {
      const q = filterState.search.toLowerCase();
      const matchName = res.name.toLowerCase().includes(q);
      const matchPurpose = res.purpose.toLowerCase().includes(q);
      const matchType = res.resourceType.toLowerCase().includes(q);
      if (!matchName && !matchPurpose && !matchType) return false;
    }
    if (filterState.resourceType && res.resourceType !== filterState.resourceType) return false;
    return true;
  });

  const summaryFacts = [
    { label: 'Typed Resources', value: resources.length, icon: <FileCode className="w-4 h-4 text-[#0369A1]" /> },
    { label: 'Websites & Docs', value: resources.filter(r => r.resourceType === 'website' || r.resourceType === 'documentation').length, icon: <Globe className="w-4 h-4 text-[#2E6B9E]" /> },
    { label: 'APIs & Endpoints', value: resources.filter(r => r.resourceType === 'api').length, icon: <Terminal className="w-4 h-4 text-[#9D174D]" /> },
    { label: 'Demos & Showcases', value: resources.filter(r => r.resourceType === 'demo' || r.resourceType === 'showcase' || r.resourceType === 'example').length, icon: <Sparkles className="w-4 h-4 text-[#B45309]" /> },
  ];

  return (
    <div className="space-y-6">
      <CollectionHeader
        eyebrow="Supporting Catalog Collection"
        title="Typed Resources"
        description="Public typed resources including web applications, API specifications, developer portals, interactive playgrounds, and UI consoles."
        observationTime="2026-08-03T18:00:00Z"
        summaryFacts={summaryFacts}
        onDownloadExport={onExportJSON}
      />

      <FilterToolbar
        filterState={filterState}
        onUpdateFilter={onUpdateFilter}
        resourceTypeOptions={['website', 'documentation', 'api', 'demo', 'example', 'showcase', 'ui']}
        totalMatches={filtered.length}
      />

      <div className="space-y-3">
        {filtered.map((res) => (
          <MemberRowCard
            key={res.routeKey}
            id={res.routeKey}
            name={res.name}
            summary={res.purpose}
            ownerPath={res.owningRepository ? `${res.owningRepository.owner}/${res.owningRepository.repository}` : 'Global Resource'}
            type="resource"
            resourceType={res.resourceType}
            route={`/catalog/resources/${res.resourceType}/${res.routeKey}`}
            onNavigate={onNavigate}
            density={filterState.density}
          />
        ))}

        {filtered.length === 0 && (
          <div className="p-8 text-center bg-white border border-[#E5E3DC] rounded-xl font-mono text-xs text-[#7A827C]">
            No typed resources match the active criteria.
          </div>
        )}
      </div>
    </div>
  );
};
