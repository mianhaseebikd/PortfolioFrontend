import { useEffect, useMemo, useRef, useState } from "react";
import {
  FiArrowRight,
  FiBriefcase,
  FiClock,
  FiCheck,
  FiChevronLeft,
  FiEdit3,
  FiFileText,
  FiFolder,
  FiGrid,
  FiBold,
  FiEye,
  FiEyeOff,
  FiImage,
  FiLock,
  FiLogOut,
  FiMail,
  FiMessageSquare,
  FiMoon,
  FiList,
  FiLayers,
  FiItalic,
  FiPlus,
  FiRefreshCw,
  FiSave,
  FiSettings,
  FiShield,
  FiTrash2,
  FiTrendingUp,
  FiUnderline,
  FiUpload,
  FiTag,
  FiUser,
  FiUsers,
  FiSun,
} from "react-icons/fi";
import { adminApi, authApi } from "../lib/api.js";
import "./admin-panel.css";

const sectionOrder = [
  "dashboard",
  "analytics",
  "profile",
  "admin-users",
  "site-settings",
  "about",
  "processes",
  "skills",
  "companies",
  "services",
  "service-categories",
  "projects",
  "project-categories",
  "testimonials",
  "blogs",
  "blog-categories",
  "timeline",
  "contacts",
  "newsletter",
];

const sectionLabels = {
  dashboard: "Dashboard",
  analytics: "Analytics",
  profile: "Profile",
  "admin-users": "Admin Users",
  "site-settings": "Site Settings",
  about: "About",
  processes: "Process",
  skills: "Skills",
  companies: "Companies",
  services: "Services",
  "service-categories": "Service Categories",
  projects: "Projects",
  "project-categories": "Project Categories",
  testimonials: "Testimonials",
  blogs: "Blogs",
  "blog-categories": "Blog Categories",
  timeline: "Timeline",
  contacts: "Contacts",
  newsletter: "Newsletter",
};

const sectionAccessMap = {
  dashboard: "dashboard",
  analytics: "dashboard",
  profile: null,
  "admin-users": "admins",
  "site-settings": "site-settings",
  about: "about",
  processes: "processes",
  skills: "skills",
  companies: "companies",
  services: "services",
  "service-categories": "services",
  projects: "projects",
  "project-categories": "projects",
  testimonials: "testimonials",
  blogs: "blogs",
  "blog-categories": "blogs",
  timeline: "timeline",
  contacts: "contacts",
  newsletter: "newsletter",
};

const allowedSectionOptions = [
  { label: "Dashboard", value: "dashboard" },
  { label: "Analytics", value: "analytics" },
  { label: "Admin Users", value: "admins" },
  { label: "Site Settings", value: "site-settings" },
  { label: "About", value: "about" },
  { label: "Process", value: "processes" },
  { label: "Skills", value: "skills" },
  { label: "Companies", value: "companies" },
  { label: "Services", value: "services" },
  { label: "Projects", value: "projects" },
  { label: "Testimonials", value: "testimonials" },
  { label: "Blogs", value: "blogs" },
  { label: "Timeline", value: "timeline" },
  { label: "Contacts", value: "contacts" },
  { label: "Newsletter", value: "newsletter" },
];

const serviceCategoryFallbackOptions = [
  { label: "Development", value: "Development" },
  { label: "Design", value: "Design" },
  { label: "Ecommerce", value: "Ecommerce" },
  { label: "Marketing", value: "Marketing" },
];

const projectCategoryFallbackOptions = [
  { label: "Web", value: "Web" },
  { label: "Design", value: "Design" },
  { label: "App", value: "App" },
  { label: "Branding", value: "Branding" },
];

const blogCategoryFallbackOptions = [
  { label: "Development", value: "Development" },
  { label: "Design", value: "Design" },
  { label: "WordPress", value: "WordPress" },
  { label: "Ecommerce", value: "Ecommerce" },
  { label: "Freelancing", value: "Freelancing" },
  { label: "Marketing", value: "Marketing" },
];

const companyIconOptions = [
  { label: "WordPress", value: "WordPress" },
  { label: "Shopify", value: "Shopify" },
  { label: "Fiverr", value: "Fiverr" },
  { label: "Upwork", value: "Upwork" },
  { label: "WooCommerce", value: "WooCommerce" },
  { label: "Elementor", value: "Elementor" },
  { label: "Figma", value: "Figma" },
  { label: "React", value: "React" },
];

const sectionIcons = {
  dashboard: FiGrid,
  analytics: FiTrendingUp,
  profile: FiUser,
  "admin-users": FiShield,
  "site-settings": FiSettings,
  about: FiFileText,
  processes: FiLayers,
  skills: FiTrendingUp,
  companies: FiUsers,
  services: FiBriefcase,
  "service-categories": FiTag,
  projects: FiFolder,
  "project-categories": FiTag,
  testimonials: FiMessageSquare,
  blogs: FiFileText,
  "blog-categories": FiTag,
  timeline: FiClock,
  contacts: FiMail,
  newsletter: FiMail,
};

const sidebarGroups = [
  {
    key: "dashboard",
    label: "Dashboard",
    sections: ["dashboard", "analytics", "profile", "admin-users", "site-settings", "about", "processes", "skills", "companies"],
  },
  {
    key: "services",
    label: "Services",
    sections: ["services", "service-categories"],
  },
  {
    key: "projects",
    label: "Projects",
    sections: ["projects", "project-categories"],
  },
  {
    key: "blogs",
    label: "Blogs",
    sections: ["blogs", "blog-categories"],
  },
  {
    key: "testimonials",
    label: "Testimonials",
    sections: ["testimonials"],
  },
  {
    key: "timeline",
    label: "Timeline",
    sections: ["timeline"],
  },
  {
    key: "contacts",
    label: "Contacts",
    sections: ["contacts"],
  },
  {
    key: "newsletter",
    label: "Newsletter",
    sections: ["newsletter"],
  },
];

