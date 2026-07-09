import { useMemo, useState } from "react";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaSearch,
  FaStar,
  FaTag,
} from "react-icons/fa";
import Header from "./header.jsx";
import Footer from "./footer.jsx";
import Gallery from "./gallery.jsx";
import { useSiteContent } from "../context/SiteContentContext.jsx";

const normalizePath = (value = "") => {
  const cleaned = String(value || "").replace(/\/+$/, "");
  return cleaned || "/";
};

const getSlugFromPath = (pathname, prefix) => {
  const normalized = normalizePath(pathname);
  const base = normalizePath(prefix);
  if (normalized === base) return "";
  if (normalized.startsWith(`${base}/`)) {
    return decodeURIComponent(normalized.slice(base.length + 1));
  }
  return "";
};

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const normalizeText = (value = "") => String(value).trim().toLowerCase();

const isPlaceholderContent = (value = "") => {
  const text = String(value || "").trim().toLowerCase();
  return !text || text === "long form content for the blog can live here.";
};

const buildBlogContent = (blog) => {
  if (!isPlaceholderContent(blog?.content)) return blog.content;

  const title = blog?.title || "Website Growth Guide";
  const category = blog?.category || "Development";
  const excerpt = blog?.excerpt || "A practical guide for planning, improving, and launching better digital experiences.";

  return `
    <p>${excerpt}</p>
    <h2>Why this matters</h2>
    <p>A good ${category.toLowerCase()} strategy is not only about looking polished. It should help visitors understand your offer quickly, trust your brand, and take the next step without friction.</p>
    <h2>What to focus on first</h2>
    <ul>
      <li>Keep the main message clear and easy to scan.</li>
      <li>Use fast pages, clean spacing, and strong mobile layouts.</li>
      <li>Make calls to action visible without making the page feel crowded.</li>
    </ul>
    <p>For "${title}", the best approach is to start with the user journey, then improve design, content, speed, and conversion points together. Small improvements in these areas can make the whole site feel more professional.</p>
    <h2>Quick checklist</h2>
    <p>Review your heading, image quality, loading speed, service details, contact flow, and trust signals. When these pieces work together, your website feels more complete and helps turn visitors into real leads.</p>
  `;
};

