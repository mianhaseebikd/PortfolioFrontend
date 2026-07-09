import { useEffect, useMemo, useState } from "react";
import { adminApi, authApi } from "../lib/api.js";
import "../admin/admin.css";

const sectionOrder = [
  "dashboard",
  "site-settings",
  "about",
  "services",
  "projects",
  "testimonials",
  "blogs",
  "timeline",
  "contacts",
  "newsletter",
];

const sectionLabels = {
  dashboard: "Dashboard",
  "site-settings": "Site Settings",
  about: "About",
  services: "Services",
  projects: "Projects",
  testimonials: "Testimonials",
  blogs: "Blogs",
  timeline: "Timeline",
  contacts: "Contacts",
  newsletter: "Newsletter",
};

const blank = (value = "") => value;

const getTextDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString().slice(0, 10);
};

const safeArray = (value) => (Array.isArray(value) ? value : []);

const createSiteSettingsForm = (item = {}) => ({
  siteName: item.siteName ?? "",
  logoUrl: item.logoUrl ?? "",
  heroName: item.heroName ?? "",
  heroTitle: item.heroTitle ?? "",
  heroSubtitle: item.heroSubtitle ?? "",
  heroDescription: item.heroDescription ?? "",
  heroImage: item.heroImage ?? "",
  heroTagline: item.heroTagline ?? "",
  primaryPhone: item.primaryPhone ?? "",
  primaryEmail: item.primaryEmail ?? "",
  address: item.address ?? "",
  whatsappNumber: item.whatsappNumber ?? "",
  resumeUrl: item.resumeUrl ?? "",
  footerTagline: item.footerTagline ?? "",
  socialFacebook: item.socialLinks?.facebook ?? "",
  socialTwitter: item.socialLinks?.twitter ?? "",
  socialLinkedin: item.socialLinks?.linkedin ?? "",
  socialInstagram: item.socialLinks?.instagram ?? "",
  socialGithub: item.socialLinks?.github ?? "",
  socialYoutube: item.socialLinks?.youtube ?? "",
});

const createAboutForm = (item = {}) => ({
  eyebrow: item.eyebrow ?? "",
  title: item.title ?? "",
  description: item.description ?? "",
  image: item.image ?? "",
  projectCount: item.stats?.[0]?.value ?? "",
  experienceYears: item.stats?.[1]?.value ?? "",
});

const createServiceForm = (item = {}) => ({
  title: item.title ?? "",
  shortDescription: item.shortDescription ?? "",
  description: item.description ?? "",
  heading: item.heading ?? "",
  image: item.image ?? "",
  icon: item.icon ?? "",
  iconBg: item.iconBg ?? "",
  priceFrom: item.priceFrom ?? "$99",
  featured: Boolean(item.featured),
  visible: item.visible ?? true,
  order: item.order ?? 0,
});

const createProjectForm = (item = {}) => ({
  title: item.title ?? "",
  category: item.category ?? "Web",
  description: item.description ?? "",
  image: item.image ?? "",
  liveDemo: item.liveDemo ?? "",
  sourceCode: item.sourceCode ?? "",
  featured: Boolean(item.featured),
  visible: item.visible ?? true,
  order: item.order ?? 0,
});

const createTestimonialForm = (item = {}) => ({
  name: item.name ?? "",
  role: item.role ?? "",
  company: item.company ?? "",
  service: item.service ?? "",
  avatar: item.avatar ?? "",
  quote: item.quote ?? "",
  rating: item.rating ?? 5,
  visible: item.visible ?? true,
  order: item.order ?? 0,
});

const createBlogForm = (item = {}) => ({
  title: item.title ?? "",
  category: item.category ?? "Development",
  excerpt: item.excerpt ?? "",
  content: item.content ?? "",
  image: item.image ?? "",
  author: item.author ?? "",
  published: item.published ?? true,
  visible: item.visible ?? true,
  publishedAt: getTextDate(item.publishedAt),
  order: item.order ?? 0,
});

const createTimelineForm = (item = {}) => ({
  section: item.section ?? "education",
  year: item.year ?? "",
  college: item.college ?? "",
  degree: item.degree ?? "",
  description: item.description ?? "",
  visible: item.visible ?? true,
  order: item.order ?? 0,
});

