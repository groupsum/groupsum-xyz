export function publicationLabel(value: unknown) {
  const status = String(value || "not observed").toLowerCase().replace(/[-_]+/g, " ");
  if (status === "published package" || status === "published") return "Published";
  if (status === "manifest private" || status === "private package" || status === "private") return "Private";
  return status.replace(/\b\w/g, (letter) => letter.toUpperCase());
}
