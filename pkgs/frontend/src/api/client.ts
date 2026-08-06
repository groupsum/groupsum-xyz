import createClient from "openapi-fetch";
import type { paths } from "./schema.generated";

type CachedResponse = {
  etag: string;
  body: ArrayBuffer;
  headers: [string, string][];
  status: number;
  statusText: string;
};

const responseCache = new Map<string, CachedResponse>();
const MAX_CACHE_ENTRIES = 100;

export async function catalogFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const request = new Request(input, init);
  if (request.method !== "GET") return fetch(request);
  const key = request.url;
  const cached = responseCache.get(key);
  const headers = new Headers(request.headers);
  if (cached) headers.set("If-None-Match", cached.etag);
  const response = await fetch(new Request(request, { headers }));
  if (response.status === 304 && cached) {
    responseCache.delete(key);
    responseCache.set(key, cached);
    return new Response(cached.body.slice(0), {
      status: cached.status,
      statusText: cached.statusText,
      headers: cached.headers,
    });
  }
  const etag = response.headers.get("etag");
  if (response.ok && etag) {
    responseCache.set(key, {
      etag,
      body: await response.clone().arrayBuffer(),
      headers: [...response.headers.entries()],
      status: response.status,
      statusText: response.statusText,
    });
    if (responseCache.size > MAX_CACHE_ENTRIES) {
      responseCache.delete(responseCache.keys().next().value as string);
    }
  }
  return response;
}

export const catalogApi = createClient<paths>({ baseUrl: "", fetch: catalogFetch });
