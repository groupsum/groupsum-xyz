import React from 'react';
import { RepositoryRecord, FilterState } from '../../types/catalog';
import { CollectionHeader } from '../common/CollectionHeader';
import { FilterToolbar } from '../common/FilterToolbar';
import { ResponsiveDataTable } from '../common/ResponsiveDataTable';
import { FolderGit2, Star, GitFork, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface RepositoriesCollectionViewProps {
  repositories: RepositoryRecord[];
  filterState: FilterState;
  onUpdateFilter: (updates: Partial<FilterState>) => void;
  onNavigate: (route: string) => void;
  onExportJSON: () => void;
}

export const RepositoriesCollectionView: React.FC<RepositoriesCollectionViewProps> = ({
  repositories,
  filterState,
  onUpdateFilter,
  onNavigate,
  onExportJSON,
}) => {
  const filtered = repositories.filter((repo) => {
    if (filterState.search) {
      const q = filterState.search.toLowerCase();
      const matchName = repo.repository.toLowerCase().includes(q);
      const matchOwner = repo.owner.toLowerCase().includes(q);
      const matchDesc = repo.description.toLowerCase().includes(q);
      const matchLang = repo.languages.some((l) => l.language.toLowerCase().includes(q));
      if (!matchName && !matchOwner && !matchDesc && !matchLang) return false;
    }
    if (filterState.organization && repo.organization !== filterState.organization) return false;
    if (filterState.governanceState && repo.governanceState !== filterState.governanceState) return false;
    return true;
  });

  const totalStars = repositories.reduce((acc, r) => acc + r.stars, 0);
  const governedCount = repositories.filter((r) => r.governanceState === 'governed').length;

  const summaryFacts = [
    { label: 'Repositories', value: repositories.length, icon: <FolderGit2 className="w-4 h-4 text-[#166534]" /> },
    { label: 'Total Stars Observed', value: totalStars.toLocaleString(), icon: <Star className="w-4 h-4 text-[#B45309]" /> },
    { label: 'SSOT Governed', value: governedCount, icon: <ShieldCheck className="w-4 h-4 text-[#3730A3]" /> },
    { label: 'Contained Packages', value: repositories.reduce((a, r) => a + r.packagesCount, 0), icon: <CheckCircle2 className="w-4 h-4 text-[#2E6B9E]" /> },
  ];

  return (
    <div className="space-y-6">
      <CollectionHeader
        eyebrow="Supporting Catalog Collection"
        title="Repositories"
        description="Source code repositories with 30-day commit bar sparklines, star trendlines, language breakdowns, and repository-scoped SSOT governance."
        observationTime="2026-08-03T18:00:00Z"
        summaryFacts={summaryFacts}
        onDownloadExport={onExportJSON}
      />

      <FilterToolbar
        filterState={filterState}
        onUpdateFilter={onUpdateFilter}
        organizationOptions={Array.from(new Set(repositories.map((r) => r.organization)))}
        sortOptions={[
          { label: 'Most Stars', value: 'stars' },
          { label: 'Repository Name', value: 'name' },
          { label: '30-Day Commits', value: 'commits' },
        ]}
        totalMatches={filtered.length}
      />

      <ResponsiveDataTable
        type="repository"
        repositories={filtered}
        filterState={filterState}
        onNavigate={onNavigate}
      />
    </div>
  );
};
