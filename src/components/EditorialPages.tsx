import React from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle,
  FileText,
  Layers,
  Search,
  ShieldCheck,
  Sliders,
  User,
} from "lucide-react";
import { StructuredData } from "mdwrk/structured-data";
import { solutionsData } from "../data/solutions";
import { servicesData } from "../data/services";
import { catalogSummary } from "../data/catalog.generated";
import type { BlogPost } from "../types";
import { InquiryForm } from "./InquiryForm";
import { CollectionHeader, MemberRowCard, RecordIdentityCard, SurfaceCard } from "./CatalogVisuals";

type Navigate = (path: string) => void;

export function ExplorerSolutionsPage({ onNavigate }: { onNavigate: Navigate }) {
  const linkedEvidence = new Set(solutionsData.flatMap((solution) => solution.suites));
  return <div className="mx-auto max-w-[var(--content-max)] space-y-8 px-4 py-10 sm:px-6 lg:px-8">
    <CollectionHeader eyebrow="Solutions collection" title="Outcome-led systems engineering" description="Solution records organize specific operating frictions, evidence-backed capabilities, intended audiences, and explicit limitations. Each member opens into its own scoped record." observedAt={catalogSummary.generated_at} facts={[
      { label: "Solutions", value: solutionsData.length, icon: Layers },
      { label: "Evidence links", value: linkedEvidence.size, icon: ShieldCheck },
      { label: "Audiences", value: new Set(solutionsData.map((item) => item.audience)).size, icon: User },
      { label: "Delivery model", value: "Scoped", icon: Sliders },
    ]} />
    <div className="space-y-3">{solutionsData.map((solution) => <MemberRowCard key={solution.id} title={solution.title} summary={`${solution.problem} ${solution.capability}`} eyebrow="Solution" owner={solution.audience} route={`/solutions/${solution.slug}`} onNavigate={onNavigate} Icon={Layers} pills={[`${solution.suites.length} evidence links`]} facts={[{ label: "Deliverables", value: solution.deliverables.length }, { label: "Limitations", value: solution.limitations.length }]} />)}</div>
    <SurfaceCard title="Evidence boundary" Icon={ShieldCheck} intro="Solutions describe source-backed delivery capability, not fixed offers, warranties, certifications, or guaranteed outcomes.">
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-ink-muted"><span>Open a member record to inspect audience, symptoms, evidence, deliverables, and limitations.</span><button type="button" onClick={() => onNavigate("/contact")} className="inline-flex min-h-10 items-center gap-1.5 rounded-[3px] bg-ink px-4 font-mono font-semibold text-white hover:bg-accent">Discuss a solution <ArrowRight className="h-3.5 w-3.5" /></button></div>
    </SurfaceCard>
    <StructuredData type="solutions" />
  </div>;
}

