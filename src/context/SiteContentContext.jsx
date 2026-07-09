import { createContext, useContext, useEffect, useState } from "react";
import { publicApi } from "../lib/api.js";

const SiteContentContext = createContext(null);

const CACHE_KEY = "portfolio_content_cache_v1";
const CACHE_TTL_MS = 10 * 60 * 1000;

const initialContent = {
  siteSettings: null,
  about: null,
  processes: [],
  skills: [],
  companies: [],
  services: [],
  projects: [],
  testimonials: [],
  blogs: [],
  serviceCategories: [],
  projectCategories: [],
  blogCategories: [],
  education: [],
  experience: [],
};

const readCache = () => {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.savedAt || Date.now() - parsed.savedAt > CACHE_TTL_MS) return null;
    return parsed.data || null;
  } catch {
    return null;
  }
};

const writeCache = (data) => {
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ savedAt: Date.now(), data }),
    );
  } catch {
    // ignore storage quota errors
  }
};

function SiteContentProvider({ children }) {
  const cached = readCache();
  const [content, setContent] = useState(cached ? { ...initialContent, ...cached } : initialContent);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState("");

  const loadContent = async (force = false) => {
    if (!force) {
      const freshCache = readCache();
      if (freshCache) {
        setContent({ ...initialContent, ...freshCache });
        setLoading(false);
        setError("");
        return;
      }
    }

    try {
      setLoading(true);
      const data = await publicApi.content();
      const merged = { ...initialContent, ...data };
      setContent(merged);
      writeCache(data);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load site content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  return (
    <SiteContentContext.Provider
      value={{ content, loading, error, refreshContent: () => loadContent(true) }}
    >
      {error ? (
        <div className="site-data-banner site-data-banner-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => loadContent(true)}>
            Retry
          </button>
        </div>
      ) : null}
      {loading && !content.siteSettings ? (
        <div className="site-data-banner site-data-banner-loading" aria-live="polite">
          Loading portfolio content...
        </div>
      ) : null}
      {children}
    </SiteContentContext.Provider>
  );
}

const useSiteContent = () => {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error("useSiteContent must be used inside SiteContentProvider");
  }
  return context;
};

export { SiteContentProvider, useSiteContent };
