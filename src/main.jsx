import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import { SiteContentProvider } from './context/SiteContentContext.jsx';
import PublicApp from './PublicApp.jsx';

const AdminPanel = lazy(() => import('./admin/AdminPanel.jsx'));

const isAdminRoute =
  window.location.hostname.startsWith("admin.") ||
  window.location.pathname.startsWith("/admin");

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isAdminRoute ? (
      <Suspense fallback={<div className="site-data-banner site-data-banner-loading">Loading admin panel...</div>}>
        <AdminPanel />
      </Suspense>
    ) : (
      <SiteContentProvider>
        <PublicApp />
      </SiteContentProvider>
    )}
  </StrictMode>
);