export function ExplorerSolutionDetailPage({ slug, onNavigate }: { slug: string; onNavigate: Navigate }) {
  const solution = solutionsData.find((item) => item.slug === slug);
  if (!solution) return <MissingEditorialRecord kind="solution" onNavigate={onNavigate} />;
  return <div className="mx-auto max-w-[var(--content-max)] space-y-8 px-4 py-10 sm:px-6 lg:px-8">
    <button type="button" onClick={() => onNavigate("/solutions")} className="inline-flex min-h-10 items-center gap-1 font-mono text-xs font-semibold text-accent hover:underline"><ArrowLeft className="h-3.5 w-3.5" />Solutions collection</button>
    <RecordIdentityCard eyebrow="Solution record" title={solution.title} summary={solution.problem} Icon={Layers} pills={[{ label: "Evidence-scoped", tone: "accent" }]} facts={[
      { label: "Audience", value: solution.audience, icon: User }, { label: "Deliverables", value: solution.deliverables.length, icon: CheckCircle },
      { label: "Evidence links", value: solution.evidence.length, icon: ShieldCheck }, { label: "Limitations", value: solution.limitations.length, icon: FileText },
    ]} actions={<button type="button" onClick={() => onNavigate("/contact")} className="inline-flex min-h-10 items-center gap-1.5 rounded-[3px] bg-ink px-4 font-mono text-xs font-semibold text-white hover:bg-accent">{solution.cta} <ArrowRight className="h-3.5 w-3.5" /></button>} />
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12"><div className="space-y-6 lg:col-span-8"><SurfaceCard title="Problem and capability" Icon={Layers}><div className="grid gap-5 sm:grid-cols-2"><div><h3 className="font-mono text-[10px] font-bold uppercase tracking-wide text-ink-muted">Operating friction</h3><p className="mt-2 text-sm leading-relaxed text-ink-muted">{solution.problem}</p></div><div><h3 className="font-mono text-[10px] font-bold uppercase tracking-wide text-accent">Capability boundary</h3><p className="mt-2 text-sm font-medium leading-relaxed text-ink">{solution.capability}</p></div></div></SurfaceCard><ListSurface title="Observed symptoms" items={solution.symptoms} /><ListSurface title="Expected deliverables" items={solution.deliverables} /><ListSurface title="Representative evidence" items={solution.evidence} /></div><aside className="space-y-6 lg:col-span-4"><SurfaceCard title="Engagement path" Icon={Sliders}><p className="text-xs leading-relaxed text-ink-muted">{solution.engagementPath}</p></SurfaceCard><ListSurface title="Explicit limitations" items={solution.limitations} /><SurfaceCard title="Related systems" Icon={ShieldCheck}><div className="flex flex-wrap gap-2">{solution.suites.map((related) => <button key={related} type="button" onClick={() => onNavigate(`/products/records/${related}`)} className="min-h-9 rounded-lg border border-[var(--color-border-soft)] bg-white px-3 font-mono text-[10px] font-semibold text-accent hover:border-accent">{related}</button>)}</div></SurfaceCard></aside></div>
  </div>;
}

export function ExplorerServicesPage({ onNavigate }: { onNavigate: Navigate }) {
  const relatedWork = new Set(servicesData.flatMap((service) => service.relatedWorkSlugs));
  return <div className="mx-auto max-w-[var(--content-max)] space-y-8 px-4 py-10 sm:px-6 lg:px-8">
    <CollectionHeader eyebrow="Services collection" title="How we partner and deliver" description="Service records define when an engagement is useful, the usual inputs and outputs, the scope boundary, and what is explicitly excluded. Schedule and commercial terms follow discovery." observedAt={catalogSummary.generated_at} facts={[
      { label: "Services", value: servicesData.length, icon: Sliders },
      { label: "Related systems", value: relatedWork.size, icon: Layers },
      { label: "Typical outputs", value: servicesData.reduce((total, item) => total + item.typicalOutputs.length, 0), icon: CheckCircle },
      { label: "Contract model", value: "Staged", icon: ShieldCheck },
    ]} />
    <div className="space-y-3">{servicesData.map((service) => <MemberRowCard key={service.id} title={service.title} summary={`${service.usefulWhen[0]} ${service.engagementShape}`} eyebrow="Service" owner={service.audience} route={`/services/${service.slug}`} onNavigate={onNavigate} Icon={Sliders} pills={[`${service.relatedWorkSlugs.length} related records`]} facts={[{ label: "Outputs", value: service.typicalOutputs.length }, { label: "Exclusions", value: service.exclusions.length }]} />)}</div>
    <SurfaceCard title="Engagement boundary" Icon={ShieldCheck} intro="These are evidence-backed engagement shapes, not fixed-duration packages.">
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-ink-muted"><span>Scope, schedule, security obligations, acceptance criteria, and commercial terms are agreed only after discovery.</span><button type="button" onClick={() => onNavigate("/contact")} className="inline-flex min-h-10 items-center gap-1.5 rounded-[3px] bg-ink px-4 font-mono font-semibold text-white hover:bg-accent">Start discovery <ArrowRight className="h-3.5 w-3.5" /></button></div>
    </SurfaceCard>
  </div>;
}

