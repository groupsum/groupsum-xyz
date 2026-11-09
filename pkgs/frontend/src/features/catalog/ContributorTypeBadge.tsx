export function contributorTypeLabel(value: unknown) {
  const type = String(value || "").toLowerCase();
  return type === "bot" ? "Bot" : type === "user" ? "Individual" : "Anonymous";
}

export function ContributorTypeBadge({ value }: { value: unknown }) {
  return <span className="inline-block max-w-full rounded border border-[var(--color-border-soft)] bg-surface px-1.5 py-0.5 text-[10px] text-ink-muted [overflow-wrap:normal]">{contributorTypeLabel(value)}</span>;
}
