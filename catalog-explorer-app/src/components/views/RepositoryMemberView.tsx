import React from 'react';
import { RepositoryRecord, PackageRecord, TypedResourceRecord, SSOTGovernanceRecord, ReleaseRecord } from '../../types/catalog';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { StateBadge } from '../common/StateBadge';
import { EvidenceBoundaryCallout } from '../common/EvidenceBoundaryCallout';
import { SSOTInventoryGrid } from '../common/SSOTInventoryGrid';
import { ClaimLinkageBar } from '../common/ClaimLinkageBar';
import { MetricSparkline } from '../common/MetricSparkline';
import { CommitBarSparkline } from '../common/CommitBarSparkline';
import { LanguageBar } from '../common/LanguageBar';
import { 
  FolderGit2, 
  Star, 
  GitFork, 
  Users, 
  Eye, 
  Package, 
  FileCode, 
  ShieldCheck, 
  ArrowLeft, 
  ExternalLink,
  Code2,
  Tag,
  Cpu
} from 'lucide-react';

interface RepositoryMemberViewProps {
  repository: RepositoryRecord;
  containedPackages: PackageRecord[];
  typedResources: TypedResourceRecord[];
  governance?: SSOTGovernanceRecord;
  releases: ReleaseRecord[];
  onNavigate: (route: string) => void;
}

