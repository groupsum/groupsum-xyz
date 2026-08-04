import React from 'react';
import { Shield, Globe } from 'lucide-react';

export const Footer: React.FC<{ onNavigate: (route: string) => void }> = ({ onNavigate }) => {
  const groups = [
    { title: 'GroupSum', links: [['Products', '/products/'], ['Portfolio', '/portfolio/'], ['Solutions', '/solutions/'], ['Services', '/services/'], ['Insights', '/insights/'], ['About', '/about/']] },
    { title: 'Public catalog', links: [['Catalog overview', '/catalog/'], ['Repositories', '/catalog/repositories/'], ['Packages', '/catalog/packages/'], ['Typed resources', '/catalog/resources/'], ['Technologies', '/catalog/technologies/']] },
    { title: 'Governance', links: [['Contact', '/contact/'], ['Privacy policy', '/privacy-policy/'], ['Terms of service', '/terms-of-service/']] },
  ];
  return (
    <footer className="mt-auto bg-[#F4F3EF] border-t border-[#E5E3DC] py-8 text-xs font-mono text-[#5C635E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-wrap justify-between items-start gap-8 border-b border-[#E5E3DC] pb-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-editorial text-base font-bold text-[#1F2421]">GroupSum</span>
              <span className="text-[10px] bg-[#E5E3DC] text-[#1F2421] px-2 py-0.5 rounded font-mono">v2.4</span>
            </div>
            <p className="text-[11px] text-[#7A827C]">
              Canonical hierarchy: Organization &rarr; Product/Portfolio &rarr; Repository &rarr; Package/Resource &rarr; Event
            </p>
          </div>

          <div className="grid min-w-0 flex-1 grid-cols-2 gap-6 sm:grid-cols-3 md:max-w-2xl">
            {groups.map((group) => <section key={group.title}><h2 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-[#1F2421]">{group.title}</h2><ul className="space-y-2">{group.links.map(([label, route]) => <li key={route}><button type="button" onClick={() => onNavigate(route)} className="text-left text-[11px] hover:text-[#2E6B9E] hover:underline">{label}</button></li>)}</ul></section>)}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] md:basis-full md:justify-end">
            <a
              href="https://groupsum.xyz"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[#2E6B9E] hover:underline font-medium"
            >
              <Globe className="w-3.5 h-3.5" />
              groupsum.xyz
            </a>
            <span className="text-[#D5D8D6]">|</span>
            <span className="inline-flex items-center gap-1 text-[#166534]">
              <Shield className="w-3.5 h-3.5" />
              Evidence-labeled public catalog
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[11px] text-[#7A827C]">
          <div>
            &copy; {new Date().getFullYear()} GroupSum. Public catalog evidence &amp; governance field guide.
          </div>
          <div className="flex space-x-4">
            <span>Observation Window: 30-Day Rolling</span>
            <span>Refreshed: August 3, 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
