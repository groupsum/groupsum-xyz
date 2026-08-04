import React from 'react';
import { ReleaseRecord } from '../../types/catalog';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { EvidenceBoundaryCallout } from '../common/EvidenceBoundaryCallout';
import { Tag, ExternalLink, ArrowLeft, Download, ShieldCheck, Clock } from 'lucide-react';

interface ReleaseMemberViewProps {
  release: ReleaseRecord;
  onNavigate: (route: string) => void;
}

export const ReleaseMemberView: React.FC<ReleaseMemberViewProps> = ({
  release,
  onNavigate,
}) => {
  return (
    <div className="space-y-8">
      {/* Top Back Navigation */}
      <div className="space-y-3">
        <button
          onClick={() => onNavigate(release.ownerRef.route)}
          className="inline-flex items-center space-x-1.5 text-xs font-mono text-[#1F2421] hover:underline font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Owner ({release.ownerRef.name})</span>
        </button>

        <Breadcrumbs
          organization="groupsum"
          onNavigate={onNavigate}
        />
      </div>

      {/* Identity Header */}
      <div className="p-6 bg-white border border-[#E5E3DC] rounded-2xl shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="p-3.5 rounded-xl bg-[#F4F3EF] border border-[#E5E3DC] text-[#1F2421] shrink-0">
              <Tag className="w-8 h-8 text-[#1A73E8]" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#1A73E8] bg-[#F4F3EF] px-2.5 py-0.5 rounded border border-[#E5E3DC]">
                  {release.releaseKind.toUpperCase()} Release Event
                </span>
                <span className="px-2 py-0.5 bg-[#E8F0FE] text-[#1A56DB] text-xs font-mono font-bold rounded">
                  Tag: {release.tagName}
                </span>
              </div>

              <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1F2421] tracking-tight">
                Release {release.version}
              </h1>

              <p className="text-sm font-mono text-[#5C635E]">
                Owning {release.ownerRef.type}:{' '}
                <button
                  onClick={() => onNavigate(release.ownerRef.route)}
                  className="font-bold text-[#1F2421] hover:underline hover:text-[#1A73E8]"
                >
                  {release.ownerRef.name}
                </button>
              </p>
            </div>
          </div>

          <a
            href={release.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#1F2421] text-white font-mono text-xs rounded-lg hover:bg-[#2E6B9E] transition-colors shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Source Artifact &rarr;</span>
          </a>
        </div>

        {/* Release Metadata Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#E5E3DC] font-mono text-xs">
          <div className="p-3 bg-[#FAF9F6] border border-[#E5E3DC] rounded-lg">
            <span className="text-[11px] text-[#7A827C] block">Published Date</span>
            <span className="text-sm font-bold text-[#1F2421]">{new Date(release.publishedAt).toLocaleDateString()}</span>
          </div>

          <div className="p-3 bg-[#FAF9F6] border border-[#E5E3DC] rounded-lg">
            <span className="text-[11px] text-[#7A827C] block">Downloads Reported</span>
            <span className="text-sm font-bold text-[#2E6B9E]">
              {release.downloadsCount ? release.downloadsCount.toLocaleString() : 'Not reported'}
            </span>
          </div>

          <div className="p-3 bg-[#FAF9F6] border border-[#E5E3DC] rounded-lg">
            <span className="text-[11px] text-[#7A827C] block">Prerelease / Draft</span>
            <span className="text-sm font-bold text-[#1F2421]">
              {release.isPrerelease ? 'Prerelease' : 'Stable Release'}
            </span>
          </div>

          <div className="p-3 bg-[#FAF9F6] border border-[#E5E3DC] rounded-lg">
            <span className="text-[11px] text-[#7A827C] block">License Inherited</span>
            <span className="text-sm font-bold text-[#166534]">{release.licenseInherited}</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <section className="p-6 bg-white border border-[#E5E3DC] rounded-2xl space-y-3">
            <h2 className="font-editorial text-2xl font-bold text-[#1F2421]">
              Release Notes &amp; Artifact Details
            </h2>

            <div className="p-4 bg-[#FAF9F6] border border-[#E5E3DC] rounded-xl font-mono text-xs text-[#1F2421] leading-relaxed whitespace-pre-wrap">
              {release.notes}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <EvidenceBoundaryCallout
            evidenceState="reviewed"
            observedAt={release.publishedAt}
            sourceUrl={release.sourceUrl}
          />
        </div>
      </div>
    </div>
  );
};
