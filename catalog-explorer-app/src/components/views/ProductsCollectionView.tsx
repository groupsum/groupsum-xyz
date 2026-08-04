import React from 'react';
import { ProductRecord, FilterState } from '../../types/catalog';
import { CollectionHeader } from '../common/CollectionHeader';
import { FilterToolbar } from '../common/FilterToolbar';
import { MemberRowCard } from '../common/MemberRowCard';
import { Box, Layers, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ProductsCollectionViewProps {
  products: ProductRecord[];
  filterState: FilterState;
  onUpdateFilter: (updates: Partial<FilterState>) => void;
  onNavigate: (route: string) => void;
  onExportJSON: () => void;
}

export const ProductsCollectionView: React.FC<ProductsCollectionViewProps> = ({
  products,
  filterState,
  onUpdateFilter,
  onNavigate,
  onExportJSON,
}) => {
  // Filter products
  const filtered = products.filter((prod) => {
    if (filterState.search) {
      const q = filterState.search.toLowerCase();
      const matchName = prod.name.toLowerCase().includes(q);
      const matchSum = prod.summary.toLowerCase().includes(q);
      const matchOrg = prod.organization.toLowerCase().includes(q);
      const matchCap = prod.reviewedCapabilities.some((c) => c.toLowerCase().includes(q));
      if (!matchName && !matchSum && !matchOrg && !matchCap) return false;
    }
    if (filterState.organization && prod.organization !== filterState.organization) return false;
    if (filterState.maturity && prod.maturity !== filterState.maturity) return false;
    return true;
  });

  const summaryFacts = [
    { label: 'Products', value: products.length, icon: <Box className="w-4 h-4 text-[#2E6B9E]" /> },
    { label: 'Production Ready', value: products.filter(p => p.maturity === 'production').length, icon: <CheckCircle2 className="w-4 h-4 text-[#166534]" /> },
    { label: 'Total Repositories', value: products.reduce((acc, p) => acc + p.repositoryRefs.length, 0), icon: <Layers className="w-4 h-4 text-[#5B4699]" /> },
    { label: 'Contained Packages', value: products.reduce((acc, p) => acc + p.packageRefs.length, 0), icon: <ShieldCheck className="w-4 h-4 text-[#B45309]" /> },
  ];

  return (
    <div className="space-y-6">
      <CollectionHeader
        eyebrow="Primary Product Evaluation Collection"
        title="GroupSum Products"
        description="Public software products reviewed for purpose, target audience, maturity, capabilities, and underlying implementation evidence."
        observationTime="2026-08-03T18:00:00Z"
        summaryFacts={summaryFacts}
        onDownloadExport={onExportJSON}
      />

      <FilterToolbar
        filterState={filterState}
        onUpdateFilter={onUpdateFilter}
        organizationOptions={Array.from(new Set(products.map((p) => p.organization)))}
        maturityOptions={['production', 'active', 'beta', 'experimental']}
        totalMatches={filtered.length}
      />

      <div className="space-y-3">
        {filtered.map((prod) => (
          <MemberRowCard
            key={prod.id}
            id={prod.id}
            name={prod.name}
            summary={prod.summary}
            ownerPath={prod.organization}
            type="product"
            maturity={prod.maturity}
            ecosystem={prod.ecosystem}
            packagesCount={prod.packageRefs.length}
            repositoriesCount={prod.repositoryRefs.length}
            route={`/products/records/${prod.slug}`}
            onNavigate={onNavigate}
            density={filterState.density}
          />
        ))}

        {filtered.length === 0 && (
          <div className="p-8 text-center bg-white border border-[#E5E3DC] rounded-xl font-mono text-xs text-[#7A827C]">
            No products match the active filter criteria. Try adjusting search terms or clearing filters.
          </div>
        )}
      </div>
    </div>
  );
};
