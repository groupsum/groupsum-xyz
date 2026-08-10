async function getContentJson<T>(path: string, label: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(path, {
    signal,
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`${label} response ${response.status}`);
  return response.json() as Promise<T>;
}

export function getProductEvidence<T>(organization: string, sourceName: string, signal?: AbortSignal): Promise<T> {
  return getContentJson<T>(
    `/catalog/product-evidence/${encodeURIComponent(organization)}/${encodeURIComponent(sourceName)}.json`,
    "Product evidence",
    signal,
  );
}

export function getInsightsIndex<T>(signal?: AbortSignal): Promise<T> {
  return getContentJson<T>("/insights-index.json", "Insights index", signal);
}

export function getInsightContent<T>(contentPath: string, signal?: AbortSignal): Promise<T> {
  return getContentJson<T>(contentPath, "Article", signal);
}
