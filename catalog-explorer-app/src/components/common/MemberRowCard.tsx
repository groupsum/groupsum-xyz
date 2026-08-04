import React from 'react';
import { 
  Box, 
  Layers, 
  ChevronRight, 
  Building2, 
  ExternalLink,
  ShieldCheck,
  FileCode,
  Sparkles,
  GitBranch
} from 'lucide-react';
import { StateBadge } from './StateBadge';
import { MaturityState, ResourceType } from '../../types/catalog';

interface MemberRowCardProps {
  id: string;
  name: string;
  summary: string;
  ownerPath: string;
  type: 'product' | 'portfolio' | 'resource' | 'technology';
  maturity?: MaturityState;
  resourceType?: ResourceType;
  ecosystem?: string;
  packagesCount?: number;
  repositoriesCount?: number;
  route: string;
  onNavigate: (route: string) => void;
  density?: 'comfortable' | 'compact';
}

export const MemberRowCard: React.FC<MemberRowCardProps> = ({
  name,
  summary,
  ownerPath,
  type,
  maturity,
  resourceType,
  ecosystem,
  packagesCount,
  repositoriesCount,
  route,
  onNavigate,
  density = 'comfortable',
}) => {
  const padClass = density === 'comfortable' ? 'p-5' : 'p-3.5';

  const renderIcon = () => {
    if (type === 'product') return <Box className="w-5 h-5 text-[#2E6B9E]" />;
    if (type === 'portfolio') return <Layers className="w-5 h-5 text-[#5B4699]" />;
    if (type === 'technology') return <Sparkles className="w-5 h-5 text-[#B45309]" />;
    return <FileCode className="w-5 h-5 text-[#166534]" />;
  };

  return (
    <div
      onClick={() => onNavigate(route)}
      className={`group bg-white hover:bg-[#FAF9F6] border border-[#E5E3DC] hover:border-[#1A73E8] rounded-xl ${padClass} transition-all duration-200 shadow-xs cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4`}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onNavigate(route);
        }
      }}
    >
      <div className="flex items-start space-x-3.5 flex-1 min-w-0">
        <div className="p-2.5 rounded-lg bg-[#F4F3EF] border border-[#E5E3DC] group-hover:bg-white transition-colors shrink-0">
          {renderIcon()}
        </div>

        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center space-x-2 flex-wrap">
            <span className="font-editorial text-lg font-bold text-[#1F2421] group-hover:text-[#1A73E8] transition-colors truncate">
              {name}
            </span>

            {maturity && <StateBadge type="maturity" value={maturity} />}
            {resourceType && <StateBadge type="resourceType" value={resourceType} />}
          </div>

          <p className="text-xs text-[#5C635E] line-clamp-2 leading-relaxed">
            {summary}
          </p>

          <div className="flex items-center space-x-3 text-xs font-mono text-[#7A827C] flex-wrap pt-0.5">
            <span className="inline-flex items-center space-x-1">
              <Building2 className="w-3 h-3 text-[#7A827C]" />
              <span>{ownerPath}</span>
            </span>

            {ecosystem && (
              <>
                <span className="text-[#D5D8D6]">&bull;</span>
                <span className="text-[#5C635E]">{ecosystem}</span>
              </>
            )}

            {repositoriesCount !== undefined && (
              <>
                <span className="text-[#D5D8D6]">&bull;</span>
                <span className="inline-flex items-center gap-1 text-[#5B4699]">
                  <GitBranch className="w-3 h-3" />
                  {repositoriesCount} Repositories
                </span>
              </>
            )}

            {packagesCount !== undefined && (
              <>
                <span className="text-[#D5D8D6]">&bull;</span>
                <span className="text-[#2E6B9E] font-medium">
                  {packagesCount} Contained Packages
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end space-x-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#E5E3DC]/60">
        <span className="text-xs font-mono font-semibold text-[#1A73E8] group-hover:underline inline-flex items-center gap-1">
          Inspect Member Record
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </div>
  );
};
