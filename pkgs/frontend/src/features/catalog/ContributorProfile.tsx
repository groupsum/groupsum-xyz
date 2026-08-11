import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, GitCommit, GitFork, UserRound } from "lucide-react";
import { getContributor, type ContributorPageModel } from "../../api/catalog";
import { StructuredData } from "../../discovery/StructuredData";
import { CollectionHeader, SurfaceCard } from "./CatalogVisuals";

export function ContributorProfile({ provider, login, onNavigate }: { provider: string; login: string; onNavigate: (path: string) => void }) {
  const [model, setModel] = useState<ContributorPageModel | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    getContributor(provider, login, controller.signal).then(setModel).catch((reason) => {
      if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : "Contributor could not be loaded");
    });
    return () => controller.abort();
  }, [login, provider]);
  if (error) return <div className="mx-auto max-w-5xl px-6 py-16"><SurfaceCard title="Contributor unavailable" Icon={UserRound}><p className="text-sm text-ink-muted">{error}</p></SurfaceCard></div>;
  if (!model) return <div className="mx-auto max-w-5xl px-6 py-16 font-mono text-sm text-ink-muted">Loading contributor profile…</div>;
  const contributor = model.item;
  const name = String(contributor.name || contributor.login || login);
  return <div className="mx-auto max-w-5xl space-y-6 px-6 py-10">
    <button type="button" onClick={() => onNavigate("/catalog/repositories")} className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-accent hover:text-ink"><ArrowLeft className="h-4 w-4" /> Repositories</button>
    <CollectionHeader eyebrow="Contributor profile" title={name} description={String(contributor.description || `Public ${provider} contributor observed in the GroupSum catalog.`)} facts={[{ label: "Repositories", value: model.repositories.length }, { label: "Contributions", value: model.repositories.reduce((total, repository) => total + repository.contributions, 0) }]} />
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <SurfaceCard title="Observed repositories" Icon={GitFork}>
        <ol className="divide-y divide-[var(--color-border-soft)]">{model.repositories.map((repository) => <li key={repository.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><button type="button" onClick={() => onNavigate(repository.route)} className="min-h-11 text-left text-sm font-semibold text-accent hover:underline">{repository.name}</button><span className="inline-flex items-center gap-1 font-mono text-[10px] text-ink-muted"><GitCommit className="h-3.5 w-3.5" /> {repository.contributions.toLocaleString()} contributions</span></li>)}</ol>
      </SurfaceCard>
      <SurfaceCard title="Identity" Icon={UserRound}><dl className="space-y-3 text-xs"><div><dt className="font-mono text-[10px] uppercase text-ink-muted">Provider</dt><dd className="mt-1 font-semibold">{provider}</dd></div><div><dt className="font-mono text-[10px] uppercase text-ink-muted">Login</dt><dd className="mt-1 font-semibold">@{String(contributor.login || login)}</dd></div></dl>{contributor.url ? <a href={String(contributor.url)} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-accent hover:text-ink">Public profile <ExternalLink className="h-4 w-4" /></a> : null}</SurfaceCard>
    </div>
    <StructuredData type="profile" data={{ ...contributor, slug: `contributors/${provider}/${login}`, title: `${name} contributor`, summary: contributor.description }} />
  </div>;
}
