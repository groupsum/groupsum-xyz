import React from 'react';
import { FilterState } from '../../types/catalog';
import { Search, X, SlidersHorizontal, ArrowUpDown, Filter } from 'lucide-react';

interface FilterToolbarProps {
  filterState: FilterState;
  onUpdateFilter: (updates: Partial<FilterState>) => void;
  ecosystemOptions?: string[];
  organizationOptions?: string[];
  maturityOptions?: string[];
  publicationOptions?: string[];
  resourceTypeOptions?: string[];
  sortOptions?: { label: string; value: string }[];
  totalMatches: number;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  filterState,
  onUpdateFilter,
  ecosystemOptions = [],
  organizationOptions = [],
  maturityOptions = [],
  publicationOptions = [],
  resourceTypeOptions = [],
  sortOptions = [
    { label: 'Name (A-Z)', value: 'name' },
    { label: 'Most Stars / Activity', value: 'activity' },
    { label: 'Recently Updated', value: 'recent' },
  ],
  totalMatches,
}) => {
  const hasActiveFilters =
    filterState.search ||
    filterState.ecosystem ||
    filterState.organization ||
    filterState.maturity ||
    filterState.publicationState ||
    filterState.resourceType;

  const handleClearAll = () => {
    onUpdateFilter({
      search: '',
      ecosystem: '',
      organization: '',
      maturity: '',
      publicationState: '',
      resourceType: '',
    });
  };

  return (
    <div className="space-y-3 py-4">
      {/* Search & Filter Controls Grid */}
      <div className="flex flex-wrap items-center gap-3 bg-[#FAF9F6] p-3 rounded-xl border border-[#E5E3DC]">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7A827C]" />
          <input
            type="text"
            placeholder="Search by name, summary, owner, language..."
            value={filterState.search}
            onChange={(e) => onUpdateFilter({ search: e.target.value })}
            className="w-full pl-9 pr-8 py-2 text-xs font-mono bg-white border border-[#E5E3DC] rounded-lg text-[#1F2421] placeholder-[#A3A8A2] focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
          />
          {filterState.search && (
            <button
              onClick={() => onUpdateFilter({ search: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7A827C] hover:text-[#1F2421]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Organization Filter */}
        {organizationOptions.length > 0 && (
          <select
            value={filterState.organization}
            onChange={(e) => onUpdateFilter({ organization: e.target.value })}
            className="px-3 py-2 text-xs font-mono bg-white border border-[#E5E3DC] rounded-lg text-[#1F2421] focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
          >
            <option value="">All Owners / Orgs</option>
            {organizationOptions.map((org) => (
              <option key={org} value={org}>
                {org}
              </option>
            ))}
          </select>
        )}

        {/* Ecosystem Filter */}
        {ecosystemOptions.length > 0 && (
          <select
            value={filterState.ecosystem}
            onChange={(e) => onUpdateFilter({ ecosystem: e.target.value })}
            className="px-3 py-2 text-xs font-mono bg-white border border-[#E5E3DC] rounded-lg text-[#1F2421] focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
          >
            <option value="">All Ecosystems</option>
            {ecosystemOptions.map((eco) => (
              <option key={eco} value={eco}>
                {eco}
              </option>
            ))}
          </select>
        )}

        {/* Maturity Filter */}
        {maturityOptions.length > 0 && (
          <select
            value={filterState.maturity}
            onChange={(e) => onUpdateFilter({ maturity: e.target.value })}
            className="px-3 py-2 text-xs font-mono bg-white border border-[#E5E3DC] rounded-lg text-[#1F2421] focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
          >
            <option value="">All Maturity States</option>
            {maturityOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        )}

        {/* Publication State Filter */}
        {publicationOptions.length > 0 && (
          <select
            value={filterState.publicationState}
            onChange={(e) => onUpdateFilter({ publicationState: e.target.value })}
            className="px-3 py-2 text-xs font-mono bg-white border border-[#E5E3DC] rounded-lg text-[#1F2421] focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
          >
            <option value="">All Publication States</option>
            {publicationOptions.map((pub) => (
              <option key={pub} value={pub}>
                {pub}
              </option>
            ))}
          </select>
        )}

        {/* Resource Type Filter */}
        {resourceTypeOptions.length > 0 && (
          <select
            value={filterState.resourceType}
            onChange={(e) => onUpdateFilter({ resourceType: e.target.value })}
            className="px-3 py-2 text-xs font-mono bg-white border border-[#E5E3DC] rounded-lg text-[#1F2421] focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
          >
            <option value="">All Resource Types</option>
            {resourceTypeOptions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        )}

        {/* Sort selector */}
        <div className="flex items-center space-x-1 ml-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#7A827C]" />
          <select
            value={filterState.sortBy}
            onChange={(e) => onUpdateFilter({ sortBy: e.target.value })}
            className="px-3 py-2 text-xs font-mono bg-white border border-[#E5E3DC] rounded-lg text-[#1F2421] focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                Sort: {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filter Pills Bar */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono">
          <span className="text-[#7A827C] font-medium">Active Filters:</span>

          {filterState.search && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#E5E3DC] rounded-full text-[#1F2421]">
              Query: <strong className="font-semibold">{filterState.search}</strong>
              <button
                onClick={() => onUpdateFilter({ search: '' })}
                className="text-[#7A827C] hover:text-[#1F2421] ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filterState.organization && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#E5E3DC] rounded-full text-[#1F2421]">
              Owner: <strong className="font-semibold">{filterState.organization}</strong>
              <button
                onClick={() => onUpdateFilter({ organization: '' })}
                className="text-[#7A827C] hover:text-[#1F2421] ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filterState.ecosystem && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#E5E3DC] rounded-full text-[#1F2421]">
              Ecosystem: <strong className="font-semibold">{filterState.ecosystem}</strong>
              <button
                onClick={() => onUpdateFilter({ ecosystem: '' })}
                className="text-[#7A827C] hover:text-[#1F2421] ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filterState.maturity && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#E5E3DC] rounded-full text-[#1F2421]">
              Maturity: <strong className="font-semibold">{filterState.maturity}</strong>
              <button
                onClick={() => onUpdateFilter({ maturity: '' })}
                className="text-[#7A827C] hover:text-[#1F2421] ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filterState.publicationState && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#E5E3DC] rounded-full text-[#1F2421]">
              Publication: <strong className="font-semibold">{filterState.publicationState}</strong>
              <button
                onClick={() => onUpdateFilter({ publicationState: '' })}
                className="text-[#7A827C] hover:text-[#1F2421] ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filterState.resourceType && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#E5E3DC] rounded-full text-[#1F2421]">
              Type: <strong className="font-semibold">{filterState.resourceType}</strong>
              <button
                onClick={() => onUpdateFilter({ resourceType: '' })}
                className="text-[#7A827C] hover:text-[#1F2421] ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={handleClearAll}
            className="text-[#2E6B9E] hover:underline font-semibold ml-2 focus:outline-none"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Results Header */}
      <div className="flex justify-between items-center text-xs font-mono text-[#5C635E] border-b border-[#E5E3DC]/60 pb-2">
        <span>
          Showing <strong className="font-bold text-[#1F2421]">{totalMatches}</strong> matching records
        </span>
        <span className="text-[#7A827C] hidden sm:inline">
          Filtered projection
        </span>
      </div>
    </div>
  );
};
