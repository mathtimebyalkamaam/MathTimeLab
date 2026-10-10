import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Auto-recover from stale chunks after new deployments or network drops
if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    console.warn('[Vite Preload Error] Module chunk outdated after deployment, refreshing page:', event);
    const lastReload = sessionStorage.getItem('vite_preload_error_reload');
    const now = Date.now();
    // Guard against reload loops if internet is down entirely
    if (!lastReload || now - Number(lastReload) > 10000) {
      sessionStorage.setItem('vite_preload_error_reload', String(now));
      window.location.reload();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

