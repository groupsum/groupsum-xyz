import React from 'react';
import { 
  Box,
  Layers,
  Lightbulb,
  SlidersHorizontal,
  BookOpen,
  Building2,
  Search, 
} from 'lucide-react';
import { FilterState } from '../../types/catalog';

interface HeaderProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  filterState: FilterState;
  onUpdateFilter: (updates: Partial<FilterState>) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigate,
  filterState,
  onUpdateFilter,
}) => {
  const isNavActive = (path: string) => {
    if (path === '/catalog/' && currentRoute === '/catalog/') return true;
    if (path !== '/catalog/' && currentRoute.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { label: 'Products', path: '/products/', icon: Box },
    { label: 'Portfolio', path: '/portfolio/', icon: Layers },
    { label: 'Solutions', path: '/solutions/', icon: Lightbulb },
    { label: 'Services', path: '/services/', icon: SlidersHorizontal },
    { label: 'Insights', path: '/insights/', icon: BookOpen },
    { label: 'About', path: '/about/', icon: Building2 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E5E3DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate('/products/')}
              className="flex items-center space-x-2 text-[#1F2421] hover:text-[#2E6B9E] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A73E8] rounded-lg p-1"
            >
              <div className="w-8 h-8 rounded-lg bg-[#1F2421] text-white flex items-center font-editorial font-bold text-lg justify-center shadow-sm">
                G
              </div>
              <div className="flex flex-col text-left">
                <span className="font-editorial text-lg font-bold tracking-tight leading-none text-[#1F2421]">
                  GroupSum
                </span>
                <span className="font-mono text-[10px] text-[#7A827C] tracking-wide">
                  groupsum.xyz
                </span>
              </div>
            </button>

            <span className="hidden sm:inline-block text-[#D5D8D6] font-mono">|</span>

            <span className="hidden sm:inline-block text-xs font-mono text-[#5C635E] bg-[#F4F3EF] px-2.5 py-1 rounded-full border border-[#E5E3DC]">
              Catalog & Evidence Explorer
            </span>
          </div>

          {/* Controls Right */}
          <div className="flex items-center space-x-3">
            {/* Density selector */}
            <div className="hidden md:flex items-center space-x-1 bg-[#F4F3EF] p-1 rounded-lg border border-[#E5E3DC] text-xs font-mono">
              <button
                onClick={() => onUpdateFilter({ density: 'comfortable' })}
                className={`px-2 py-0.5 rounded transition-all ${
                  filterState.density === 'comfortable'
                    ? 'bg-white text-[#1F2421] font-semibold shadow-xs'
                    : 'text-[#7A827C] hover:text-[#1F2421]'
                }`}
                title="Comfortable row density"
              >
                Comfortable
              </button>
              <button
                onClick={() => onUpdateFilter({ density: 'compact' })}
                className={`px-2 py-0.5 rounded transition-all ${
                  filterState.density === 'compact'
                    ? 'bg-white text-[#1F2421] font-semibold shadow-xs'
                    : 'text-[#7A827C] hover:text-[#1F2421]'
                }`}
                title="Compact table row density"
              >
                Compact
              </button>
            </div>

            {/* Quick search input trigger */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7A827C]" />
              <input
                type="text"
                placeholder="Search catalog..."
                value={filterState.search}
                onChange={(e) => onUpdateFilter({ search: e.target.value })}
                className="w-36 sm:w-48 pl-8 pr-3 py-1.5 text-xs font-mono bg-white border border-[#E5E3DC] rounded-lg text-[#1F2421] placeholder-[#A3A8A2] focus:outline-none focus:ring-1 focus:ring-[#1A73E8] focus:border-[#1A73E8] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <nav className="flex flex-wrap gap-1 pb-2 border-t border-[#E5E3DC]/60 pt-2 text-xs font-mono">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isNavActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all whitespace-nowrap focus:outline-none focus:ring-1 focus:ring-[#1A73E8] ${
                  active
                    ? 'bg-[#1F2421] text-white font-semibold shadow-xs'
                    : 'text-[#5C635E] hover:text-[#1F2421] hover:bg-[#F4F3EF]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-[#7A827C]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
