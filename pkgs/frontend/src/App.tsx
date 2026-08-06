/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { LegacyArticlePage } from "./pages/ArticlePages";
import { RouteSwitcher } from "./app/RouteSwitcher";
import { useLocation, useNavigate } from "./router";

const legacyRoute = /^\/(\d{4})\/(\d{2})\/(\d{2})\/([a-zA-Z0-9_-]+)\/?$/;

export default function App() {
  const location = useLocation();
  const navigateHook = useNavigate();
  const currentPath = location.pathname;
  const legacyMatch = currentPath.match(legacyRoute);
  const navigate = (path: string) => {
    navigateHook(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return <div className="min-h-screen flex flex-col bg-canvas text-ink selection:bg-accent/15 selection:text-accent font-sans">
    <SiteHeader currentPath={currentPath} onNavigate={navigate} />
    <main className="flex-grow">
      {legacyMatch
        ? <LegacyArticlePage year={legacyMatch[1]} month={legacyMatch[2]} day={legacyMatch[3]} slug={legacyMatch[4]} onNavigate={navigate} />
        : <RouteSwitcher path={`${location.pathname}${location.search}`} onNavigate={navigate} />}
    </main>
    <SiteFooter onNavigate={navigate} />
  </div>;
}
