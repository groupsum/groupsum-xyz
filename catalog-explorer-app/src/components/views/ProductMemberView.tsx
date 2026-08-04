import React from 'react';
import { ProductRecord, RepositoryRecord, PackageRecord, TypedResourceRecord, SSOTGovernanceRecord } from '../../types/catalog';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { StateBadge } from '../common/StateBadge';
import { EvidenceBoundaryCallout } from '../common/EvidenceBoundaryCallout';
import { SSOTInventoryGrid } from '../common/SSOTInventoryGrid';
import { ClaimLinkageBar } from '../common/ClaimLinkageBar';
import { CommitBarSparkline } from '../common/CommitBarSparkline';
import { MetricSparkline } from '../common/MetricSparkline';
import { 
  Box, 
  CheckCircle2, 
  GitBranch, 
  Package, 
  FileCode, 
  ExternalLink, 
  ArrowLeft,
  ShieldCheck,
  Star,
  Users,
  AlertTriangle
} from 'lucide-react';

interface ProductMemberViewProps {
  product: ProductRecord;
  repositories: RepositoryRecord[];
  packages: PackageRecord[];
  resources: TypedResourceRecord[];
  governanceRecords: Record<string, SSOTGovernanceRecord>;
  onNavigate: (route: string) => void;
}

