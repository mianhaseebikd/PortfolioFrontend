import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const navLinks = [
  { label: "Home", href: "index.html" },
  { label: "About", href: "#about" },
  { label: "Resume", href: "#resume" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Services", href: "#services" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

function Header() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sectionRef = useRef(null);
  const mobileNavRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 200);
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

  return (
    <div className="first-container" ref={sectionRef}>
      <div
        className={`header-container ${isSticky ? "sticky" : ""} ${isVisible ? "show" : ""}`}
      >
        <div className="navigation-bar">
          <div className="site-logo">
            <a href="#">
              <img src="/images/ha-webz.png" alt="ha-webz logo" />
            </a>
          </div>

          {/* Desktop nav - hidden on mobile via CSS */}
          <nav>
            {navLinks.map((link) => (
              <a key={link.label} href={link.href}>{link.label}</a>
            ))}
            <a href="/images/my-resume.png" download className="button" style={{marginLeft: "30px"}}>
              Download CV
            </a>
          </nav>

          {/* Hamburger - only shown on mobile via CSS */}
          <button
            className={`menu-btn ${isMenuOpen ? "active" : ""}`}
            onClick={() => setIsMenuOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile nav portal - renders on body to escape stacking context */}
      {createPortal(
        <>
          {isMenuOpen && (
            <div className="menu-overlay active" onClick={closeMenu} />
          )}
          <nav
            ref={mobileNavRef}
            className={`mobile-nav ${isMenuOpen ? "menu-active" : ""}`}
          >
            <button className="mobile-nav-close" onClick={closeMenu} aria-label="Close menu">✕</button>
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} onClick={closeMenu}>
                {link.label}
              </a>
            ))}
            <a href="/images/my-resume.png" download onClick={closeMenu} className="button">
              Download CV
            </a>
          </nav>
        </>,
        document.body
      )}

      {/* Hero Section */}
      <div className="row80 hero-row">
        <div className={`col-2 hero-left ${isVisible ? "show" : ""}`}>
          <div className="inner-box">
            <h3 className="orange-text">Hello, I'm</h3>
          </div>
          <div className="inner-box">
            <h2 className="name">Haseeb Ahmad</h2>
          </div>
          <div className="inner-box">
            <p className="short-para">
              A <span className="green-text"> Creative Web Designer</span> From{" "}
              <span className="blue-text">Pakistan</span>
            </p>
          </div>
          <div className="inner-box">
            <p className="intro-para">
              I'm a creative WordPress &amp; Web Designer from Pakistan, turning
              ideas into visually stunning and fully functional websites with
              passion and precision.
            </p>
          </div>
          <div className="inner-box scial-icon-btn">
            <a href="#about">
              <button className="button">About Me</button>
            </a>
            <div className="social-icons">
              <a href="#"><FaFacebookF className="icon" /></a>
              <a href="#"><FaTwitter className="icon" /></a>
              <a href="#"><FaLinkedinIn className="icon" /></a>
              <a href="#"><FaInstagram className="icon" /></a>
            </div>
          </div>
        </div>

        <div className={`col-2 my-image hero-right ${isVisible ? "show" : ""}`}>
          <img src="/images/Haseeb-dsk.png" alt="Haseeb" />
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
    </div>
  );
}

export default Header;
