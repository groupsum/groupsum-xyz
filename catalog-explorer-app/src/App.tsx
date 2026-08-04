import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { FilterState } from './types/catalog';
import { 
  PRODUCTS_DATA, 
  PORTFOLIO_DATA, 
  REPOSITORIES_DATA, 
  PACKAGES_DATA, 
  TYPED_RESOURCES_DATA, 
  TECHNOLOGIES_DATA, 
  SSOT_GOVERNANCE_DATA,
  RELEASES_DATA 
} from './data/mockCatalogData';

// Views
import { CatalogOverviewView } from './components/views/CatalogOverviewView';
import { ProductsCollectionView } from './components/views/ProductsCollectionView';
import { PortfolioCollectionView } from './components/views/PortfolioCollectionView';
import { RepositoriesCollectionView } from './components/views/RepositoriesCollectionView';
import { PackagesCollectionView } from './components/views/PackagesCollectionView';
import { ResourcesCollectionView } from './components/views/ResourcesCollectionView';
import { TechnologiesCollectionView } from './components/views/TechnologiesCollectionView';

// Canonical Member Views
import { ProductMemberView } from './components/views/ProductMemberView';
import { PortfolioMemberView } from './components/views/PortfolioMemberView';
import { RepositoryMemberView } from './components/views/RepositoryMemberView';
import { PackageMemberView } from './components/views/PackageMemberView';
import { ResourceMemberView } from './components/views/ResourceMemberView';
import { TechnologyMemberView } from './components/views/TechnologyMemberView';
import { ReleaseMemberView } from './components/views/ReleaseMemberView';
import { EditorialView } from './components/views/EditorialView';

import { X, Copy, Check, Download, FileText } from 'lucide-react';

