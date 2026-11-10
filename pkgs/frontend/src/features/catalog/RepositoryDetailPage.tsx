import { ExternalLink, GitBranch, ShieldCheck } from "lucide-react";
import { CatalogLink } from "./CatalogLink";
import { CatalogPill } from "./CatalogVisuals";
import { ContributorActivityDate } from "./ContributorActivityDate";
import { InlineMetricChart } from "./InlineMetricChart";
import { formatDate, humanLabel, recordDescription, recordTitle, valueRecord, valueRecords, type CatalogRecord } from "./CatalogRecordShared";
import { ContainedPackageList, RepositoryLanguagePanel } from "./RepositoryImplementationPanels";
import { RepositoryActivity } from "./RepositoryDetailActivity";
import { RepositoryDisclosure, RepositoryEvidence } from "./RepositoryDetailEvidence";

const link = "type-control text-accent hover:underline";
const sections = [["observed-activity", "Activity"], ["contributors", "Contributors"], ["contained-packages", "Packages"], ["governance-evidence", "Governance & evidence"]];

function RepositoryHeader({ record, primaryUrl }: { record: CatalogRecord; primaryUrl?: string }) {
  const commit = valueRecord(record.latest_commit);
  const deployment = valueRecord(record.latest_deployment);
  const release = valueRecord(record.latest_release);
  const legal = valueRecords(record.legal_observations);
  const expression = record.license_expression || record.license;
  const commits = valueRecords(record.commit_activity).slice(-30).flatMap((point) =>
    typeof point.date === "string" && typeof point.count === "number" ? [{ label: point.date, value: point.count }] : []);
  const legalFiles = legal.filter((row) => row.url && (row.kind === "notice-file" || row.kind === "license-file"));
  const events = [
    { label: "Commit", date: commit.committed_at, detail: commit.message, href: commit.url, action: "View commit", empty: "No commit observed" },
    { label: "Deployment", date: deployment.updated_at, detail: [deployment.environment, deployment.state && humanLabel(String(deployment.state))].filter(Boolean).join(" · "), href: deployment.log_url, action: "View log", empty: "No deployment observed" },
    { label: "Release", date: release.published_at, detail: release.name || release.tag, href: release.url, action: "View release", empty: "No GitHub release observed" },
  ];
  return <header className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <CatalogLink href="/catalog/repositories" className={link}>← Repositories</CatalogLink>
      {primaryUrl && <a href={primaryUrl} target="_blank" rel="noreferrer" className={`${link} inline-flex items-center gap-1`}>Open on GitHub <ExternalLink aria-hidden="true" className="h-3 w-3" /></a>}
    </div>
    <div className="grid items-start gap-x-8 gap-y-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,16rem)]">
      <div className="min-w-0 space-y-1">
        <h1 className="flex items-baseline gap-2 font-serif text-3xl font-bold [overflow-wrap:anywhere] sm:text-4xl"><GitBranch aria-hidden="true" className="h-5 w-5 shrink-0 text-accent" /><span>{recordTitle(record)}</span></h1>
        <p className="type-technical text-ink-muted [overflow-wrap:anywhere]">{String(record.owner || "")} / {String(record.name || recordTitle(record))}</p>
        <p className="type-body-md [overflow-wrap:anywhere]">{recordDescription(record)}</p>
      </div>
      <div className="space-y-1" aria-label="Commit activity">
        <p className="type-ui-label text-ink-muted">Daily commits</p>
        <InlineMetricChart label="Daily commits" points={commits} bars expanded compact />
        {commits.length > 0 && <p className="type-caption text-ink-muted">Select chart for exact daily counts · UTC</p>}
      </div>
    </div>
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 type-body-sm text-ink-muted [overflow-wrap:anywhere]">
      {record.visibility && <span>{humanLabel(String(record.visibility))}</span>}
      {record.default_branch && <span>Default branch: <strong className="text-ink">{String(record.default_branch)}</strong></span>}
      {record.ssot_governance?.governed && <CatalogPill tone="signal" Icon={ShieldCheck}>SSOT governed</CatalogPill>}
      {record.created_at && <span>Created <ContributorActivityDate value={record.created_at} /></span>}
    </div>
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 type-body-sm [overflow-wrap:anywhere]">
        <span className="type-ui-label text-ink-muted">License &amp; notices</span>
        <span>{expression ? String(expression) : "No repository license observed"}</span>
        {legalFiles.map((row, index) => <a key={index} className={link} href={String(row.url)} target="_blank" rel="noreferrer">{row.kind === "license-file" ? "License file" : "Notice file"}</a>)}
    </div>
    <div id="latest-observed-events" className="space-y-1 border-t border-[var(--color-border-soft)] pt-3">
      <h2 className="type-ui-label text-ink-muted">Latest observed events</h2>
      <dl>{events.map(({ label, date, detail, href, action, empty }) => <div key={label} className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-baseline gap-x-3 py-1 type-body-sm sm:grid-cols-[6rem_minmax(0,1fr)_auto]">
        <dt className="font-semibold">{label}</dt>
        <dd className="min-w-0 [overflow-wrap:anywhere]">{date ? <span className="text-ink-muted">{formatDate(String(date))} · </span> : null}{String(detail || (date || href ? "Details not reported" : empty))}</dd>
        {href ? <dd className="col-start-2 sm:col-start-3"><a className={link} href={String(href)} target="_blank" rel="noreferrer">{action} ↗</a></dd> : null}
      </div>)}</dl>
    </div>
    <p className="type-control text-right text-ink-muted">Last observed <ContributorActivityDate value={record.observed_at} /></p>
  </header>;
}