function ArchiveShell({ title, children }) {
  return (
    <div className="archive-page">
      <Header archiveMode archiveTitle={title} />
      <main className="archive-main">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function ServicesArchivePage() {
  const { content } = useSiteContent();
  const siteSettings = content?.siteSettings || {};
  const services = Array.isArray(content?.services) ? content.services : [];
  const serviceCategories = Array.isArray(content?.serviceCategories) ? content.serviceCategories : [];
  const categoryItems = useMemo(() => {
    const baseCategories = serviceCategories
      .filter((category) => category?.visible !== false)
      .sort((a, b) => Number(a?.order || 0) - Number(b?.order || 0))
      .map((category) => ({
        name: category.name,
        description: category.description || "",
      }));
    const fallback = [...new Set(services.map((service) => service.category).filter(Boolean))].map((name) => ({
      name,
      description: "",
    }));
    return baseCategories.length ? baseCategories : fallback;
  }, [serviceCategories, services]);

  return (
    <ArchiveShell title={siteSettings.servicesTitle || "Services"}>
      <div className="archive-blog-layout archive-services-layout">
        <div className="archive-card-grid archive-service-grid archive-services-main">
          {services.map((service) => {
            const slug = service.slug || service._id || service.id || service.title;
            const href = `/services/${encodeURIComponent(slug)}`;

            return (
              <a className="archive-service-card" href={href} key={service._id || service.id || service.slug || service.title}>
                <div className="archive-service-thumb">
                  <img
                    src={service.image || "/images/portfolio/portfolio-1.jpg"}
                    alt={service.title}
                  />
                </div>
                <div className="archive-service-content">
                  <div className="archive-card-meta">
                    <span>{service.category || "Service"}</span>
                    {service.priceFrom ? <strong>{service.priceFrom}</strong> : null}
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.shortDescription || service.description}</p>
                  <span className="archive-card-link">
                    View service <FaArrowRight />
                  </span>
                </div>
              </a>
            );
          })}
          {!services.length ? <p className="empty-state">No services available.</p> : null}
        </div>

        <aside className="archive-side-panel archive-blog-sidebar archive-services-sidebar">
          <div className="archive-list-card">
            <h3>Categories</h3>
            <div className="archive-category-list archive-category-static">
              {categoryItems.length ? (
                categoryItems.map((category) => (
                  <span key={category.name}>
                    <FaTag className="archive-small-icon" />
                    <span>{category.name}</span>
                  </span>
                ))
              ) : (
                <p className="empty-state">No categories yet.</p>
              )}
            </div>
          </div>

          <div className="archive-list-card">
            <h3>Quick View</h3>
            <div className="archive-summary-list">
              <div>
                <span>Total Services</span>
                <strong>{services.length}</strong>
              </div>
              <div>
                <span>Visible Categories</span>
                <strong>{categoryItems.length}</strong>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </ArchiveShell>
  );
}

function ServiceDetailPage({ path }) {
  const { content } = useSiteContent();
  const siteSettings = content?.siteSettings || {};
  const services = Array.isArray(content?.services) ? content.services : [];
  const slug = getSlugFromPath(path, "/services");
  const service =
    services.find((item) => normalizeText(item.slug) === normalizeText(slug)) ||
    services.find((item) => normalizeText(item.title) === normalizeText(slug));

  if (!service) {
    return (
      <ArchiveShell title={siteSettings.servicesTitle || "Services"}>
        <div className="archive-empty-panel">
          <p>The requested service was not found.</p>
          <a className="archive-back-link" href="/services">
            Back to services
          </a>
        </div>
      </ArchiveShell>
    );
  }

  const rating = Number(service.rating || (service.featured ? 4.9 : 4.8));
  const reviewsCount = Number(service.reviewsCount || 24);
  const featurePoints = [
    service.category ? `${service.category} focused delivery` : "Custom delivery plan",
    service.priceFrom ? `Starts from ${service.priceFrom}` : "Flexible pricing",
    service.featured ? "Featured service" : "Standard service",
    "Responsive, clean, and performance-first",
  ];
  const packages = useMemo(() => {
    const incoming = Array.isArray(service.packages) ? service.packages : [];
    const fallback = [
      {
        name: "Basic",
        price: service.priceFrom || "On request",
        note: "Great for getting started",
        features: ["Core setup", "1 revision", "Email support"],
      },
      {
        name: "Standard",
        price: service.priceFrom ? `${service.priceFrom}+` : "Custom",
        note: "Best value for most clients",
        features: ["Priority support", "2 revisions", "Faster delivery"],
      },
      {
        name: "Premium",
        price: "Custom",
        note: "Best for larger scope",
        features: ["Dedicated planning", "Extended support", "Custom scope"],
      },
    ];

    return fallback.map((item, index) => {
      const source = incoming[index] || {};
      return {
        name: source.name || item.name,
        price: source.price || item.price,
        note: source.note || item.note,
        features: Array.isArray(source.features) && source.features.length ? source.features : item.features,
      };
    });
  }, [service.packages, service.priceFrom]);
  const whatsappNumber = (siteSettings.whatsappNumber || "923041051616").replace(/\D/g, "");
  const buildWhatsAppLink = (packageName) => {
    const serviceLink = `${window.location.origin}/services/${encodeURIComponent(service.slug || service._id || service.title)}`;
    const message = encodeURIComponent(
      `Hi! I'm interested in the ${packageName} package for "${service.title}". Please share details.\nService link: ${serviceLink}`,
    );
    return `https://wa.me/${whatsappNumber}?text=${message}`;
  };

  return (
    <ArchiveShell title={service.title}>
      <div className="archive-detail-layout archive-service-detail-layout">
        <article className="archive-detail-card archive-service-detail-card">
          <div className="archive-detail-media archive-service-hero">
                <img src={service.image || "/images/portfolio/portfolio-1.jpg"} alt={service.title} />
              </div>

          <div className="archive-detail-body">
            <div className="archive-product-meta">
              <div className="archive-rating">
                <div className="archive-stars" aria-label={`Rated ${rating.toFixed(1)} out of 5`}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <FaStar key={index} className={index < Math.round(rating) ? "active" : ""} />
                  ))}
                </div>
                <strong>{rating.toFixed(1)}</strong>
                <span>({reviewsCount} reviews)</span>
              </div>
              <div className="archive-product-meta-right">
                <span>{service.category || "Service"}</span>
                {service.priceFrom ? <strong>{service.priceFrom}</strong> : null}
              </div>
            </div>

            {service.heading ? <h3>{service.heading}</h3> : null}
            <p>{service.description || service.shortDescription}</p>
            <div className="archive-inline-tags">
              {[service.category, ...(Array.isArray(service.packages) ? service.packages.map((pkg) => pkg?.name).filter(Boolean) : [])]
                .filter(Boolean)
                .map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
            </div>

            <div className="archive-service-packages">
              {packages.map((pkg) => (
                <div className="archive-package-card" key={pkg.name}>
                  <div className="archive-package-top">
                    <div>
                      <span>{pkg.name}</span>
                      <h4>{pkg.price}</h4>
                    </div>
                    <strong>{pkg.note}</strong>
                  </div>
                  <ul className="archive-package-features">
                    {pkg.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                  <a className="archive-package-btn" href={buildWhatsAppLink(pkg.name)} target="_blank" rel="noreferrer">
                    Buy Now
                  </a>
                </div>
              ))}
            </div>

            <div className="archive-features">
              {featurePoints.map((point) => (
                <div key={point} className="archive-feature-row">
                  <span />
                  <p>{point}</p>
                </div>
              ))}
            </div>

            <div className="archive-action-row">
              <a className="archive-action-btn" href="/#contact">
                Start a project
              </a>
              <a
                className="archive-action-btn archive-action-btn-secondary"
                href={buildWhatsAppLink("Premium")}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp us
              </a>
            </div>
          </div>
        </article>

        <aside className="archive-side-panel archive-product-sidebar">
          <div className="archive-summary-card">
            <div className="archive-summary-head">
              <span>{service.category || "Service"}</span>
              <strong>{service.priceFrom || "On request"}</strong>
            </div>
            <h3>Quick Summary</h3>
            <p>{service.shortDescription || service.description}</p>
            <div className="archive-summary-list">
              <div>
                <span>Category</span>
                <strong>{service.category || "Service"}</strong>
              </div>
              <div>
                <span>Price</span>
                <strong>{service.priceFrom || "On request"}</strong>
              </div>
              <div>
                <span>Rating</span>
                <strong>{rating.toFixed(1)} / 5</strong>
              </div>
            </div>
            <a className="archive-summary-cta" href={buildWhatsAppLink("Standard")} target="_blank" rel="noreferrer">
              Discuss this service <FaArrowRight />
            </a>
          </div>
        </aside>
      </div>
    </ArchiveShell>
  );
}