export function ExplorerServiceDetailPage({ slug, onNavigate }: { slug: string; onNavigate: Navigate }) {
  const service = servicesData.find((item) => item.slug === slug);
  if (!service) return <MissingEditorialRecord kind="service" onNavigate={onNavigate} />;
  return <div className="mx-auto max-w-[var(--content-max)] space-y-8 px-4 py-10 sm:px-6 lg:px-8">
    <button type="button" onClick={() => onNavigate("/services")} className="inline-flex min-h-10 items-center gap-1 font-mono text-xs font-semibold text-accent hover:underline"><ArrowLeft className="h-3.5 w-3.5" />Services collection</button>
    <RecordIdentityCard eyebrow="Service record" title={service.title} summary={service.engagementShape} Icon={Sliders} pills={[{ label: "Discovery-led", tone: "accent" }]} facts={[
      { label: "Audience", value: service.audience, icon: User }, { label: "Inputs", value: service.inputs.length, icon: FileText },
      { label: "Outputs", value: service.typicalOutputs.length, icon: CheckCircle }, { label: "Exclusions", value: service.exclusions.length, icon: ShieldCheck },
    ]} actions={<button type="button" onClick={() => onNavigate("/contact")} className="inline-flex min-h-10 items-center gap-1.5 rounded-[3px] bg-ink px-4 font-mono text-xs font-semibold text-white hover:bg-accent">{service.cta} <ArrowRight className="h-3.5 w-3.5" /></button>} />
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12"><div className="space-y-6 lg:col-span-8"><ListSurface title="Useful when" items={service.usefulWhen} /><ListSurface title="Typical outputs" items={service.typicalOutputs} /><ListSurface title="Scope" items={service.scope} /></div><aside className="space-y-6 lg:col-span-4"><ListSurface title="Required inputs" items={service.inputs} /><ListSurface title="Explicit exclusions" items={service.exclusions} /><SurfaceCard title="Related work" Icon={Layers}><div className="flex flex-wrap gap-2">{service.relatedWorkSlugs.map((related) => <button key={related} type="button" onClick={() => onNavigate(`/products/records/${related}`)} className="min-h-9 rounded-lg border border-[var(--color-border-soft)] bg-white px-3 font-mono text-[10px] font-semibold text-accent hover:border-accent">{related}</button>)}</div></SurfaceCard></aside></div>
  </div>;
}

function ListSurface({ title, items }: { title: string; items: string[] }) {
  return <SurfaceCard title={title} Icon={CheckCircle}><ul className="space-y-2.5">{items.map((item) => <li key={item} className="flex items-start gap-2 text-xs leading-relaxed text-ink-muted"><CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" /><span>{item}</span></li>)}</ul></SurfaceCard>;
}

function MissingEditorialRecord({ kind, onNavigate }: { kind: string; onNavigate: Navigate }) {
  return <div className="mx-auto max-w-xl px-4 py-20 text-center"><h1 className="font-serif text-3xl font-bold text-ink">{kind} record not found</h1><p className="mt-3 text-sm text-ink-muted">No published {kind} record matches this route.</p><button type="button" onClick={() => onNavigate(`/${kind}s`)} className="mt-6 min-h-10 rounded-lg bg-ink px-4 font-mono text-xs font-semibold text-white">Return to collection</button></div>;
}

export function ExplorerInsightsCollection({ posts, matchingCount, legacyCount, searchQuery, onSearch, currentPage, totalPages, onPage, onNavigate }: { posts: BlogPost[]; matchingCount: number; legacyCount: number; searchQuery: string; onSearch: (value: string) => void; currentPage: number; totalPages: number; onPage: (page: number) => void; onNavigate: Navigate }) {
  return <div className="mx-auto max-w-[var(--content-max)] space-y-8 px-4 py-10 sm:px-6 lg:px-8">
    <CollectionHeader eyebrow="Insights collection" title="Research notes and historical papers" description="The archive preserves historical articles and URLs. Entries are labeled as historical material and are not treated as current package, API, security, or product evidence." observedAt={catalogSummary.generated_at} facts={[
      { label: "Matching posts", value: matchingCount, icon: BookOpen },
      { label: "Historical", value: legacyCount, icon: CalendarDays },
      { label: "Current guidance", value: Math.max(0, matchingCount - legacyCount), icon: CheckCircle },
      { label: "Evidence state", value: "Labeled", icon: ShieldCheck },
    ]} />
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--color-border-soft)] bg-surface p-3">
      <label className="relative min-w-[14rem] flex-1"><span className="sr-only">Search insights</span><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" /><input type="search" value={searchQuery} onChange={(event) => onSearch(event.target.value)} placeholder="Search by title, topic, author, or tag" className="min-h-10 w-full rounded-lg border border-[var(--color-border-soft)] bg-white pl-9 pr-3 font-mono text-xs text-ink" /></label>
      <span className="font-mono text-[10px] text-ink-muted">Page {Math.min(currentPage, Math.max(totalPages, 1))} of {Math.max(totalPages, 1)}</span>
    </div>
    {posts.length ? <div className="space-y-3">{posts.map((post) => <MemberRowCard key={post.slug} title={post.title} summary={post.excerpt} eyebrow={post.isLegacy ? "Historical insight" : "Insight"} owner={post.author} route={`/insights?slug=${post.slug}`} onNavigate={onNavigate} Icon={BookOpen} pills={(post.tags || []).slice(0, 2)} />)}</div> : <SurfaceCard title="No matching insights" Icon={Search}><p className="text-sm text-ink-muted">Try a broader title, topic, author, or tag.</p></SurfaceCard>}
    {totalPages > 1 && <nav className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border-soft)] pt-5" aria-label="Insights pagination"><button type="button" disabled={currentPage === 1} onClick={() => onPage(Math.max(1, currentPage - 1))} className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-[var(--color-border-soft)] bg-white px-3 font-mono text-xs disabled:opacity-40"><ArrowLeft className="h-3.5 w-3.5" />Previous</button><button type="button" disabled={currentPage === totalPages} onClick={() => onPage(Math.min(totalPages, currentPage + 1))} className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-[var(--color-border-soft)] bg-white px-3 font-mono text-xs disabled:opacity-40">Next<ArrowRight className="h-3.5 w-3.5" /></button></nav>}
  </div>;
}