export const RepositoryMemberView: React.FC<RepositoryMemberViewProps> = ({
  repository,
  containedPackages,
  typedResources,
  governance,
  releases,
  onNavigate,
}) => {
  return (
    <div className="space-y-8">
      {/* Top Back Navigation & Breadcrumb */}
      <div className="space-y-3">
        <button
          onClick={() => onNavigate('/catalog/repositories/')}
          className="inline-flex items-center space-x-1.5 text-xs font-mono text-[#166534] hover:underline font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Repositories Collection</span>
        </button>

        <Breadcrumbs
          organization={repository.organization}
          repository={{ owner: repository.owner, name: repository.repository }}
          onNavigate={onNavigate}
        />
      </div>

      {/* Identity Header */}
      <div className="p-6 bg-white border border-[#E5E3DC] rounded-2xl shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="p-3.5 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0] text-[#166534] shrink-0">
              <FolderGit2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#166534] bg-[#F4F3EF] px-2.5 py-0.5 rounded border border-[#E5E3DC]">
                  Repository Member
                </span>
                <StateBadge type="governance" value={repository.governanceState} />
              </div>

              <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1F2421] tracking-tight">
                {repository.owner}/{repository.repository}
              </h1>

              <p className="text-sm sm:text-base text-[#5C635E] max-w-3xl leading-relaxed">
                {repository.description}
              </p>
            </div>
          </div>

          <a
            href={repository.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#1F2421] text-white font-mono text-xs rounded-lg hover:bg-[#2E6B9E] transition-colors shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Source Code &rarr;</span>
          </a>
        </div>

        {/* Activity Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 border-t border-[#E5E3DC]">
          <div className="p-3 bg-[#FAF9F6] border border-[#E5E3DC] rounded-lg">
            <span className="text-[11px] font-mono text-[#7A827C] flex items-center gap-1">
              <Star className="w-3 h-3 text-[#B45309]" /> Stars
            </span>
            <span className="text-lg font-mono font-bold text-[#1F2421] tabular-nums">
              {repository.stars.toLocaleString()}
            </span>
          </div>

          <div className="p-3 bg-[#FAF9F6] border border-[#E5E3DC] rounded-lg">
            <span className="text-[11px] font-mono text-[#7A827C] flex items-center gap-1">
              <GitFork className="w-3 h-3 text-[#7A827C]" /> Forks
            </span>
            <span className="text-lg font-mono font-bold text-[#1F2421] tabular-nums">
              {repository.forks}
            </span>
          </div>

          <div className="p-3 bg-[#FAF9F6] border border-[#E5E3DC] rounded-lg">
            <span className="text-[11px] font-mono text-[#7A827C] flex items-center gap-1">
              <Eye className="w-3 h-3 text-[#7A827C]" /> Watchers
            </span>
            <span className="text-lg font-mono font-bold text-[#1F2421] tabular-nums">
              {repository.watchers}
            </span>
          </div>

          <div className="p-3 bg-[#FAF9F6] border border-[#E5E3DC] rounded-lg">
            <span className="text-[11px] font-mono text-[#7A827C] flex items-center gap-1">
              <Users className="w-3 h-3 text-[#7A827C]" /> Contributors
            </span>
            <span className="text-lg font-mono font-bold text-[#1F2421] tabular-nums">
              {repository.contributors}
            </span>
          </div>

          <div className="p-3 bg-[#FAF9F6] border border-[#E5E3DC] rounded-lg">
            <span className="text-[11px] font-mono text-[#7A827C] flex items-center gap-1">
              <Package className="w-3 h-3 text-[#C46D20]" /> Packages
            </span>
            <span className="text-lg font-mono font-bold text-[#2E6B9E] tabular-nums">
              {containedPackages.length} Pkgs
            </span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Section 1: Trend Band */}
          <section className="p-6 bg-white border border-[#E5E3DC] rounded-2xl space-y-4">
            <h2 className="font-editorial text-2xl font-bold text-[#1F2421]">
              Repository Activity Trends
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#FAF9F6] border border-[#E5E3DC] rounded-xl space-y-2">
                <span className="text-xs font-mono font-semibold text-[#1F2421]">Star Growth Trendline</span>
                <MetricSparkline
                  series={repository.starsSeries}
                  label="Star growth"
                  ownerName={repository.slug}
                  width={220}
                  height={36}
                />
              </div>

              <div className="p-4 bg-[#FAF9F6] border border-[#E5E3DC] rounded-xl space-y-2">
                <span className="text-xs font-mono font-semibold text-[#1F2421]">30-Day Commit Frequency</span>
                <CommitBarSparkline
                  commits={repository.commits30d}
                  repositoryName={repository.repository}
                  width={220}
                  height={36}
                />
              </div>
            </div>
          </section>

          {/* Section 2: Contained Packages */}
          <section className="p-6 bg-white border border-[#E5E3DC] rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-editorial text-2xl font-bold text-[#1F2421] flex items-center gap-2">
                <Package className="w-5 h-5 text-[#C46D20]" />
                Contained Packages ({containedPackages.length})
              </h2>
            </div>

            {containedPackages.length > 0 ? (
              <div className="space-y-3 font-mono text-xs">
                {containedPackages.map((pkg) => {
                  const pkgRoute = `/catalog/packages/${pkg.ecosystem}/${pkg.routeKey}`;
                  return (
                    <div
                      key={pkg.routeKey}
                      onClick={() => onNavigate(pkgRoute)}
                      className="p-4 bg-[#FAF9F6] border border-[#E5E3DC] hover:border-[#1A73E8] rounded-xl space-y-2 cursor-pointer transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-[#1F2421] text-sm">{pkg.packageName}</span>
                          <span className="px-2 py-0.5 bg-white text-[10px] rounded border border-[#E5E3DC]">
                            {pkg.ecosystem}
                          </span>
                        </div>
                        <StateBadge type="publication" value={pkg.publicationState} />
                      </div>

                      <div className="text-[#5C635E]">
                        Manifest path: <code className="text-[#1F2421] bg-white px-1.5 py-0.5 rounded">{pkg.owningRepository.manifestPath}</code>
                      </div>

                      <div className="flex justify-between items-center pt-2 text-[11px] text-[#7A827C] border-t border-[#E5E3DC]/60">
                        <span>Version: <strong className="text-[#1F2421]">{pkg.latestVersion}</strong></span>
                        <span>Dependencies: {pkg.dependencies.length} &bull; License: {pkg.license}</span>
                        <span className="text-[#1A73E8] font-semibold">Inspect Package &rarr;</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 text-center text-xs font-mono text-[#7A827C] bg-[#FAF9F6] rounded-xl border border-[#E5E3DC]">
                No packages declared in this repository manifest.
              </div>
            )}
          </section>

          {/* Section 3: Typed Resources */}
          {typedResources.length > 0 && (
            <section className="p-6 bg-white border border-[#E5E3DC] rounded-2xl space-y-4">
              <h2 className="font-editorial text-2xl font-bold text-[#1F2421] flex items-center gap-2">
                <FileCode className="w-5 h-5 text-[#0369A1]" />
                Typed Resources Sourced by Repository
              </h2>

              <div className="space-y-3 font-mono text-xs">
                {typedResources.map((res) => (
                  <div
                    key={res.routeKey}
                    onClick={() => onNavigate(`/catalog/resources/${res.resourceType}/${res.routeKey}`)}
                    className="p-3.5 bg-[#FAF9F6] border border-[#E5E3DC] hover:border-[#1A73E8] rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-[#1F2421]">{res.name}</span>
                        <StateBadge type="resourceType" value={res.resourceType} />
                      </div>
                      <p className="text-[11px] text-[#5C635E]">{res.purpose}</p>
                    </div>
                    <span className="text-[#1A73E8] font-semibold shrink-0">Inspect &rarr;</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section 4: SSOT Governance */}
          {governance && (
            <section className="p-6 bg-white border border-[#E5E3DC] rounded-2xl space-y-4">
              <h2 className="font-editorial text-2xl font-bold text-[#1F2421] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#3730A3]" />
                Repository SSOT Governance
              </h2>

              <SSOTInventoryGrid governance={governance} />

              <ClaimLinkageBar
                numerator={governance.claimCoverage.numerator}
                denominator={governance.claimCoverage.denominator}
                percentage={governance.claimCoverage.percentage}
                canonicalRegistry={governance.canonicalRegistry}
                limitation={governance.explicitLimitation}
              />
            </section>
          )}

          {/* Section 5: Languages & Technologies Taxonomy */}
          <section className="p-6 bg-white border border-[#E5E3DC] rounded-2xl space-y-6">
            <div>
              <h2 className="font-editorial text-2xl font-bold text-[#1F2421] flex items-center gap-2">
                <Code2 className="w-5 h-5 text-[#3178c6]" />
                Programming Languages
              </h2>
              <div className="mt-4">
                <LanguageBar languages={repository.languages} observedAt={repository.observedAt} />
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5E3DC]">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#1F2421] mb-2 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#B45309]" />
                Categorical Technologies (Separated Taxonomy)
              </h3>
              <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                {repository.technologies.map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-[#FAF9F6] text-[#1F2421] border border-[#E5E3DC] rounded-lg font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Right Rail (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <EvidenceBoundaryCallout
            evidenceState={repository.license.evidenceState}
            observedAt={repository.observedAt}
            sourceUrl={repository.sourceUrl}
            noticeUrl={repository.license.noticeUrl}
            canonicalRegistryUrl={governance?.canonicalRegistry}
          />

          <div className="p-5 bg-white border border-[#E5E3DC] rounded-2xl space-y-3 font-mono text-xs">
            <h3 className="font-bold text-[#1F2421] uppercase tracking-wider text-[11px]">
              License &amp; Ownership Notice
            </h3>

            <div className="p-3 bg-[#FAF9F6] border border-[#E5E3DC] rounded-lg space-y-1.5 text-[#5C635E]">
              <div>Expression: <strong className="text-[#166534] font-bold">{repository.license.expression}</strong></div>
              <div>Governance State: <strong className="text-[#1F2421]">{repository.governanceState}</strong></div>
              <div>Source Host: <span className="text-[#2E6B9E]">GitHub</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
