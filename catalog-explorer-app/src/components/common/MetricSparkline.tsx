import React, { useState } from 'react';
import { TimeSeries } from '../../types/catalog';

interface MetricSparklineProps {
  series?: TimeSeries;
  label: string;
  ownerName?: string;
  color?: string;
  width?: number;
  height?: number;
}

export const MetricSparkline: React.FC<MetricSparklineProps> = ({
  series,
  label,
  ownerName,
  color = '#2E6B9E',
  width = 120,
  height = 28,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ dateLabel: string; value: number } | null>(null);

  if (!series || !series.points || series.points.length < 2) {
    return (
      <div className="inline-flex items-center text-[11px] font-mono text-[#7A827C]" title="Insufficient observations to draw trendline">
        <span className="w-1.5 h-1.5 rounded-full bg-[#A3A8A2] mr-1.5" />
        1 persisted observation
      </div>
    );
  }

  const values = series.points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  // Build SVG path points
  const pointsString = series.points
    .map((pt, idx) => {
      const x = (idx / (series.points.length - 1)) * width;
      // Invert Y for SVG coordinates
      const y = height - 4 - ((pt.value - min) / range) * (height - 8);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const summaryText = `${label} trend for ${ownerName || 'resource'}: ${series.points[0].value} on ${series.points[0].dateLabel} to ${series.points[series.points.length - 1].value} on ${series.points[series.points.length - 1].dateLabel} (${series.period} window, ${series.dataPointCount} points).`;

  return (
    <div className="relative inline-flex flex-col group">
      <div className="flex items-center space-x-2">
        <svg
          width={width}
          height={height}
          className="overflow-visible"
          aria-label={summaryText}
          role="img"
        >
          {/* Background baseline */}
          <line x1="0" y1={height - 2} x2={width} y2={height - 2} stroke="#E5E3DC" strokeWidth="1" strokeDasharray="2 2" />

          {/* Sparkline polyline */}
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={pointsString}
          />

          {/* Interactive dots */}
          {series.points.map((pt, idx) => {
            const x = (idx / (series.points.length - 1)) * width;
            const y = height - 4 - ((pt.value - min) / range) * (height - 8);
            return (
              <circle
                key={idx}
                cx={x}
                cy={y}
                r="2.5"
                fill={color}
                className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:r-4"
                onMouseEnter={() => setHoveredPoint({ dateLabel: pt.dateLabel, value: pt.value })}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            );
          })}
        </svg>

        <span className="text-[10px] font-mono text-[#7A827C] whitespace-nowrap">
          {series.period} ({series.dataPointCount} pts)
        </span>
      </div>

      {/* Tooltip on hover */}
      {hoveredPoint && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-[#1F2421] text-white text-[10px] font-mono rounded shadow-md z-20 pointer-events-none whitespace-nowrap">
          {hoveredPoint.dateLabel}: <span className="font-semibold">{hoveredPoint.value.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
};
