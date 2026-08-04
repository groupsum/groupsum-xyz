import React from 'react';
import { LanguageByte } from '../../types/catalog';

interface LanguageBarProps {
  languages: LanguageByte[];
  totalBytes?: number;
  observedAt?: string;
}

export const LanguageBar: React.FC<LanguageBarProps> = ({ languages, observedAt }) => {
  if (!languages || languages.length === 0) {
    return <span className="text-xs font-mono text-[#7A827C]">Not reported</span>;
  }

  const sumBytes = languages.reduce((acc, l) => acc + l.bytes, 0);

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="font-semibold text-[#1F2421]">Programming Languages</span>
        <span className="text-[11px] text-[#7A827C]">
          {(sumBytes / 1024).toFixed(1)} KB analyzed
        </span>
      </div>

      {/* Proportional bar */}
      <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-[#E5E3DC]" role="img" aria-label={`Language breakdown: ${languages.map(l => `${l.language} ${l.percentage}%`).join(', ')}`}>
        {languages.map((l, i) => (
          <div
            key={i}
            style={{ width: `${l.percentage}%`, backgroundColor: l.color }}
            className="h-full transition-all duration-300"
            title={`${l.language}: ${l.percentage}% (${(l.bytes / 1024).toFixed(1)} KB)`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-mono pt-1">
        {languages.map((l, i) => (
          <div key={i} className="flex items-center space-x-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: l.color }}
              aria-hidden="true"
            />
            <span className="font-medium text-[#1F2421]">{l.language}</span>
            <span className="text-[#7A827C] text-[11px]">{l.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