function RepositoryContributors({ record }: { record: CatalogRecord }) {
  const rows = valueRecords(record.contributors).sort((a, b) => Number(b.contributions || 0) - Number(a.contributions || 0));
  return <section id="contributors" className="space-y-3">
    <h2 className="font-serif text-xl font-bold">Contributors ({rows.length.toLocaleString()})</h2>
    {rows.length ? <table className="w-full table-fixed text-left type-record-table">
      <thead><tr className="text-ink-muted"><th scope="col" className="py-2">Contributor</th><th scope="col" className="py-2 text-right">Repository contributions</th></tr></thead>
      <tbody className="divide-y divide-[var(--color-border-soft)]">{rows.map((row, index) => {
        const name = String(row.name || row.login || "Anonymous");
        const label = row.profile_route ? <CatalogLink href={String(row.profile_route)} className={link}>{name}</CatalogLink> : name;
        return <tr key={String(row.id || row.login || index)}><th scope="row" className="py-2 pr-2 font-normal [overflow-wrap:anywhere]">{label}{row.login && row.name !== row.login ? <span className="ml-2 text-ink-muted">@{String(row.login)}</span> : null}</th><td className="py-2 text-right tabular-nums">{typeof row.contributions === "number" ? row.contributions.toLocaleString() : "—"}</td></tr>;
      })}</tbody>
    </table> : <p className="type-body-sm text-ink-muted">No contributor identities were reported.</p>}
  </section>;
}

export default function RepositoryDetailPage({ record, primaryUrl, onNavigate }: { record: CatalogRecord; primaryUrl?: string; onNavigate: (path: string) => void }) {
  return <div className="min-w-0 space-y-7 [&_section]:scroll-mt-24">
    <RepositoryHeader record={record} primaryUrl={primaryUrl} />
    <nav aria-label="On this repository" className="flex flex-wrap gap-x-5 gap-y-1 border-y border-[var(--color-border-soft)] py-2">
      {sections.map(([id, label]) => <a key={id} href={`#${id}`} className={`${link} inline-flex min-h-8 items-center`}>{label}</a>)}
    </nav>
    <RepositoryActivity key={record.id} record={record} />
    <RepositoryContributors record={record} />
    <section id="contained-packages" className="space-y-3">
      <h2 className="font-serif text-xl font-bold">Contained packages ({valueRecords(record.packages).length.toLocaleString()})</h2>
      <ContainedPackageList packagesValue={record.packages} />
      <RepositoryDisclosure label="Languages & technologies"><RepositoryLanguagePanel languagesValue={record.languages} technologiesValue={record.technologies} /></RepositoryDisclosure>
    </section>
    <RepositoryEvidence key={record.id} record={record} onNavigate={onNavigate} />
  </div>;
}