const emptyForms = {
  "site-settings": createSiteSettingsForm(),
  about: createAboutForm(),
  services: createServiceForm(),
  projects: createProjectForm(),
  testimonials: createTestimonialForm(),
  blogs: createBlogForm(),
  timeline: createTimelineForm(),
};

const sectionConfigs = {
  "site-settings": {
    title: "Site Settings",
    listKey: "siteSettings",
    singleton: true,
    load: () => adminApi.siteSettings(),
    save: (payload) => adminApi.updateSiteSettings(payload),
    fromItem: createSiteSettingsForm,
    toPayload: (form) => ({
      siteName: form.siteName,
      logoUrl: form.logoUrl,
      heroName: form.heroName,
      heroTitle: form.heroTitle,
      heroSubtitle: form.heroSubtitle,
      heroDescription: form.heroDescription,
      heroImage: form.heroImage,
      heroTagline: form.heroTagline,
      primaryPhone: form.primaryPhone,
      primaryEmail: form.primaryEmail,
      address: form.address,
      whatsappNumber: form.whatsappNumber,
      resumeUrl: form.resumeUrl,
      footerTagline: form.footerTagline,
      socialLinks: {
        facebook: form.socialFacebook,
        twitter: form.socialTwitter,
        linkedin: form.socialLinkedin,
        instagram: form.socialInstagram,
        github: form.socialGithub,
        youtube: form.socialYoutube,
      },
    }),
    fields: [
      { name: "siteName", label: "Site Name", type: "text" },
      { name: "logoUrl", label: "Logo URL", type: "text" },
      { name: "heroName", label: "Hero Name", type: "text" },
      { name: "heroTitle", label: "Hero Title", type: "text" },
      { name: "heroSubtitle", label: "Hero Subtitle", type: "text" },
      { name: "heroDescription", label: "Hero Description", type: "textarea" },
      { name: "heroImage", label: "Hero Image URL", type: "text" },
      { name: "heroTagline", label: "Hero Tagline", type: "text" },
      { name: "primaryPhone", label: "Primary Phone", type: "text" },
      { name: "primaryEmail", label: "Primary Email", type: "email" },
      { name: "address", label: "Address", type: "text" },
      { name: "whatsappNumber", label: "WhatsApp Number", type: "text" },
      { name: "resumeUrl", label: "Resume URL", type: "text" },
      { name: "footerTagline", label: "Footer Tagline", type: "textarea" },
      { name: "socialFacebook", label: "Facebook", type: "text" },
      { name: "socialTwitter", label: "Twitter", type: "text" },
      { name: "socialLinkedin", label: "LinkedIn", type: "text" },
      { name: "socialInstagram", label: "Instagram", type: "text" },
      { name: "socialGithub", label: "GitHub", type: "text" },
      { name: "socialYoutube", label: "YouTube", type: "text" },
    ],
  },
  about: {
    title: "About Section",
    listKey: "about",
    singleton: true,
    load: () => adminApi.about(),
    save: (payload) => adminApi.updateAbout(payload),
    fromItem: createAboutForm,
    toPayload: (form) => ({
      eyebrow: form.eyebrow,
      title: form.title,
      description: form.description,
      image: form.image,
      stats: [
        { label: "Total Projects", value: form.projectCount },
        { label: "Years of Experience", value: form.experienceYears },
      ],
    }),
    fields: [
      { name: "eyebrow", label: "Eyebrow", type: "text" },
      { name: "title", label: "Title", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "image", label: "Image URL", type: "text" },
      { name: "projectCount", label: "Project Count", type: "text" },
      { name: "experienceYears", label: "Experience Years", type: "text" },
    ],
  },
  services: {
    title: "Services",
    listKey: "services",
    singleton: false,
    load: () => adminApi.services(),
    create: (payload) => adminApi.serviceCreate(payload),
    update: (id, payload) => adminApi.serviceUpdate(id, payload),
    remove: (id) => adminApi.serviceDelete(id),
    fromItem: createServiceForm,
    toPayload: (form) => ({
      title: form.title,
      shortDescription: form.shortDescription,
      description: form.description,
      heading: form.heading,
      image: form.image,
      icon: form.icon,
      iconBg: form.iconBg,
      priceFrom: form.priceFrom,
      featured: Boolean(form.featured),
      visible: Boolean(form.visible),
      order: Number(form.order || 0),
    }),
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "shortDescription", label: "Short Description", type: "textarea" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "heading", label: "Heading", type: "text" },
      { name: "image", label: "Image URL", type: "text" },
      { name: "icon", label: "Icon URL", type: "text" },
      { name: "iconBg", label: "Icon Background URL", type: "text" },
      { name: "priceFrom", label: "Price From", type: "text" },
      { name: "featured", label: "Featured", type: "checkbox" },
      { name: "visible", label: "Visible", type: "checkbox" },
      { name: "order", label: "Order", type: "number" },
    ],
  },
  projects: {
    title: "Projects",
    listKey: "projects",
    singleton: false,
    load: () => adminApi.projects(),
    create: (payload) => adminApi.projectCreate(payload),
    update: (id, payload) => adminApi.projectUpdate(id, payload),
    remove: (id) => adminApi.projectDelete(id),
    fromItem: createProjectForm,
    toPayload: (form) => ({
      title: form.title,
      category: form.category,
      description: form.description,
      image: form.image,
      liveDemo: form.liveDemo,
      sourceCode: form.sourceCode,
      featured: Boolean(form.featured),
      visible: Boolean(form.visible),
      order: Number(form.order || 0),
    }),
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "category", label: "Category", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "image", label: "Image URL", type: "text" },
      { name: "liveDemo", label: "Live Demo", type: "url" },
      { name: "sourceCode", label: "Source Code", type: "url" },
      { name: "featured", label: "Featured", type: "checkbox" },
      { name: "visible", label: "Visible", type: "checkbox" },
      { name: "order", label: "Order", type: "number" },
    ],
  },
  testimonials: {
    title: "Testimonials",
    listKey: "testimonials",
    singleton: false,
    load: () => adminApi.testimonials(),
    create: (payload) => adminApi.testimonialCreate(payload),
    update: (id, payload) => adminApi.testimonialUpdate(id, payload),
    remove: (id) => adminApi.testimonialDelete(id),
    fromItem: createTestimonialForm,
    toPayload: (form) => ({
      name: form.name,
      role: form.role,
      company: form.company,
      service: form.service,
      avatar: form.avatar,
      quote: form.quote,
      rating: Number(form.rating || 5),
      visible: Boolean(form.visible),
      order: Number(form.order || 0),
    }),
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "role", label: "Role", type: "text" },
      { name: "company", label: "Company", type: "text" },
      { name: "service", label: "Service", type: "text" },
      { name: "avatar", label: "Avatar URL", type: "text" },
      { name: "quote", label: "Quote", type: "textarea" },
      { name: "rating", label: "Rating", type: "number" },
      { name: "visible", label: "Visible", type: "checkbox" },
      { name: "order", label: "Order", type: "number" },
    ],
  },
  blogs: {
    title: "Blogs",
    listKey: "blogs",
    singleton: false,
    load: () => adminApi.blogs(),
    create: (payload) => adminApi.blogCreate(payload),
    update: (id, payload) => adminApi.blogUpdate(id, payload),
    remove: (id) => adminApi.blogDelete(id),
    fromItem: createBlogForm,
    toPayload: (form) => ({
      title: form.title,
      category: form.category,
      excerpt: form.excerpt,
      content: form.content,
      image: form.image,
      author: form.author,
      published: Boolean(form.published),
      visible: Boolean(form.visible),
      publishedAt: form.publishedAt || undefined,
      order: Number(form.order || 0),
    }),
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "category", label: "Category", type: "text" },
      { name: "excerpt", label: "Excerpt", type: "textarea" },
      { name: "content", label: "Content", type: "textarea" },
      { name: "image", label: "Image URL", type: "text" },
      { name: "author", label: "Author", type: "text" },
      { name: "publishedAt", label: "Published Date", type: "date" },
      { name: "published", label: "Published", type: "checkbox" },
      { name: "visible", label: "Visible", type: "checkbox" },
      { name: "order", label: "Order", type: "number" },
    ],
  },
  timeline: {
    title: "Timeline",
    listKey: "timeline",
    singleton: false,
    load: () => adminApi.timeline(),
    create: (payload) => adminApi.timelineCreate(payload),
    update: (id, payload) => adminApi.timelineUpdate(id, payload),
    remove: (id) => adminApi.timelineDelete(id),
    fromItem: createTimelineForm,
    toPayload: (form) => ({
      section: form.section,
      year: form.year,
      college: form.college,
      degree: form.degree,
      description: form.description,
      visible: Boolean(form.visible),
      order: Number(form.order || 0),
    }),
    fields: [
      {
        name: "section",
        label: "Section",
        type: "select",
        options: [
          { label: "Education", value: "education" },
          { label: "Experience", value: "experience" },
        ],
      },
      { name: "year", label: "Year", type: "text" },
      { name: "college", label: "College / Company", type: "text" },
      { name: "degree", label: "Degree / Role", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "visible", label: "Visible", type: "checkbox" },
      { name: "order", label: "Order", type: "number" },
    ],
  },
};

