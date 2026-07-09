import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import { SiteContentProvider } from './context/SiteContentContext.jsx';
import PublicApp from './PublicApp.jsx';
import AdminPanel from './admin/AdminPanel.jsx';

const isAdminRoute =
  window.location.hostname.startsWith("admin.") ||
  window.location.pathname.startsWith("/admin");

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isAdminRoute ? (
      <AdminPanel />
    ) : (
      <SiteContentProvider>
        <PublicApp />
      </SiteContentProvider>
    )}
  </StrictMode>
);