export const ProductMemberView: React.FC<ProductMemberViewProps> = ({
  product,
  repositories,
  packages,
  resources,
  governanceRecords,
  onNavigate,
}) => {
  // Filter attached repositories
  const attachedRepos = repositories.filter((r) =>
    product.repositoryRefs.some((ref) => ref.owner === r.owner && ref.repository === r.repository)
  );

  // Filter attached packages
  const attachedPackages = packages.filter((p) =>
    product.packageRefs.some((ref) => ref.routeKey === p.routeKey)
  );

  // Filter attached resources
  const attachedResources = resources.filter((res) =>
    product.resourceRefs.some((ref) => ref.routeKey === res.routeKey)
  );

  return (
    <div className="space-y-8">
      {/* Top Back Navigation & Breadcrumb */}
      <div className="space-y-3">
        <button
          onClick={() => onNavigate('/products/')}
          className="inline-flex items-center space-x-1.5 text-xs font-mono text-[#2E6B9E] hover:underline font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products Collection</span>
        </button>

        <Breadcrumbs
          organization={product.organization}
          product={{ name: product.name, slug: product.slug }}
          onNavigate={onNavigate}
        />
      </div>

      {/* Identity Header */}
      <div className="p-6 bg-white border border-[#E5E3DC] rounded-2xl shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="p-3.5 rounded-xl bg-[#EBF3FA] border border-[#C6D7F9] text-[#2E6B9E] shrink-0">
              <Box className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#2E6B9E] bg-[#F4F3EF] px-2.5 py-0.5 rounded border border-[#E5E3DC]">
                  Product Record
                </span>
                <StateBadge type="maturity" value={product.maturity} />
              </div>

              <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1F2421] tracking-tight">
                {product.name}
              </h1>

              <p className="text-sm sm:text-base text-[#5C635E] max-w-3xl leading-relaxed">
                {product.summary}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-mono shrink-0">
            <button
              onClick={() => onNavigate(`/catalog/`)}
              className="px-4 py-2 bg-[#1F2421] text-white font-medium rounded-lg hover:bg-[#2E6B9E] transition-colors shadow-xs"
            >
              Explore Evidence Hierarchy
            </button>
          </div>
        </div>

        {/* Count Strip (Up to 5 metrics) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#E5E3DC]">
          <div className="p-3 bg-[#FAF9F6] border border-[#E5E3DC] rounded-lg">
            <span className="text-[11px] font-mono text-[#7A827C] block">Owner Org</span>
            <span className="text-sm font-mono font-bold text-[#1F2421]">{product.organization}</span>
          </div>
          <div className="p-3 bg-[#FAF9F6] border border-[#E5E3DC] rounded-lg">
            <span className="text-[11px] font-mono text-[#7A827C] block">Target Audience</span>
            <span className="text-xs font-mono font-semibold text-[#1F2421] truncate block" title={product.audience}>
              {product.audience}
            </span>
          </div>
          <div className="p-3 bg-[#FAF9F6] border border-[#E5E3DC] rounded-lg">
            <span className="text-[11px] font-mono text-[#7A827C] block">Repositories</span>
            <span className="text-sm font-mono font-bold text-[#5B4699]">{attachedRepos.length} Repos</span>
          </div>
          <div className="p-3 bg-[#FAF9F6] border border-[#E5E3DC] rounded-lg">
            <span className="text-[11px] font-mono text-[#7A827C] block">Contained Packages</span>
            <span className="text-sm font-mono font-bold text-[#2E6B9E]">{attachedPackages.length} Packages</span>
          </div>
        </div>
      </div>

      {/* 12-Column Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area (8 Columns) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Section 1: Reviewed Purpose & Capabilities */}
          <section className="p-6 bg-white border border-[#E5E3DC] rounded-2xl space-y-4">
            <h2 className="font-editorial text-2xl font-bold text-[#1F2421] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#166534]" />
              Reviewed Capabilities &amp; Purpose
            </h2>

            <ul className="space-y-2 text-xs sm:text-sm text-[#5C635E]">
              {product.reviewedCapabilities.map((cap, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#166534] mt-2 shrink-0" />
                  <span>{cap}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2 text-xs font-mono text-[#7A827C]">
              Ecosystem Scope: <span className="font-semibold text-[#1F2421]">{product.ecosystem}</span>
            </div>
          </section>

          {/* Section 2: Repository Implementation Table */}
          <section className="p-6 bg-white border border-[#E5E3DC] rounded-2xl space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h2 className="font-editorial text-2xl font-bold text-[#1F2421] flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-[#5B4699]" />
                Repository Implementation Map
              </h2>
              <span className="text-xs font-mono text-[#7A827C]">
                {attachedRepos.length} attached repositories
              </span>
            </div>

            <p className="text-xs text-[#5C635E]">
              Metrics are owned strictly by each repository row and are not aggregated at the product level.
            </p>

            <div className="space-y-3">
              {attachedRepos.map((repo) => {
                const repoRef = product.repositoryRefs.find(r => r.owner === repo.owner && r.repository === repo.repository);
                const route = `/catalog/repositories/${repo.owner}/${repo.repository}`;
                return (
                  <div
                    key={repo.slug}
                    onClick={() => onNavigate(route)}
                    className="p-4 bg-[#FAF9F6] border border-[#E5E3DC] hover:border-[#1A73E8] rounded-xl space-y-3 cursor-pointer transition-all"
                  >
                    <div className="flex justify-between items-start flex-wrap gap-2 font-mono">
                      <div>
                        <span className="text-[10px] text-[#7A827C] uppercase">{repoRef?.role || 'Repository'}</span>
                        <h3 className="font-bold text-[#1F2421] text-sm hover:underline flex items-center gap-1.5">
                          {repo.owner}/{repo.repository}
                        </h3>
                      </div>
                      <span className="px-2 py-0.5 bg-white border border-[#E5E3DC] rounded text-[11px] font-bold text-[#1F2421] flex items-center gap-1">
                        <Star className="w-3 h-3 text-[#B45309]" />
                        {repo.stars}
                      </span>
                    </div>

                    <p className="text-xs text-[#5C635E]">
                      {repo.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E5E3DC]/60 font-mono text-xs">
                      <div>
                        <span className="text-[10px] text-[#7A827C] block mb-1">30-Day Commit Activity:</span>
                        <CommitBarSparkline commits={repo.commits30d} repositoryName={repo.repository} width={160} height={24} />
                      </div>

                      <span className="text-[#1A73E8] font-semibold text-xs hover:underline inline-flex items-center gap-1">
                        View Repository Detail &rarr;
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 3: Packages Grouped Under Repository */}
          <section className="p-6 bg-white border border-[#E5E3DC] rounded-2xl space-y-4">
            <h2 className="font-editorial text-2xl font-bold text-[#1F2421] flex items-center gap-2">
              <Package className="w-5 h-5 text-[#C46D20]" />
              Contained Packages
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              {attachedPackages.map((pkg) => {
                const pkgRoute = `/catalog/packages/${pkg.ecosystem}/${pkg.routeKey}`;
                return (
                  <div
                    key={pkg.routeKey}
                    onClick={() => onNavigate(pkgRoute)}
                    className="p-3.5 bg-[#FAF9F6] border border-[#E5E3DC] hover:border-[#1A73E8] rounded-xl space-y-2 cursor-pointer transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#1F2421]">{pkg.packageName}</span>
                      <span className="px-2 py-0.5 bg-white text-[10px] rounded border border-[#E5E3DC]">
                        {pkg.ecosystem}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#5C635E] line-clamp-2">
                      {pkg.summary}
                    </div>

                    <div className="flex justify-between items-center pt-2 text-[11px] text-[#7A827C]">
                      <span>v{pkg.latestVersion}</span>
                      <span className="text-[#1A73E8] font-semibold">Inspect &rarr;</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 4: Typed Resources */}
          {attachedResources.length > 0 && (
            <section className="p-6 bg-white border border-[#E5E3DC] rounded-2xl space-y-4">
              <h2 className="font-editorial text-2xl font-bold text-[#1F2421] flex items-center gap-2">
                <FileCode className="w-5 h-5 text-[#0369A1]" />
                Attached Typed Resources
              </h2>

              <div className="space-y-3 font-mono text-xs">
                {attachedResources.map((res) => {
                  const resRoute = `/catalog/resources/${res.resourceType}/${res.routeKey}`;
                  return (
                    <div
                      key={res.routeKey}
                      onClick={() => onNavigate(resRoute)}
                      className="p-3.5 bg-[#FAF9F6] border border-[#E5E3DC] hover:border-[#1A73E8] rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-[#1F2421]">{res.name}</span>
                          <StateBadge type="resourceType" value={res.resourceType} />
                        </div>
                        <p className="text-[11px] text-[#5C635E] truncate">
                          {res.purpose}
                        </p>
                      </div>

                      <span className="text-[#1A73E8] font-semibold shrink-0">
                        Inspect &rarr;
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Section 5: SSOT Governance Summary */}
          {attachedRepos.some(r => governanceRecords[r.slug]) && (
            <section className="p-6 bg-white border border-[#E5E3DC] rounded-2xl space-y-4">
              <h2 className="font-editorial text-2xl font-bold text-[#1F2421] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#3730A3]" />
                Repository-Scoped SSOT Governance
              </h2>

              <p className="text-xs text-[#5C635E]">
                Governance rules apply strictly to owning repositories. Showing aggregated SSOT claim linkage:
              </p>

              {attachedRepos.map((repo) => {
                const gov = governanceRecords[repo.slug];
                if (!gov) return null;
                return (
                  <div key={repo.slug} className="space-y-3 p-4 bg-[#FAF9F6] border border-[#E5E3DC] rounded-xl">
                    <div className="font-mono text-xs font-bold text-[#1F2421]">
                      Repository: {repo.owner}/{repo.repository}
                    </div>
                    <SSOTInventoryGrid governance={gov} />
                    <ClaimLinkageBar
                      numerator={gov.claimCoverage.numerator}
                      denominator={gov.claimCoverage.denominator}
                      percentage={gov.claimCoverage.percentage}
                      canonicalRegistry={gov.canonicalRegistry}
                      limitation={gov.explicitLimitation}
                    />
                  </div>
                );
              })}
            </section>
          )}
        </div>

        {/* Right Context Rail (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          <EvidenceBoundaryCallout
            evidenceState="reviewed"
            observedAt={product.observedAt}
            limitations={product.limitations}
          />

          <div className="p-5 bg-white border border-[#E5E3DC] rounded-2xl space-y-3 font-mono text-xs">
            <h3 className="font-bold text-[#1F2421] uppercase tracking-wider text-[11px]">
              Record Ownership &amp; Path
            </h3>

            <div className="p-3 bg-[#FAF9F6] border border-[#E5E3DC] rounded-lg space-y-2 text-[#5C635E]">
              <div>Organization: <strong className="text-[#1F2421]">{product.organization}</strong></div>
              <div>Product Slug: <strong className="text-[#1F2421]">{product.slug}</strong></div>
              <div>Ecosystem: <strong className="text-[#1F2421]">{product.ecosystem}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
