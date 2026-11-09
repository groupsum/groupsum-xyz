export function TrendDelta({ value, description, period }: {
  value?: number;
  description: string;
  period?: string;
}) {
  if (value === 0) return null;
  const signed = value == null ? "—" : value > 0 ? `+${value.toLocaleString()}` : value.toLocaleString();
  const title = value == null ? description : `${signed} ${description}`;
  const tone = value == null ? "text-ink-muted" : value > 0 ? "text-success" : "text-danger";
  return <span className={`type-control ${tone}`} title={title}>
    <span aria-hidden="true" className="inline-flex items-center gap-px whitespace-nowrap">
      {value != null && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 shrink-0">
        <path d={value > 0 ? "m3 17 6-6 4 4 8-8m-6 0h6v6" : "m3 7 6 6 4-4 8 8m-6 0h6v-6"} />
      </svg>}{signed}{value != null && period && <span className="type-caption"> · {period}</span>}
    </span>
    <span className="sr-only">{title}</span>
  </span>;
}
