export function observationSeries(points, days = 0, changes = false) {
  const byTime = new Map();
  for (const point of points) {
    const time = Date.parse(point.label);
    if (Number.isFinite(time) && typeof point.value === "number" && Number.isFinite(point.value)) byTime.set(time, { ...point, time });
  }
  const sorted = [...byTime.values()].sort((a, b) => a.time - b.time);
  const end = sorted.at(-1)?.time || 0;
  const result = changes ? sorted.slice(1).map((point, index) => ({ ...point, value: point.value - sorted[index].value, from: sorted[index].label })) : sorted;
  return result.filter((point) => !days || point.time > end - days * 86400000);
}
