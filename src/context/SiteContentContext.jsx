import { createContext, useContext, useEffect, useState } from "react";
import { publicApi } from "../lib/api.js";

const SiteContentContext = createContext(null);

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

function SiteContentProvider({ children }) {
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadContent = async () => {
    try {
      setLoading(true);
      const data = await publicApi.content();
      setContent({
        ...initialContent,
        ...data,
      });
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
      value={{ content, loading, error, refreshContent: loadContent }}
    >
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
