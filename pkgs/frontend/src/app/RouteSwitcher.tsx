import { ExplorerAboutPage, ExplorerContactPage, ExplorerPolicyPage, ExplorerServiceDetailPage, ExplorerServicesPage, ExplorerSolutionDetailPage, ExplorerSolutionsPage } from "../features/editorial/EditorialPages";
import { ProductCollectionPage, ProductRecordPage } from "../features/products/ProductPortfolio";
import { PublicCatalogDetail, PublicCatalogExplorer, PublicCatalogOverview } from "../features/catalog/PublicCatalog";
import { portfolioEntities } from "../data/entities";
import { PackageDetailPage, ProjectDetailPage, SpecificationDetailPage } from "../pages/CatalogMemberPages";
import { HomePage } from "../pages/HomePage";
import { InsightsPage } from "../pages/OfferingCollections";
import { PortfolioDetailPage } from "../pages/PortfolioPages";
import { NotFoundPage } from "../pages/StaticPages";
import { ContributorProfile } from "../features/catalog/ContributorProfile";

export function RouteSwitcher({ path, onNavigate }: { path: string; onNavigate: (path: string) => void }) {
  const cleanPath = path.split("?")[0].split("#")[0];
  const query = new URLSearchParams(path.split("?")[1] || "").get("q") || "";
  const segments = cleanPath.split("/").filter(Boolean);
  const primary = segments[0];
  if (!primary || primary === "home" || primary === "index.html") return <HomePage onNavigate={onNavigate} />;

  if (primary === "products") {
    if (segments.length === 1) return <ProductCollectionPage mode="products" onNavigate={onNavigate} />;
    const slug = segments[1] === "records" ? segments[2] : segments[1];
    if (segments[1] !== "records" && ["groupsum", "tigrbl", "swarmauri"].includes(slug)) return <ProductCollectionPage mode="portfolio" organization={slug} onNavigate={onNavigate} />;
    return <ProductRecordPage slug={slug} onNavigate={onNavigate} />;
  }
  if (primary === "portfolio") {
    if (segments.length === 1) return <ProductCollectionPage mode="portfolio" onNavigate={onNavigate} />;
    const family = segments[1];
    const slug = family === "records" || ["projects", "packages", "specifications"].includes(family) ? segments[2] : family;
    if (family === "records") return <ProductRecordPage slug={slug} recordType="portfolio" onNavigate={onNavigate} />;
    if (slug && portfolioEntities.some((entity) => entity.slug === slug && entity.approved)) return <ProductRecordPage slug={slug} onNavigate={onNavigate} />;
    if (family === "projects") return <ProjectDetailPage slug={slug} onNavigate={onNavigate} />;
    if (family === "packages") return <PackageDetailPage slug={slug} onNavigate={onNavigate} />;
    if (family === "specifications") return <SpecificationDetailPage slug={slug} onNavigate={onNavigate} />;
    return <PortfolioDetailPage slug={family} onNavigate={onNavigate} />;
  }
  if (primary === "catalog") {
    const dataset = segments[1];
    if (!dataset) return query ? <PublicCatalogExplorer onNavigate={onNavigate} initialQuery={query} /> : <PublicCatalogOverview onNavigate={onNavigate} />;
    if (segments.length === 2 && ["repositories", "packages", "resources", "technologies"].includes(dataset)) return <PublicCatalogExplorer onNavigate={onNavigate} fixedDataset={dataset as "repositories" | "packages" | "resources" | "technologies"} initialQuery={query} />;
    return <PublicCatalogDetail path={cleanPath} onNavigate={onNavigate} />;
  }
  if (primary === "contributors" && segments[1] && segments[2]) return <ContributorProfile provider={segments[1]} login={decodeURIComponent(segments[2])} onNavigate={onNavigate} />;
  if (primary === "solutions") return segments.length === 1 ? <ExplorerSolutionsPage onNavigate={onNavigate} /> : <ExplorerSolutionDetailPage slug={segments[1]} onNavigate={onNavigate} />;
  if (primary === "services") return segments.length === 1 ? <ExplorerServicesPage onNavigate={onNavigate} /> : <ExplorerServiceDetailPage slug={segments[1]} onNavigate={onNavigate} />;
  if (primary === "insights") return <InsightsPage onNavigate={onNavigate} />;
  if (primary === "about") return <ExplorerAboutPage onNavigate={onNavigate} />;
  if (primary === "contact") return <ExplorerContactPage />;
  if (primary === "privacy-policy") return <ExplorerPolicyPage kind="privacy" />;
  if (primary === "terms-of-service") return <ExplorerPolicyPage kind="terms" />;
  return <NotFoundPage onNavigate={onNavigate} />;
}
