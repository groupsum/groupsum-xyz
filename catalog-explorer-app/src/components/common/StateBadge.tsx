import React from 'react';
import { 
  MaturityState, 
  PublicationState, 
  EvidenceState, 
  GovernanceState, 
  ResourceType 
} from '../../types/catalog';
import { CheckCircle2, AlertTriangle, HelpCircle, ShieldCheck, ShieldAlert, CircleDot, Globe, BookOpen, Terminal, Sparkles, Code2, Layout, Layers } from 'lucide-react';

interface StateBadgeProps {
  type: 'maturity' | 'publication' | 'evidence' | 'governance' | 'resourceType' | 'freshness';
  value: MaturityState | PublicationState | EvidenceState | GovernanceState | ResourceType | string;
  size?: 'sm' | 'md';
}

export const StateBadge: React.FC<StateBadgeProps> = ({ type, value, size = 'sm' }) => {
  const padClass = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  if (type === 'maturity') {
    const v = value as MaturityState;
    switch (v) {
      case 'production':
        return (
          <span className={`inline-flex items-center gap-1 font-mono font-medium rounded-md bg-[#EBF5EE] text-[#1E5631] border border-[#C5E1CD] ${padClass}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E5631]" aria-hidden="true" />
            Production
          </span>
        );
      case 'active':
        return (
          <span className={`inline-flex items-center gap-1 font-mono font-medium rounded-md bg-[#E8F0FE] text-[#1A56DB] border border-[#C6D7F9] ${padClass}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#1A56DB]" aria-hidden="true" />
            Active
          </span>
        );
      case 'beta':
        return (
          <span className={`inline-flex items-center gap-1 font-mono font-medium rounded-md bg-[#FFF4E5] text-[#B45309] border border-[#FCD34D] ${padClass}`}>
            <span className="w-1.5 h-1.5 rotate-45 bg-[#B45309]" aria-hidden="true" />
            Beta
          </span>
        );
      case 'experimental':
        return (
          <span className={`inline-flex items-center gap-1 font-mono font-medium rounded-md bg-[#F3E8FF] text-[#6B21A8] border border-[#E9D5FF] ${padClass}`}>
            <span className="w-1.5 h-1.5 bg-[#6B21A8]" aria-hidden="true" />
            Experimental
          </span>
        );
      default:
        return (
          <span className={`inline-flex items-center gap-1 font-mono font-medium rounded-md bg-[#F1F3F2] text-[#5C635E] border border-[#D5D8D6] ${padClass}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#5C635E]" aria-hidden="true" />
            {v}
          </span>
        );
    }
  }

  if (type === 'publication') {
    const v = value as PublicationState;
    switch (v) {
      case 'published':
        return (
          <span className={`inline-flex items-center gap-1 font-mono font-medium rounded-md bg-[#E3F2FD] text-[#0D47A1] border border-[#BBDEFB] ${padClass}`}>
            <CheckCircle2 className="w-3 h-3 text-[#0D47A1]" />
            Published
          </span>
        );
      case 'manifest-private':
        return (
          <span className={`inline-flex items-center gap-1 font-mono font-medium rounded-md bg-[#F3F4F6] text-[#374151] border border-[#E5E7EB] ${padClass}`}>
            <span className="w-1.5 h-1.5 bg-[#4B5563]" aria-hidden="true" />
            Manifest Private
          </span>
        );
      case 'candidate':
        return (
          <span className={`inline-flex items-center gap-1 font-mono font-medium rounded-md bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] ${padClass}`}>
            <AlertTriangle className="w-3 h-3 text-[#92400E]" />
            Private Candidate
          </span>
        );
      case 'workspace':
        return (
          <span className={`inline-flex items-center gap-1 font-mono font-medium rounded-md bg-[#EDE9FE] text-[#5B21B6] border border-[#DDD6FE] ${padClass}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#5B21B6]" aria-hidden="true" />
            Workspace
          </span>
        );
      default:
        return (
          <span className={`inline-flex items-center gap-1 font-mono font-medium rounded-md bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB] ${padClass}`}>
            <HelpCircle className="w-3 h-3 text-[#6B7280]" />
            Registry Unavailable
          </span>
        );
    }
  }

  if (type === 'evidence') {
    const v = value as EvidenceState;
    switch (v) {
      case 'reviewed':
        return (
          <span className={`inline-flex items-center gap-1 font-mono font-medium rounded-md bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] ${padClass}`}>
            <CheckCircle2 className="w-3 h-3 text-[#065F46]" />
            Reviewed Evidence
          </span>
        );
      case 'observed':
        return (
          <span className={`inline-flex items-center gap-1 font-mono font-medium rounded-md bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] ${padClass}`}>
            <CircleDot className="w-3 h-3 text-[#166534]" />
            Automated Observation
          </span>
        );
      case 'not-observed':
        return (
          <span className={`inline-flex items-center gap-1 font-mono font-medium rounded-md bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A] ${padClass}`}>
            <HelpCircle className="w-3 h-3 text-[#92400E]" />
            Not Observed
          </span>
        );
      case 'stale':
        return (
          <span className={`inline-flex items-center gap-1 font-mono font-medium rounded-md bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA] ${padClass}`}>
            <AlertTriangle className="w-3 h-3 text-[#991B1B]" />
            Stale Payload
          </span>
        );
      default:
        return (
          <span className={`inline-flex items-center gap-1 font-mono font-medium rounded-md bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB] ${padClass}`}>
            Unavailable
          </span>
        );
    }
  }

  if (type === 'governance') {
    const v = value as GovernanceState;
    switch (v) {
      case 'governed':
        return (
          <span className={`inline-flex items-center gap-1 font-mono font-medium rounded-md bg-[#EEF2FF] text-[#3730A3] border border-[#C7D2FE] ${padClass}`}>
            <ShieldCheck className="w-3 h-3 text-[#3730A3]" />
            SSOT Governed
          </span>
        );
      case 'partial':
        return (
          <span className={`inline-flex items-center gap-1 font-mono font-medium rounded-md bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A] ${padClass}`}>
            <ShieldAlert className="w-3 h-3 text-[#92400E]" />
            Partial SSOT
          </span>
        );
      default:
        return (
          <span className={`inline-flex items-center gap-1 font-mono font-medium rounded-md bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB] ${padClass}`}>
            <HelpCircle className="w-3 h-3 text-[#6B7280]" />
            Registry Absent
          </span>
        );
    }
  }

  if (type === 'resourceType') {
    const r = value as ResourceType;
    switch (r) {
      case 'website':
        return (
          <span className={`inline-flex items-center gap-1 font-mono font-medium rounded-md bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD] ${padClass}`}>
            <Globe className="w-3 h-3 text-[#0369A1]" />
            Website
          </span>
        );
      case 'documentation':
        return (
          <span className={`inline-flex items-center gap-1 font-mono font-medium rounded-md bg-[#E0E7FF] text-[#3730A3] border border-[#C7D2FE] ${padClass}`}>
            <BookOpen className="w-3 h-3 text-[#3730A3]" />
            Docs
          </span>
        );
      case 'api':
        return (
          <span className={`inline-flex items-center gap-1 font-mono font-medium rounded-md bg-[#FCE7F3] text-[#9D174D] border border-[#FBCFE8] ${padClass}`}>
            <Terminal className="w-3 h-3 text-[#9D174D]" />
            API
          </span>
        );
      case 'demo':
        return (
          <span className={`inline-flex items-center gap-1 font-mono font-medium rounded-md bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] ${padClass}`}>
            <Sparkles className="w-3 h-3 text-[#92400E]" />
            Demo
          </span>
        );
      case 'example':
        return (
          <span className={`inline-flex items-center gap-1 font-mono font-medium rounded-md bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0] ${padClass}`}>
            <Code2 className="w-3 h-3 text-[#166534]" />
            Example
          </span>
        );
      case 'showcase':
        return (
          <span className={`inline-flex items-center gap-1 font-mono font-medium rounded-md bg-[#EDE9FE] text-[#5B21B6] border border-[#DDD6FE] ${padClass}`}>
            <Layers className="w-3 h-3 text-[#5B21B6]" />
            Showcase
          </span>
        );
      case 'ui':
        return (
          <span className={`inline-flex items-center gap-1 font-mono font-medium rounded-md bg-[#F3E8FF] text-[#6B21A8] border border-[#E9D5FF] ${padClass}`}>
            <Layout className="w-3 h-3 text-[#6B21A8]" />
            UI / Console
          </span>
        );
    }
  }

  return (
    <span className={`inline-flex items-center gap-1 font-mono font-medium rounded-md bg-[#F3F4F6] text-[#374151] border border-[#E5E7EB] ${padClass}`}>
      {String(value)}
    </span>
  );
};
