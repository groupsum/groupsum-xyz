import React from 'react';

interface ClaimLinkageBarProps {
  numerator: number;
  denominator: number;
  percentage: number;
  canonicalRegistry?: string;
  limitation?: string;
}

export const ClaimLinkageBar: React.FC<ClaimLinkageBarProps> = ({
  numerator,
  denominator,
  percentage,
  canonicalRegistry,
  limitation,
}) => {
  return (
    <div className="p-4 bg-[#FAF9F6] border border-[#E5E3DC] rounded-xl space-y-3">
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="font-semibold text-[#1F2421]">SSOT Claim-to-Evidence Linkage Coverage</span>
        <span className="font-bold text-[#2E6B9E] tabular-nums">
          {numerator} / {denominator} verified ({percentage.toFixed(1)}%)
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-[#E5E3DC] rounded-full overflow-hidden flex">
        <div
          style={{ width: `${percentage}%` }}
          className="h-full bg-[#2E6B9E] transition-all duration-300"
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Claim coverage: ${numerator} of ${denominator} verified (${percentage.toFixed(1)}%)`}
        />
      </div>

      <div className="flex flex-col space-y-1 text-xs font-mono text-[#5C635E]">
        {canonicalRegistry && (
          <div className="truncate">
            Canonical Registry SSOT Target:{' '}
            <a
              href={canonicalRegistry}
              target="_blank"
              rel="noreferrer"
              className="text-[#5B4699] underline font-medium"
            >
              {canonicalRegistry}
            </a>
          </div>
        )}
        {limitation && (
          <div className="text-[11px] text-[#7A827C] italic">
            Coverage Note: {limitation}
          </div>
        )}
      </div>
    </div>
  );
};
