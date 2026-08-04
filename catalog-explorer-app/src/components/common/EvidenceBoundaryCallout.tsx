import React from 'react';
import { ShieldCheck, Info, ExternalLink, Clock, FileText } from 'lucide-react';
import { EvidenceState } from '../../types/catalog';
import { StateBadge } from './StateBadge';

interface EvidenceBoundaryCalloutProps {
  evidenceState: EvidenceState;
  observedAt: string;
  sourceUrl?: string;
  limitations?: string[];
  canonicalRegistryUrl?: string;
  noticeUrl?: string;
}

export const EvidenceBoundaryCallout: React.FC<EvidenceBoundaryCalloutProps> = ({
  evidenceState,
  observedAt,
  sourceUrl,
  limitations = [],
  canonicalRegistryUrl,
  noticeUrl,
}) => {
  const formattedDate = new Date(observedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  return (
    <div className="p-4 bg-[#FAF9F6] border border-[#E5E3DC] rounded-xl space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#E5E3DC] pb-2.5">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-[#2E6B9E]" />
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#1F2421]">
            Evidence & Provenance Boundary
          </h3>
        </div>
        <StateBadge type="evidence" value={evidenceState} />
      </div>

      <div className="text-xs font-mono text-[#5C635E] space-y-1.5">
        <div className="flex items-center space-x-1.5 text-[#7A827C]">
          <Clock className="w-3.5 h-3.5 text-[#7A827C]" />
          <span>Last observed: <time dateTime={observedAt} className="text-[#1F2421] font-medium">{formattedDate}</time></span>
        </div>

        {limitations.length > 0 && (
          <div className="mt-2 space-y-1 bg-[#F4F3EF] p-2.5 rounded-lg border border-[#E5E3DC]">
            <span className="font-semibold text-[#1F2421] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#B45309]" />
              Explicit Limitations & Boundary:
            </span>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-[#5C635E]">
              {limitations.map((lim, idx) => (
                <li key={idx}>{lim}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-2 text-[11px]">
          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[#2E6B9E] hover:underline font-medium"
            >
              <ExternalLink className="w-3 h-3" />
              Source Repository
            </a>
          )}
          {canonicalRegistryUrl && (
            <a
              href={canonicalRegistryUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[#5B4699] hover:underline font-medium"
            >
              <FileText className="w-3 h-3" />
              Canonical Registry SSOT
            </a>
          )}
          {noticeUrl && (
            <a
              href={noticeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[#166534] hover:underline font-medium"
            >
              <ShieldCheck className="w-3 h-3" />
              License & Notice File
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
