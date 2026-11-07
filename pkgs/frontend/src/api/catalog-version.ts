import { useSyncExternalStore } from "react";
export type CatalogVersion = { snapshot_id: string; collected_at?: string; projection_version?: string; public_projection_available?: boolean };
const empty: CatalogVersion = { snapshot_id: "unversioned" };
let selected: CatalogVersion | undefined;
const listeners = new Set<() => void>();
export const getCatalogVersion = () => selected || globalThis.__GROUPSUM_CATALOG_VERSION__ || empty;
export function selectCatalogVersion(next: CatalogVersion) {
  if (next.snapshot_id === getCatalogVersion().snapshot_id && next.public_projection_available === getCatalogVersion().public_projection_available) return;
  selected = next; listeners.forEach((listener) => listener());
}
export function useCatalogVersion() {
  return useSyncExternalStore((listener) => { listeners.add(listener); return () => { listeners.delete(listener); }; }, getCatalogVersion, getCatalogVersion);
}
export function pinnable(path: string) {
  return /^\/api\/v1\/(?:contributors(?:\/[^/]+\/[^/]+)?|catalog\/(?:repositories(?:\/[^/]+\/[^/]+)?|packages(?:\/[^/]+(?:\/relationships)?)?|technologies))$/.test(path);
}
declare global { var __GROUPSUM_CATALOG_VERSION__: CatalogVersion | undefined; }
