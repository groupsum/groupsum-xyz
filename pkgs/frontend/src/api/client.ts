import { getCatalogVersion, pinnable } from "./catalog-version";
import type { PublicCacheEntry } from "./public-cache";
const persistence = () => import("./public-cache");
const memory = new Map<string, PublicCacheEntry>();
const pending = new Map<string, Promise<PublicCacheEntry>>();
function remember(entry: PublicCacheEntry) {
  memory.delete(entry.key); memory.set(entry.key, entry); let bytes = 0;
  for (const row of memory.values()) bytes += row.body.length * 2;
  while (memory.size > 100 || bytes > 32 * 1024 * 1024) {
    const key = memory.keys().next().value!; bytes -= memory.get(key)!.body.length * 2; memory.delete(key);
  }
}
const response = (entry: PublicCacheEntry) => new Response(entry.body, { status: 200, headers: entry.headers });
async function withSignal<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
  if (signal.aborted) throw signal.reason;
  return new Promise((resolve, reject) => {
    const abort = () => reject(signal.reason); signal.addEventListener("abort", abort, { once: true });
    promise.then(resolve, reject).finally(() => signal.removeEventListener("abort", abort));
  });
}
export async function catalogFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const request = new Request(input, init); const url = new URL(request.url);
  const publicRead = /^\/api\/v1\/(?:catalog(?:\/|$)|contributors(?:\/|$)|snapshots(?:\/|$)|entities\/|organizations(?:\/|$)|products(?:\/|$)|portfolio(?:\/|$)|repository-metrics$|analytics\/)/.test(url.pathname);
  const eligible = request.method === "GET" && url.origin === location.origin && publicRead && !request.headers.has("authorization") && request.credentials !== "include";
  if (!eligible) return fetch(request);
  const version = getCatalogVersion();
  const pinned = version.public_projection_available && pinnable(url.pathname);
  if (pinned) { url.searchParams.set("snapshot_id", version.snapshot_id); url.searchParams.set("projection_version", version.projection_version || "1"); }
  url.searchParams.sort(); const key = `v1:${version.snapshot_id}:${version.projection_version || "legacy"}:${url.pathname}${url.search}`;
  let cached = memory.get(key) || await (await persistence()).readPublicCache(key);
  if (cached) {
    remember(cached);
    if (cached.immutable || Date.now() - cached.stored < 30_000) return response(cached);
  }
  let work = pending.get(key);
  if (!work) {
    work = (async () => {
      const headers = new Headers(request.headers); const etag = cached && new Headers(cached.headers).get("etag");
      if (etag) headers.set("If-None-Match", etag);
      const fresh = await fetch(url, { headers, credentials: "omit", signal: AbortSignal.timeout(20_000), cache: "default" });
      if (fresh.status === 304 && cached) cached = { ...cached, stored: Date.now() };
      else {
        if (!fresh.ok) throw new Error(`Catalog response ${fresh.status}`);
        cached = { key, stored: Date.now(), body: await fresh.text(), headers: [...fresh.headers.entries()],
          immutable: Boolean(pinned && fresh.headers.get("X-Catalog-Snapshot") === version.snapshot_id) };
      }
      cached.headers = cached.headers.filter(([name]) => !["content-encoding", "content-length"].includes(name.toLowerCase()));
      remember(cached); void persistence().then(({ writePublicCache }) => writePublicCache(cached!)); return cached;
    })().finally(() => pending.delete(key));
    pending.set(key, work);
  }
  try { return response(await withSignal(work, request.signal)); }
  catch (error) {
    if (!request.signal.aborted && cached && Date.now() - cached.stored < 86400_000) {
      window.dispatchEvent(new Event("catalog-stale"));
      const fallback = response(cached); fallback.headers.set("X-Catalog-Stale", "true"); return fallback;
    }
    throw error;
  }
}
