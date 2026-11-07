import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getCatalogVersion, selectCatalogVersion, useCatalogVersion, type CatalogVersion } from "../../api/catalog-version";
export function CatalogFreshness() {
  const queryClient = useQueryClient(); const version = useCatalogVersion(); const [offline, setOffline] = useState(false);
  const [stale, setStale] = useState(false);
  useEffect(() => {
    const controller = new AbortController(); let pending = false;
    const check = async () => {
      if (document.hidden || pending) return; pending = true;
      try {
        const response = await fetch("/api/v1/catalog/version", { credentials: "omit", cache: "no-cache", signal: AbortSignal.any([controller.signal, AbortSignal.timeout(10_000)]) });
        if (!response.ok) throw new Error("Version unavailable");
        const next = await response.json() as CatalogVersion;
        if (!next.snapshot_id) throw new Error("Version invalid");
        const previous = getCatalogVersion().snapshot_id;
        const changed = previous !== next.snapshot_id;
        selectCatalogVersion(next); setOffline(false); if (changed) { setStale(false); void queryClient.invalidateQueries({ predicate: (query) => !query.queryKey.includes(previous) }); }
      } catch { if (!controller.signal.aborted) setOffline(true); }
      finally { pending = false; }
    };
    void check(); const interval = setInterval(check, 30_000);
    const saved = () => setStale(true);
    window.addEventListener("catalog-stale", saved);
    window.addEventListener("focus", check); window.addEventListener("online", check); document.addEventListener("visibilitychange", check);
    return () => { controller.abort(); clearInterval(interval); window.removeEventListener("catalog-stale", saved); window.removeEventListener("focus", check); window.removeEventListener("online", check); document.removeEventListener("visibilitychange", check); };
  }, [queryClient]);
  return offline || stale ? <p role="status" className="type-body-sm mx-auto max-w-[var(--content-max)] px-4 py-1 text-ink-muted">Showing saved catalog data{version.collected_at ? ` observed ${new Date(version.collected_at).toLocaleDateString("en-US", { timeZone: "UTC" })}` : ""}. Updates will resume when the connection is available.</p> : null;
}
