import {StrictMode} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import {BrowserRouter} from './router';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import App from './App.tsx';
import './index.css';
import { CatalogFreshness } from './features/catalog/CatalogFreshness';

const serializedModel = document.getElementById('groupsum-api-snapshot');
if (serializedModel?.textContent) {
  globalThis.__GROUPSUM_API_SNAPSHOT__ = JSON.parse(serializedModel.textContent);
}
const serializedVersion = document.getElementById('groupsum-catalog-version');
if (serializedVersion?.textContent) globalThis.__GROUPSUM_CATALOG_VERSION__ = JSON.parse(serializedVersion.textContent);

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, gcTime: 30 * 60_000, refetchOnWindowFocus: false } },
});

const root = document.getElementById('root')!;
const shouldHydrate = root.hasChildNodes();
// Static HTML is generated for the pathname, without visitor-specific filters or fragments.
const initialLocation = shouldHydrate ? window.location.pathname : undefined;

const application = (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter initialLocation={initialLocation}>
        <App />
        <CatalogFreshness />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);

if (shouldHydrate) {
  hydrateRoot(root, application);
} else {
  createRoot(root).render(application);
}

declare global {
  var __GROUPSUM_API_SNAPSHOT__: unknown | null;
}