const readOnlySections = {
  contacts: {
    title: "Contacts",
    load: () => adminApi.contacts(),
    rows: (items, onAction) =>
      items.map((item) => (
        <div key={item._id} className="admin-card-row">
          <div>
            <strong>{item.name}</strong>
            <p>{item.subject}</p>
            <span>{item.email}</span>
          </div>
          <div className="admin-row-actions">
            <button type="button" onClick={() => onAction(item._id, "read")}>Mark Read</button>
            <button type="button" onClick={() => onAction(item._id, "replied")}>Replied</button>
          </div>
        </div>
      )),
  },
  newsletter: {
    title: "Newsletter",
    load: () => adminApi.newsletter(),
    rows: (items, onDelete) =>
      items.map((item) => (
        <div key={item._id} className="admin-card-row">
          <div>
            <strong>{item.email}</strong>
            <p>Status: {item.status}</p>
          </div>
          <div className="admin-row-actions">
            <button type="button" onClick={() => onDelete(item._id)}>Delete</button>
          </div>
        </div>
      )),
  },
};

const fieldControl = (field, value, onChange) => {
  if (field.type === "checkbox") {
    return (
      <label className="admin-checkbox">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(field.name, e.target.checked)}
        />
        <span>{field.label}</span>
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <label className="admin-field">
        <span>{field.label}</span>
        <select
          value={value ?? ""}
          onChange={(e) => onChange(field.name, e.target.value)}
        >
          {(field.options || []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.type === "textarea") {
    return (
      <label className="admin-field">
        <span>{field.label}</span>
        <textarea
          rows={field.rows || 4}
          value={value ?? ""}
          onChange={(e) => onChange(field.name, e.target.value)}
          placeholder={field.placeholder || field.label}
        />
      </label>
    );
  }

  return (
    <label className="admin-field">
      <span>{field.label}</span>
      <input
        type={field.type || "text"}
        value={value ?? ""}
        onChange={(e) => onChange(field.name, e.target.value)}
        placeholder={field.placeholder || field.label}
      />
    </label>
  );
};

function AdminApp() {
  const [authenticated, setAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [dashboard, setDashboard] = useState(null);
  const [collections, setCollections] = useState({});
  const [activeSection, setActiveSection] = useState("dashboard");
  const [activeItemId, setActiveItemId] = useState(null);
  const [formState, setFormState] = useState(emptyForms.services);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadAdminData = async () => {
    const requests = await Promise.all([
      adminApi.dashboard(),
      adminApi.siteSettings(),
      adminApi.about(),
      adminApi.services(),
      adminApi.projects(),
      adminApi.testimonials(),
      adminApi.blogs(),
      adminApi.timeline(),
      adminApi.contacts(),
      adminApi.newsletter(),
    ]);

    const [dash, siteSettings, about, services, projects, testimonials, blogs, timeline, contacts, newsletter] = requests;
    setDashboard(dash);
    setCollections({
      "site-settings": siteSettings,
      about,
      services,
      projects,
      testimonials,
      blogs,
      timeline,
      contacts,
      newsletter,
    });
  };

  const bootstrapAuth = async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    try {
      const session = await authApi.me();
      setAdmin(session.admin);
      setAuthenticated(true);
      await loadAdminData();
    } catch (_err) {
      localStorage.removeItem("admin_token");
    }
  };

  useEffect(() => {
    bootstrapAuth();
  }, []);

  const currentConfig = useMemo(
    () => sectionConfigs[activeSection] || null,
    [activeSection],
  );

  const currentList = collections[activeSection] || [];

  const showNotice = (message) => {
    setNotice(message);
    setTimeout(() => setNotice(""), 2500);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await authApi.login(loginForm);
      localStorage.setItem("admin_token", data.token);
      setAdmin(data.admin);
      setAuthenticated(true);
      await loadAdminData();
      setActiveSection("dashboard");
      showNotice("Logged in successfully");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (_err) {
      // ignore logout errors
    }
    localStorage.removeItem("admin_token");
    setAuthenticated(false);
    setAdmin(null);
    setCollections({});
    setDashboard(null);
    setActiveSection("dashboard");
  };

  const handleSelectSection = (section) => {
    setActiveSection(section);
    setActiveItemId(null);
    const config = sectionConfigs[section];
    if (config?.singleton) {
      const data = collections[section] || null;
      const value = config.fromItem(data || {});
      setFormState(value);
      return;
    }
    if (config) {
      setFormState(config.fromItem({}));
      return;
    }
    setFormState({});
  };

  useEffect(() => {
    if (!authenticated) return;
    const config = sectionConfigs[activeSection];
    if (config?.singleton) {
      const data = collections[activeSection] || null;
      setFormState(config.fromItem(data || {}));
    }
  }, [activeSection, authenticated, collections]);

  const handleNew = () => {
    const config = sectionConfigs[activeSection];
    if (!config) return;
    setActiveItemId(null);
    setFormState(config.fromItem({}));
  };

  const handleEdit = (item) => {
    const config = sectionConfigs[activeSection];
    if (!config) return;
    setActiveItemId(item._id);
    setFormState(config.fromItem(item));
  };

  const updateField = (name, value) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const config = sectionConfigs[activeSection];
    if (!config) return;

    setLoading(true);
    setError("");

    try {
      const payload = config.toPayload(formState);
      if (config.singleton) {
        await config.save(payload);
      } else if (activeItemId) {
        await config.update(activeItemId, payload);
      } else {
        await config.create(payload);
      }
      await loadAdminData();
      setActiveItemId(null);
      showNotice(`${config.title} saved successfully`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {
    const config = sectionConfigs[activeSection];
    if (!config || config.singleton) return;

    const confirmed = window.confirm(`Delete this ${config.title.slice(0, -1).toLowerCase()}?`);
    if (!confirmed) return;

    setLoading(true);
    setError("");
    try {
      await config.remove(item._id);
      await loadAdminData();
      showNotice(`${config.title.slice(0, -1)} deleted`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleContactStatus = async (id, status) => {
    setLoading(true);
    try {
      await adminApi.updateContactStatus(id, status);
      await loadAdminData();
      showNotice(`Contact marked as ${status}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNewsletterDelete = async (id) => {
    setLoading(true);
    try {
      await adminApi.newsletterDelete(id);
      await loadAdminData();
      showNotice("Subscriber removed");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="admin-shell auth-shell">
        <div className="auth-card">
          <div className="auth-header">
            <p className="eyebrow">Portfolio Admin</p>
            <h1>Sign in to manage content</h1>
            <p>Update services, projects, blogs, testimonials, timeline, and site settings from one place.</p>
          </div>

          <form className="auth-form" onSubmit={handleLogin}>
            <label>
              <span>Email</span>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="admin@example.com"
                required
              />
            </label>
            <label>
              <span>Password</span>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="Password"
                required
              />
            </label>
            {error ? <div className="admin-alert admin-error">{error}</div> : null}
            <button type="submit" className="admin-button" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <p>Portfolio CMS</p>
          <h2>Admin Panel</h2>
          <span>{admin?.name}</span>
        </div>

        <nav className="admin-nav">
          {sectionOrder.map((section) => (
            <button
              key={section}
              className={activeSection === section ? "active" : ""}
              onClick={() => handleSelectSection(section)}
              type="button"
            >
              {sectionLabels[section]}
            </button>
          ))}
        </nav>

        <button type="button" className="admin-logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h1>{sectionLabels[activeSection]}</h1>
          </div>
          <div className="admin-topbar-actions">
            <button type="button" className="admin-button secondary" onClick={loadAdminData}>
              Refresh
            </button>
          </div>
        </header>

        {notice ? <div className="admin-alert admin-success">{notice}</div> : null}
        {error ? <div className="admin-alert admin-error">{error}</div> : null}

        {activeSection === "dashboard" ? (
          <div className="admin-dashboard">
            <div className="stat-grid">
              {[
                ["Services", dashboard?.services],
                ["Projects", dashboard?.projects],
                ["Blogs", dashboard?.blogs],
                ["Testimonials", dashboard?.testimonials],
                ["Timeline", dashboard?.timeline],
                ["Contacts", dashboard?.contacts],
              ].map(([label, value]) => (
                <article key={label} className="stat-card">
                  <span>{label}</span>
                  <strong>{value ?? 0}</strong>
                </article>
              ))}
            </div>

            <div className="admin-double-grid">
              <section className="admin-panel">
                <h3>Quick Content Snapshot</h3>
                <p>Update your website content directly from the sidebar sections.</p>
                <div className="snapshot-list">
                  <div><span>New Messages</span><strong>{dashboard?.newMessages ?? 0}</strong></div>
                  <div><span>Subscribers</span><strong>{dashboard?.newSubscribers ?? 0}</strong></div>
                  <div><span>Hero Name</span><strong>{dashboard?.siteSettings?.heroName || "Unset"}</strong></div>
                  <div><span>About Title</span><strong>{dashboard?.about?.title || "Unset"}</strong></div>
                </div>
              </section>

              <section className="admin-panel">
                <h3>Admin Tips</h3>
                <ul className="tips-list">
                  <li>Keep your homepage content short and strong.</li>
                  <li>Mark only the best work as featured.</li>
                  <li>Use visible toggles to hide unfinished items.</li>
                  <li>Publish blogs only after content review.</li>
                </ul>
              </section>
            </div>
          </div>
        ) : activeSection === "contacts" ? (
          <section className="admin-panel">
            <div className="panel-head">
              <div>
                <h3>Incoming Leads</h3>
                <p>Mark messages as read or replied.</p>
              </div>
            </div>
            <div className="admin-list">
              {safeArray(collections.contacts).length
                ? readOnlySections.contacts.rows(safeArray(collections.contacts), handleContactStatus)
                : <p className="empty-state">No contact messages yet.</p>}
            </div>
          </section>
        ) : activeSection === "newsletter" ? (
          <section className="admin-panel">
            <div className="panel-head">
              <div>
                <h3>Newsletter Subscribers</h3>
                <p>Manage the people subscribed from the website.</p>
              </div>
            </div>
            <div className="admin-list">
              {safeArray(collections.newsletter).length
                ? readOnlySections.newsletter.rows(safeArray(collections.newsletter), handleNewsletterDelete)
                : <p className="empty-state">No subscribers yet.</p>}
            </div>
          </section>
        ) : currentConfig ? (
          <div className="admin-editor-grid">
            <section className="admin-panel">
              <div className="panel-head">
                <div>
                  <h3>{currentConfig.title}</h3>
                  <p>
                    {currentConfig.singleton
                      ? "This section has one main record."
                      : "Create, edit, or delete records from here."}
                  </p>
                </div>
                {!currentConfig.singleton ? (
                  <button type="button" className="admin-button secondary" onClick={handleNew}>
                    New Item
                  </button>
                ) : null}
              </div>

              <form className="admin-form" onSubmit={handleSave}>
                <div className="form-grid">
                  {currentConfig.fields.map((field) =>
                    fieldControl(field, formState[field.name], updateField)
                  )}
                </div>
                <button type="submit" className="admin-button" disabled={loading}>
                  {loading ? "Saving..." : activeItemId ? "Update" : "Save"}
                </button>
              </form>
            </section>

            <section className="admin-panel">
              <div className="panel-head">
                <div>
                  <h3>Saved Items</h3>
                  <p>Click any card to edit it.</p>
                </div>
              </div>

              <div className="admin-list">
                {safeArray(currentList).length ? (
                  safeArray(currentList).map((item) => (
                    <article key={item._id} className={`admin-item ${activeItemId === item._id ? "active" : ""}`}>
                      <button type="button" className="admin-item-main" onClick={() => handleEdit(item)}>
                        <strong>{item.title || item.name || item.year || item.email || "Untitled"}</strong>
                        <p>
                          {item.shortDescription || item.excerpt || item.description || item.subject || item.category || item.section}
                        </p>
                      </button>
                      {!currentConfig.singleton ? (
                        <div className="admin-item-actions">
                          <button type="button" onClick={() => handleEdit(item)}>Edit</button>
                          <button type="button" onClick={() => handleDelete(item)}>Delete</button>
                        </div>
                      ) : null}
                    </article>
                  ))
                ) : (
                  <p className="empty-state">No records available.</p>
                )}
              </div>
            </section>
          </div>
        ) : null}
      </main>
    </div>
  );
}

export default AdminApp;
