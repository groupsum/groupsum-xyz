import React from 'react';
import { TechnologyRecord } from '../../types/catalog';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { EvidenceBoundaryCallout } from '../common/EvidenceBoundaryCallout';
import { Cpu, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

interface TechnologyMemberViewProps {
  tech: TechnologyRecord;
  onNavigate: (route: string) => void;
}

export const TechnologyMemberView: React.FC<TechnologyMemberViewProps> = ({
  tech,
  onNavigate,
}) => {
  return (
    <div className="space-y-8">
      {/* Top Back Navigation & Breadcrumb */}
      <div className="space-y-3">
        <button
          onClick={() => onNavigate('/catalog/technologies/')}
          className="inline-flex items-center space-x-1.5 text-xs font-mono text-[#B45309] hover:underline font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Technologies Collection</span>
        </button>

        <Breadcrumbs
          organization="groupsum"
          technology={{ name: tech.name, slug: tech.slug }}
          onNavigate={onNavigate}
        />
      </div>

      {/* Identity Header */}
      <div className="p-6 bg-white border border-[#E5E3DC] rounded-2xl shadow-xs space-y-6">
        <div className="flex items-start space-x-4">
          <div className="p-3.5 rounded-xl bg-[#FFEDD5] border border-[#FDBA74] text-[#B45309] shrink-0">
            <Cpu className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#B45309] bg-[#F4F3EF] px-2.5 py-0.5 rounded border border-[#E5E3DC]">
              Categorical Technology
            </span>

            <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1F2421] tracking-tight">
              {tech.name}
            </h1>

            <p className="text-sm sm:text-base text-[#5C635E] max-w-3xl leading-relaxed">
              {tech.summary}
            </p>
          </div>
        </div>

        <div className="p-3 bg-[#FAF9F6] border border-[#E5E3DC] rounded-xl font-mono text-xs text-[#5C635E]">
          Category: <strong className="text-[#1F2421]">{tech.category}</strong>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <section className="p-6 bg-white border border-[#E5E3DC] rounded-2xl space-y-4">
            <h2 className="font-editorial text-2xl font-bold text-[#1F2421]">
              Catalog Records Utilizing {tech.name}
            </h2>

            <div className="space-y-3 font-mono text-xs">
              {tech.relatedRecordRefs.map((ref, idx) => (
                <div
                  key={idx}
                  onClick={() => onNavigate(ref.route)}
                  className="p-3.5 bg-[#FAF9F6] border border-[#E5E3DC] hover:border-[#1A73E8] rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all"
                >
                  <div>
                    <span className="text-[10px] text-[#7A827C] uppercase block">{ref.entityType}</span>
                    <span className="font-bold text-[#1F2421] text-sm">{ref.name}</span>
                  </div>

                  <span className="text-[#1A73E8] font-semibold inline-flex items-center gap-1">
                    Inspect Record &rarr;
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <EvidenceBoundaryCallout
            evidenceState="reviewed"
            observedAt={tech.observedAt}
          />
        </div>
      </div>
    </div>
  );
};
