/** Public anonymous data only; IndexedDB is optional and bounded. */
export type PublicCacheEntry = { key: string; stored: number; body: string; headers: [string, string][]; immutable: boolean };
const MAX_BYTES = 32 * 1024 * 1024, MAX_ENTRY_BYTES = 2 * 1024 * 1024, MAX_AGE = 86400_000;
let database: Promise<IDBDatabase | undefined> | undefined;
function open() {
  if (typeof indexedDB === "undefined") return Promise.resolve(undefined);
  return database ||= new Promise((resolve) => {
    const request = indexedDB.open("groupsum-public-v1", 1);
    const timer = setTimeout(() => resolve(undefined), 1000);
    request.onupgradeneeded = () => request.result.createObjectStore("responses", { keyPath: "key" });
    request.onsuccess = () => { clearTimeout(timer); request.result.onversionchange = () => request.result.close(); resolve(request.result); };
    request.onerror = request.onblocked = () => { clearTimeout(timer); resolve(undefined); };
  });
}
export async function readPublicCache(key: string): Promise<PublicCacheEntry | undefined> {
  try {
    const db = await open(); if (!db) return;
    return await new Promise((resolve) => {
      const tx = db.transaction("responses"); const request = tx.objectStore("responses").get(key);
      request.onsuccess = () => { const entry = request.result as PublicCacheEntry | undefined; resolve(entry && Date.now() - entry.stored < MAX_AGE ? entry : undefined); };
      request.onerror = tx.onabort = () => resolve(undefined);
    });
  } catch { return undefined; }
}
export async function writePublicCache(entry: PublicCacheEntry) {
  if (new TextEncoder().encode(entry.body).byteLength > MAX_ENTRY_BYTES) return;
  try {
    const db = await open(); if (!db) return;
    const tx = db.transaction("responses", "readwrite"); const store = tx.objectStore("responses"); store.put(entry);
    const request = store.getAll();
    request.onsuccess = () => {
      const rows = (request.result as PublicCacheEntry[]).sort((a, b) => b.stored - a.stored); let bytes = 0;
      rows.forEach((row, index) => { bytes += new TextEncoder().encode(row.body).byteLength;
        if (index >= 100 || bytes > MAX_BYTES || Date.now() - row.stored >= MAX_AGE) store.delete(row.key);
      });
    };
    tx.onerror = () => { /* Optional persistence must never prevent rendering. */ };
  } catch { /* Private browsing, storage eviction and quota errors use memory instead. */ }
}
