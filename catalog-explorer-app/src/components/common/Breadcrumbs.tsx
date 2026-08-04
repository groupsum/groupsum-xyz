import React from 'react';
import { ChevronRight, Building2, Package, GitBranch, FolderGit2, FileCode, Layers } from 'lucide-react';
import { ResourceType } from '../../types/catalog';

interface BreadcrumbsProps {
  organization: string;
  product?: { name: string; slug: string };
  repository?: { owner: string; name: string };
  packageItem?: { packageName: string; ecosystem: string; routeKey: string };
  resource?: { name: string; type: ResourceType; routeKey: string };
  technology?: { name: string; slug: string };
  portfolio?: { name: string; slug: string };
  onNavigate: (route: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  organization,
  product,
  repository,
  packageItem,
  resource,
  technology,
  portfolio,
  onNavigate,
}) => {
  return (
    <nav aria-label="Ownership Hierarchy" className="py-2.5 px-3 bg-[#F4F3EF] border border-[#E5E3DC] rounded-lg text-xs font-mono text-[#5C635E]">
      <ol className="flex flex-wrap items-center gap-2">
        {/* Organization */}
        <li className="flex items-center space-x-1.5">
          <Building2 className="w-3.5 h-3.5 text-[#7A827C]" />
          <button
            onClick={() => onNavigate('/catalog/')}
            className="hover:text-[#1F2421] font-medium hover:underline focus:outline-none focus:ring-1 focus:ring-[#1A73E8]"
          >
            {organization}
          </button>
        </li>

        {/* Portfolio if present */}
        {portfolio && (
          <>
            <li aria-hidden="true" className="text-[#A3A8A2]">
              <ChevronRight className="w-3.5 h-3.5" />
            </li>
            <li className="flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-[#5C635E]" />
              <button
                onClick={() => onNavigate(`/portfolio/records/${portfolio.slug}`)}
                className="hover:text-[#1F2421] font-medium hover:underline focus:outline-none focus:ring-1 focus:ring-[#1A73E8]"
              >
                {portfolio.name}
              </button>
            </li>
          </>
        )}

        {/* Product if present */}
        {product && (
          <>
            <li aria-hidden="true" className="text-[#A3A8A2]">
              <ChevronRight className="w-3.5 h-3.5" />
            </li>
            <li className="flex items-center space-x-1.5">
              <Package className="w-3.5 h-3.5 text-[#2E6B9E]" />
              <button
                onClick={() => onNavigate(`/products/records/${product.slug}`)}
                className="hover:text-[#1F2421] font-medium hover:underline focus:outline-none focus:ring-1 focus:ring-[#1A73E8]"
              >
                {product.name}
              </button>
            </li>
          </>
        )}

        {/* Repository if present */}
        {repository && (
          <>
            <li aria-hidden="true" className="text-[#A3A8A2]">
              <ChevronRight className="w-3.5 h-3.5" />
            </li>
            <li className="flex items-center space-x-1.5">
              <GitBranch className="w-3.5 h-3.5 text-[#5B4699]" />
              <button
                onClick={() => onNavigate(`/catalog/repositories/${repository.owner}/${repository.name}`)}
                className="hover:text-[#1F2421] font-medium hover:underline focus:outline-none focus:ring-1 focus:ring-[#1A73E8]"
              >
                {repository.owner}/{repository.name}
              </button>
            </li>
          </>
        )}

        {/* Package if present */}
        {packageItem && (
          <>
            <li aria-hidden="true" className="text-[#A3A8A2]">
              <ChevronRight className="w-3.5 h-3.5" />
            </li>
            <li className="flex items-center space-x-1.5">
              <FolderGit2 className="w-3.5 h-3.5 text-[#C46D20]" />
              <span className="font-semibold text-[#1F2421]">
                {packageItem.packageName} <span className="text-[#7A827C] font-normal">({packageItem.ecosystem})</span>
              </span>
            </li>
          </>
        )}

        {/* Typed Resource if present */}
        {resource && (
          <>
            <li aria-hidden="true" className="text-[#A3A8A2]">
              <ChevronRight className="w-3.5 h-3.5" />
            </li>
            <li className="flex items-center space-x-1.5">
              <FileCode className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span className="font-semibold text-[#1F2421] truncate max-w-[200px]" title={resource.name}>
                {resource.name}
              </span>
            </li>
          </>
        )}

        {/* Technology if present */}
        {technology && (
          <>
            <li aria-hidden="true" className="text-[#A3A8A2]">
              <ChevronRight className="w-3.5 h-3.5" />
            </li>
            <li className="flex items-center space-x-1.5">
              <span className="font-semibold text-[#1F2421]">
                {technology.name}
              </span>
            </li>
          </>
        )}
      </ol>
    </nav>
  );
};
