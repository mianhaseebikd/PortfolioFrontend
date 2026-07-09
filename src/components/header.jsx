import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { SiAdobephotoshop, SiFigma, SiReact } from "react-icons/si";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSiteContent } from "../context/SiteContentContext.jsx";

function Header({ compact = false, archiveMode = false, archiveTitle = "" } = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sectionRef = useRef(null);
  const mobileNavRef = useRef(null);
  const { content } = useSiteContent();
  const siteSettings = content?.siteSettings || {};
  const logoSrc = siteSettings.logoUrl || "";
  const resumeHref = siteSettings.resumeUrl || "";

  const navLinks = useMemo(
    () =>
      [
        { label: siteSettings.navHomeLabel || "", href: "/" },
        { label: siteSettings.navAboutLabel || "", href: compact || archiveMode ? "/#about" : "#about" },
        { label: siteSettings.navResumeLabel || "", href: compact || archiveMode ? "/#resume" : "#resume" },
        { label: siteSettings.navPortfolioLabel || "", href: "/portfolio" },
        { label: siteSettings.navServicesLabel || "", href: "/services" },
        { label: siteSettings.navBlogLabel || "", href: "/blog" },
        { label: siteSettings.navContactLabel || "", href: compact || archiveMode ? "/#contact" : "#contact" },
      ].filter((link) => link.label),
    [siteSettings, compact, archiveMode],
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileNavRef.current &&
        !mobileNavRef.current.contains(event.target) &&
        !event.target.closest(".menu-btn")
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  const showArchiveHero = archiveMode && archiveTitle;

  return (
    <div className={`first-container ${compact ? "compact-shell" : ""} ${showArchiveHero ? "archive-shell" : ""}`} ref={sectionRef}>
      <div className={`header-container ${compact ? "compact" : ""} ${isSticky || compact ? "sticky" : ""} ${isVisible || compact ? "show" : ""}`}>
        <div className="navigation-bar">
          <div className="site-logo">
            <a href="/">
              {logoSrc ? <img src={logoSrc} alt={siteSettings.siteName || "logo"} /> : null}
            </a>
          </div>

          <nav>
            {navLinks.map((link) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ))}
            {resumeHref ? (
              <a href={resumeHref} download className="button" style={{ marginLeft: "30px" }}>
                {siteSettings.resumeButtonLabel || ""}
              </a>
            ) : null}
          </nav>

          <button
            className={`menu-btn ${isMenuOpen ? "active" : ""}`}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {createPortal(
        <>
          {isMenuOpen ? <div className="menu-overlay active" onClick={closeMenu} /> : null}
          <nav ref={mobileNavRef} className={`mobile-nav ${isMenuOpen ? "menu-active" : ""}`}>
            <button className="mobile-nav-close" onClick={closeMenu} aria-label="Close menu">
              {"\u00D7"}
            </button>
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} onClick={closeMenu}>
                {link.label}
              </a>
            ))}
            {resumeHref ? (
              <a href={resumeHref} download onClick={closeMenu} className="button">
                {siteSettings.resumeButtonLabel || ""}
              </a>
            ) : null}
          </nav>
        </>,
        document.body,
      )}

      {showArchiveHero ? (
        <div className="row80 hero-row archive-hero-row">
          <div className="archive-hero-banner">
            <h1 className="archive-hero-title">{archiveTitle}</h1>
          </div>
        </div>
      ) : !compact ? (
        <>
          <div className="row80 hero-row">
            <div className={`col-2 hero-left ${isVisible ? "show" : ""}`}>
              <div className="inner-box">
                <h3 className="orange-text">{siteSettings.heroGreeting || ""}</h3>
              </div>
              <div className="inner-box">
                <h2 className="name">{siteSettings.heroName || ""}</h2>
              </div>
              <div className="inner-box">
                <p className="short-para">
                  {siteSettings.heroTitle || ""}
                  {siteSettings.heroTagline ? (
                    <>
                      {" "}
                      <span className="green-text">{siteSettings.heroTagline}</span>
                    </>
                  ) : null}
                </p>
              </div>
              <div className="inner-box">
                <p className="intro-para">{siteSettings.heroDescription || ""}</p>
              </div>
              <div className="inner-box scial-icon-btn">
                <a href="#about">
                  <button className="button">{siteSettings.heroButtonLabel || ""}</button>
                </a>
                <div className="social-icons">
                  {siteSettings.socialLinks?.facebook ? (
                    <a href={siteSettings.socialLinks.facebook}>
                      <FaFacebookF className="icon" />
                    </a>
                  ) : null}
                  {siteSettings.socialLinks?.twitter ? (
                    <a href={siteSettings.socialLinks.twitter}>
                      <FaTwitter className="icon" />
                    </a>
                  ) : null}
                  {siteSettings.socialLinks?.linkedin ? (
                    <a href={siteSettings.socialLinks.linkedin}>
                      <FaLinkedinIn className="icon" />
                    </a>
                  ) : null}
                  {siteSettings.socialLinks?.instagram ? (
                    <a href={siteSettings.socialLinks.instagram}>
                      <FaInstagram className="icon" />
                    </a>
                  ) : null}
                </div>
              </div>
            </div>

            <div className={`col-2 my-image hero-right ${isVisible ? "show" : ""}`}>
              <div className="hero-badge hero-badge-react" aria-hidden="true">
                <SiReact className="hero-badge-icon react-icon" />
              </div>
              <div className="hero-badge hero-badge-figma" aria-hidden="true">
                <SiFigma className="hero-badge-icon figma-icon" />
              </div>
              <div className="hero-badge hero-badge-ps" aria-hidden="true">
                <SiAdobephotoshop className="hero-badge-icon ps-icon" />
              </div>
              {siteSettings.heroImage ? <img src={siteSettings.heroImage} alt={siteSettings.heroName || "Hero"} /> : null}
            </div>
          </div>

          <div className="mouse-wheel">
            <a className="anchor" href="#process">
              <svg
                width="26px"
                height="100%"
                viewBox="0 0 247 390"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeMiterlimit: 1.5,
                }}
              >
                <path
                  id="wheel"
                  d="M123.359,79.775l0,72.843"
                  style={{ fill: "none", stroke: "#E74E2B", strokeWidth: "24px" }}
                />
                <path
                  id="mouse"
                  d="M236.717,123.359c0,-62.565 -50.794,-113.359 -113.358,-113.359c-62.565,0 -113.359,50.794 -113.359,113.359l0,143.237c0,62.565 50.794,113.359 113.359,113.359c62.564,0 113.358,-50.794 113.358,-113.359l0,-143.237Z"
                  style={{ fill: "none", stroke: "#000", strokeWidth: "20px" }}
                />
              </svg>
            </a>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default Header;
