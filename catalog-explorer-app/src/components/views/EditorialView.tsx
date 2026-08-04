import React from 'react';
import { BookOpen, Building2, CheckCircle, Lightbulb, SlidersHorizontal } from 'lucide-react';
import { CollectionHeader } from '../common/CollectionHeader';

const records = {
  solutions: [
    ['Traceable Product Delivery', 'Connect intent, implementation, tests, release evidence, and public claims.'],
    ['Schema-first API Foundations', 'Make validation, operations, persistence, and transport boundaries explicit.'],
    ['Composable AI Application Systems', 'Separate providers, tools, parsers, memory, and evaluation.'],
  ],
  services: [
    ['Product and Evidence Review', 'Classify implementation, publication, deployment, and public claim boundaries.'],
    ['Architecture and Specification Delivery', 'Create durable decisions, contracts, tests, and migration guidance.'],
    ['Delivery and Release Operations', 'Make build, publication, deployment, and reachability evidence distinct.'],
  ],
  insights: [
    ['Research notes and historical papers', 'Preserved writing with explicit historical and evidence-state labels.'],
    ['Engineering field notes', 'Technical observations organized for scanning and deeper reading.'],
  ],
  about: [
    ['Source-controlled truth', 'Keep decisions and contracts inspectable in version-controlled source.'],
    ['Traceable delivery gates', 'Retain the path from intent to tests, artifacts, deployment, and verification.'],
    ['Quiet, focus-driven design', 'Favor legibility, responsive density, and explicit action consequences.'],
  ],
  contact: [['Technical inquiry', 'A discovery starting point for bounded product, evidence, delivery, or operator work.']],
  'privacy-policy': [['Information processing', 'Only explicitly submitted inquiry information is used to evaluate potential engagements.'], ['Tracking boundary', 'The public site does not operate marketing trackers or advertising networks.']],
  'terms-of-service': [['Site terms', 'Public records and historical materials are provided as-is with explicit evidence boundaries.'], ['Repository licenses', 'Linked source and packages remain governed by their respective licenses and notices.']],
} as const;

const pageCopy = {
  solutions: ['Solutions collection', 'Outcome-led systems engineering', 'Specific operating frictions, evidence-backed capabilities, audiences, and limitations.'],
  services: ['Services collection', 'How we partner and deliver', 'Discovery-led engagement shapes with explicit inputs, outputs, scope, and exclusions.'],
  insights: ['Insights collection', 'Research notes and historical papers', 'Historical and current editorial records presented with clear evidence boundaries.'],
  about: ['Organization record', 'GroupSum LLC', 'Governed developer systems for teams that need complex products and delivery boundaries to remain legible.'],
  contact: ['Contact', 'Discuss a bounded project', 'Share the system, evidence, delivery, or operator problem that needs to become explicit.'],
  'privacy-policy': ['Governance record', 'Privacy policy', 'How GroupSum handles information submitted through groupsum.xyz.'],
  'terms-of-service': ['Governance record', 'Terms of service', 'The conditions and boundaries that apply when accessing groupsum.xyz.'],
} as const;

export const EditorialView: React.FC<{ kind: keyof typeof records }> = ({ kind }) => {
  const [eyebrow, title, description] = pageCopy[kind];
  const Icon = kind === 'solutions' ? Lightbulb : kind === 'services' ? SlidersHorizontal : kind === 'insights' ? BookOpen : Building2;
  return <div className="space-y-8"><CollectionHeader eyebrow={eyebrow} title={title} description={description} observationTime="2026-08-04T00:00:00Z" summaryFacts={[{ label: 'Records', value: records[kind].length, icon: <Icon className="h-4 w-4 text-[#2E6B9E]" /> }, { label: 'State', value: 'Evidence labeled', icon: <CheckCircle className="h-4 w-4 text-[#166534]" /> }]} /><div className="space-y-3">{records[kind].map(([name, summary]) => <article key={name} className="flex flex-wrap items-start gap-4 rounded-xl border border-[#E5E3DC] bg-white p-5"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-[#E5E3DC] bg-[#F4F3EF] text-[#2E6B9E]"><Icon className="h-5 w-5" /></span><div className="min-w-0 flex-1"><h2 className="font-editorial text-xl font-bold text-[#1F2421]">{name}</h2><p className="mt-1 text-xs leading-relaxed text-[#5C635E]">{summary}</p></div></article>)}</div></div>;
};