export function ExplorerAboutPage({ onNavigate }: { onNavigate: Navigate }) {
  const principles = [
    ["Source-controlled truth", "Decisions, specifications, code schemas, and access controls remain inspectable in version-controlled source rather than hidden interfaces."],
    ["Traceable delivery gates", "Delivery decisions retain a path from intent to source, tests, artifacts, deployment evidence, and external verification."],
    ["Quiet, focus-driven design", "Interfaces favor legibility, information density, negative space, keyboard access, and explicit action consequences."],
  ];
  return <div className="mx-auto max-w-[var(--content-max)] space-y-8 px-4 py-10 sm:px-6 lg:px-8">
    <RecordIdentityCard eyebrow="Organization record" title="GroupSum LLC" summary="Groupsum builds governed developer systems for teams that need complex products, evidence, and delivery boundaries to remain legible and operable." Icon={Building2} pills={[{ label: "Public organization", tone: "accent" }]} facts={[
      { label: "Principles", value: principles.length, icon: ShieldCheck },
      { label: "Primary domain", value: "groupsum.xyz", icon: FileText },
      { label: "Catalog model", value: "Evidence-labeled", icon: CheckCircle },
      { label: "Engagement", value: "Discovery-led", icon: Sliders },
    ]} actions={<button type="button" onClick={() => onNavigate("/contact")} className="inline-flex min-h-10 items-center gap-1.5 rounded-[3px] bg-ink px-4 font-mono text-xs font-semibold text-white hover:bg-accent">Discuss a project <ArrowRight className="h-3.5 w-3.5" /></button>} />
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12"><div className="space-y-6 lg:col-span-8"><SurfaceCard title="Operating principles" Icon={ShieldCheck}><div className="space-y-3">{principles.map(([title, description], index) => <article key={title} className="flex flex-wrap gap-4 rounded-xl border border-[var(--color-border-soft)] bg-white p-5"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface font-mono text-xs font-bold text-accent">0{index + 1}</span><div className="min-w-0 flex-1"><h3 className="font-serif text-lg font-bold text-ink">{title}</h3><p className="mt-1 text-xs leading-relaxed text-ink-muted">{description}</p></div></article>)}</div></SurfaceCard></div><aside className="space-y-6 lg:col-span-4"><SurfaceCard title="Legal identity" Icon={Building2}><dl className="space-y-3 font-mono text-xs"><div><dt className="text-[10px] uppercase text-ink-muted">Entity</dt><dd className="mt-1 font-semibold text-ink">GroupSum LLC</dd></div><div><dt className="text-[10px] uppercase text-ink-muted">Domain</dt><dd className="mt-1 font-semibold text-ink">groupsum.xyz</dd></div><div><dt className="text-[10px] uppercase text-ink-muted">Inquiry</dt><dd className="mt-1 break-all font-semibold text-accent">partner@groupsum.xyz</dd></div></dl></SurfaceCard><SurfaceCard title="Authority boundary" Icon={ShieldCheck}><p className="text-xs leading-relaxed text-ink-muted">Public repositories show what can be inspected. Availability, deployment state, support, scope, and engagement terms are confirmed separately.</p></SurfaceCard></aside></div>
    <StructuredData type="about" />
  </div>;
}

