import {StrictMode} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import {BrowserRouter} from './router';
import App from './App.tsx';
import './index.css';

const serializedModel = document.getElementById('groupsum-page-model');
if (serializedModel?.textContent) {
  globalThis.__GROUPSUM_PAGE_MODEL__ = JSON.parse(serializedModel.textContent);
}

const application = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

const root = document.getElementById('root')!;
if (root.hasChildNodes()) {
  hydrateRoot(root, application);
} else {
  createRoot(root).render(application);
}

declare global {
  var __GROUPSUM_PAGE_MODEL__: unknown | null;
}
