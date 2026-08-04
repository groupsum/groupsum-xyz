import React from 'react';
import { SSOTGovernanceRecord } from '../../types/catalog';
import { CheckCircle2, GitMerge, Shield, Lock, FileText, Key, Folder, Box, Check } from 'lucide-react';

interface SSOTInventoryGridProps {
  governance: SSOTGovernanceRecord;
}

const renderIcon = (iconName: string) => {
  switch (iconName) {
    case 'CheckCircle': return <CheckCircle2 className="w-4 h-4 text-[#166534]" />;
    case 'GitMerge': return <GitMerge className="w-4 h-4 text-[#5B4699]" />;
    case 'Shield': return <Shield className="w-4 h-4 text-[#2E6B9E]" />;
    case 'Lock': return <Lock className="w-4 h-4 text-[#9D174D]" />;
    case 'FileText': return <FileText className="w-4 h-4 text-[#3730A3]" />;
    case 'Key': return <Key className="w-4 h-4 text-[#B45309]" />;
    case 'Folder': return <Folder className="w-4 h-4 text-[#0369A1]" />;
    case 'Box': return <Box className="w-4 h-4 text-[#4B5563]" />;
    default: return <Check className="w-4 h-4 text-[#166534]" />;
  }
};

export const SSOTInventoryGrid: React.FC<SSOTInventoryGridProps> = ({ governance }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {governance.inventory.map((item, idx) => (
        <div key={idx} className="p-3 bg-[#FAF9F6] border border-[#E5E3DC] rounded-lg flex flex-col justify-between space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#5C635E] truncate" title={item.label}>
              {item.label}
            </span>
            {renderIcon(item.icon)}
          </div>
          <div className="text-xl font-mono font-bold text-[#1F2421] tabular-nums">
            {item.count.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};
