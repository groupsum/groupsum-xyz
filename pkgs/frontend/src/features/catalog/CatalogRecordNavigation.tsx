import React from "react";
import {
  ArrowLeft,
  Box,
  Building2,
  ChevronRight,
  Code2,
  Cpu,
  FileCode2,
  FolderGit2,
  GitBranch,
} from "lucide-react";
import type { CatalogIcon } from "./CatalogVisuals";
import {
  humanLabel,
  recordTitle,
  valueRecord,
  valueRecords,
  type CatalogRecord,
  type DetailDatasetName,
} from "./CatalogRecordShared";

type Navigate = (path: string) => void;

type Crumb = {
  label: string;
  route?: string;
  detail?: string;
  Icon: CatalogIcon;
  color: string;
};

const collectionLabels: Record<DetailDatasetName, string> = {
  repositories: "Repositories",
  packages: "Packages",
  resources: "Typed Resources",
  technologies: "Technologies",
  releases: "Releases",
};

function internalRoute(value: unknown): string | undefined {
  return typeof value === "string" && value.startsWith("/") ? value : undefined;
}

function organizationCrumb(record: CatalogRecord): Crumb | null {
  const graph = valueRecord(record.entity_graph);
  const owner = valueRecord(graph.owner);
  const repositories = valueRecords(record.repositories);
  const repository = repositories[0] || {};
  const label = String(owner.name || record.owner || repository.owner || "").trim();
  if (!label) return null;
  return {
    label,
    route: internalRoute(owner.route) || "/catalog",
    Icon: Building2,
    color: "text-ink-muted",
  };
}

function repositoryCrumb(record: CatalogRecord): Crumb | null {
  if (record.kind === "repository") return null;
  const repositories = valueRecords(record.repositories);
  const repository = repositories[0] || {};
  const repositoryLabel = String(record.repository || "").trim();
  const owner = String(repository.owner || "").trim();
  const name = String(repository.name || "").trim();
  const label = owner && name ? `${owner}/${name}` : repositoryLabel;
  if (!label) return null;
  const [fallbackOwner, fallbackName] = label.split("/");
  return {
    label,
    route: internalRoute(repository.route || record.repository_route)
      || (fallbackOwner && fallbackName ? `/catalog/repositories/${fallbackOwner}/${fallbackName}` : undefined),
    Icon: GitBranch,
    color: "text-violet-700",
  };
}

function currentCrumb(record: CatalogRecord): Crumb {
  const kind = String(record.kind || "resource");
  const iconByKind: Record<string, CatalogIcon> = {
    repository: Code2,
    package: FolderGit2,
    resource: FileCode2,
    technology: Cpu,
    release: Box,
  };
  const colorByKind: Record<string, string> = {
    repository: "text-violet-700",
    package: "text-orange-700",
    resource: "text-sky-700",
    technology: "text-amber-700",
    release: "text-accent",
  };
  return {
    label: recordTitle(record),
    detail: kind === "package" ? humanLabel(String(record.ecosystem || "package")) : undefined,
    Icon: iconByKind[kind] || FileCode2,
    color: colorByKind[kind] || "text-accent",
  };
}

export function CatalogRecordNavigation({
  dataset,
  record,
  onNavigate,
}: {
  dataset: DetailDatasetName;
  record: CatalogRecord;
  onNavigate: Navigate;
}) {
  const collection = collectionLabels[dataset];
  const collectionRoute = `/catalog/${dataset}`;
  const crumbs = [organizationCrumb(record), repositoryCrumb(record), currentCrumb(record)].filter(Boolean) as Crumb[];

  return <div className="space-y-3">
    <a href={collectionRoute} onClick={(event) => { event.preventDefault(); onNavigate(collectionRoute); }} className="inline-flex min-h-9 items-center gap-1.5 text-xs font-mono font-semibold text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
      <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
      Back to {collection} Collection
    </a>
    <nav aria-label="Ownership hierarchy" className="rounded-[4px] border border-[var(--color-border-soft)] bg-[var(--color-surface)] px-3 py-2.5 text-xs font-mono text-ink-muted">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-2">
        {crumbs.map((crumb, index) => <React.Fragment key={`${crumb.label}-${index}`}>
          {index > 0 && <li aria-hidden="true" className="text-[var(--color-border-muted)]"><ChevronRight className="h-3.5 w-3.5" /></li>}
          <li className="flex min-w-0 items-center gap-1.5">
            <crumb.Icon className={`h-3.5 w-3.5 shrink-0 ${crumb.color}`} aria-hidden="true" />
            {crumb.route
              ? <a href={crumb.route} onClick={(event) => { event.preventDefault(); onNavigate(crumb.route!); }} className="break-words font-medium hover:text-ink hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">{crumb.label}</a>
              : <span className="break-words font-semibold text-ink" aria-current="page">{crumb.label}{crumb.detail && <span className="font-normal text-ink-muted"> ({crumb.detail})</span>}</span>}
          </li>
        </React.Fragment>)}
      </ol>
    </nav>
  </div>;
}
