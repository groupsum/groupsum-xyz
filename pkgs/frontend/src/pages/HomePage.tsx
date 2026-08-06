import { HomeEditorial } from "./HomeEditorial";
import { HomeHero } from "./HomeHero";
import { HomeOfferings } from "./HomeOfferings";
import { HomePortfolio } from "./HomePortfolio";

export function HomePage({ onNavigate }: { onNavigate: (path: string) => void }) {
  return <div className="space-y-24 md:space-y-32 pb-24">
    <HomeHero onNavigate={onNavigate} />
    <HomePortfolio onNavigate={onNavigate} />
    <HomeOfferings onNavigate={onNavigate} />
    <HomeEditorial onNavigate={onNavigate} />
  </div>;
}
