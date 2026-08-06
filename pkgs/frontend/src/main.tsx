import {StrictMode} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import {BrowserRouter} from './router';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import App from './App.tsx';
import './index.css';

const serializedModel = document.getElementById('groupsum-api-snapshot');
if (serializedModel?.textContent) {
  globalThis.__GROUPSUM_API_SNAPSHOT__ = JSON.parse(serializedModel.textContent);
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, refetchOnWindowFocus: false } },
});

const application = (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);

const root = document.getElementById('root')!;
if (root.hasChildNodes()) {
  hydrateRoot(root, application);
} else {
  createRoot(root).render(application);
}

declare global {
  var __GROUPSUM_API_SNAPSHOT__: unknown | null;
}