function BlogsArchivePage() {
  const { content } = useSiteContent();
  const siteSettings = content?.siteSettings || {};
  const blogs = Array.isArray(content?.blogs) ? content.blogs : [];
  const blogCategories = Array.isArray(content?.blogCategories) ? content.blogCategories : [];
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const archiveCategories = useMemo(() => {
    const fromAdmin = blogCategories
      .filter((category) => category?.visible !== false)
      .sort((a, b) => Number(a?.order || 0) - Number(b?.order || 0))
      .map((category) => category.name)
      .filter(Boolean);
    const fromBlogs = blogs.map((blog) => blog.category).filter(Boolean);
    return ["All", ...new Set([...fromAdmin, ...fromBlogs])];
  }, [blogCategories, blogs]);
  const filteredBlogs = useMemo(() => {
    const query = normalizeText(searchQuery);
    return blogs.filter((blog) => {
      const categoryMatches = activeCategory === "All" || normalizeText(blog.category) === normalizeText(activeCategory);
      const searchMatches =
        !query ||
        normalizeText(blog.title).includes(query) ||
        normalizeText(blog.excerpt).includes(query) ||
        normalizeText(blog.category).includes(query);
      return categoryMatches && searchMatches;
    });
  }, [activeCategory, blogs, searchQuery]);
  return (
    <ArchiveShell title={siteSettings.blogTitle || "Blog"}>
      <div className="archive-blog-layout">
        <div className="archive-blog-main">
          <div className="archive-filter-tabs">
            {archiveCategories.map((category) => (
              <button
                type="button"
                key={category}
                className={activeCategory === category ? "active" : ""}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="archive-card-grid archive-blog-grid">
          {filteredBlogs.map((blog) => {
            const href = `/blog/${encodeURIComponent(blog.slug || blog._id || blog.id || blog.title)}`;
            const publishedLabel = formatDate(blog.publishedAt || blog.createdAt || blog.date);

            return (
              <a className="archive-blog-card" href={href} key={blog._id || blog.id || blog.slug || blog.title}>
                <div className="archive-blog-image">
                  <img src={blog.image} alt={blog.title} />
                </div>
                <div className="archive-blog-content">
                  <div className="archive-card-meta">
                    <span>
                      <FaTag className="archive-small-icon" />
                      {blog.category || "Blog"}
                    </span>
                    {publishedLabel ? (
                      <strong className="archive-date">
                        <FaCalendarAlt />
                        {publishedLabel}
                      </strong>
                    ) : null}
                  </div>
                  <h3>{blog.title}</h3>
                  <p>{blog.excerpt}</p>
                  <span className="archive-card-link">
                    Read article <FaArrowRight />
                  </span>
                </div>
              </a>
            );
          })}
          {!filteredBlogs.length ? <p className="empty-state">No blog posts found.</p> : null}
          </div>
        </div>

        <aside className="archive-side-panel archive-blog-sidebar">
          <div className="archive-search-card">
            <p className="archive-side-kicker">Search</p>
            <div className="archive-search-field">
              <input
                type="text"
                placeholder="Search posts"
                aria-label="Search posts"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              <button type="button" aria-label="Search">
                <FaSearch />
              </button>
            </div>
          </div>

          <div className="archive-list-card">
            <h3>Categories</h3>
            <div className="archive-category-list archive-category-static">
              {archiveCategories.slice(1, 9).map((category) => (
                  <span key={category}>
                    <FaTag className="archive-small-icon" />
                    <span>{category}</span>
                  </span>
                ))}
            </div>
          </div>

          <div className="archive-list-card">
            <h3>Topics</h3>
            <div className="archive-tag-list">
              {[...new Set([...(blogCategories.map((item) => item.name).filter(Boolean) || []), "Portfolio", "Blog", "Design", "Development"])].slice(0, 8).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>

          <div className="archive-list-card">
            <h3>Gallery</h3>
            <div className="archive-gallery-grid">
              {recentBlogs.slice(0, 6).map((item) => (
                <a href={`/blog/${encodeURIComponent(item.slug || item._id || item.title)}`} key={item._id || item.slug || item.title}>
                  <img src={item.image} alt={item.title} />
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </ArchiveShell>
  );
}

function BlogDetailPage({ path }) {
  const { content } = useSiteContent();
  const siteSettings = content?.siteSettings || {};
  const blogs = Array.isArray(content?.blogs) ? content.blogs : [];
  const blogCategories = Array.isArray(content?.blogCategories) ? content.blogCategories : [];
  const slug = getSlugFromPath(path, "/blog");
  const blog =
    blogs.find((item) => normalizeText(item.slug) === normalizeText(slug)) ||
    blogs.find((item) => normalizeText(item.title) === normalizeText(slug));
  const [commentForm, setCommentForm] = useState({ name: "", email: "", comment: "" });
  const [commentSaved, setCommentSaved] = useState(false);

  if (!blog) {
    return (
      <ArchiveShell title={siteSettings.blogTitle || "Blog"}>
        <div className="archive-empty-panel">
          <p>The requested article was not found.</p>
          <a className="archive-back-link" href="/blog">
            Back to blog
          </a>
        </div>
      </ArchiveShell>
    );
  }

  const publishedLabel = formatDate(blog.publishedAt || blog.createdAt || blog.date);
  const categories = blogCategories.filter((category) => category?.visible !== false).slice(0, 6);

  const submitComment = (event) => {
    event.preventDefault();
    setCommentSaved(true);
    setCommentForm({ name: "", email: "", comment: "" });
    window.setTimeout(() => setCommentSaved(false), 2200);
  };

  return (
    <ArchiveShell title={blog.title}>
      <div className="archive-blog-single-layout">
        <article className="archive-detail-card archive-blog-article archive-blog-single-article">
          <div className="archive-detail-media archive-blog-detail-media">
            <img src={blog.image} alt={blog.title} />
          </div>

          <div className="archive-detail-body">
            <div className="archive-card-meta archive-card-meta-blog">
              <span>
                <FaTag className="archive-small-icon" />
                {blog.category || "Blog"}
              </span>
              {publishedLabel ? (
                <strong className="archive-date">
                  <FaCalendarAlt />
                  {publishedLabel}
                </strong>
              ) : null}
            </div>
            <h3>{blog.title}</h3>
            <div className="archive-inline-tags">
              {[blog.category, ...categories.map((category) => category.name)].filter(Boolean).slice(0, 6).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <div className="archive-rich-content" dangerouslySetInnerHTML={{ __html: buildBlogContent(blog) }} />
          </div>
        </article>

        <section className="archive-comment-card">
          <div className="archive-section-head">
            <p className="archive-side-kicker">Leave a Comment</p>
            <h3>Share your thoughts</h3>
          </div>
          <form className="archive-comment-form" onSubmit={submitComment}>
            <div className="archive-comment-grid">
              <label className="archive-comment-field">
                <span>Name</span>
                <input
                  type="text"
                  placeholder="Your name"
                  value={commentForm.name}
                  onChange={(e) => setCommentForm((prev) => ({ ...prev, name: e.target.value }))}
                />
              </label>
              <label className="archive-comment-field">
                <span>Email</span>
                <input
                  type="email"
                  placeholder="Your email"
                  value={commentForm.email}
                  onChange={(e) => setCommentForm((prev) => ({ ...prev, email: e.target.value }))}
                />
              </label>
            </div>
            <label className="archive-comment-field">
              <span>Comment</span>
              <textarea
                rows="5"
                placeholder="Write your comment"
                value={commentForm.comment}
                onChange={(e) => setCommentForm((prev) => ({ ...prev, comment: e.target.value }))}
              />
            </label>
            {commentSaved ? <p className="archive-comment-saved">Thanks! Your comment was added to the draft queue.</p> : null}
            <button type="submit" className="archive-action-btn">
              Post Comment
            </button>
          </form>
        </section>
      </div>
    </ArchiveShell>
  );
}

function PortfolioArchivePage() {
  const { content } = useSiteContent();
  const siteSettings = content?.siteSettings || {};

  return (
    <ArchiveShell title={siteSettings.portfolioTitle || "Portfolio"}>
      <div className="archive-portfolio-layout">
        <Gallery />
      </div>
    </ArchiveShell>
  );
}

export {
  BlogDetailPage,
  BlogsArchivePage,
  PortfolioArchivePage,
  ServiceDetailPage,
  ServicesArchivePage,
};
