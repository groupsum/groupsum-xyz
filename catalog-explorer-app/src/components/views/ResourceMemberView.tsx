import React from 'react';
import { TypedResourceRecord } from '../../types/catalog';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { StateBadge } from '../common/StateBadge';
import { EvidenceBoundaryCallout } from '../common/EvidenceBoundaryCallout';
import { 
  FileCode, 
  ExternalLink, 
  ArrowLeft, 
  CheckCircle2, 
  Globe, 
  Terminal, 
  BookOpen, 
  Sparkles, 
  Layout, 
  Code2, 
  Layers 
} from 'lucide-react';

interface ResourceMemberViewProps {
  resource: TypedResourceRecord;
  onNavigate: (route: string) => void;
}

export const ResourceMemberView: React.FC<ResourceMemberViewProps> = ({
  resource,
  onNavigate,
}) => {
  return (
    <div className="space-y-8">
      {/* Top Back Navigation & Breadcrumb */}
      <div className="space-y-3">
        <button
          onClick={() => onNavigate('/catalog/resources/')}
          className="inline-flex items-center space-x-1.5 text-xs font-mono text-[#0369A1] hover:underline font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Typed Resources Collection</span>
        </button>

        <Breadcrumbs
          organization="groupsum"
          resource={{ name: resource.name, type: resource.resourceType, routeKey: resource.routeKey }}
          onNavigate={onNavigate}
        />
      </div>

      {/* Identity Header */}
      <div className="p-6 bg-white border border-[#E5E3DC] rounded-2xl shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="p-3.5 rounded-xl bg-[#E0F2FE] border border-[#BAE6FD] text-[#0369A1] shrink-0">
              <FileCode className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#0369A1] bg-[#F4F3EF] px-2.5 py-0.5 rounded border border-[#E5E3DC]">
                  Typed Resource Record
                </span>
                <StateBadge type="resourceType" value={resource.resourceType} />
              </div>

              <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1F2421] tracking-tight">
                {resource.name}
              </h1>

              <p className="text-sm sm:text-base text-[#5C635E] max-w-3xl leading-relaxed">
                {resource.purpose}
              </p>
            </div>
          </div>

          <a
            href={resource.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#1F2421] text-white font-mono text-xs rounded-lg hover:bg-[#2E6B9E] transition-colors shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Launch Resource &rarr;</span>
          </a>
        </div>

        {/* Spec details strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#E5E3DC] font-mono text-xs">
          <div className="p-3 bg-[#FAF9F6] border border-[#E5E3DC] rounded-lg">
            <span className="text-[11px] text-[#7A827C] block">Reachability State</span>
            <span className="text-sm font-bold text-[#166534] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {resource.reachability.toUpperCase()}
            </span>
          </div>

          {resource.owningRepository && (
            <div className="p-3 bg-[#FAF9F6] border border-[#E5E3DC] rounded-lg">
              <span className="text-[11px] text-[#7A827C] block">Owning Source Repo</span>
              <button
                onClick={() => onNavigate(`/catalog/repositories/${resource.owningRepository?.owner}/${resource.owningRepository?.repository}`)}
                className="text-xs font-bold text-[#5B4699] hover:underline"
              >
                {resource.owningRepository.owner}/{resource.owningRepository.repository}
              </button>
            </div>
          )}

          {resource.relatedProduct && (
            <div className="p-3 bg-[#FAF9F6] border border-[#E5E3DC] rounded-lg">
              <span className="text-[11px] text-[#7A827C] block">Related Product</span>
              <button
                onClick={() => onNavigate(`/products/records/${resource.relatedProduct?.slug}`)}
                className="text-xs font-bold text-[#2E6B9E] hover:underline"
              >
                {resource.relatedProduct.name}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {resource.specDetails && (
            <section className="p-6 bg-white border border-[#E5E3DC] rounded-2xl space-y-3 font-mono text-xs">
              <h2 className="font-editorial text-2xl font-bold text-[#1F2421]">
                Specification Details
              </h2>
              <div className="p-4 bg-[#FAF9F6] border border-[#E5E3DC] rounded-xl space-y-2 text-[#5C635E]">
                {resource.specDetails.contractVersion && (
                  <div>Contract Version: <strong className="text-[#1F2421]">{resource.specDetails.contractVersion}</strong></div>
                )}
                {resource.specDetails.authBoundary && (
                  <div>Authentication Boundary: <strong className="text-[#9D174D]">{resource.specDetails.authBoundary}</strong></div>
                )}
                {resource.specDetails.framework && (
                  <div>Framework / Engine: <strong className="text-[#1F2421]">{resource.specDetails.framework}</strong></div>
                )}
                {resource.specDetails.scenario && (
                  <div>Integration Scenario: <strong className="text-[#1F2421]">{resource.specDetails.scenario}</strong></div>
                )}
              </div>
            </section>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <EvidenceBoundaryCallout
            evidenceState="reviewed"
            observedAt={resource.observedAt}
            limitations={resource.limitations}
            sourceUrl={resource.url}
          />
        </div>
      </div>
    </div>
  );
};
