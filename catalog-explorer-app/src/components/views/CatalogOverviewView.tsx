import React from 'react';
import { 
  Box, 
  Layers, 
  FolderGit2, 
  Package, 
  FileCode, 
  Cpu, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface CatalogOverviewViewProps {
  onNavigate: (route: string) => void;
  productsCount: number;
  portfolioCount: number;
  repositoriesCount: number;
  packagesCount: number;
  resourcesCount: number;
  technologiesCount: number;
}

export const CatalogOverviewView: React.FC<CatalogOverviewViewProps> = ({
  onNavigate,
  productsCount,
  portfolioCount,
  repositoriesCount,
  packagesCount,
  resourcesCount,
  technologiesCount,
}) => {
  const collections = [
    {
      title: 'Products',
      route: '/products/',
      count: productsCount,
      icon: Box,
      color: 'text-[#2E6B9E]',
      bgColor: 'bg-[#EBF3FA]',
      description: 'Primary public software products reviewed for purpose, audience, and capabilities.'
    },
    {
      title: 'Portfolios',
      route: '/portfolio/',
      count: portfolioCount,
      icon: Layers,
      color: 'text-[#5B4699]',
      bgColor: 'bg-[#F3E8FF]',
      description: 'Strategic portfolio domains grouping related enterprise product ecosystems.'
    },
    {
      title: 'Repositories',
      route: '/catalog/repositories/',
      count: repositoriesCount,
      icon: FolderGit2,
      color: 'text-[#166534]',
      bgColor: 'bg-[#DCFCE7]',
      description: 'Source code repositories, commit activity sparklines, stars, and SSOT governance.'
    },
    {
      title: 'Packages',
      route: '/catalog/packages/',
      count: packagesCount,
      icon: Package,
      color: 'text-[#C46D20]',
      bgColor: 'bg-[#FEF3C7]',
      description: 'Published, private, and workspace packages with grouped dependencies & releases.'
    },
    {
      title: 'Typed Resources',
      route: '/catalog/resources/',
      count: resourcesCount,
      icon: FileCode,
      color: 'text-[#0369A1]',
      bgColor: 'bg-[#E0F2FE]',
      description: 'Websites, API contracts, developer documentation, showcases, and interactive UIs.'
    },
    {
      title: 'Technologies',
      route: '/catalog/technologies/',
      count: technologiesCount,
      icon: Cpu,
      color: 'text-[#B45309]',
      bgColor: 'bg-[#FFEDD5]',
      description: 'Categorical technology tags explicitly separated from programming languages.'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Editorial Overview Header */}
      <div className="p-8 bg-white border border-[#E5E3DC] rounded-2xl shadow-xs space-y-4">
        <div className="inline-flex items-center space-x-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#2E6B9E]">
          <ShieldCheck className="w-4 h-4 text-[#2E6B9E]" />
          <span>Supporting Evidence &amp; Public Catalog Explorer</span>
        </div>

        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#1F2421] tracking-tight">
          GroupSum Ecosystem Catalog
        </h1>

        <p className="text-sm sm:text-base text-[#5C635E] leading-relaxed max-w-3xl">
          Traverse from high-level products into verified repositories, published packages, API specifications, developer documentation, and SSOT governance claims without losing ownership context.
        </p>

        <div className="flex items-center space-x-2 pt-2 text-xs font-mono text-[#7A827C]">
          <Calendar className="w-3.5 h-3.5" />
          <span>Active Observation Period: 30-Day Window &bull; Refreshed August 3, 2026</span>
        </div>
      </div>

      {/* Collection Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {collections.map((col) => {
          const Icon = col.icon;
          return (
            <div
              key={col.route}
              onClick={() => onNavigate(col.route)}
              className="group p-6 bg-white hover:bg-[#FAF9F6] border border-[#E5E3DC] hover:border-[#1A73E8] rounded-xl transition-all duration-200 shadow-xs cursor-pointer flex flex-col justify-between space-y-4"
              role="link"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onNavigate(col.route);
                }
              }}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className={`p-3 rounded-lg ${col.bgColor} shrink-0`}>
                    <Icon className={`w-6 h-6 ${col.color}`} />
                  </div>
                  <span className="font-mono text-xl font-bold text-[#1F2421] bg-[#F4F3EF] px-3 py-1 rounded-full border border-[#E5E3DC]">
                    {col.count}
                  </span>
                </div>

                <h2 className="font-editorial text-2xl font-bold text-[#1F2421] group-hover:text-[#1A73E8] transition-colors">
                  {col.title}
                </h2>

                <p className="text-xs text-[#5C635E] leading-relaxed">
                  {col.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E5E3DC]/60 flex items-center justify-between text-xs font-mono font-semibold text-[#1A73E8]">
                <span>Browse Collection</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
