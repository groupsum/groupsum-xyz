import React, { useState } from 'react';
import { CommitBarPoint } from '../../types/catalog';
import { Table, BarChart2 } from 'lucide-react';

interface CommitBarSparklineProps {
  commits: CommitBarPoint[];
  repositoryName: string;
  width?: number;
  height?: number;
}

export const CommitBarSparkline: React.FC<CommitBarSparklineProps> = ({
  commits,
  repositoryName,
  width = 180,
  height = 32,
}) => {
  const [hoveredDay, setHoveredDay] = useState<CommitBarPoint | null>(null);
  const [showTable, setShowTable] = useState(false);

  if (!commits || commits.length === 0) {
    return (
      <span className="text-xs font-mono text-[#7A827C]">Not observed</span>
    );
  }

  const totalCommits = commits.reduce((sum, c) => sum + c.commitCount, 0);
  const maxCount = Math.max(...commits.map((c) => c.commitCount), 1);

  const barWidth = Math.max(2, Math.floor((width - (commits.length - 1)) / commits.length));
  const gap = 1;

  const summaryLabel = `30-day commit activity for ${repositoryName}: ${totalCommits} total commits across ${commits.length} observed days. Peak day had ${maxCount} commits.`;

  return (
    <div className="flex flex-col space-y-1 group">
      <div className="flex items-center space-x-2">
        <svg
          width={width}
          height={height}
          className="overflow-visible"
          aria-label={summaryLabel}
          role="img"
        >
          {commits.map((c, idx) => {
            const barHeight = c.commitCount > 0 
              ? Math.max(3, (c.commitCount / maxCount) * (height - 4)) 
              : 1;
            const x = idx * (barWidth + gap);
            const y = height - barHeight;
            const isZero = c.commitCount === 0;

            return (
              <rect
                key={idx}
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={isZero ? '#E5E3DC' : '#2E6B9E'}
                className="hover:fill-[#1A4B75] transition-colors cursor-pointer"
                onMouseEnter={() => setHoveredDay(c)}
                onMouseLeave={() => setHoveredDay(null)}
              />
            );
          })}
        </svg>

        <div className="flex items-center space-x-1">
          <span className="text-xs font-mono font-semibold text-[#1F2421]">
            {totalCommits}
          </span>
          <span className="text-[10px] font-mono text-[#7A827C]">commits/30d</span>
          
          <button
            onClick={() => setShowTable(!showTable)}
            className="p-0.5 text-[#7A827C] hover:text-[#1F2421] focus:outline-none focus:ring-1 focus:ring-[#1A73E8] rounded ml-1"
            title="Toggle tabular view of daily commit counts"
            aria-label="Toggle tabular view of daily commit counts"
          >
            <Table className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Hover tooltip */}
      {hoveredDay && (
        <div className="text-[10px] font-mono text-[#2E6B9E] font-medium">
          {hoveredDay.date}: <span className="font-bold text-[#1F2421]">{hoveredDay.commitCount}</span> commit{hoveredDay.commitCount === 1 ? '' : 's'}
        </div>
      )}

      {/* Accessible data table for screen reader & keyboard users */}
      {showTable && (
        <div className="mt-2 p-2 bg-[#FAF9F6] border border-[#E5E3DC] rounded text-xs font-mono max-h-36 overflow-y-auto">
          <div className="font-semibold mb-1 text-[#1F2421] flex items-center gap-1">
            <BarChart2 className="w-3.5 h-3.5 text-[#2E6B9E]" />
            Daily Breakdown ({repositoryName})
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#E5E3DC]">
                <th className="py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-[#7A827C] whitespace-nowrap text-left select-none">Date</th>
                <th className="py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-[#7A827C] whitespace-nowrap text-right select-none">Commits</th>
              </tr>
            </thead>
            <tbody>
              {commits.map((c, i) => (
                <tr key={i} className="border-b border-[#F4F3EF] hover:bg-[#F1F0EC]">
                  <td className="py-0.5 text-[#5C635E]">{c.date}</td>
                  <td className="py-0.5 text-right font-medium text-[#1F2421]">{c.commitCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
