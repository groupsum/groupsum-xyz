import React from 'react';
import { PackageRecord, RepositoryRecord } from '../../types/catalog';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { StateBadge } from '../common/StateBadge';
import { EvidenceBoundaryCallout } from '../common/EvidenceBoundaryCallout';
import { MetricSparkline } from '../common/MetricSparkline';
import { 
  Package, 
  GitBranch, 
  ExternalLink, 
  ArrowLeft, 
  CheckCircle2, 
  FileCode, 
  ShieldCheck, 
  Layers,
  Info
} from 'lucide-react';

interface PackageMemberViewProps {
  pkg: PackageRecord;
  owningRepo?: RepositoryRecord;
  onNavigate: (route: string) => void;
}

export const PackageMemberView: React.FC<PackageMemberViewProps> = ({
  pkg,
  owningRepo,
  onNavigate,
}) => {
  return (
    <div className="space-y-8">
      {/* Top Back Navigation & Breadcrumb */}
      <div className="space-y-3">
        <button
          onClick={() => onNavigate('/catalog/packages/')}
          className="inline-flex items-center space-x-1.5 text-xs font-mono text-[#C46D20] hover:underline font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Packages Collection</span>
        </button>

        <Breadcrumbs
          organization={pkg.owningRepository.owner}
          repository={{ owner: pkg.owningRepository.owner, name: pkg.owningRepository.repository }}
          packageItem={{ packageName: pkg.packageName, ecosystem: pkg.ecosystem, routeKey: pkg.routeKey }}
          onNavigate={onNavigate}
        />
      </div>

      {/* Identity Header */}
      <div className="p-6 bg-white border border-[#E5E3DC] rounded-2xl shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="p-3.5 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] text-[#C46D20] shrink-0">
              <Package className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#C46D20] bg-[#F4F3EF] px-2.5 py-0.5 rounded border border-[#E5E3DC]">
                  {pkg.ecosystem} Package Member
                </span>
                <StateBadge type="publication" value={pkg.publicationState} />
              </div>

              <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1F2421] tracking-tight">
                {pkg.packageName}
              </h1>

              <p className="text-sm sm:text-base text-[#5C635E] max-w-3xl leading-relaxed">
                {pkg.summary}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0 font-mono text-xs">
            {pkg.registryUrl && (
              <a
                href={pkg.registryUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#1F2421] text-white rounded-lg hover:bg-[#2E6B9E] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Registry Page &rarr;</span>
              </a>
            )}
          </div>
        </div>

        {/* Owning Repository Banner */}
        <div className="p-4 bg-[#FAF9F6] border border-[#E5E3DC] rounded-xl flex items-center justify-between flex-wrap gap-3 font-mono text-xs">
          <div className="flex items-center space-x-2">
            <GitBranch className="w-4 h-4 text-[#5B4699]" />
            <span>
              Owning Repository:{' '}
              <button
                onClick={() => onNavigate(`/catalog/repositories/${pkg.owningRepository.owner}/${pkg.owningRepository.repository}`)}
                className="font-bold text-[#1F2421] hover:underline hover:text-[#1A73E8]"
              >
                {pkg.owningRepository.owner}/{pkg.owningRepository.repository}
              </button>
            </span>
          </div>

          <div className="text-[#5C635E]">
            Manifest path: <code className="bg-white px-2 py-0.5 rounded border border-[#E5E3DC] text-[#1F2421] font-semibold">{pkg.owningRepository.manifestPath}</code>
          </div>
        </div>

        {/* Count Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#E5E3DC] font-mono text-xs">
          <div className="p-3 bg-[#FAF9F6] border border-[#E5E3DC] rounded-lg">
            <span className="text-[11px] text-[#7A827C] block">Latest Version</span>
            <span className="text-lg font-bold text-[#1F2421]">v{pkg.latestVersion}</span>
          </div>
          <div className="p-3 bg-[#FAF9F6] border border-[#E5E3DC] rounded-lg">
            <span className="text-[11px] text-[#7A827C] block">Package Kind</span>
            <span className="text-sm font-semibold text-[#1F2421] capitalize">{pkg.packageKind}</span>
          </div>
          <div className="p-3 bg-[#FAF9F6] border border-[#E5E3DC] rounded-lg">
            <span className="text-[11px] text-[#7A827C] block">Declared Dependencies</span>
            <span className="text-lg font-bold text-[#5C635E]">{pkg.dependencies.length} Deps</span>
          </div>
          <div className="p-3 bg-[#FAF9F6] border border-[#E5E3DC] rounded-lg">
            <span className="text-[11px] text-[#7A827C] block">Observed Dependents</span>
            <span className="text-lg font-bold text-[#2E6B9E]">{pkg.dependentsCount}</span>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Download Trendline if available */}
          {pkg.downloadTrend && (
            <section className="p-6 bg-white border border-[#E5E3DC] rounded-2xl space-y-3 font-mono text-xs">
              <h2 className="font-editorial text-2xl font-bold text-[#1F2421]">
                Observed Download Activity Trend
              </h2>
              <MetricSparkline
                series={pkg.downloadTrend}
                label="Downloads"
                ownerName={pkg.packageName}
                width={280}
                height={40}
              />
            </section>
          )}

          {/* Dependencies Table (Dependencies are ROWS, not pills!) */}
          <section className="p-6 bg-white border border-[#E5E3DC] rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-editorial text-2xl font-bold text-[#1F2421]">
                Declared Dependencies ({pkg.dependencies.length})
              </h2>
              <span className="text-xs font-mono text-[#7A827C]">Grouped by Scope</span>
            </div>

            {pkg.dependencies.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {pkg.dependencies.map((dep, idx) => <article key={idx} className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-[#E5E3DC] bg-[#FAF9F6] p-4 font-mono text-xs"><div className="min-w-0"><h3 className="break-words font-bold text-[#1F2421]">{dep.name}</h3><p className="mt-1 break-words text-[11px] text-[#5C635E]">{dep.version}</p></div><div className="flex flex-wrap justify-end gap-2"><span className="rounded border border-[#E5E3DC] bg-white px-2 py-0.5 text-[10px] uppercase text-[#1F2421]">{dep.scope}</span><span className={`text-[11px] font-semibold ${dep.isInternal ? 'text-[#5B4699]' : 'text-[#7A827C]'}`}>{dep.isInternal ? 'Internal monorepo' : 'External ecosystem'}</span></div></article>)}
              </div>
            ) : (
              <div className="p-4 text-center text-xs font-mono text-[#7A827C] bg-[#FAF9F6] rounded-xl border border-[#E5E3DC]">
                Zero declared dependencies in package manifest.
              </div>
            )}
          </section>

          {/* Dependents Table */}
          <section className="p-6 bg-white border border-[#E5E3DC] rounded-2xl space-y-4">
            <h2 className="font-editorial text-2xl font-bold text-[#1F2421]">
              Observed Dependent Packages ({pkg.dependentsCount})
            </h2>

            <div className="p-3 bg-[#FAF9F6] border border-[#E5E3DC] rounded-lg text-xs font-mono text-[#5C635E] flex items-center gap-2">
              <Info className="w-4 h-4 text-[#2E6B9E] shrink-0" />
              <span>Coverage Limitation: Dependent counts represent packages indexed in the current GroupSum observation window.</span>
            </div>

            {pkg.dependents.length > 0 ? (
              <div className="space-y-2 font-mono text-xs">
                {pkg.dependents.map((dep, idx) => (
                  <div key={idx} className="p-3 bg-white border border-[#E5E3DC] rounded-lg flex flex-wrap justify-between items-center gap-2">
                    <span className="font-bold text-[#1F2421]">{dep.name}</span>
                    <span className="text-[#7A827C] text-[11px]">Owner: {dep.owner} &bull; {dep.ecosystem}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-xs font-mono text-[#7A827C] bg-[#FAF9F6] rounded-xl border border-[#E5E3DC]">
                No downstream dependents observed in current index.
              </div>
            )}
          </section>
        </div>

        {/* Right Rail */}
        <div className="lg:col-span-4 space-y-6">
          <EvidenceBoundaryCallout
            evidenceState="reviewed"
            observedAt={pkg.observedAt}
            canonicalRegistryUrl={pkg.registryUrl}
          />

          <div className="p-5 bg-white border border-[#E5E3DC] rounded-2xl space-y-3 font-mono text-xs">
            <h3 className="font-bold text-[#1F2421] uppercase tracking-wider text-[11px]">
              License &amp; Package State
            </h3>

            <div className="p-3 bg-[#FAF9F6] border border-[#E5E3DC] rounded-lg space-y-2 text-[#5C635E]">
              <div>Declared License: <strong className="text-[#166534]">{pkg.license}</strong></div>
              <div>Publication Badge: <StateBadge type="publication" value={pkg.publicationState} /></div>
              <div>Ecosystem: <strong className="text-[#1F2421]">{pkg.ecosystem}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
