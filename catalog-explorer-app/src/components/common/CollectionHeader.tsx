import React from 'react';
import { Calendar, Download, RefreshCw } from 'lucide-react';

export interface SummaryFact {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  hint?: string;
}

interface CollectionHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  observationTime: string;
  summaryFacts: SummaryFact[];
  onDownloadExport?: () => void;
}

export const CollectionHeader: React.FC<CollectionHeaderProps> = ({
  eyebrow,
  title,
  description,
  observationTime,
  summaryFacts,
  onDownloadExport,
}) => {
  const formattedDate = new Date(observationTime).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-6 pb-6 border-b border-[#E5E3DC]">
      {/* Editorial Title Block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center space-x-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#2E6B9E]">
            <span className="w-2 h-2 rounded-full bg-[#2E6B9E]" />
            <span>{eyebrow}</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1F2421] tracking-tight">
            {title}
          </h1>

          <p className="text-sm sm:text-base text-[#5C635E] leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end space-y-2 text-xs font-mono">
          <div className="inline-flex items-center space-x-1.5 text-[#7A827C] bg-[#F4F3EF] px-2.5 py-1 rounded-md border border-[#E5E3DC]">
            <Calendar className="w-3.5 h-3.5" />
            <span>Observed: {formattedDate}</span>
          </div>

          {onDownloadExport && (
            <button
              onClick={onDownloadExport}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-[#F4F3EF] text-[#1F2421] font-medium rounded-lg border border-[#E5E3DC] transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-[#1A73E8]"
            >
              <Download className="w-3.5 h-3.5 text-[#2E6B9E]" />
              <span>Export JSON Dataset</span>
            </button>
          )}
        </div>
      </div>

      {/* Collection Summary Band (3-5 facts) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
        {summaryFacts.map((fact, idx) => (
          <div
            key={idx}
            className="p-3 bg-white border border-[#E5E3DC] rounded-xl shadow-xs flex flex-col justify-between space-y-1 hover:border-[#B5B0A6] transition-colors"
          >
            <div className="flex items-center justify-between text-xs font-mono text-[#5C635E]">
              <span className="truncate">{fact.label}</span>
              {fact.icon}
            </div>
            <div className="text-xl font-mono font-bold text-[#1F2421] tabular-nums tracking-tight">
              {fact.value}
            </div>
            {fact.hint && (
              <span className="text-[10px] font-mono text-[#7A827C]">
                {fact.hint}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
