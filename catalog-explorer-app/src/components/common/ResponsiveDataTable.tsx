import React from 'react';
import { RepositoryRecord, PackageRecord, FilterState } from '../../types/catalog';
import { MetricSparkline } from './MetricSparkline';
import { CommitBarSparkline } from './CommitBarSparkline';
import { StateBadge } from './StateBadge';
import { Star, GitFork, Users, ExternalLink, ChevronRight, Package, ShieldCheck, GitBranch } from 'lucide-react';

interface ResponsiveDataTableProps {
  type: 'repository' | 'package';
  repositories?: RepositoryRecord[];
  packages?: PackageRecord[];
  filterState: FilterState;
  onNavigate: (route: string) => void;
}

export const ResponsiveDataTable: React.FC<ResponsiveDataTableProps> = ({
  type,
  repositories = [],
  packages = [],
  filterState,
  onNavigate,
}) => {
  const isCompact = filterState.density === 'compact';
  const rowPad = isCompact ? 'py-2 px-3 text-xs' : 'py-3.5 px-4 text-xs';

  if (type === 'repository') {
    if (repositories.length === 0) {
      return (
        <div className="p-8 text-center bg-white border border-[#E5E3DC] rounded-xl font-mono text-xs text-[#7A827C]">
          No repositories matching active constraints. Try clearing filters.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Wide Layout Aligned Table (>= 640px) */}
        <div className="hidden border border-[#E5E3DC] rounded-xl bg-white shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF9F6] border-b border-[#E5E3DC]">
                <th className="py-3 px-4 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#5C635E] bg-[#FAF9F6] whitespace-nowrap text-left select-none">Repository</th>
                <th className="py-3 px-3 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#5C635E] bg-[#FAF9F6] whitespace-nowrap text-left select-none">Organization</th>
                <th className="py-3 px-3 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#5C635E] bg-[#FAF9F6] whitespace-nowrap text-left select-none">Stars &amp; Trend</th>
                <th className="py-3 px-3 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#5C635E] bg-[#FAF9F6] whitespace-nowrap text-left select-none">Forks</th>
                <th className="py-3 px-3 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#5C635E] bg-[#FAF9F6] whitespace-nowrap text-left select-none">30-Day Commits</th>
                <th className="py-3 px-3 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#5C635E] bg-[#FAF9F6] whitespace-nowrap text-left select-none">Packages</th>
                <th className="py-3 px-3 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#5C635E] bg-[#FAF9F6] whitespace-nowrap text-left select-none">Latest Release</th>
                <th className="py-3 px-3 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#5C635E] bg-[#FAF9F6] whitespace-nowrap text-left select-none">Governance</th>
                <th className="py-3 px-4 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#5C635E] bg-[#FAF9F6] whitespace-nowrap text-right select-none">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E3DC]/60 font-mono">
              {repositories.map((repo) => {
                const repoRoute = `/catalog/repositories/${repo.owner}/${repo.repository}`;
                return (
                  <tr
                    key={repo.slug}
                    className="hover:bg-[#FAF9F6] transition-colors group cursor-pointer"
                    onClick={() => onNavigate(repoRoute)}
                  >
                    <td className={`${rowPad} font-bold text-[#1F2421] group-hover:text-[#1A73E8]`}>
                      <div className="flex items-center space-x-1.5">
                        <GitBranch className="w-3.5 h-3.5 text-[#5B4699] shrink-0" />
                        <span className="truncate max-w-[160px]">{repo.repository}</span>
                      </div>
                    </td>

                    <td className={`${rowPad} text-[#5C635E]`}>
                      {repo.organization}
                    </td>

                    <td className={`${rowPad}`}>
                      <div className="flex flex-col space-y-1">
                        <span className="font-bold text-[#1F2421] flex items-center gap-1">
                          <Star className="w-3 h-3 text-[#B45309]" />
                          {repo.stars.toLocaleString()}
                        </span>
                        <MetricSparkline
                          series={repo.starsSeries}
                          label="Stars"
                          ownerName={repo.slug}
                          width={90}
                          height={20}
                        />
                      </div>
                    </td>

                    <td className={`${rowPad} text-[#5C635E]`}>
                      <span className="flex items-center gap-1">
                        <GitFork className="w-3 h-3 text-[#7A827C]" />
                        {repo.forks}
                      </span>
                    </td>

                    <td className={`${rowPad}`}>
                      <CommitBarSparkline
                        commits={repo.commits30d}
                        repositoryName={repo.repository}
                        width={110}
                        height={24}
                      />
                    </td>

                    <td className={`${rowPad} text-[#2E6B9E] font-semibold`}>
                      {repo.packagesCount} pkgs
                    </td>

                    <td className={`${rowPad} text-[#1F2421]`}>
                      {repo.latestRelease ? (
                        <span className="px-2 py-0.5 bg-[#F4F3EF] border border-[#E5E3DC] rounded text-[11px]">
                          {repo.latestRelease.version}
                        </span>
                      ) : (
                        <span className="text-[#7A827C]">None</span>
                      )}
                    </td>

                    <td className={`${rowPad}`}>
                      <StateBadge type="governance" value={repo.governanceState} />
                    </td>

                    <td className={`${rowPad} text-right`}>
                      <ChevronRight className="w-4 h-4 text-[#7A827C] group-hover:text-[#1A73E8] group-hover:translate-x-0.5 transition-all inline-block" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Reflow Cards (< 640px) */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {repositories.map((repo) => {
            const repoRoute = `/catalog/repositories/${repo.owner}/${repo.repository}`;
            return (
              <div
                key={repo.slug}
                onClick={() => onNavigate(repoRoute)}
                className="p-4 bg-white border border-[#E5E3DC] rounded-xl space-y-3 font-mono text-xs cursor-pointer hover:border-[#1A73E8]"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-[#7A827C] uppercase">{repo.organization}</span>
                    <h3 className="font-bold text-[#1F2421] text-sm">{repo.repository}</h3>
                  </div>
                  <StateBadge type="governance" value={repo.governanceState} />
                </div>

                <p className="text-[#5C635E] font-sans text-xs line-clamp-2">
                  {repo.description}
                </p>

                <div className="grid grid-cols-2 gap-2 bg-[#FAF9F6] p-2.5 rounded-lg border border-[#E5E3DC]">
                  <div>
                    <span className="text-[10px] text-[#7A827C]">Stars:</span>
                    <span className="font-bold text-[#1F2421] block">{repo.stars}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#7A827C]">Forks:</span>
                    <span className="font-bold text-[#1F2421] block">{repo.forks}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#7A827C]">Packages:</span>
                    <span className="font-bold text-[#2E6B9E] block">{repo.packagesCount}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#7A827C]">License:</span>
                    <span className="font-bold text-[#166534] block">{repo.license.expression}</span>
                  </div>
                </div>

                <div className="pt-1">
                  <span className="text-[10px] text-[#7A827C] block mb-1">30-Day Commits:</span>
                  <CommitBarSparkline commits={repo.commits30d} repositoryName={repo.repository} width={220} height={28} />
                </div>

                <div className="pt-2 border-t border-[#E5E3DC] flex justify-between items-center text-[#1A73E8] font-semibold">
                  <span>Open Repository Detail</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Packages Table
  if (packages.length === 0) {
    return (
      <div className="p-8 text-center bg-white border border-[#E5E3DC] rounded-xl font-mono text-xs text-[#7A827C]">
        No packages matching active constraints. Try clearing filters.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Packages Table */}
      <div className="hidden border border-[#E5E3DC] rounded-xl bg-white shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF9F6] border-b border-[#E5E3DC]">
              <th className="py-3 px-4 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#5C635E] bg-[#FAF9F6] whitespace-nowrap text-left select-none">Package Name</th>
              <th className="py-3 px-3 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#5C635E] bg-[#FAF9F6] whitespace-nowrap text-left select-none">Ecosystem</th>
              <th className="py-3 px-3 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#5C635E] bg-[#FAF9F6] whitespace-nowrap text-left select-none">Owning Repository</th>
              <th className="py-3 px-3 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#5C635E] bg-[#FAF9F6] whitespace-nowrap text-left select-none">Kind / Publication</th>
              <th className="py-3 px-3 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#5C635E] bg-[#FAF9F6] whitespace-nowrap text-left select-none">Latest Version</th>
              <th className="py-3 px-3 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#5C635E] bg-[#FAF9F6] whitespace-nowrap text-left select-none">Dependencies</th>
              <th className="py-3 px-3 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#5C635E] bg-[#FAF9F6] whitespace-nowrap text-left select-none">Dependents</th>
              <th className="py-3 px-3 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#5C635E] bg-[#FAF9F6] whitespace-nowrap text-left select-none">License</th>
              <th className="py-3 px-4 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#5C635E] bg-[#FAF9F6] whitespace-nowrap text-right select-none">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E3DC]/60 font-mono">
            {packages.map((pkg) => {
              const pkgRoute = `/catalog/packages/${pkg.ecosystem}/${pkg.routeKey}`;
              return (
                <tr
                  key={pkg.routeKey}
                  className="hover:bg-[#FAF9F6] transition-colors group cursor-pointer"
                  onClick={() => onNavigate(pkgRoute)}
                >
                  <td className={`${rowPad} font-bold text-[#1F2421] group-hover:text-[#1A73E8]`}>
                    <div className="flex items-center space-x-1.5">
                      <Package className="w-3.5 h-3.5 text-[#C46D20] shrink-0" />
                      <span className="truncate max-w-[180px]">{pkg.packageName}</span>
                    </div>
                  </td>

                  <td className={`${rowPad} text-[#5C635E]`}>
                    <span className="px-2 py-0.5 bg-[#F4F3EF] border border-[#E5E3DC] rounded text-[11px]">
                      {pkg.ecosystem}
                    </span>
                  </td>

                  <td className={`${rowPad} text-[#5B4699]`}>
                    {pkg.owningRepository.owner}/{pkg.owningRepository.repository}
                  </td>

                  <td className={`${rowPad}`}>
                    <StateBadge type="publication" value={pkg.publicationState} />
                  </td>

                  <td className={`${rowPad} font-bold text-[#1F2421]`}>
                    {pkg.latestVersion}
                  </td>

                  <td className={`${rowPad} text-[#5C635E]`}>
                    {pkg.dependencies.length} deps
                  </td>

                  <td className={`${rowPad} text-[#2E6B9E] font-semibold`}>
                    {pkg.dependentsCount} observed
                  </td>

                  <td className={`${rowPad} text-[#166534]`}>
                    {pkg.license}
                  </td>

                  <td className={`${rowPad} text-right`}>
                    <ChevronRight className="w-4 h-4 text-[#7A827C] group-hover:text-[#1A73E8] group-hover:translate-x-0.5 transition-all inline-block" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Packages Card Reflow */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {packages.map((pkg) => {
          const pkgRoute = `/catalog/packages/${pkg.ecosystem}/${pkg.routeKey}`;
          return (
            <div
              key={pkg.routeKey}
              onClick={() => onNavigate(pkgRoute)}
              className="p-4 bg-white border border-[#E5E3DC] rounded-xl space-y-3 font-mono text-xs cursor-pointer hover:border-[#1A73E8]"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-[#7A827C] uppercase">{pkg.ecosystem}</span>
                  <h3 className="font-bold text-[#1F2421] text-sm">{pkg.packageName}</h3>
                </div>
                <StateBadge type="publication" value={pkg.publicationState} />
              </div>

              <div className="text-[11px] text-[#5B4699]">
                Owner Repo: {pkg.owningRepository.owner}/{pkg.owningRepository.repository}
              </div>

              <div className="grid grid-cols-2 gap-2 bg-[#FAF9F6] p-2.5 rounded-lg border border-[#E5E3DC]">
                <div>
                  <span className="text-[10px] text-[#7A827C]">Latest Version:</span>
                  <span className="font-bold text-[#1F2421] block">{pkg.latestVersion}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#7A827C]">License:</span>
                  <span className="font-bold text-[#166534] block">{pkg.license}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#7A827C]">Dependencies:</span>
                  <span className="font-bold text-[#5C635E] block">{pkg.dependencies.length}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#7A827C]">Dependents:</span>
                  <span className="font-bold text-[#2E6B9E] block">{pkg.dependentsCount}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E5E3DC] flex justify-between items-center text-[#1A73E8] font-semibold">
                <span>Inspect Package Member</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