const DEFAULT_ADMIN_AVATAR =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#f97316"/>
          <stop offset="100%" stop-color="#fb7185"/>
        </linearGradient>
      </defs>
      <rect width="128" height="128" rx="28" fill="#0f172a"/>
      <circle cx="64" cy="50" r="26" fill="url(#g)"/>
      <path d="M28 110c6-20 24-32 36-32s30 12 36 32" fill="url(#g)"/>
    </svg>
  `);

const authHighlights = [
  { label: "Content", value: "10+ modules" },
  { label: "Access", value: "Role based" },
  { label: "Media", value: "URL + upload" },
  { label: "Route", value: "admin subdomain" },
];

const authChecklist = [
  "Manage services, projects, testimonials, and blogs",
  "Update site settings and your personal profile",
  "Add admins and control access sections",
];

const formatUpdatedAt = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getItemTitle = (item = {}) =>
  item.title || item.name || item.year || item.email || item.siteName || "Untitled";

const getItemDescription = (item = {}) =>
  stripHtml(
    item.shortDescription ||
    item.excerpt ||
      item.text ||
      item.description ||
      item.subject ||
      item.category ||
      item.section ||
      String(item.value ?? "").trim() ||
      "No description available",
  );

const getItemMetaSummary = (item = {}) => {
  const parts = [];

  if (item.slug) parts.push(`Slug: ${item.slug}`);
  if (item.service) parts.push(`Service: ${item.service}`);
  if (item.iconName) parts.push(`Icon: ${item.iconName}`);
  if (typeof item.value !== "undefined") parts.push(`Value: ${item.value}`);
  if (item.role) parts.push(`Role: ${item.role}`);
  if (item.status) parts.push(`Status: ${item.status}`);
  if (item.category) parts.push(`Category: ${item.category}`);
  if (item.section) parts.push(`Section: ${item.section}`);
  if (typeof item.rating === "number") parts.push(`Rating: ${item.rating}/5`);
  if (typeof item.order === "number") parts.push(`Order: ${item.order}`);
  if (item.isDefault) parts.push("Default");
  if (Object.prototype.hasOwnProperty.call(item, "published")) parts.push(item.published ? "Published" : "Draft");
  if (Object.prototype.hasOwnProperty.call(item, "visible")) parts.push(item.visible ? "Visible" : "Hidden");

  return parts.length ? parts.join(" | ") : "No extra details";
};

const getAvatarSrc = (value) => value || DEFAULT_ADMIN_AVATAR;

const getFileLabelFromValue = (value, fallback = "Uploaded file") => {
  if (!value) return fallback;
  const raw = String(value).trim();
  if (!raw || raw.startsWith("data:")) return fallback;

  try {
    const cleaned = raw.split("?")[0].split("#")[0];
    const parts = cleaned.split("/").filter(Boolean);
    return decodeURIComponent(parts[parts.length - 1] || fallback);
  } catch (_error) {
    return fallback;
  }
};

const stripHtml = (value = "") =>
  String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const isTruthy = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return ["true", "1", "yes", "on"].includes(normalized);
  }
  return Boolean(value);
};

const splitSections = (value) =>
  String(value || "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

const normalizeSelectedSections = (value = []) =>
  [...new Set((Array.isArray(value) ? value : []).map((section) => String(section).trim()).filter(Boolean))];

const toDateInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};

const imageToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const runWithMinDuration = async (task, minMs = 500) => {
  const startedAt = Date.now();
  try {
    return await task();
  } finally {
    const elapsed = Date.now() - startedAt;
    if (elapsed < minMs) {
      await sleep(minMs - elapsed);
    }
  }
};

function SafeImage({ src, alt, fallback = DEFAULT_ADMIN_AVATAR, className }) {
  const [currentSrc, setCurrentSrc] = useState(src || fallback);

  useEffect(() => {
    setCurrentSrc(src || fallback);
  }, [src, fallback]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (currentSrc !== fallback) setCurrentSrc(fallback);
      }}
    />
  );
}

function CompactRichTextEditor({ label, value, onChange, placeholder = "Write a short bio..." }) {
  const editorRef = useRef(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const nextValue = value || "";
    if (editor.innerHTML !== nextValue) {
      editor.innerHTML = nextValue;
    }
  }, [value]);

  const syncValue = () => {
    const editor = editorRef.current;
    if (!editor) return;
    onChange("bio", editor.innerHTML);
  };

  const runCommand = (command, valueArg = null) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    document.execCommand(command, false, valueArg);
    syncValue();
  };

  return (
    <div className="admin-field profile-bio-field">
      <span>{label}</span>
      <div className="rich-editor">
        <div className="rich-editor-toolbar" role="toolbar" aria-label="Bio formatting toolbar">
          <button type="button" className="rich-editor-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => runCommand("bold")} aria-label="Bold">
            <FiBold />
          </button>
          <button type="button" className="rich-editor-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => runCommand("italic")} aria-label="Italic">
            <FiItalic />
          </button>
          <button type="button" className="rich-editor-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => runCommand("underline")} aria-label="Underline">
            <FiUnderline />
          </button>
          <button type="button" className="rich-editor-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => runCommand("insertUnorderedList")} aria-label="Bulleted list">
            <FiList />
          </button>
          <button type="button" className="rich-editor-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => runCommand("insertOrderedList")} aria-label="Numbered list">
            <span className="rich-editor-text-icon">1.</span>
          </button>
          <button type="button" className="rich-editor-btn" onMouseDown={(e) => e.preventDefault()} onClick={() => runCommand("removeFormat")} aria-label="Clear formatting">
            <FiTrash2 />
          </button>
        </div>
        <div
          ref={editorRef}
          className="rich-editor-area"
          contentEditable
          suppressContentEditableWarning
          spellCheck="true"
          data-placeholder={placeholder}
          onInput={syncValue}
          onBlur={syncValue}
        />
      </div>
    </div>
  );
}

function AdvancedRichTextEditor({
  label,
  value,
  onChange,
  fieldName = "content",
  placeholder = "Write structured content with headings, tables, and lists...",
}) {
  const editorRef = useRef(null);
  const imageInputRef = useRef(null);
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [sourceValue, setSourceValue] = useState(value || "");

  useEffect(() => {
    if (isSourceMode) {
      setSourceValue(value || "");
      return;
    }

    const editor = editorRef.current;
    if (!editor) return;

    const nextValue = value || "";
    if (editor.innerHTML !== nextValue) {
      editor.innerHTML = nextValue;
    }
  }, [value, isSourceMode]);

  const syncValue = () => {
    if (isSourceMode) {
      onChange(fieldName, sourceValue);
      return;
    }

    const editor = editorRef.current;
    if (!editor) return;
    onChange(fieldName, editor.innerHTML);
  };

  const focusEditor = () => {
    const editor = editorRef.current;
    if (!editor) return null;
    editor.focus();
    return editor;
  };

  const applyCommand = (command, valueArg = null) => {
    if (isSourceMode) return;
    if (!focusEditor()) return;
    document.execCommand(command, false, valueArg);
    syncValue();
  };

  const applyBlock = (tag) => {
    if (isSourceMode) return;
    if (!focusEditor()) return;
    document.execCommand("formatBlock", false, `<${tag}>`);
    syncValue();
  };

  const insertLink = () => {
    if (isSourceMode) return;
    if (!focusEditor()) return;
    const url = window.prompt("Enter link URL", "https://");
    if (!url) return;
    document.execCommand("createLink", false, url);
    syncValue();
  };

  const insertTable = () => {
    if (isSourceMode) return;
    if (!focusEditor()) return;
    const tableHtml = `
      <table>
        <thead>
          <tr>
            <th>Heading 1</th>
            <th>Heading 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Cell 1</td>
            <td>Cell 2</td>
          </tr>
          <tr>
            <td>Cell 3</td>
            <td>Cell 4</td>
          </tr>
        </tbody>
      </table>
    `;
    document.execCommand("insertHTML", false, tableHtml);
    syncValue();
  };

  const insertImage = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !editorRef.current || isSourceMode) return;

    const dataUrl = await imageToDataUrl(file);
    focusEditor();
    document.execCommand(
      "insertHTML",
      false,
      `<figure class="editor-image-wrap"><img src="${dataUrl}" alt="${file.name || "Inserted image"}" /></figure>`,
    );
    syncValue();
  };

  const clearContent = () => {
    if (isSourceMode) {
      setSourceValue("");
      onChange(fieldName, "");
      return;
    }

    const editor = editorRef.current;
    if (!editor) return;
    editor.innerHTML = "";
    syncValue();
  };

  const handleEditorKeyDown = (event) => {
    if (isSourceMode) return;

    const key = String(event.key || "").toLowerCase();
    const withMeta = event.ctrlKey || event.metaKey;

    if (!withMeta) return;

    const preventAndRun = (command, valueArg = null) => {
      event.preventDefault();
      applyCommand(command, valueArg);
    };

    if (!event.shiftKey && key === "b") return preventAndRun("bold");
    if (!event.shiftKey && key === "i") return preventAndRun("italic");
    if (!event.shiftKey && key === "u") return preventAndRun("underline");
    if (event.shiftKey && key === "7") return preventAndRun("insertOrderedList");
    if (event.shiftKey && key === "8") return preventAndRun("insertUnorderedList");
    if (event.shiftKey && key === "9") return preventAndRun("formatBlock", "<blockquote>");
  };

  const toggleSourceMode = () => {
    if (!isSourceMode) {
      const editor = editorRef.current;
      setSourceValue(editor?.innerHTML || value || "");
      setIsSourceMode(true);
      return;
    }

    onChange(fieldName, sourceValue);
    setIsSourceMode(false);
  };

  return (
    <div className="admin-field richtext-field">
      <span>{label}</span>
      <div className="rich-editor rich-editor-advanced">
        <div className="rich-editor-toolbar">
          <div className="rich-editor-group">
            <select
              className="rich-editor-select"
              defaultValue="p"
              disabled={isSourceMode}
              onChange={(e) => {
                const block = e.target.value;
                applyBlock(block === "p" ? "p" : block);
                e.target.value = "p";
              }}
              aria-label="Text style"
            >
              <option value="p">Paragraph</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
            </select>
          </div>
          <div className="rich-editor-group">
            <button type="button" className="rich-editor-btn" disabled={isSourceMode} onMouseDown={(e) => e.preventDefault()} onClick={() => applyCommand("bold")} aria-label="Bold" title="Bold (Ctrl+B)">
              <FiBold />
            </button>
            <button type="button" className="rich-editor-btn" disabled={isSourceMode} onMouseDown={(e) => e.preventDefault()} onClick={() => applyCommand("italic")} aria-label="Italic" title="Italic (Ctrl+I)">
              <FiItalic />
            </button>
            <button type="button" className="rich-editor-btn" disabled={isSourceMode} onMouseDown={(e) => e.preventDefault()} onClick={() => applyCommand("underline")} aria-label="Underline" title="Underline (Ctrl+U)">
              <FiUnderline />
            </button>
            <button type="button" className="rich-editor-btn" disabled={isSourceMode} onMouseDown={(e) => e.preventDefault()} onClick={() => applyCommand("strikeThrough")} aria-label="Strikethrough" title="Strikethrough">
              <span className="rich-editor-text-icon">S</span>
            </button>
          </div>
          <div className="rich-editor-group">
            <button type="button" className="rich-editor-btn" disabled={isSourceMode} onMouseDown={(e) => e.preventDefault()} onClick={() => applyCommand("insertUnorderedList")} aria-label="Bulleted list" title="Bulleted list (Ctrl+Shift+8)">
              <FiList />
            </button>
            <button type="button" className="rich-editor-btn" disabled={isSourceMode} onMouseDown={(e) => e.preventDefault()} onClick={() => applyCommand("insertOrderedList")} aria-label="Numbered list" title="Numbered list (Ctrl+Shift+7)">
              <span className="rich-editor-text-icon">1.</span>
            </button>
            <button type="button" className="rich-editor-btn" disabled={isSourceMode} onMouseDown={(e) => e.preventDefault()} onClick={() => applyCommand("formatBlock", "<blockquote>")} aria-label="Blockquote" title="Blockquote (Ctrl+Shift+9)">
              <span className="rich-editor-text-icon">"</span>
            </button>
          </div>
          <div className="rich-editor-group">
            <button type="button" className="rich-editor-btn" disabled={isSourceMode} onMouseDown={(e) => e.preventDefault()} onClick={insertLink} aria-label="Insert link" title="Insert link">
              <FiArrowRight />
            </button>
            <button type="button" className="rich-editor-btn" disabled={isSourceMode} onMouseDown={(e) => e.preventDefault()} onClick={insertTable} aria-label="Insert table" title="Insert table">
              <FiGrid />
            </button>
            <button type="button" className="rich-editor-btn" disabled={isSourceMode} onMouseDown={(e) => e.preventDefault()} onClick={() => imageInputRef.current?.click()} aria-label="Insert image" title="Insert image">
              <FiImage />
            </button>
            <button type="button" className="rich-editor-btn" onMouseDown={(e) => e.preventDefault()} onClick={clearContent} aria-label="Clear content" title="Clear content">
              <FiTrash2 />
            </button>
          </div>
          <div className="rich-editor-group rich-editor-group-end">
            <button type="button" className="rich-editor-mode-btn" onClick={toggleSourceMode}>
              {isSourceMode ? "Visual" : "HTML"}
            </button>
            <input ref={imageInputRef} type="file" accept="image/*" hidden onChange={insertImage} />
          </div>
        </div>
        <div className="rich-editor-shortcuts">
          Shortcuts: Ctrl+B bold, Ctrl+I italic, Ctrl+U underline, Ctrl+Shift+7 ordered list, Ctrl+Shift+8 bulleted list, Ctrl+Shift+9 blockquote.
        </div>
        {isSourceMode ? (
          <textarea
            className="rich-editor-source"
            value={sourceValue}
            spellCheck="false"
            placeholder="Edit HTML source..."
            onChange={(e) => {
              const next = e.target.value;
              setSourceValue(next);
              onChange(fieldName, next);
            }}
          />
        ) : (
          <div
            ref={editorRef}
            className="rich-editor-area rich-editor-area-lg"
            contentEditable
            suppressContentEditableWarning
            spellCheck="true"
            data-placeholder={placeholder}
            onInput={syncValue}
            onBlur={syncValue}
            onKeyDown={handleEditorKeyDown}
          />
        )}
      </div>
    </div>
  );
}

const getInitials = (name = "") =>
  String(name)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const createSiteSettingsForm = (item = {}) => ({
  siteName: item.siteName ?? "",
  logoUrl: item.logoUrl ?? "",
  heroGreeting: item.heroGreeting ?? "",
  heroName: item.heroName ?? "",
  heroTitle: item.heroTitle ?? "",
  heroSubtitle: item.heroSubtitle ?? "",
  heroDescription: item.heroDescription ?? "",
  heroImage: item.heroImage ?? "",
  heroTagline: item.heroTagline ?? "",
  heroButtonLabel: item.heroButtonLabel ?? "",
  resumeButtonLabel: item.resumeButtonLabel ?? "",
  navHomeLabel: item.navHomeLabel ?? "",
  navAboutLabel: item.navAboutLabel ?? "",
  navResumeLabel: item.navResumeLabel ?? "",
  navPortfolioLabel: item.navPortfolioLabel ?? "",
  navServicesLabel: item.navServicesLabel ?? "",
  navBlogLabel: item.navBlogLabel ?? "",
  navContactLabel: item.navContactLabel ?? "",
  processTitle: item.processTitle ?? "",
  processSubtitle: item.processSubtitle ?? "",
  processDescription: item.processDescription ?? "",
  skillTitle: item.skillTitle ?? "",
  skillSubtitle: item.skillSubtitle ?? "",
  skillDescription: item.skillDescription ?? "",
  companiesTitle: item.companiesTitle ?? "",
  companiesSubtitle: item.companiesSubtitle ?? "",
  companiesDescription: item.companiesDescription ?? "",
  portfolioTitle: item.portfolioTitle ?? "",
  portfolioSubtitle: item.portfolioSubtitle ?? "",
  portfolioDescription: item.portfolioDescription ?? "",
  servicesTitle: item.servicesTitle ?? "",
  servicesSubtitle: item.servicesSubtitle ?? "",
  servicesDescription: item.servicesDescription ?? "",
  timelineTitle: item.timelineTitle ?? "",
  timelineSubtitle: item.timelineSubtitle ?? "",
  timelineDescription: item.timelineDescription ?? "",
  blogTitle: item.blogTitle ?? "",
  blogSubtitle: item.blogSubtitle ?? "",
  blogDescription: item.blogDescription ?? "",
  contactTitle: item.contactTitle ?? "",
  contactSubtitle: item.contactSubtitle ?? "",
  contactDescription: item.contactDescription ?? "",
  contactButtonLabel: item.contactButtonLabel ?? "",
  newsletterPre: item.newsletterPre ?? "",
  newsletterTitle: item.newsletterTitle ?? "",
  newsletterDescription: item.newsletterDescription ?? "",
  newsletterButtonLabel: item.newsletterButtonLabel ?? "",
  primaryPhone: item.primaryPhone ?? "",
  primaryEmail: item.primaryEmail ?? "",
  notificationEmail: item.notificationEmail ?? "",
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

const servicePackageDefaults = [
  { name: "Basic", price: "$99", note: "Best for getting started", features: ["", "", ""] },
  { name: "Standard", price: "$199", note: "Best value for most clients", features: ["", "", ""] },
  { name: "Premium", price: "$349", note: "Best for advanced scope", features: ["", "", ""] },
];

const normalizeServicePackages = (packages = [], priceFrom = "$99") => {
  const incoming = Array.isArray(packages) ? packages : [];
  return servicePackageDefaults.map((fallback, index) => {
    const source = incoming[index] || {};
    return {
      name: source.name ?? fallback.name,
      price: source.price ?? (index === 0 ? priceFrom : fallback.price),
      note: source.note ?? fallback.note,
      features: Array.isArray(source.features)
        ? [source.features[0] ?? "", source.features[1] ?? "", source.features[2] ?? ""]
        : fallback.features,
    };
  });
};

const createServiceForm = (item = {}) => ({
  title: item.title ?? "",
  category: item.category ?? "Development",
  shortDescription: item.shortDescription ?? "",
  description: item.description ?? "",
  heading: item.heading ?? "",
  image: item.image ?? "",
  icon: item.icon ?? "",
  iconBg: item.iconBg ?? "",
  priceFrom: item.priceFrom ?? "$99",
  packages: normalizeServicePackages(item.packages, item.priceFrom ?? "$99"),
  featured: isTruthy(item.featured),
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
  featured: isTruthy(item.featured),
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
  publishedAt: toDateInput(item.publishedAt),
  order: item.order ?? 0,
});

const createCategoryForm = (item = {}, type = "services") => ({
  name: item.name ?? "",
  slug: item.slug ?? "",
  description: item.description ?? "",
  visible: item.visible ?? true,
  order: item.order ?? 0,
  type,
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

const createAdminUserForm = (item = {}) => ({
  name: item.name ?? "",
  email: item.email ?? "",
  password: "",
  role: item.role ?? "editor",
  allowedSections: Array.isArray(item.allowedSections) ? normalizeSelectedSections(item.allowedSections) : [],
  active: item.active ?? true,
  avatarUrl: item.avatarUrl ?? "",
  jobTitle: item.jobTitle ?? "",
  bio: item.bio ?? "",
  phone: item.phone ?? "",
});

const createProfileForm = (item = {}) => ({
  name: item.name ?? "",
  jobTitle: item.jobTitle ?? "",
  bio: item.bio ?? "",
  phone: item.phone ?? "",
  avatarUrl: item.avatarUrl ?? "",
});

const createPasswordForm = () => ({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const createCategorySectionConfig = (title, type, singularTitle) => ({
  title,
  singularTitle,
  singleton: false,
  load: () => {
    if (type === "services") return adminApi.serviceCategories();
    if (type === "projects") return adminApi.projectCategories();
    return adminApi.blogCategories();
  },
  create: (payload) => {
    if (type === "services") return adminApi.serviceCategoryCreate(payload);
    if (type === "projects") return adminApi.projectCategoryCreate(payload);
    return adminApi.blogCategoryCreate(payload);
  },
  update: (id, payload) => {
    if (type === "services") return adminApi.serviceCategoryUpdate(id, payload);
    if (type === "projects") return adminApi.projectCategoryUpdate(id, payload);
    return adminApi.blogCategoryUpdate(id, payload);
  },
  remove: (id) => {
    if (type === "services") return adminApi.serviceCategoryDelete(id);
    if (type === "projects") return adminApi.projectCategoryDelete(id);
    return adminApi.blogCategoryDelete(id);
  },
  fromItem: (item) => createCategoryForm(item, type),
  toPayload: (form) => ({
    name: form.name,
    slug: form.slug,
    description: form.description,
    visible: isTruthy(form.visible),
    order: Number(form.order || 0),
  }),
  fields: [
    { name: "name", label: "Category Name", type: "text" },
    {
      name: "slug",
      label: "Slug",
      type: "text",
      placeholder: "Optional, auto-generated from the name",
      helpText: "Leave blank and the backend will generate a slug from the name.",
    },
    { name: "description", label: "Description", type: "textarea", rows: 4 },
    { name: "visible", label: "Visible", type: "checkbox" },
    { name: "order", label: "Order", type: "number" },
  ],
});

const createProcessForm = (item = {}) => ({
  title: item.title ?? "",
  text: item.text ?? "",
  bgImage: item.bgImage ?? "",
  iconImage: item.iconImage ?? "",
  visible: item.visible ?? true,
  order: item.order ?? 0,
});

const createSkillForm = (item = {}) => ({
  title: item.title ?? "",
  value: item.value ?? 0,
  visible: item.visible ?? true,
  order: item.order ?? 0,
});

const createCompanyForm = (item = {}) => ({
  name: item.name ?? "",
  iconName: item.iconName ?? "",
  logoUrl: item.logoUrl ?? "",
  visible: item.visible ?? true,
  order: item.order ?? 0,
});

const createListSectionConfig = ({
  title,
  singularTitle,
  load,
  create,
  update,
  remove,
  fromItem,
  toPayload,
  fields,
}) => ({
  title,
  singularTitle,
  singleton: false,
  load,
  create,
  update,
  remove,
  fromItem,
  toPayload,
  fields,
});

const sectionConfigs = {
  "site-settings": {
    title: "Site Settings",
    singleton: true,
    load: () => adminApi.siteSettings(),
    save: (payload) => adminApi.updateSiteSettings(payload),
    fromItem: createSiteSettingsForm,
    toPayload: (form) => ({
      siteName: form.siteName,
      logoUrl: form.logoUrl,
      heroGreeting: form.heroGreeting,
      heroName: form.heroName,
      heroTitle: form.heroTitle,
      heroSubtitle: form.heroSubtitle,
      heroDescription: form.heroDescription,
      heroImage: form.heroImage,
      heroTagline: form.heroTagline,
      heroButtonLabel: form.heroButtonLabel,
      resumeButtonLabel: form.resumeButtonLabel,
      navHomeLabel: form.navHomeLabel,
      navAboutLabel: form.navAboutLabel,
      navResumeLabel: form.navResumeLabel,
      navPortfolioLabel: form.navPortfolioLabel,
      navServicesLabel: form.navServicesLabel,
      navBlogLabel: form.navBlogLabel,
      navContactLabel: form.navContactLabel,
      processTitle: form.processTitle,
      processSubtitle: form.processSubtitle,
      processDescription: form.processDescription,
      skillTitle: form.skillTitle,
      skillSubtitle: form.skillSubtitle,
      skillDescription: form.skillDescription,
      companiesTitle: form.companiesTitle,
      companiesSubtitle: form.companiesSubtitle,
      companiesDescription: form.companiesDescription,
      portfolioTitle: form.portfolioTitle,
      portfolioSubtitle: form.portfolioSubtitle,
      portfolioDescription: form.portfolioDescription,
      servicesTitle: form.servicesTitle,
      servicesSubtitle: form.servicesSubtitle,
      servicesDescription: form.servicesDescription,
      timelineTitle: form.timelineTitle,
      timelineSubtitle: form.timelineSubtitle,
      timelineDescription: form.timelineDescription,
      blogTitle: form.blogTitle,
      blogSubtitle: form.blogSubtitle,
      blogDescription: form.blogDescription,
      contactTitle: form.contactTitle,
      contactSubtitle: form.contactSubtitle,
      contactDescription: form.contactDescription,
      contactButtonLabel: form.contactButtonLabel,
      newsletterPre: form.newsletterPre,
      newsletterTitle: form.newsletterTitle,
      newsletterDescription: form.newsletterDescription,
      newsletterButtonLabel: form.newsletterButtonLabel,
      primaryPhone: form.primaryPhone,
      primaryEmail: form.primaryEmail,
      notificationEmail: form.notificationEmail,
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
      { name: "logoUrl", label: "Logo", type: "media" },
      { name: "heroGreeting", label: "Hero Greeting", type: "text" },
      { name: "heroName", label: "Hero Name", type: "text" },
      { name: "heroTitle", label: "Hero Title", type: "text" },
      { name: "heroSubtitle", label: "Hero Subtitle", type: "text" },
      { name: "heroDescription", label: "Hero Description", type: "richtext" },
      { name: "heroImage", label: "Hero Image", type: "media" },
      { name: "heroTagline", label: "Hero Tagline", type: "text" },
      { name: "heroButtonLabel", label: "Hero Button Label", type: "text" },
      { name: "resumeButtonLabel", label: "Resume Button Label", type: "text" },
      { name: "navHomeLabel", label: "Nav Home Label", type: "text" },
      { name: "navAboutLabel", label: "Nav About Label", type: "text" },
      { name: "navResumeLabel", label: "Nav Resume Label", type: "text" },
      { name: "navPortfolioLabel", label: "Nav Portfolio Label", type: "text" },
      { name: "navServicesLabel", label: "Nav Services Label", type: "text" },
      { name: "navBlogLabel", label: "Nav Blog Label", type: "text" },
      { name: "navContactLabel", label: "Nav Contact Label", type: "text" },
      { name: "processTitle", label: "Process Title", type: "text" },
      { name: "processSubtitle", label: "Process Subtitle", type: "text" },
      { name: "processDescription", label: "Process Description", type: "textarea" },
      { name: "skillTitle", label: "Skills Title", type: "text" },
      { name: "skillSubtitle", label: "Skills Subtitle", type: "text" },
      { name: "skillDescription", label: "Skills Description", type: "textarea" },
      { name: "companiesTitle", label: "Companies Title", type: "text" },
      { name: "companiesSubtitle", label: "Companies Subtitle", type: "text" },
      { name: "companiesDescription", label: "Companies Description", type: "textarea" },
      { name: "portfolioTitle", label: "Portfolio Title", type: "text" },
      { name: "portfolioSubtitle", label: "Portfolio Subtitle", type: "text" },
      { name: "portfolioDescription", label: "Portfolio Description", type: "textarea" },
      { name: "servicesTitle", label: "Services Title", type: "text" },
      { name: "servicesSubtitle", label: "Services Subtitle", type: "text" },
      { name: "servicesDescription", label: "Services Description", type: "textarea" },
      { name: "timelineTitle", label: "Timeline Title", type: "text" },
      { name: "timelineSubtitle", label: "Timeline Subtitle", type: "text" },
      { name: "timelineDescription", label: "Timeline Description", type: "textarea" },
      { name: "blogTitle", label: "Blog Title", type: "text" },
      { name: "blogSubtitle", label: "Blog Subtitle", type: "text" },
      { name: "blogDescription", label: "Blog Description", type: "textarea" },
      { name: "contactTitle", label: "Contact Title", type: "text" },
      { name: "contactSubtitle", label: "Contact Subtitle", type: "text" },
      { name: "contactDescription", label: "Contact Description", type: "textarea" },
      { name: "contactButtonLabel", label: "Contact Button Label", type: "text" },
      { name: "newsletterPre", label: "Newsletter Pretext", type: "text" },
      { name: "newsletterTitle", label: "Newsletter Title", type: "text" },
      { name: "newsletterDescription", label: "Newsletter Description", type: "textarea" },
      { name: "newsletterButtonLabel", label: "Newsletter Button Label", type: "text" },
      { name: "primaryPhone", label: "Primary Phone", type: "text" },
      { name: "primaryEmail", label: "Primary Email", type: "email" },
      { name: "notificationEmail", label: "Notification Email", type: "email" },
      { name: "address", label: "Address", type: "text" },
      { name: "whatsappNumber", label: "WhatsApp Number", type: "text" },
      { name: "resumeUrl", label: "CV / Resume", type: "file", accept: "application/pdf,.pdf", buttonLabel: "Upload CV", fileLabel: "CV uploaded", helpText: "PDF files only. Uploaded file is used for the public download button." },
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
    title: "About",
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
      { name: "description", label: "Description", type: "richtext" },
      { name: "image", label: "About Image", type: "media" },
      { name: "projectCount", label: "Project Count", type: "text" },
      { name: "experienceYears", label: "Experience Years", type: "text" },
    ],
  },
  processes: createListSectionConfig({
    title: "Process",
    singularTitle: "Process Item",
    load: () => adminApi.processes(),
    create: (payload) => adminApi.processCreate(payload),
    update: (id, payload) => adminApi.processUpdate(id, payload),
    remove: (id) => adminApi.processDelete(id),
    fromItem: createProcessForm,
    toPayload: (form) => ({
      title: form.title,
      text: form.text,
      bgImage: form.bgImage,
      iconImage: form.iconImage,
      visible: isTruthy(form.visible),
      order: Number(form.order || 0),
    }),
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "text", label: "Text", type: "textarea", rows: 4 },
      { name: "bgImage", label: "Background Image", type: "media" },
      { name: "iconImage", label: "Icon Image", type: "media" },
      { name: "visible", label: "Visible", type: "checkbox" },
      { name: "order", label: "Order", type: "number" },
    ],
  }),
  skills: createListSectionConfig({
    title: "Skills",
    singularTitle: "Skill",
    load: () => adminApi.skills(),
    create: (payload) => adminApi.skillCreate(payload),
    update: (id, payload) => adminApi.skillUpdate(id, payload),
    remove: (id) => adminApi.skillDelete(id),
    fromItem: createSkillForm,
    toPayload: (form) => ({
      title: form.title,
      value: Number(form.value || 0),
      visible: isTruthy(form.visible),
      order: Number(form.order || 0),
    }),
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "value", label: "Value", type: "number", placeholder: "Enter value from 0 to 100" },
      { name: "visible", label: "Visible", type: "checkbox" },
      { name: "order", label: "Order", type: "number" },
    ],
  }),
  companies: createListSectionConfig({
    title: "Companies",
    singularTitle: "Company",
    load: () => adminApi.companies(),
    create: (payload) => adminApi.companyCreate(payload),
    update: (id, payload) => adminApi.companyUpdate(id, payload),
    remove: (id) => adminApi.companyDelete(id),
    fromItem: createCompanyForm,
    toPayload: (form) => ({
      name: form.name,
      iconName: form.iconName,
      logoUrl: form.logoUrl,
      visible: isTruthy(form.visible),
      order: Number(form.order || 0),
    }),
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "iconName", label: "Icon Name", type: "combo", options: companyIconOptions, placeholder: "Type or select icon name" },
      { name: "logoUrl", label: "Logo", type: "media" },
      { name: "visible", label: "Visible", type: "checkbox" },
      { name: "order", label: "Order", type: "number" },
    ],
  }),
  services: {
    title: "Services",
    singleton: false,
    load: () => adminApi.services(),
    create: (payload) => adminApi.serviceCreate(payload),
    update: (id, payload) => adminApi.serviceUpdate(id, payload),
    remove: (id) => adminApi.serviceDelete(id),
    fromItem: createServiceForm,
    toPayload: (form) => ({
      title: form.title,
      category: form.category,
      shortDescription: form.shortDescription,
      description: form.description,
      heading: form.heading,
      image: form.image,
      icon: form.icon,
      iconBg: form.iconBg,
      priceFrom: form.priceFrom,
      packages: Array.isArray(form.packages)
        ? form.packages.map((pkg, index) => ({
            name: String(pkg?.name || ["Basic", "Standard", "Premium"][index] || "").trim(),
            price: String(pkg?.price || "").trim(),
            note: String(pkg?.note || "").trim(),
            features: Array.isArray(pkg?.features)
              ? pkg.features.map((feature) => String(feature || "").trim()).filter(Boolean)
              : [],
          }))
        : [],
      featured: isTruthy(form.featured),
      visible: isTruthy(form.visible),
      order: Number(form.order || 0),
    }),
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "category", label: "Category", type: "select", options: serviceCategoryFallbackOptions },
      { name: "shortDescription", label: "Short Description", type: "richtext" },
      { name: "description", label: "Description", type: "richtext" },
      { name: "heading", label: "Heading", type: "text" },
      { name: "image", label: "Image", type: "media" },
      { name: "icon", label: "Icon", type: "media" },
      { name: "iconBg", label: "Icon Background", type: "media" },
      { name: "priceFrom", label: "Price From", type: "text" },
      { name: "packages", label: "Packages", type: "packages" },
      { name: "featured", label: "Featured", type: "checkbox" },
      { name: "visible", label: "Visible", type: "checkbox" },
      { name: "order", label: "Order", type: "number" },
    ],
  },
  "service-categories": createCategorySectionConfig("Service Categories", "services", "Service Category"),
  projects: {
    title: "Projects",
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
      featured: isTruthy(form.featured),
      visible: isTruthy(form.visible),
      order: Number(form.order || 0),
    }),
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "category", label: "Category", type: "select", options: projectCategoryFallbackOptions },
      { name: "description", label: "Description", type: "richtext" },
      { name: "image", label: "Project Image", type: "media" },
      { name: "liveDemo", label: "Live Demo", type: "url" },
      { name: "sourceCode", label: "Source Code", type: "url" },
      { name: "featured", label: "Featured", type: "checkbox" },
      { name: "visible", label: "Visible", type: "checkbox" },
      { name: "order", label: "Order", type: "number" },
    ],
  },
  "project-categories": createCategorySectionConfig("Project Categories", "projects", "Project Category"),
  testimonials: {
    title: "Testimonials",
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
      visible: isTruthy(form.visible),
      order: Number(form.order || 0),
    }),
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "role", label: "Role", type: "text" },
      { name: "company", label: "Company", type: "text" },
      { name: "service", label: "Service Category", type: "select", options: serviceCategoryFallbackOptions, placeholder: "Select a service category" },
      { name: "avatar", label: "Avatar", type: "media" },
      { name: "quote", label: "Quote", type: "richtext" },
      { name: "rating", label: "Rating", type: "number" },
      { name: "visible", label: "Visible", type: "checkbox" },
      { name: "order", label: "Order", type: "number" },
    ],
  },
  blogs: {
    title: "Blogs",
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
      published: isTruthy(form.published),
      visible: isTruthy(form.visible),
      publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : undefined,
      order: Number(form.order || 0),
    }),
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "category", label: "Category", type: "select", options: blogCategoryFallbackOptions },
      { name: "excerpt", label: "Excerpt", type: "richtext" },
      { name: "content", label: "Content", type: "richtext" },
      { name: "image", label: "Featured Image", type: "media" },
      { name: "author", label: "Author", type: "text" },
      { name: "publishedAt", label: "Published Date", type: "date" },
      { name: "published", label: "Published", type: "checkbox" },
      { name: "visible", label: "Visible", type: "checkbox" },
      { name: "order", label: "Order", type: "number" },
    ],
  },
  "blog-categories": createCategorySectionConfig("Blog Categories", "blogs", "Blog Category"),
  timeline: {
    title: "Timeline",
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
      visible: isTruthy(form.visible),
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
      { name: "description", label: "Description", type: "richtext" },
      { name: "visible", label: "Visible", type: "checkbox" },
      { name: "order", label: "Order", type: "number" },
    ],
  },
  "admin-users": {
    title: "Admin Users",
    singleton: false,
    load: () => adminApi.adminUsers(),
    create: (payload) => adminApi.adminUserCreate(payload),
    update: (id, payload) => adminApi.adminUserUpdate(id, payload),
    remove: (id) => adminApi.adminUserDelete(id),
    fromItem: createAdminUserForm,
    toPayload: (form, activeId) => {
      const payload = {
        name: form.name,
        email: form.email,
        role: form.role,
        allowedSections: normalizeSelectedSections(form.allowedSections),
        active: isTruthy(form.active),
        avatarUrl: form.avatarUrl,
        jobTitle: form.jobTitle,
        bio: form.bio,
        phone: form.phone,
      };

      if (!activeId || String(form.password || "").trim()) {
        payload.password = String(form.password || "").trim();
      }

      return payload;
    },
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "email", label: "Email", type: "email" },
      { name: "password", label: "Password", type: "password", placeholder: "Leave blank to keep current password" },
      {
        name: "role",
        label: "Role",
        type: "select",
        options: [
          { label: "Superadmin", value: "superadmin" },
          { label: "Editor", value: "editor" },
          { label: "Viewer", value: "viewer" },
        ],
      },
      { name: "active", label: "Active", type: "checkbox" },
      { name: "jobTitle", label: "Job Title", type: "text" },
      { name: "phone", label: "Phone", type: "text" },
      {
        name: "allowedSections",
        label: "Allowed Sections",
        type: "multiselect",
        options: allowedSectionOptions,
        placeholder: "Select allowed sections",
      },
      { name: "avatarUrl", label: "Avatar", type: "media" },
      { name: "bio", label: "Bio", type: "richtext" },
    ],
  },
};

const readOnlySections = {
  contacts: {
    title: "Contacts",
    load: () => adminApi.contacts(),
    icon: FiMail,
    render: (items, onAction, isBusy = () => false) =>
      items.length ? (
        <div className="admin-table-shell">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Subject</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Received</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.subject}</td>
                  <td>{item.email}</td>
                  <td>{item.phone || "—"}</td>
                  <td>
                    <span className={`profile-status ${item.status === "new" ? "inactive" : "active"}`}>{item.status}</span>
                  </td>
                  <td>{formatUpdatedAt(item.createdAt) || "—"}</td>
                  <td>
                    <div className="admin-list-actions table-actions">
                      <button
                        type="button"
                        className="admin-button soft"
                        onClick={() => onAction(item._id, "read")}
                        disabled={isBusy(`contact:${item._id}:read`)}
                        aria-busy={isBusy(`contact:${item._id}:read`)}
                      >
                        {isBusy(`contact:${item._id}:read`) ? "Loading..." : "Mark Read"}
                      </button>
                      <button
                        type="button"
                        className="admin-button soft"
                        onClick={() => onAction(item._id, "replied")}
                        disabled={isBusy(`contact:${item._id}:replied`)}
                        aria-busy={isBusy(`contact:${item._id}:replied`)}
                      >
                        {isBusy(`contact:${item._id}:replied`) ? "Loading..." : "Replied"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="empty-state">No contact messages yet.</p>
      ),
  },
  newsletter: {
    title: "Newsletter",
    load: () => adminApi.newsletter(),
    icon: FiMail,
    render: (items, onDelete, isBusy = () => false) =>
      items.length ? (
        <div className="admin-table-shell">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Status</th>
                <th>Source</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>{item.email}</td>
                  <td>{item.status}</td>
                  <td>{item.source}</td>
                  <td>{formatUpdatedAt(item.createdAt) || "—"}</td>
                  <td>
                    <div className="admin-list-actions table-actions">
                      <button
                        type="button"
                        className="admin-button soft"
                        onClick={() => onDelete(item._id)}
                        disabled={isBusy(`newsletter:${item._id}`)}
                        aria-busy={isBusy(`newsletter:${item._id}`)}
                      >
                        {isBusy(`newsletter:${item._id}`) ? "Loading..." : "Remove"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="empty-state">No subscribers yet.</p>
      ),
  },
};

function Field({ field, value, onChange, onUpload }) {
  const multiselectRef = useRef(null);
  const [multiselectOpen, setMultiselectOpen] = useState(false);
  const isSquareMedia = /avatar|logo|icon/i.test(String(field.name || field.label || ""));
  const selectedValues = Array.isArray(value) ? value : [];
  const selectedLabels = (field.options || [])
    .filter((option) => selectedValues.includes(option.value))
    .map((option) => option.label);
  const helpNode = field.helpText ? <small className="admin-field-help">{field.helpText}</small> : null;

  useEffect(() => {
    if (field.type !== "multiselect") return undefined;

    const handleOutsideClick = (event) => {
      if (multiselectRef.current && !multiselectRef.current.contains(event.target)) {
        setMultiselectOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMultiselectOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [field.type]);

  if (field.type === "checkbox") {
    return (
      <label className="admin-field admin-checkbox">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(field.name, e.target.checked)}
        />
        <span>{field.label}</span>
      </label>
    );
  }

  if (field.type === "multiselect") {
    const toggleOption = (optionValue) => {
      const next = selectedValues.includes(optionValue)
        ? selectedValues.filter((item) => item !== optionValue)
        : [...selectedValues, optionValue];
      onChange(field.name, next);
    };

    return (
      <div className="admin-field admin-multiselect" ref={multiselectRef}>
        <span>{field.label}</span>
        <button
          type="button"
          className={`admin-multiselect-trigger ${multiselectOpen ? "is-open" : ""}`}
          onClick={() => setMultiselectOpen((open) => !open)}
          aria-expanded={multiselectOpen}
          aria-haspopup="listbox"
        >
          <span className="admin-multiselect-summary">
            {selectedLabels.length ? selectedLabels.join(", ") : field.placeholder || "Select options"}
          </span>
          <span className="admin-multiselect-caret" aria-hidden="true">
            v
          </span>
        </button>
        {multiselectOpen ? (
          <div className="admin-multiselect-panel" role="listbox" aria-multiselectable="true">
            <div className="admin-multiselect-options">
              {(field.options || []).map((option) => {
                const checked = selectedValues.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={`admin-multiselect-option ${checked ? "is-selected" : ""}`}
                    onClick={() => toggleOption(option.value)}
                    aria-pressed={checked}
                  >
                    <input type="checkbox" tabIndex={-1} checked={checked} readOnly />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
            <small className="admin-multiselect-note">Click to toggle sections on or off.</small>
          </div>
        ) : null}
        {helpNode}
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <label className="admin-field">
        <span>{field.label}</span>
        <select value={value ?? ""} onChange={(e) => onChange(field.name, e.target.value)}>
          <option value="">{field.placeholder || `Select ${field.label.toLowerCase()}`}</option>
          {(field.options || []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {helpNode}
      </label>
    );
  }

  if (field.type === "combo") {
    const listId = `${field.name}-options`;
    return (
      <label className="admin-field">
        <span>{field.label}</span>
        <div className="admin-combo">
          <input
            list={listId}
            value={value ?? ""}
            onChange={(e) => onChange(field.name, e.target.value)}
            placeholder={field.placeholder || field.label}
          />
          <datalist id={listId}>
            {(field.options || []).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </datalist>
        </div>
        {helpNode}
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
        {helpNode}
      </label>
    );
  }

  if (field.type === "richtext") {
    return (
      <AdvancedRichTextEditor
        label={field.label}
        value={value ?? ""}
        onChange={onChange}
        fieldName={field.name}
        placeholder={field.placeholder || field.label}
      />
    );
  }

  if (field.type === "packages") {
    const packageItems = Array.isArray(value) && value.length ? value : normalizeServicePackages([], "$99");
    const packageLabels = ["Basic", "Standard", "Premium"];

    const updatePackage = (index, key, nextValue) => {
      const nextPackages = packageItems.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: nextValue } : item
      );
      onChange(field.name, nextPackages);
    };

    const updatePackageFeature = (index, featureIndex, nextValue) => {
      const nextPackages = packageItems.map((item, itemIndex) => {
        if (itemIndex !== index) return item;
        const features = Array.isArray(item.features) ? [...item.features] : ["", "", ""];
        features[featureIndex] = nextValue;
        return { ...item, features };
      });
      onChange(field.name, nextPackages);
    };

    return (
      <div className="admin-field admin-packages-field">
        <span>{field.label}</span>
        <div className="admin-packages-grid">
          {packageItems.slice(0, 3).map((pkg, index) => (
            <div className="admin-package-editor" key={packageLabels[index] || index}>
              <div className="admin-package-editor-head">
                <div>
                  <strong>{packageLabels[index] || `Package ${index + 1}`}</strong>
                  <span>Pricing card</span>
                </div>
                <small>Package {index + 1}</small>
              </div>
              <div className="admin-package-mini-grid">
                <label className="admin-mini-field">
                  <span>Name</span>
                  <input
                    type="text"
                    value={pkg.name ?? ""}
                    onChange={(e) => updatePackage(index, "name", e.target.value)}
                    placeholder="Package name"
                  />
                </label>
                <label className="admin-mini-field">
                  <span>Price</span>
                  <input
                    type="text"
                    value={pkg.price ?? ""}
                    onChange={(e) => updatePackage(index, "price", e.target.value)}
                    placeholder="$99"
                  />
                </label>
              </div>
              <label className="admin-mini-field">
                <span>Note</span>
                <input
                  type="text"
                  value={pkg.note ?? ""}
                  onChange={(e) => updatePackage(index, "note", e.target.value)}
                  placeholder="Short package note"
                />
              </label>
              <div className="admin-package-mini-grid admin-package-features-grid">
                {[0, 1, 2].map((featureIndex) => (
                  <label className="admin-mini-field" key={`${index}-${featureIndex}`}>
                    <span>Feature {featureIndex + 1}</span>
                    <input
                      type="text"
                      value={pkg.features?.[featureIndex] ?? ""}
                      onChange={(e) => updatePackageFeature(index, featureIndex, e.target.value)}
                      placeholder={`Feature ${featureIndex + 1}`}
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        {helpNode}
      </div>
    );
  }

  if (field.type === "media") {
    const mediaLayoutClass = isSquareMedia ? "square-layout" : "full-layout";

    return (
      <label className="admin-field">
        <span>{field.label}</span>
        <div className={`admin-media ${mediaLayoutClass}`}>
          {value ? (
            <div className={`admin-media-preview ${isSquareMedia ? "square" : ""}`}>
              <SafeImage src={value} alt={field.label} />
            </div>
          ) : (
            <div className={`admin-media-placeholder ${isSquareMedia ? "square" : ""}`}>
              <FiImage />
              <span>No image selected</span>
            </div>
          )}
          <div className="admin-media-actions">
            <label className="admin-upload">
              <FiUpload />
              <span>Upload file</span>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const dataUrl = await imageToDataUrl(file);
                    onUpload(field.name, dataUrl);
                  }
                  e.target.value = "";
                }}
              />
            </label>
            <small className="admin-media-hint">Square images work best. Uploaded files stay in preview only.</small>
          </div>
        </div>
      </label>
    );
  }

  if (field.type === "file") {
    const fileLabel = getFileLabelFromValue(value, field.fileLabel || "Uploaded file");

    return (
      <label className="admin-field">
        <span>{field.label}</span>
        <div className="admin-file">
          <label className="admin-upload admin-upload-file">
            <FiUpload />
            <span>{field.buttonLabel || (value ? "Replace file" : "Upload file")}</span>
            <input
              type="file"
              accept={field.accept || "*/*"}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const dataUrl = await imageToDataUrl(file);
                  onUpload(field.name, dataUrl);
                }
                e.target.value = "";
              }}
            />
          </label>
          <div className="admin-file-meta">
            <strong>{value ? fileLabel : "No file selected"}</strong>
            <small>{field.helpText || "Upload a single file."}</small>
          </div>
        </div>
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
        {helpNode}
      </label>
    );
  }

function CardStat({ label, value, icon: Icon, detail }) {
  return (
    <article className="stat-card">
      <div className="stat-card-head">
        <span className="stat-card-inline">
          {Icon ? <Icon /> : null}
          <span>{label}</span>
        </span>
      </div>
      <strong>{value ?? 0}</strong>
      {detail ? <p>{detail}</p> : null}
    </article>
  );
}

function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("admin_theme") || "dark");
  const [dashboard, setDashboard] = useState(null);
  const [collections, setCollections] = useState({});
  const [activeSection, setActiveSection] = useState("dashboard");
  const [activeItemId, setActiveItemId] = useState(null);
  const [sectionScreen, setSectionScreen] = useState("list");
  const [formState, setFormState] = useState({});
  const [profileForm, setProfileForm] = useState(createProfileForm());
  const [passwordForm, setPasswordForm] = useState(createPasswordForm());
  const [contactReplyItem, setContactReplyItem] = useState(null);
  const [contactReplyBody, setContactReplyBody] = useState("");
  const [listFilters, setListFilters] = useState({
    processes: "all",
    skills: "all",
    companies: "all",
    services: "all",
    "service-categories": "all",
    projects: "all",
    "project-categories": "all",
    blogs: "all",
    "blog-categories": "all",
  });
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busyAction, setBusyAction] = useState(null);
  const [navOpenGroups, setNavOpenGroups] = useState({
    dashboard: true,
    services: true,
    projects: true,
    blogs: true,
    testimonials: true,
    timeline: true,
    contacts: true,
    newsletter: true,
  });

  const canAccessSection = (section, currentAdmin = admin) => {
    if (!currentAdmin) return section === "profile";
    if (section === "profile") return true;
    if (currentAdmin.role === "superadmin") return true;
    const backendKey = sectionAccessMap[section];
    const allowedSections = currentAdmin.allowedSections || [];
    const accessKeys =
      section === "dashboard" || section === "analytics"
        ? ["dashboard", "analytics"]
        : backendKey
          ? [backendKey]
          : [];
    return accessKeys.some((key) => allowedSections.includes(key));
  };

  const visibleSections = useMemo(
    () => sectionOrder.filter((section) => canAccessSection(section)),
    [admin],
  );

  const currentConfig = sectionConfigs[activeSection] || null;
  const isDarkTheme = theme === "dark";
  const isBusy = (actionKey) => busyAction === actionKey;
  const serviceCategoryOptions = useMemo(() => {
    const categoryValues = Array.isArray(collections["service-categories"])
      ? collections["service-categories"].map((item) => String(item.name || "").trim()).filter(Boolean)
      : [];
    const fallbackValues = serviceCategoryFallbackOptions.map((option) => option.value);
    const merged = [...new Set([...categoryValues, ...fallbackValues])];
    return merged.map((value) => ({ label: value, value }));
  }, [collections["service-categories"]]);
  const projectCategoryOptions = useMemo(() => {
    const categoryValues = Array.isArray(collections["project-categories"])
      ? collections["project-categories"].map((item) => String(item.name || "").trim()).filter(Boolean)
      : [];
    const merged = [...new Set([...categoryValues, ...projectCategoryFallbackOptions.map((option) => option.value)])];
    return merged.map((value) => ({ label: value, value }));
  }, [collections["project-categories"]]);
  const blogCategoryOptions = useMemo(() => {
    const categoryValues = Array.isArray(collections["blog-categories"])
      ? collections["blog-categories"].map((item) => String(item.name || "").trim()).filter(Boolean)
      : [];
    const merged = [...new Set([...categoryValues, ...blogCategoryFallbackOptions.map((option) => option.value)])];
    return merged.map((value) => ({ label: value, value }));
  }, [collections["blog-categories"]]);
  const testimonialServiceOptions = serviceCategoryOptions;
  const resolveFieldConfig = (section, field) => {
    if (section === "services" && field.name === "category") {
      return { ...field, type: "select", options: serviceCategoryOptions, placeholder: "Select a category" };
    }

    if (section === "testimonials" && field.name === "service") {
      return { ...field, type: "select", options: testimonialServiceOptions, label: "Service Category", placeholder: "Select a service category" };
    }

    if (section === "projects" && field.name === "category") {
      return { ...field, type: "select", options: projectCategoryOptions, placeholder: "Select a category" };
    }

    if (section === "blogs" && field.name === "category") {
      return { ...field, type: "select", options: blogCategoryOptions, placeholder: "Select a category" };
    }

    if (section === "companies" && field.name === "iconName") {
      return { ...field, type: "combo", options: companyIconOptions, placeholder: "Type or select icon name" };
    }

    return field;
  };
  const activeCollection = collections[activeSection] || [];
  const activeItem = Array.isArray(activeCollection)
    ? activeCollection.find((item) => item._id === activeItemId) || null
    : null;

  const filterListItems = (section, items = []) => {
    const filter = listFilters[section] || "all";
    if (section === "services") {
      if (filter === "visible") return items.filter((item) => item.visible !== false);
      if (filter === "hidden") return items.filter((item) => item.visible === false);
      if (filter === "featured") return items.filter((item) => item.featured);
      return items;
    }
    if (section === "processes" || section === "skills" || section === "companies") {
      if (filter === "visible") return items.filter((item) => item.visible !== false);
      if (filter === "hidden") return items.filter((item) => item.visible === false);
      return items;
    }
    if (section === "service-categories" || section === "project-categories" || section === "blog-categories") {
      if (filter === "visible") return items.filter((item) => item.visible !== false);
      if (filter === "hidden") return items.filter((item) => item.visible === false);
      if (filter === "default") return items.filter((item) => item.isDefault);
      return items;
    }
    if (section === "blogs") {
      if (filter === "published") return items.filter((item) => item.published);
      if (filter === "draft") return items.filter((item) => !item.published);
      if (filter === "visible") return items.filter((item) => item.visible !== false);
      return items;
    }
    return items;
  };

  const getListFilters = (section) => {
    if (section === "services") {
      return [
        { key: "all", label: "All" },
        { key: "visible", label: "Visible" },
        { key: "hidden", label: "Hidden" },
        { key: "featured", label: "Featured" },
      ];
    }
    if (section === "processes" || section === "skills" || section === "companies") {
      return [
        { key: "all", label: "All" },
        { key: "visible", label: "Visible" },
        { key: "hidden", label: "Hidden" },
      ];
    }
    if (section === "service-categories" || section === "project-categories" || section === "blog-categories") {
      return [
        { key: "all", label: "All" },
        { key: "visible", label: "Active" },
        { key: "hidden", label: "Hidden" },
        { key: "default", label: "Default" },
      ];
    }
    if (section === "blogs") {
      return [
        { key: "all", label: "All" },
        { key: "published", label: "Published" },
        { key: "draft", label: "Draft" },
        { key: "visible", label: "Visible" },
      ];
    }
    return [];
  };

  const getFieldWrapperClass = (section, field) => {
  if (section === "admin-users") {
    if (["allowedSections", "avatarUrl", "bio"].includes(field.name)) return "form-span";
    return "";
  }

    if (field.type === "textarea" || field.type === "richtext" || field.type === "media" || field.type === "packages") {
      return "form-span";
    }

    return "";
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const setFlash = (kind, message) => {
    if (kind === "error") {
      setError(message);
      return;
    }

    setNotice(message);
    setTimeout(() => setNotice(""), 2400);
  };

  const runAction = async (actionKey, task) => {
    setBusyAction(actionKey);
    try {
      return await runWithMinDuration(task, 500);
    } finally {
      setBusyAction(null);
    }
  };

  const refreshAdminData = async (currentAdmin = admin) => {
    if (!currentAdmin) return;

    const nextCollections = {};
    const requestMap = [];

    if (canAccessSection("dashboard", currentAdmin)) requestMap.push(["dashboard", adminApi.dashboard()]);
    if (canAccessSection("analytics", currentAdmin)) requestMap.push(["analytics", adminApi.analytics()]);
    if (canAccessSection("site-settings", currentAdmin)) requestMap.push(["site-settings", adminApi.siteSettings()]);
    if (canAccessSection("about", currentAdmin)) requestMap.push(["about", adminApi.about()]);
    if (canAccessSection("processes", currentAdmin)) requestMap.push(["processes", adminApi.processes()]);
    if (canAccessSection("skills", currentAdmin)) requestMap.push(["skills", adminApi.skills()]);
    if (canAccessSection("companies", currentAdmin)) requestMap.push(["companies", adminApi.companies()]);
    if (canAccessSection("services", currentAdmin)) requestMap.push(["services", adminApi.services()]);
    if (canAccessSection("service-categories", currentAdmin)) requestMap.push(["service-categories", adminApi.serviceCategories()]);
    if (canAccessSection("projects", currentAdmin)) requestMap.push(["projects", adminApi.projects()]);
    if (canAccessSection("project-categories", currentAdmin)) requestMap.push(["project-categories", adminApi.projectCategories()]);
    if (canAccessSection("testimonials", currentAdmin)) requestMap.push(["testimonials", adminApi.testimonials()]);
    if (canAccessSection("blogs", currentAdmin)) requestMap.push(["blogs", adminApi.blogs()]);
    if (canAccessSection("blog-categories", currentAdmin)) requestMap.push(["blog-categories", adminApi.blogCategories()]);
    if (canAccessSection("timeline", currentAdmin)) requestMap.push(["timeline", adminApi.timeline()]);
    if (canAccessSection("contacts", currentAdmin)) requestMap.push(["contacts", adminApi.contacts()]);
    if (canAccessSection("newsletter", currentAdmin)) requestMap.push(["newsletter", adminApi.newsletter()]);
    if (canAccessSection("admin-users", currentAdmin)) requestMap.push(["admin-users", adminApi.adminUsers()]);

    const results = await Promise.allSettled(requestMap.map(([, promise]) => promise));
    results.forEach((result, index) => {
      const [section] = requestMap[index];
      if (result.status === "fulfilled") {
        nextCollections[section] = result.value;
      }
    });

    setCollections(nextCollections);
    setDashboard(nextCollections.dashboard || null);
  };

  const bootstrapAuth = async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    try {
      const session = await authApi.me();
      setAdmin(session.admin);
      setProfileForm(createProfileForm(session.admin));
      setAuthenticated(true);

      const firstSection = sectionOrder.find((section) => canAccessSection(section, session.admin)) || "profile";
      setActiveSection(firstSection);
      await refreshAdminData(session.admin);
    } catch (_error) {
      localStorage.removeItem("admin_token");
    }
  };

  useEffect(() => {
    bootstrapAuth();
  }, []);

  useEffect(() => {
    document.title = authenticated
      ? `Portfolio Admin | ${sectionLabels[activeSection]}`
      : "Portfolio Admin";
  }, [authenticated, activeSection]);

  useEffect(() => {
    localStorage.setItem("admin_theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!authenticated) return;
    if (activeSection === "profile" && admin) {
      setProfileForm(createProfileForm(admin));
      return;
    }

    const config = sectionConfigs[activeSection];
    if (!config) return;

    if (config.singleton) {
      setFormState(config.fromItem(collections[activeSection] || {}));
    } else if (!activeItemId) {
      setFormState(config.fromItem({}));
    }
  }, [authenticated, activeSection, admin, collections, activeItemId]);

  useEffect(() => {
    if (!authenticated) return;
    if (currentConfig?.singleton) {
      setSectionScreen("form");
    } else if (activeSection === "contacts" || activeSection === "newsletter" || activeSection === "dashboard" || activeSection === "profile") {
      setSectionScreen("list");
    } else {
      setSectionScreen((prev) => prev);
    }
  }, [authenticated, activeSection, currentConfig]);

  const selectSection = (section) => {
    if (!canAccessSection(section)) return;
    setError("");
    setNotice("");
    setActiveSection(section);
    setActiveItemId(null);
    setSectionScreen(section === "profile" || section === "dashboard" || section === "contacts" || section === "newsletter" ? "list" : "list");

    if (section === "profile" && admin) {
      setProfileForm(createProfileForm(admin));
      return;
    }

    const group = sidebarGroups.find((entry) => entry.sections.includes(section));
    if (group) {
      setNavOpenGroups((prev) => ({ ...prev, [group.key]: true }));
    }

    const config = sectionConfigs[section];
    if (config?.singleton) {
      setFormState(config.fromItem(collections[section] || {}));
    } else if (config) {
      setFormState(config.fromItem({}));
    }
  };

  const toggleNavGroup = (groupKey) => {
    setNavOpenGroups((prev) => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await runAction("login", async () => {
        const session = await authApi.login(loginForm);
        localStorage.setItem("admin_token", session.token);
        setAdmin(session.admin);
        setProfileForm(createProfileForm(session.admin));
        setPasswordForm(createPasswordForm());
        setAuthenticated(true);

        const firstSection = sectionOrder.find((section) => canAccessSection(section, session.admin)) || "profile";
        setActiveSection(firstSection);
        setSectionScreen("list");
        setShowLoginPassword(false);
        await refreshAdminData(session.admin);
      });
      setFlash("notice", "Login successful");
    } catch (err) {
      setFlash("error", err.message || "Login failed");
    }
  };

  const handleLogout = async () => {
    try {
      await runAction("logout", () => authApi.logout());
    } catch (_error) {
      // ignore logout errors
    }

    localStorage.removeItem("admin_token");
    setAuthenticated(false);
    setAdmin(null);
    setCollections({});
    setDashboard(null);
    setActiveSection("dashboard");
    setActiveItemId(null);
    setSectionScreen("list");
    setFormState({});
    setProfileForm(createProfileForm());
    setPasswordForm(createPasswordForm());
    setShowLoginPassword(false);
  };

  const updateField = (name, value) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const updateProfileField = (name, value) => {
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const updatePasswordField = (name, value) => {
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await runAction("profile-save", async () => {
        const result = await authApi.updateMe({
          name: profileForm.name,
          jobTitle: profileForm.jobTitle,
          bio: profileForm.bio,
          phone: profileForm.phone,
          avatarUrl: profileForm.avatarUrl,
        });
        setAdmin(result.admin);
        setProfileForm(createProfileForm(result.admin));
        await refreshAdminData(result.admin);
      });
      setFlash("notice", "Profile updated");
    } catch (err) {
      setFlash("error", err.message || "Unable to update profile");
    }
  };

  const handlePasswordSave = async (event) => {
    event.preventDefault();
    setError("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setFlash("error", "New password and confirmation do not match");
      return;
    }

    try {
      await runAction("password-save", () =>
        authApi.updatePassword({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        })
      );
      setPasswordForm(createPasswordForm());
      setFlash("notice", "Password updated");
    } catch (err) {
      setFlash("error", err.message || "Unable to update password");
    }
  };

  const handleSaveContent = async (event) => {
    event.preventDefault();
    if (!currentConfig) return;

    setError("");

    try {
      await runAction(`content-save:${activeSection}`, async () => {
        const payload = currentConfig.toPayload(formState, activeItemId);
        if (currentConfig.singleton) {
          await currentConfig.save(payload);
        } else if (activeItemId) {
          await currentConfig.update(activeItemId, payload);
        } else {
          await currentConfig.create(payload);
        }

        await refreshAdminData(admin);
      });
      setActiveItemId(null);
      setSectionScreen("list");
      setFlash("notice", `${currentConfig.title} saved`);
    } catch (err) {
      setFlash("error", err.message || "Unable to save changes");
    }
  };

  const handleDeleteItem = async (item) => {
    if (!currentConfig || currentConfig.singleton) return;

    const singularTitle = getSectionSingularTitle(currentConfig);
    const confirmed = window.confirm(`Delete this ${singularTitle.toLowerCase()}?`);
    if (!confirmed) return;

    setError("");

    try {
      await runAction(`delete:${item._id}`, async () => {
        await currentConfig.remove(item._id);
        await refreshAdminData(admin);
      });
      setFlash("notice", `${singularTitle} deleted`);
    } catch (err) {
      setFlash("error", err.message || "Unable to delete item");
    }
  };

  const handleEditItem = (item) => {
    if (!currentConfig) return;
    setActiveItemId(item._id);
    setFormState(currentConfig.fromItem(item));
    setSectionScreen("form");
  };

  const handleNewItem = () => {
    if (!currentConfig) return;
    setActiveItemId(null);
    setFormState(currentConfig.fromItem({}));
    setSectionScreen("form");
  };

  const handleShowAllItems = () => {
    if (!currentConfig || currentConfig.singleton) return;
    setActiveItemId(null);
    setSectionScreen("list");
  };

  const handleContactStatus = async (id, status) => {
    setError("");
    try {
      await runAction(`contact:${id}:${status}`, async () => {
        await adminApi.updateContactStatus(id, status);
        await refreshAdminData(admin);
      });
      setFlash("notice", `Contact marked as ${status}`);
    } catch (err) {
      setFlash("error", err.message || "Unable to update contact");
    }
  };

  const handleContactReplyStart = (item) => {
    setContactReplyItem(item);
    setContactReplyBody(
      item?.replyMessage ||
        `Hi ${item?.name || "there"},\n\nThanks for reaching out. I have received your message and will get back to you shortly.\n\nBest regards,\nMian Haseeb`,
    );
  };

  const handleContactReplyCancel = () => {
    setContactReplyItem(null);
    setContactReplyBody("");
  };

  const handleContactReplySend = async (event) => {
    event.preventDefault();
    if (!contactReplyItem) return;

    const body = String(contactReplyBody || "").trim();
    if (!body) {
      setFlash("error", "Reply message is required");
      return;
    }

    setError("");
    try {
      const result = await runAction(`contact-reply:${contactReplyItem._id}`, async () =>
        adminApi.replyContact(contactReplyItem._id, {
          message: body,
          subject: `Re: ${contactReplyItem.subject || "Your message"}`,
        }),
      );

      if (result?.mailtoUrl) {
        window.open(result.mailtoUrl, "_blank", "noopener,noreferrer");
      }

      handleContactReplyCancel();
      await refreshAdminData(admin);
      setFlash("notice", "Reply prepared and contact marked as replied");
    } catch (err) {
      setFlash("error", err.message || "Unable to prepare reply");
    }
  };

  const handleSubscriberDelete = async (id) => {
    setError("");
    try {
      await runAction(`newsletter:${id}`, async () => {
        await adminApi.newsletterDelete(id);
        await refreshAdminData(admin);
      });
      setFlash("notice", "Subscriber removed");
    } catch (err) {
      setFlash("error", err.message || "Unable to delete subscriber");
    }
  };

  const isCategorySection = (section) =>
    section === "service-categories" || section === "project-categories" || section === "blog-categories";

  const getSectionSingularTitle = (config) =>
    config?.singularTitle || (config?.title?.endsWith("s") ? config.title.slice(0, -1) : config?.title || "Item");

  const renderSectionEditor = () => {
    if (!currentConfig) return null;

    const items = Array.isArray(collections[activeSection]) ? collections[activeSection] : [];
    const isFormMode = sectionScreen === "form" || currentConfig.singleton;
    const titleBase = getSectionSingularTitle(currentConfig);

    if (!isFormMode) {
      const listFiltersOptions = getListFilters(activeSection);
      const filteredItems = filterListItems(activeSection, items);

      return (
        <section className="admin-panel admin-list-screen">
          <div className="panel-head">
            <div>
              <h3>{currentConfig.title}</h3>
              <p>All saved records are listed here. Click any item to update it.</p>
            </div>
            <div className="panel-actions panel-actions-wrap">
              {listFiltersOptions.length ? (
                <div className="filter-tabs" role="tablist" aria-label={`${currentConfig.title} filters`}>
                  {listFiltersOptions.map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      className={`chip filter-chip ${listFilters[activeSection] === option.key ? "active" : ""}`}
                      onClick={() => setListFilters((prev) => ({ ...prev, [activeSection]: option.key }))}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              ) : null}
              <button type="button" className="admin-button soft" onClick={handleNewItem}>
                <FiPlus /> Add
              </button>
              <button type="button" className="admin-button soft" onClick={() => refreshAdminData(admin)}>
                <FiRefreshCw /> Refresh
              </button>
            </div>
          </div>

          {filteredItems.length ? (
            <div className="admin-table-shell">
              <table className="admin-data-table admin-list-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Meta</th>
                    <th>Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item._id} className={activeItemId === item._id ? "active-row" : ""}>
                      <td>
                        <button type="button" className="admin-table-link" onClick={() => handleEditItem(item)}>
                          <strong>{getItemTitle(item)}</strong>
                        </button>
                      </td>
                      <td>{getItemDescription(item)}</td>
                      <td>{getItemMetaSummary(item)}</td>
                      <td>{formatUpdatedAt(item.updatedAt || item.createdAt) || "—"}</td>
                      <td>
                        <div className="admin-list-actions table-actions">
                          <button type="button" className="admin-button soft" onClick={() => handleEditItem(item)}>
                            <FiEdit3 /> Edit
                          </button>
                          <button
                            type="button"
                            className="admin-button soft danger"
                            onClick={() => handleDeleteItem(item)}
                            disabled={isBusy(`delete:${item._id}`) || (isCategorySection(activeSection) && item.isDefault)}
                            aria-busy={isBusy(`delete:${item._id}`)}
                          >
                            <FiTrash2 /> {isBusy(`delete:${item._id}`) ? "Loading..." : isCategorySection(activeSection) && item.isDefault ? "Locked" : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty-state">{listFiltersOptions.length ? "No items match the current filter." : "No records available yet."}</p>
          )}
        </section>
      );
    }

    if (currentConfig.singleton) {
      return (
        <section className="admin-panel admin-editor-screen">
          <div className="panel-head">
            <div>
              <h3>{activeItemId ? `Update ${titleBase}` : `Add ${titleBase}`}</h3>
              <p>
                {activeItemId
                  ? `Last saved: ${formatUpdatedAt(activeItem?.updatedAt || activeItem?.createdAt) || "Recently"}`
                  : `Create a new ${titleBase.toLowerCase()} record.`}
              </p>
            </div>
            <div className="panel-actions">
              <button
                type="button"
                className="admin-button soft"
                onClick={() => runAction(`refresh:singleton:${activeSection}`, () => refreshAdminData(admin))}
                disabled={isBusy(`refresh:singleton:${activeSection}`)}
                aria-busy={isBusy(`refresh:singleton:${activeSection}`)}
              >
                <FiRefreshCw /> {isBusy(`refresh:singleton:${activeSection}`) ? "Loading..." : "Refresh"}
              </button>
            </div>
          </div>

            <form
              className={`admin-form ${activeSection === "site-settings" ? "site-settings-form" : ""} ${activeSection === "admin-users" ? "admin-users-form" : ""}`}
              onSubmit={handleSaveContent}
            >
            <div className="form-grid">
              {currentConfig.fields.map((field) => {
                const resolvedField = resolveFieldConfig(activeSection, field);
                return (
                <div
                  key={field.name}
                  className={getFieldWrapperClass(activeSection, field)}
                >
                  <Field
                    field={resolvedField}
                    value={formState[field.name]}
                    onChange={updateField}
                    onUpload={(name, value) => updateField(name, value)}
                  />
                </div>
                );
              })}
            </div>

            <div className="editor-footer">
              <div className="editor-note">
                <span>{activeItemId ? "Updating existing record" : "Ready for a new record"}</span>
                <small>{activeItem?.updatedAt ? `Last saved: ${formatUpdatedAt(activeItem.updatedAt)}` : "Keep it simple and short."}</small>
              </div>
              <button
                type="submit"
                className="admin-button primary"
                disabled={isBusy(`content-save:${activeSection}`)}
                aria-busy={isBusy(`content-save:${activeSection}`)}
              >
                <FiSave /> {isBusy(`content-save:${activeSection}`) ? "Loading..." : activeItemId ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </section>
      );
    }

    return (
      <section className="admin-panel admin-editor-screen">
        <div className="panel-head">
          <div>
            <h3>{activeItemId ? `Update ${titleBase}` : `Add ${titleBase}`}</h3>
            <p>
              {activeItemId
                ? `Last saved: ${formatUpdatedAt(activeItem?.updatedAt || activeItem?.createdAt) || "Recently"}`
                : `Create a new ${titleBase.toLowerCase()} record.`}
            </p>
          </div>
          <div className="panel-actions">
            <button type="button" className="admin-button soft" onClick={handleShowAllItems}>
              <FiList /> All
            </button>
            <button type="button" className="admin-button soft" onClick={handleNewItem}>
              <FiPlus /> Add
            </button>
            <button
              type="button"
              className="admin-button soft"
              onClick={() => runAction(`refresh:editor:${activeSection}`, () => refreshAdminData(admin))}
              disabled={isBusy(`refresh:editor:${activeSection}`)}
              aria-busy={isBusy(`refresh:editor:${activeSection}`)}
            >
              <FiRefreshCw /> {isBusy(`refresh:editor:${activeSection}`) ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>

        <form
          className={`admin-form ${activeSection === "site-settings" ? "site-settings-form" : ""} ${activeSection === "admin-users" ? "admin-users-form" : ""}`}
          onSubmit={handleSaveContent}
        >
          <div className="form-grid">
            {currentConfig.fields.map((field) => {
              const resolvedField = resolveFieldConfig(activeSection, field);
              return (
              <div
                key={field.name}
                className={getFieldWrapperClass(activeSection, field)}
              >
                <Field
                  field={resolvedField}
                  value={formState[field.name]}
                  onChange={updateField}
                  onUpload={(name, value) => updateField(name, value)}
                />
              </div>
              );
            })}
          </div>

          <div className="editor-footer">
            <div className="editor-note">
              <span>{activeItemId ? "Updating existing record" : "Ready for a new record"}</span>
              <small>{activeItem?.updatedAt ? `Last saved: ${formatUpdatedAt(activeItem.updatedAt)}` : "Keep it simple and short."}</small>
            </div>
            <button
              type="submit"
              className="admin-button primary"
              disabled={isBusy(`content-save:${activeSection}`)}
              aria-busy={isBusy(`content-save:${activeSection}`)}
            >
              <FiSave /> {isBusy(`content-save:${activeSection}`) ? "Loading..." : activeItemId ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </section>
    );
  };

  const renderDashboard = () => (
    <div className="admin-dashboard">
      <section className="stat-grid">
        <CardStat
          label="Services"
          value={dashboard?.services ?? (collections.services || []).length}
          icon={FiBriefcase}
          detail={(collections.services || [])[0] ? `Latest: ${getItemTitle(collections.services[0])}` : "No services yet"}
        />
        <CardStat
          label="Process"
          value={dashboard?.processes ?? (collections.processes || []).length}
          icon={FiLayers}
          detail={(collections.processes || [])[0] ? `Latest: ${getItemTitle(collections.processes[0])}` : "No process steps yet"}
        />
        <CardStat
          label="Skills"
          value={dashboard?.skills ?? (collections.skills || []).length}
          icon={FiTrendingUp}
          detail={(collections.skills || [])[0] ? `Latest: ${getItemTitle(collections.skills[0])}` : "No skills yet"}
        />
        <CardStat
          label="Companies"
          value={dashboard?.companies ?? (collections.companies || []).length}
          icon={FiUsers}
          detail={(collections.companies || [])[0] ? `Latest: ${getItemTitle(collections.companies[0])}` : "No companies yet"}
        />
        <CardStat
          label="Projects"
          value={dashboard?.projects ?? (collections.projects || []).length}
          icon={FiFolder}
          detail={(collections.projects || [])[0] ? `Latest: ${getItemTitle(collections.projects[0])}` : "No projects yet"}
        />
        <CardStat
          label="Blogs"
          value={dashboard?.blogs ?? (collections.blogs || []).length}
          icon={FiFileText}
          detail={(collections.blogs || [])[0] ? `Latest: ${getItemTitle(collections.blogs[0])}` : "No blogs yet"}
        />
        <CardStat
          label="Testimonials"
          value={dashboard?.testimonials ?? (collections.testimonials || []).length}
          icon={FiMessageSquare}
          detail={(collections.testimonials || [])[0] ? `Latest: ${getItemTitle(collections.testimonials[0])}` : "No testimonials yet"}
        />
        <CardStat
          label="Contacts"
          value={dashboard?.contacts ?? (collections.contacts || []).length}
          icon={FiMail}
          detail={`Unread: ${dashboard?.newMessages ?? 0}`}
        />
        <CardStat
          label="Subscribers"
          value={dashboard?.newsletters ?? (collections.newsletter || []).length}
          icon={FiUsers}
          detail={`New: ${dashboard?.newSubscribers ?? 0}`}
        />
      </section>

      <section className="panel-grid dashboard-grid">
        <article className="admin-panel">
          <div className="panel-head">
            <div>
              <h3>Recent Services</h3>
              <p>Latest content added to your portfolio services.</p>
            </div>
          </div>
          <div className="mini-list">
            {(collections.services || []).slice(0, 4).map((item) => (
              <div key={item._id} className="mini-row">
                <div>
                  <strong>{getItemTitle(item)}</strong>
                  <span>{getItemDescription(item)}</span>
                </div>
                <small>{formatUpdatedAt(item.updatedAt || item.createdAt)}</small>
              </div>
            ))}
            {!(collections.services || []).length ? <p className="empty-state">No services added yet.</p> : null}
          </div>
        </article>

        <article className="admin-panel">
          <div className="panel-head">
            <div>
              <h3>Account Summary</h3>
              <p>Quick look at the active admin profile.</p>
            </div>
          </div>
          <div className="profile-mini large">
            <div className="profile-avatar">
              <SafeImage src={getAvatarSrc(admin?.avatarUrl)} alt={admin?.name || "Admin"} />
            </div>
            <div>
              <strong>{admin?.name}</strong>
              <p>{admin?.jobTitle || admin?.role || "Admin"}</p>
              <span>{admin?.email}</span>
            </div>
          </div>
          <div className="profile-meta-list compact">
            <div>
              <span>Role</span>
              <strong>{admin?.role || "admin"}</strong>
            </div>
            <div>
              <span>Access</span>
              <strong>{(admin?.allowedSections || []).length} sections</strong>
            </div>
            <div>
              <span>Profile</span>
              <strong>Manage in Profile</strong>
            </div>
          </div>
        </article>
      </section>
    </div>
  );

  const renderAnalytics = () => {
    const analytics = collections.analytics || {};
    const overview = analytics.overview || {};
    const pageViews = analytics.pageViews || [];
    const visitors = analytics.visitors || [];
    const recentViews = analytics.recentViews || [];

    return (
      <div className="admin-dashboard admin-analytics">
        <section className="stat-grid">
          <CardStat label="Total Views" value={overview.totalViews ?? 0} icon={FiTrendingUp} detail="All tracked page and section views" />
          <CardStat label="Unique Visitors" value={overview.uniqueVisitors ?? 0} icon={FiUsers} detail="Distinct visitor IDs" />
          <CardStat label="Tracked Pages" value={overview.trackedPages ?? 0} icon={FiGrid} detail="Pages and sections tracked" />
          <CardStat label="Contact Leads" value={overview.contactLeads ?? 0} icon={FiMail} detail={`New: ${overview.newLeads ?? 0}`} />
          <CardStat label="Newsletter" value={overview.newsletterSubscribers ?? 0} icon={FiUsers} detail={`Active: ${overview.newSubscribers ?? 0}`} />
          <CardStat label="Recent Events" value={recentViews.length ?? 0} icon={FiClock} detail="Latest tracked views" />
        </section>

        <section className="panel-grid dashboard-grid">
          <article className="admin-panel">
            <div className="panel-head">
              <div>
                <h3>Page Views</h3>
                <p>Traffic by page or section, grouped by visitor activity.</p>
              </div>
            </div>
            {pageViews.length ? (
              <div className="admin-table-shell">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Page</th>
                      <th>Views</th>
                      <th>Unique Visitors</th>
                      <th>First Seen</th>
                      <th>Last Seen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageViews.map((item) => (
                      <tr key={item.pageKey}>
                        <td>{item.pageTitle}</td>
                        <td>{item.viewCount}</td>
                        <td>{item.uniqueVisitors}</td>
                        <td>{formatUpdatedAt(item.firstSeen) || "—"}</td>
                        <td>{formatUpdatedAt(item.lastSeen) || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="empty-state">No page views tracked yet.</p>
            )}
          </article>

          <article className="admin-panel">
            <div className="panel-head">
              <div>
                <h3>Visitors</h3>
                <p>Each row is a visitor ID with page view totals.</p>
              </div>
            </div>
            {visitors.length ? (
              <div className="admin-table-shell">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Visitor ID</th>
                      <th>Views</th>
                      <th>Pages</th>
                      <th>Last Path</th>
                      <th>Last Seen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visitors.map((item) => (
                      <tr key={item.visitorId}>
                        <td title={item.visitorId}>{String(item.visitorId).slice(0, 12)}...</td>
                        <td>{item.totalViews}</td>
                        <td>{item.pageCount}</td>
                        <td>{item.lastPath || "—"}</td>
                        <td>{formatUpdatedAt(item.lastSeen) || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="empty-state">No visitors tracked yet.</p>
            )}
          </article>
        </section>

        <section className="admin-panel">
          <div className="panel-head">
            <div>
              <h3>Recent Views</h3>
              <p>Latest tracked page events and visitor IDs.</p>
            </div>
          </div>
          {recentViews.length ? (
            <div className="admin-table-shell">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Page</th>
                    <th>Visitor</th>
                    <th>Path</th>
                    <th>Referrer</th>
                    <th>Viewed</th>
                  </tr>
                </thead>
                <tbody>
                  {recentViews.map((item) => (
                    <tr key={item._id}>
                      <td>{item.pageTitle || item.pageKey}</td>
                      <td title={item.visitorId}>{String(item.visitorId).slice(0, 12)}...</td>
                      <td>{item.path || "/"}</td>
                      <td>{item.referrer || "—"}</td>
                      <td>{formatUpdatedAt(item.createdAt) || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty-state">No recent views available.</p>
          )}
        </section>
      </div>
    );
  };

  const renderProfile = () => {
    const profileRows = [
      { label: "Name", value: admin?.name || "Unavailable" },
      { label: "Email", value: admin?.email || "Unavailable" },
      { label: "Role", value: admin?.role || "admin" },
      { label: "Phone", value: profileForm.phone || admin?.phone || "Unavailable" },
      { label: "Last Login", value: formatUpdatedAt(admin?.lastLoginAt) || "Never" },
    ];

    return (
      <div className="profile-page">
        <div className="profile-page-grid">
          <section className="admin-panel profile-overview-card">
            <div className="panel-head">
              <div>
                <h3>Profile Overview</h3>
                <p>Compact account details, avatar controls, and live status.</p>
              </div>
            </div>

            <div className="profile-overview-identity">
              <div className="profile-avatar profile-avatar-circle">
                <SafeImage src={getAvatarSrc(profileForm.avatarUrl || admin?.avatarUrl)} alt={profileForm.name || admin?.name || "Profile"} />
              </div>
              <div className="profile-overview-copy">
                <strong>{profileForm.name || admin?.name || "Admin User"}</strong>
                <p>{profileForm.jobTitle || admin?.role || "Admin"}</p>
                <span>{admin?.email || "No email set"}</span>
                <label className="admin-upload profile-upload-button">
                  <FiUpload />
                  <span>Upload avatar</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const dataUrl = await imageToDataUrl(file);
                        updateProfileField("avatarUrl", dataUrl);
                      }
                      e.target.value = "";
                    }}
                  />
                </label>
                <small>Square images work best. Preview stays contained.</small>
              </div>
            </div>

            <div className="profile-info-table">
              {profileRows.map((row) => (
                <div key={row.label} className="profile-info-row">
                  <span>{row.label}</span>
                  <strong>{row.value}</strong>
                </div>
              ))}
              <div className="profile-info-row">
                <span>Status</span>
                <strong>
                  <span className={`profile-status ${admin?.active ? "active" : "inactive"}`}>
                    {admin?.active ? "Active" : "Inactive"}
                  </span>
                </strong>
              </div>
            </div>

            <div className="profile-overview-note">
              <span>Bio preview</span>
              <p>{stripHtml(profileForm.bio) || "Use the editor on the right to add a short professional bio."}</p>
            </div>
          </section>

          <div className="profile-stack">
            <section className="admin-panel profile-editor-card">
              <div className="panel-head">
                <div>
                  <h3>Profile Details</h3>
                  <p>Update your name, role title, phone, and short bio.</p>
                </div>
              </div>
              <form className="admin-form" onSubmit={handleProfileSave}>
                <div className="profile-form-grid">
                  <Field field={{ name: "name", label: "Name", type: "text" }} value={profileForm.name} onChange={updateProfileField} onUpload={updateProfileField} />
                  <Field field={{ name: "jobTitle", label: "Job Title", type: "text" }} value={profileForm.jobTitle} onChange={updateProfileField} onUpload={updateProfileField} />
                  <div className="form-span">
                    <Field field={{ name: "phone", label: "Phone", type: "text" }} value={profileForm.phone} onChange={updateProfileField} onUpload={updateProfileField} />
                  </div>
                </div>

                <CompactRichTextEditor label="Bio" value={profileForm.bio} onChange={updateProfileField} placeholder="Write a concise professional bio..." />

                <div className="profile-form-footer">
                  <div className="editor-note">
                    <span>Profile bio</span>
                    <small>Use short rich text. Keep it clean and easy to scan.</small>
                  </div>
                  <button type="submit" className="admin-button primary" disabled={isBusy("profile-save")} aria-busy={isBusy("profile-save")}>
                    <FiSave /> {isBusy("profile-save") ? "Loading..." : "Save Profile"}
                  </button>
                </div>
              </form>
            </section>

            <section className="admin-panel profile-password-card">
              <div className="panel-head">
                <div>
                  <h3>Change Password</h3>
                  <p>Keep your admin account secure with a new password.</p>
                </div>
              </div>
              <form className="admin-form" onSubmit={handlePasswordSave}>
                <div className="profile-password-grid">
                  <Field field={{ name: "currentPassword", label: "Current Password", type: "password" }} value={passwordForm.currentPassword} onChange={updatePasswordField} onUpload={updatePasswordField} />
                  <Field field={{ name: "newPassword", label: "New Password", type: "password" }} value={passwordForm.newPassword} onChange={updatePasswordField} onUpload={updatePasswordField} />
                  <Field field={{ name: "confirmPassword", label: "Confirm Password", type: "password" }} value={passwordForm.confirmPassword} onChange={updatePasswordField} onUpload={updatePasswordField} />
                </div>

                <div className="profile-form-footer">
                  <div className="editor-note">
                    <span>Password update</span>
                    <small>Confirm the current password before saving the new one.</small>
                  </div>
                  <button type="submit" className="admin-button primary" disabled={isBusy("password-save")} aria-busy={isBusy("password-save")}>
                    <FiLock /> {isBusy("password-save") ? "Loading..." : "Update Password"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    );
  };

  const renderContactsSection = () => {
    const items = Array.isArray(collections.contacts) ? collections.contacts : [];

    return (
      <section className="admin-panel">
        <div className="panel-head">
          <div>
            <h3>Contacts</h3>
            <p>Manage incoming messages, reply to leads, and keep statuses updated.</p>
          </div>
        </div>

        <div className="admin-list">
          {contactReplyItem ? (
            <form className="admin-panel contact-reply-panel" onSubmit={handleContactReplySend}>
              <div className="panel-head">
                <div>
                  <h3>Reply Contact</h3>
                  <p>
                    Reply to <strong>{contactReplyItem.name}</strong> at {contactReplyItem.email}.
                  </p>
                </div>
                <div className="panel-actions">
                  <button type="button" className="admin-button soft" onClick={handleContactReplyCancel}>
                    Cancel
                  </button>
                </div>
              </div>

              <div className="form-grid contact-reply-grid">
                <label className="admin-field form-span">
                  <span>Reply Message</span>
                  <textarea
                    rows={7}
                    value={contactReplyBody}
                    onChange={(e) => setContactReplyBody(e.target.value)}
                    placeholder="Write a clean reply message..."
                  />
                </label>
              </div>

              <div className="editor-footer">
                <div className="editor-note">
                  <span>Notification email</span>
                  <small>{collections["site-settings"]?.notificationEmail || "Set this in Site Settings"}</small>
                </div>
                <button
                  type="submit"
                  className="admin-button primary"
                  disabled={isBusy(`contact-reply:${contactReplyItem._id}`)}
                  aria-busy={isBusy(`contact-reply:${contactReplyItem._id}`)}
                >
                  {isBusy(`contact-reply:${contactReplyItem._id}`) ? "Loading..." : "Send Reply"}
                </button>
              </div>
            </form>
          ) : null}

          {items.length ? (
            <div className="admin-table-shell">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Subject</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Received</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item._id}>
                      <td>{item.name}</td>
                      <td>{item.subject}</td>
                      <td>{item.email}</td>
                      <td>{item.phone || "—"}</td>
                      <td>
                        <span className={`profile-status ${item.status === "new" ? "inactive" : "active"}`}>{item.status}</span>
                      </td>
                      <td>{formatUpdatedAt(item.createdAt) || "—"}</td>
                      <td>
                        <div className="admin-list-actions table-actions">
                          <button
                            type="button"
                            className="admin-button soft"
                            onClick={() => handleContactStatus(item._id, "read")}
                            disabled={isBusy(`contact:${item._id}:read`)}
                            aria-busy={isBusy(`contact:${item._id}:read`)}
                          >
                            {isBusy(`contact:${item._id}:read`) ? "Loading..." : "Mark Read"}
                          </button>
                          <button
                            type="button"
                            className="admin-button soft"
                            onClick={() => handleContactStatus(item._id, "replied")}
                            disabled={isBusy(`contact:${item._id}:replied`)}
                            aria-busy={isBusy(`contact:${item._id}:replied`)}
                          >
                            {isBusy(`contact:${item._id}:replied`) ? "Loading..." : "Replied"}
                          </button>
                          <button type="button" className="admin-button soft" onClick={() => handleContactReplyStart(item)}>
                            Reply
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty-state">No contact messages yet.</p>
          )}
        </div>
      </section>
    );
  };

  const renderReadOnly = (key) => {
    const config = readOnlySections[key];
    if (!config) return null;
    const items = collections[key] || [];
    return (
      <section className="admin-panel">
        <div className="panel-head">
          <div>
            <h3>{config.title}</h3>
            <p>Manage incoming {key === "contacts" ? "messages" : "subscribers"}.</p>
          </div>
        </div>
        <div className="admin-list">
          {config.render(
            Array.isArray(items) ? items : [],
            key === "contacts" ? handleContactStatus : handleSubscriberDelete,
            isBusy,
          )}
        </div>
      </section>
    );
  };

  if (!authenticated) {
    return (
      <div className={`admin-shell auth-shell theme-${theme}`}>
        <section className="auth-stage">
          <div className="auth-hero">
            <div className="auth-orb auth-orb-one" />
            <div className="auth-orb auth-orb-two" />
            <span className="auth-kicker">Portfolio Admin</span>
            <h1>Command the portfolio from one secure panel.</h1>
            <p>
              Update services, projects, testimonials, blogs, site settings, and admin users without
              jumping between tools.
            </p>

            <div className="auth-badges">
              <span>admin.domainname.com</span>
              <span>/admin</span>
              <span>Role based access</span>
            </div>

            <div className="auth-mini-grid">
              {authHighlights.map((item) => (
                <article key={item.label} className="auth-mini-card">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </article>
              ))}
            </div>

            <ul className="auth-checklist">
              {authChecklist.map((item) => (
                <li key={item}>
                  <FiCheck />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <section className="auth-card">
            <div className="auth-card-head">
              <div className="auth-card-top">
                <div>
                  <span className="auth-kicker">Secure login</span>
                  <h2>Sign in to continue</h2>
                </div>
                <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                  {isDarkTheme ? <FiSun /> : <FiMoon />}
                </button>
              </div>
              <p>Use the seeded admin account or any active admin profile.</p>
            </div>

            <form className="auth-form" onSubmit={handleLogin}>
              <label className="admin-field">
                <span>Email</span>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="mianhaseebikd@gmail.com"
                  autoComplete="email"
                  required
                />
              </label>

              <label className="admin-field password-field">
                <span>Password</span>
                <div className="password-input">
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="Your admin password"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowLoginPassword((prev) => !prev)}
                    aria-label={showLoginPassword ? "Hide password" : "Show password"}
                  >
                    {showLoginPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </label>

              <div className="auth-form-meta">
                <span>Connect to your backend at `http://localhost:5000/api` while testing locally.</span>
                <span>Passwords stay private and are sent over POST JSON only.</span>
              </div>

              {error ? <div className="admin-alert error">{error}</div> : null}

              <button type="submit" className="admin-button primary auth-submit" disabled={isBusy("login")} aria-busy={isBusy("login")}>
                <span>{isBusy("login") ? "Loading..." : "Login"}</span>
                <FiArrowRight />
              </button>
            </form>
          </section>
        </section>
      </div>
    );
  }

  return (
    <div className={`admin-shell theme-${theme}`}>
      <aside className="admin-sidebar">
        <div className="admin-brand-card">
          <div className="admin-brand-mark">
            <img
              src={getAvatarSrc(admin?.avatarUrl)}
              alt={admin?.name || "Admin"}
              onError={(event) => {
                event.currentTarget.src = DEFAULT_ADMIN_AVATAR;
              }}
            />
          </div>
          <div className="admin-brand-copy">
            <strong>{admin?.name}</strong>
            <p>{admin?.role}</p>
          </div>
        </div>

        <nav className="admin-nav">
          {sidebarGroups.map((group) => {
            const groupSections = group.sections.filter((section) => visibleSections.includes(section));
            if (!groupSections.length) return null;

            if (groupSections.length === 1) {
              const section = groupSections[0];
              const Icon = sectionIcons[section] || FiGrid;
              return (
                <button
                  key={section}
                  type="button"
                  className={activeSection === section ? "active" : ""}
                  onClick={() => selectSection(section)}
                >
                  <span className="nav-icon"><Icon /></span>
                  <span>{sectionLabels[section]}</span>
                </button>
              );
            }

            const isOpen = navOpenGroups[group.key] !== false;
            const GroupIcon = sectionIcons[groupSections[0]] || FiGrid;

            return (
              <div className="admin-nav-group" key={group.key}>
                <button
                  type="button"
                  className={`admin-nav-group-toggle ${isOpen ? "is-open" : ""} ${groupSections.includes(activeSection) ? "active" : ""}`}
                  onClick={() => toggleNavGroup(group.key)}
                >
                  <span className="nav-icon"><GroupIcon /></span>
                  <span>{group.label}</span>
                  <FiChevronLeft className="nav-caret" />
                </button>
                {isOpen ? (
                  <div className="admin-nav-group-items">
                    {groupSections.map((section) => {
                      const Icon = sectionIcons[section] || FiGrid;
                      return (
                        <button
                          key={section}
                          type="button"
                          className={`admin-nav-child ${activeSection === section ? "active" : ""}`}
                          onClick={() => selectSection(section)}
                        >
                          <span className="nav-icon"><Icon /></span>
                          <span>{sectionLabels[section]}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <button
          type="button"
          className="admin-button soft sidebar-logout"
          onClick={handleLogout}
          disabled={isBusy("logout")}
          aria-busy={isBusy("logout")}
        >
          <FiLogOut /> {isBusy("logout") ? "Loading..." : "Logout"}
        </button>
      </aside>

      <main className="admin-main">
        <header className={`admin-topbar ${activeSection === "profile" ? "profile-topbar" : ""}`}>
          <div>
            {activeSection === "profile" ? (
              <nav className="profile-breadcrumb" aria-label="Breadcrumb">
                <span>Dashboard</span>
                <span>/</span>
                <span>Profile</span>
              </nav>
            ) : (
              <span className="topbar-kicker">Dashboard</span>
            )}
            <h1>{sectionLabels[activeSection]}</h1>
            <p>
              {activeSection === "profile"
                ? "Clean account details, avatar controls, and security settings."
                : activeSection === "analytics"
                  ? "View traffic, visitors, and tracked page views."
                : `Manage ${sectionLabels[activeSection].toLowerCase()} from here.`}
            </p>
          </div>
          <div className="admin-topbar-actions">
            <button type="button" className="admin-button soft" onClick={toggleTheme}>
              {isDarkTheme ? <FiSun /> : <FiMoon />}
              {isDarkTheme ? "Light" : "Dark"}
            </button>
            <button
              type="button"
              className="admin-button soft"
              onClick={() => runAction("refresh:topbar", () => refreshAdminData(admin))}
              disabled={isBusy("refresh:topbar")}
              aria-busy={isBusy("refresh:topbar")}
            >
              <FiRefreshCw /> {isBusy("refresh:topbar") ? "Loading..." : "Refresh"}
            </button>
            <button type="button" className="admin-button soft" onClick={() => selectSection(activeSection)}>
              <FiGrid /> Reset
            </button>
          </div>
        </header>

        {notice ? <div className="admin-alert success">{notice}</div> : null}
        {error ? <div className="admin-alert error">{error}</div> : null}

        {activeSection === "dashboard" ? renderDashboard() : null}
        {activeSection === "analytics" ? renderAnalytics() : null}
        {activeSection === "profile" ? renderProfile() : null}
        {activeSection === "contacts" ? renderContactsSection() : null}
        {activeSection === "newsletter" ? renderReadOnly("newsletter") : null}
        {currentConfig && activeSection !== "profile" && activeSection !== "dashboard" && activeSection !== "analytics" && activeSection !== "contacts" && activeSection !== "newsletter"
          ? renderSectionEditor()
          : null}

        {!currentConfig && activeSection !== "profile" && activeSection !== "dashboard" && activeSection !== "analytics" && activeSection !== "contacts" && activeSection !== "newsletter"
          ? (
            <section className="admin-panel">
              <p className="empty-state">This section is not available for your account.</p>
            </section>
          )
          : null}
      </main>
    </div>
  );
}

export default AdminPanel;