export default function App() {
  // Helper to parse hash or default route
  const getInitialRoute = () => {
    const hash = window.location.hash.replace(/^#/, '');
    return hash || '/products/';
  };

  const [currentRoute, setCurrentRoute] = useState<string>(getInitialRoute);
  const [filterState, setFilterState] = useState<FilterState>({
    search: '',
    ecosystem: '',
    organization: '',
    maturity: '',
    publicationState: '',
    evidenceState: '',
    governanceState: '',
    resourceType: '',
    sortBy: 'name',
    sortOrder: 'asc',
    density: 'comfortable',
  });

  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash && hash !== currentRoute) {
        setCurrentRoute(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentRoute]);

  const handleNavigate = (route: string) => {
    setCurrentRoute(route);
    window.location.hash = route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateFilter = (updates: Partial<FilterState>) => {
    setFilterState((prev) => ({ ...prev, ...updates }));
  };

  const handleExportJSON = () => {
    setExportModalOpen(true);
  };

  // Generate current JSON projection
  const getCurrentDatasetJSON = () => {
    return JSON.stringify(
      {
        site: 'https://groupsum.xyz',
        generatedAt: new Date().toISOString(),
        products: PRODUCTS_DATA,
        portfolios: PORTFOLIO_DATA,
        repositories: REPOSITORIES_DATA,
        packages: PACKAGES_DATA,
        resources: TYPED_RESOURCES_DATA,
        technologies: TECHNOLOGIES_DATA,
        ssotGovernance: SSOT_GOVERNANCE_DATA,
      },
      null,
      2
    );
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(getCurrentDatasetJSON());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([getCurrentDatasetJSON()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `groupsum-catalog-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Render view router based on currentRoute
  const renderCurrentView = () => {
    for (const kind of ['solutions', 'services', 'insights', 'about', 'contact', 'privacy-policy', 'terms-of-service'] as const) {
      if (currentRoute === `/${kind}/` || currentRoute === `/${kind}`) return <EditorialView kind={kind} />;
    }
    // 1. Catalog Overview
    if (currentRoute === '/catalog/' || currentRoute === '/catalog') {
      return (
        <CatalogOverviewView
          onNavigate={handleNavigate}
          productsCount={PRODUCTS_DATA.length}
          portfolioCount={PORTFOLIO_DATA.length}
          repositoriesCount={REPOSITORIES_DATA.length}
          packagesCount={PACKAGES_DATA.length}
          resourcesCount={TYPED_RESOURCES_DATA.length}
          technologiesCount={TECHNOLOGIES_DATA.length}
        />
      );
    }

    // 2. Products Collection
    if (currentRoute === '/products/' || currentRoute === '/products') {
      return (
        <ProductsCollectionView
          products={PRODUCTS_DATA}
          filterState={filterState}
          onUpdateFilter={handleUpdateFilter}
          onNavigate={handleNavigate}
          onExportJSON={handleExportJSON}
        />
      );
    }

    // 3. Product Member Detail (/products/records/:slug)
    if (currentRoute.startsWith('/products/records/')) {
      const slug = currentRoute.replace('/products/records/', '').replace(/\/$/, '');
      const product = PRODUCTS_DATA.find((p) => p.slug === slug);
      if (product) {
        return (
          <ProductMemberView
            product={product}
            repositories={REPOSITORIES_DATA}
            packages={PACKAGES_DATA}
            resources={TYPED_RESOURCES_DATA}
            governanceRecords={SSOT_GOVERNANCE_DATA}
            onNavigate={handleNavigate}
          />
        );
      }
    }

    // 4. Portfolio Collection
    if (currentRoute === '/portfolio/' || currentRoute === '/portfolio') {
      return (
        <PortfolioCollectionView
          portfolioItems={PORTFOLIO_DATA}
          filterState={filterState}
          onUpdateFilter={handleUpdateFilter}
          onNavigate={handleNavigate}
          onExportJSON={handleExportJSON}
        />
      );
    }

    // 5. Portfolio Member Detail (/portfolio/records/:slug)
    if (currentRoute.startsWith('/portfolio/records/')) {
      const slug = currentRoute.replace('/portfolio/records/', '').replace(/\/$/, '');
      const portfolioItem = PORTFOLIO_DATA.find((p) => p.slug === slug);
      if (portfolioItem) {
        return (
          <PortfolioMemberView
            portfolio={portfolioItem}
            products={PRODUCTS_DATA}
            onNavigate={handleNavigate}
          />
        );
      }
    }

    // 6. Repositories Collection
    if (currentRoute === '/catalog/repositories/' || currentRoute === '/catalog/repositories') {
      return (
        <RepositoriesCollectionView
          repositories={REPOSITORIES_DATA}
          filterState={filterState}
          onUpdateFilter={handleUpdateFilter}
          onNavigate={handleNavigate}
          onExportJSON={handleExportJSON}
        />
      );
    }

    // 7. Repository Member Detail (/catalog/repositories/:owner/:repo)
    if (currentRoute.startsWith('/catalog/repositories/')) {
      const parts = currentRoute.replace('/catalog/repositories/', '').split('/');
      if (parts.length >= 2) {
        const owner = parts[0];
        const repository = parts[1];
        const repo = REPOSITORIES_DATA.find((r) => r.owner === owner && r.repository === repository);
        if (repo) {
          const containedPkgs = PACKAGES_DATA.filter(
            (p) => p.owningRepository.owner === owner && p.owningRepository.repository === repository
          );
          const attachedResources = TYPED_RESOURCES_DATA.filter(
            (res) => res.owningRepository?.owner === owner && res.owningRepository?.repository === repository
          );
          const gov = SSOT_GOVERNANCE_DATA[repo.slug];
          const rels = RELEASES_DATA.filter((rel) => rel.ownerRef.name === repo.slug);

          return (
            <RepositoryMemberView
              repository={repo}
              containedPackages={containedPkgs}
              typedResources={attachedResources}
              governance={gov}
              releases={rels}
              onNavigate={handleNavigate}
            />
          );
        }
      }
    }

    // 8. Packages Collection
    if (currentRoute === '/catalog/packages/' || currentRoute === '/catalog/packages') {
      return (
        <PackagesCollectionView
          packages={PACKAGES_DATA}
          filterState={filterState}
          onUpdateFilter={handleUpdateFilter}
          onNavigate={handleNavigate}
          onExportJSON={handleExportJSON}
        />
      );
    }

    // 9. Package Member Detail (/catalog/packages/:ecosystem/:routeKey)
    if (currentRoute.startsWith('/catalog/packages/')) {
      const parts = currentRoute.replace('/catalog/packages/', '').split('/');
      if (parts.length >= 2) {
        const routeKey = parts[1];
        const pkg = PACKAGES_DATA.find((p) => p.routeKey === routeKey);
        if (pkg) {
          const owningRepo = REPOSITORIES_DATA.find(
            (r) => r.owner === pkg.owningRepository.owner && r.repository === pkg.owningRepository.repository
          );
          return (
            <PackageMemberView
              pkg={pkg}
              owningRepo={owningRepo}
              onNavigate={handleNavigate}
            />
          );
        }
      }
    }

    // 10. Typed Resources Collection
    if (currentRoute === '/catalog/resources/' || currentRoute === '/catalog/resources') {
      return (
        <ResourcesCollectionView
          resources={TYPED_RESOURCES_DATA}
          filterState={filterState}
          onUpdateFilter={handleUpdateFilter}
          onNavigate={handleNavigate}
          onExportJSON={handleExportJSON}
        />
      );
    }

    // 11. Resource Member Detail (/catalog/resources/:type/:key)
    if (currentRoute.startsWith('/catalog/resources/')) {
      const parts = currentRoute.replace('/catalog/resources/', '').split('/');
      if (parts.length >= 2) {
        const key = parts[1];
        const res = TYPED_RESOURCES_DATA.find((r) => r.routeKey === key);
        if (res) {
          return (
            <ResourceMemberView
              resource={res}
              onNavigate={handleNavigate}
            />
          );
        }
      }
    }

    // 12. Technologies Collection
    if (currentRoute === '/catalog/technologies/' || currentRoute === '/catalog/technologies') {
      return (
        <TechnologiesCollectionView
          technologies={TECHNOLOGIES_DATA}
          filterState={filterState}
          onUpdateFilter={handleUpdateFilter}
          onNavigate={handleNavigate}
          onExportJSON={handleExportJSON}
        />
      );
    }

    // 13. Technology Member Detail (/catalog/technologies/:slug)
    if (currentRoute.startsWith('/catalog/technologies/')) {
      const slug = currentRoute.replace('/catalog/technologies/', '').replace(/\/$/, '');
      const tech = TECHNOLOGIES_DATA.find((t) => t.slug === slug);
      if (tech) {
        return (
          <TechnologyMemberView
            tech={tech}
            onNavigate={handleNavigate}
          />
        );
      }
    }

    // 14. Release Member Detail (/catalog/releases/:key)
    if (currentRoute.startsWith('/catalog/releases/')) {
      const key = currentRoute.replace('/catalog/releases/', '').replace(/\/$/, '');
      const rel = RELEASES_DATA.find((r) => r.routeKey === key);
      if (rel) {
        return (
          <ReleaseMemberView
            release={rel}
            onNavigate={handleNavigate}
          />
        );
      }
    }

    // Fallback to Products Collection
    return (
      <ProductsCollectionView
        products={PRODUCTS_DATA}
        filterState={filterState}
        onUpdateFilter={handleUpdateFilter}
        onNavigate={handleNavigate}
        onExportJSON={handleExportJSON}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#1F2421]">
      {/* Top Header */}
      <Header
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        filterState={filterState}
        onUpdateFilter={handleUpdateFilter}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentView()}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* JSON Dataset Export Modal */}
      {exportModalOpen && (
        <div className="fixed inset-0 bg-[#1F2421]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5E3DC] rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-xl font-mono text-xs max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-[#E5E3DC] pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-[#2E6B9E]" />
                <h3 className="font-bold text-[#1F2421] text-sm">GroupSum Page Model &amp; Dataset Export</h3>
              </div>
              <button
                onClick={() => setExportModalOpen(false)}
                className="text-[#7A827C] hover:text-[#1F2421] p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#5C635E] font-sans">
              This exported JSON contains canonical page models for all GroupSum products, portfolios, repositories, packages, typed resources, technologies, and SSOT governance claims.
            </p>

            <div className="flex-1 min-h-0 bg-[#FAF9F6] border border-[#E5E3DC] p-3 rounded-lg overflow-y-auto font-mono text-[11px] text-[#1F2421]">
              <pre>{getCurrentDatasetJSON()}</pre>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-[#E5E3DC]">
              <button
                onClick={handleCopyJSON}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#F4F3EF] hover:bg-[#E5E3DC] text-[#1F2421] font-semibold rounded-lg transition-colors border border-[#E5E3DC]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#166534]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Raw JSON'}</span>
              </button>

              <button
                onClick={handleDownloadFile}
                className="inline-flex items-center space-x-1.5 px-4 py-1.5 bg-[#1F2421] hover:bg-[#2E6B9E] text-white font-semibold rounded-lg transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .json File</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
