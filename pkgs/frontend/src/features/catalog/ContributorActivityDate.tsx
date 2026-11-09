const updatedDate = new Intl.DateTimeFormat("en-US", { month: "long", timeZone: "UTC" });

export function ContributorActivityDate({ value, fallback = "—" }: { value: unknown; fallback?: string }) {
  const iso = typeof value === "string" ? value.slice(0, 10) : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return fallback;
  const date = new Date(iso);
  if (Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== iso) return fallback;
  const day = date.getUTCDate();
  const suffix = day >= 11 && day <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[day % 10] ?? "th";
  return <time dateTime={iso}>{updatedDate.format(date)} {day}{suffix}, {date.getUTCFullYear()}</time>;
}
