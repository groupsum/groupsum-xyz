import { getCatalogPackageMember, getCatalogRepositoryMember, getContributor } from "./catalog";
import { getCatalogVersion } from "./catalog-version";
let active = false;
const warmed = new Set<string>();
export async function prefetchCatalogPath(href: string) {
  const key = `${getCatalogVersion().snapshot_id}:${href}`;
  if (active || warmed.has(key)) return;
  const path = href.split(/[?#]/, 1)[0];
  const repository = path.match(/^\/catalog\/repositories\/([^/]+)\/([^/]+)\/?$/);
  const pkg = path.match(/^\/catalog\/packages\/[^/]+\/([^/]+)\/?$/);
  const person = path.match(/^\/contributors\/([^/]+)\/([^/]+)\/?$/);
  if (!repository && !pkg && !person) return;
  active = true;
  try {
    if (repository) await getCatalogRepositoryMember(decodeURIComponent(repository[1]), decodeURIComponent(repository[2]));
    else if (pkg) await getCatalogPackageMember(decodeURIComponent(pkg[1]));
    else if (person) await getContributor(decodeURIComponent(person[1]), decodeURIComponent(person[2]));
    warmed.add(key); if (warmed.size > 64) warmed.delete(warmed.values().next().value!);
  } catch { /* Intent prefetch never changes navigation or surfaces an error. */ }
  finally { active = false; }
}
