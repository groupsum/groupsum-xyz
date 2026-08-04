import React from 'react';
import { PackageRecord, FilterState } from '../../types/catalog';
import { CollectionHeader } from '../common/CollectionHeader';
import { FilterToolbar } from '../common/FilterToolbar';
import { ResponsiveDataTable } from '../common/ResponsiveDataTable';
import { Package, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface PackagesCollectionViewProps {
  packages: PackageRecord[];
  filterState: FilterState;
  onUpdateFilter: (updates: Partial<FilterState>) => void;
  onNavigate: (route: string) => void;
  onExportJSON: () => void;
}

export const PackagesCollectionView: React.FC<PackagesCollectionViewProps> = ({
  packages,
  filterState,
  onUpdateFilter,
  onNavigate,
  onExportJSON,
}) => {
  const filtered = packages.filter((pkg) => {
    if (filterState.search) {
      const q = filterState.search.toLowerCase();
      const matchName = pkg.packageName.toLowerCase().includes(q);
      const matchEco = pkg.ecosystem.toLowerCase().includes(q);
      const matchRepo = `${pkg.owningRepository.owner}/${pkg.owningRepository.repository}`.toLowerCase().includes(q);
      if (!matchName && !matchEco && !matchRepo) return false;
    }
    if (filterState.ecosystem && pkg.ecosystem !== filterState.ecosystem) return false;
    if (filterState.publicationState && pkg.publicationState !== filterState.publicationState) return false;
    return true;
  });

  const publishedCount = packages.filter((p) => p.publicationState === 'published').length;
  const privateCandidateCount = packages.filter((p) => p.publicationState === 'candidate' || p.publicationState === 'manifest-private').length;

  const summaryFacts = [
    { label: 'Packages', value: packages.length, icon: <Package className="w-4 h-4 text-[#C46D20]" /> },
    { label: 'Published Registry', value: publishedCount, icon: <CheckCircle2 className="w-4 h-4 text-[#0D47A1]" /> },
    { label: 'Private / Candidates', value: privateCandidateCount, icon: <AlertTriangle className="w-4 h-4 text-[#92400E]" />, hint: 'Unpublished or candidate' },
    { label: 'Ecosystems', value: Array.from(new Set(packages.map(p => p.ecosystem))).length, icon: <ShieldCheck className="w-4 h-4 text-[#166534]" /> },
  ];

  return (
    <div className="space-y-6">
      <CollectionHeader
        eyebrow="Supporting Catalog Collection"
        title="Packages"
        description="Software packages published across npm, PyPI, Cargo, and GHCR container registries, grouped by owning repository with declared dependencies."
        observationTime="2026-08-03T18:00:00Z"
        summaryFacts={summaryFacts}
        onDownloadExport={onExportJSON}
      />

      <FilterToolbar
        filterState={filterState}
        onUpdateFilter={onUpdateFilter}
        ecosystemOptions={Array.from(new Set(packages.map((p) => p.ecosystem)))}
        publicationOptions={['published', 'manifest-private', 'candidate', 'workspace']}
        totalMatches={filtered.length}
      />

      <ResponsiveDataTable
        type="package"
        packages={filtered}
        filterState={filterState}
        onNavigate={onNavigate}
      />
    </div>
  );
};