export function ExplorerContactPage() {
  return <div className="mx-auto max-w-[var(--content-max)] space-y-8 px-4 py-10 sm:px-6 lg:px-8"><CollectionHeader eyebrow="Contact" title="Discuss a bounded project" description="Share the system, evidence, delivery, or operator problem you need to make explicit. The inquiry creates a discovery starting point, not an automatic commitment." facts={[{ label: "Process", value: "Discovery", icon: Search }, { label: "Scope", value: "Evidence-led", icon: ShieldCheck }, { label: "Response", value: "Human review", icon: User }]} /><SurfaceCard title="Technical inquiry" Icon={FileText}><InquiryForm /></SurfaceCard></div>;
}

export function ExplorerPolicyPage({ kind }: { kind: "privacy" | "terms" }) {
  const privacy = kind === "privacy";
  return <div className="mx-auto max-w-[var(--content-max)] space-y-8 px-4 py-10 sm:px-6 lg:px-8"><RecordIdentityCard eyebrow="Governance record" title={privacy ? "Privacy policy" : "Terms of service"} summary={privacy ? "How GroupSum handles information submitted through groupsum.xyz." : "The conditions and boundaries that apply when accessing groupsum.xyz."} Icon={ShieldCheck} pills={[{ label: "Last updated July 20, 2026", tone: "neutral" }]} facts={[{ label: "Publisher", value: "GroupSum LLC", icon: Building2 }, { label: "Applies to", value: "groupsum.xyz", icon: FileText }, { label: "Record type", value: privacy ? "Privacy" : "Terms", icon: ShieldCheck }]} />
    {privacy ? <div className="space-y-6"><SurfaceCard title="Information we process"><p className="text-sm leading-relaxed text-ink-muted">We process only information explicitly submitted through the technical inquiry form: name, email, organization, interest area, and project goals. It is used to evaluate potential engineering engagements.</p></SurfaceCard><SurfaceCard title="Tracking and cookies"><p className="text-sm leading-relaxed text-ink-muted">We do not operate marketing trackers, advertising networks, or tracking cookies. Connection parameters and logs may be handled by cloud ingress proxies for security and operations.</p></SurfaceCard><SurfaceCard title="Data preservation"><p className="text-sm leading-relaxed text-ink-muted">Submitted inquiry details are routed for partner review. We do not sell submitted contact information.</p></SurfaceCard></div> : <div className="space-y-6"><SurfaceCard title="Acceptance of terms"><p className="text-sm leading-relaxed text-ink-muted">By accessing groupsum.xyz, you agree to use the site lawfully and respect the security and ownership boundaries of linked systems.</p></SurfaceCard><SurfaceCard title="Disclaimers"><p className="text-sm leading-relaxed text-ink-muted">Historical publications, research logs, code specifications, and catalog observations are provided as-is. They are not warranties of suitability, completeness, availability, or current deployment state.</p></SurfaceCard><SurfaceCard title="Intellectual property"><p className="text-sm leading-relaxed text-ink-muted">GroupSum names and original site materials belong to GroupSum LLC. Linked repositories and packages remain governed by their respective license and notice records.</p></SurfaceCard></div>}
  </div>;
}
