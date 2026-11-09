type Column = readonly [label: string, key: string, visibility: string, ascending: boolean];

export const repositoryColumns: readonly Column[] = [
  ["Repository", "name_lex", "", true],
  ["Organization", "owner", "hidden lg:table-cell", true],
  ["Stars", "stars", "", false],
  ["Forks", "forks", "hidden xl:table-cell", false],
  ["30-Day Commits", "commits", "hidden md:table-cell", false],
  ["Contributors", "contributors", "hidden xl:table-cell", false],
  ["Packages", "packages", "", false],
  ["Latest Release", "latest_release", "hidden lg:table-cell", false],
];

export const packageColumns: readonly Column[] = [
  ["Package", "name_lex", "", true],
  ["Ecosystem", "ecosystem", "", true],
  ["Repository", "repository", "hidden lg:table-cell", true],
  ["Publication", "publication", "hidden lg:table-cell", true],
  ["Latest", "version", "", false],
  ["Dependencies", "dependencies", "hidden md:table-cell", false],
  ["Dependents", "dependents", "hidden xl:table-cell", false],
  ["License", "license", "hidden xl:table-cell", true],
];

export function columnSortValue(key: string, ascending: boolean) {
  return key === "stars" && !ascending ? key : `${key}_${ascending ? "asc" : "desc"}`;
}

export function columnSortOptions(dataset: string) {
  const columns = dataset === "repositories" ? repositoryColumns : dataset === "packages" ? packageColumns : [];
  return columns.flatMap(([label, key, , text]) => [true, false].map((ascending) => ({
    label: `${label} (${text ? ascending ? "A–Z" : "Z–A" : ascending ? "ascending" : "descending"})`,
    value: columnSortValue(key, ascending),
  })));
}
