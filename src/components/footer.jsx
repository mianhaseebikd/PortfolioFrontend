import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { useSiteContent } from "../context/SiteContentContext.jsx";

const Footer = () => {
  const { content } = useSiteContent();
  const siteSettings = content?.siteSettings || {};
  const footerLinks = [
    { label: siteSettings.navHomeLabel || "", href: "/" },
    { label: siteSettings.navAboutLabel || "", href: "/#about" },
    { label: siteSettings.navPortfolioLabel || "", href: "/portfolio" },
    { label: siteSettings.navServicesLabel || "", href: "/services" },
    { label: siteSettings.navBlogLabel || "", href: "/blog" },
    { label: siteSettings.navContactLabel || "", href: "/#contact" },
  ].filter((link) => link.label);

  const socialLinks = [
    { label: "Facebook", href: siteSettings.socialLinks?.facebook || "", icon: FaFacebookF },
    { label: "Instagram", href: siteSettings.socialLinks?.instagram || "", icon: FaInstagram },
    { label: "Twitter", href: siteSettings.socialLinks?.twitter || "", icon: FaTwitter },
    { label: "LinkedIn", href: siteSettings.socialLinks?.linkedin || "", icon: FaLinkedinIn },
  ].filter((link) => link.href);

  return (
    <footer className="site-footer">
      <div className="row80 footer-simple">
        <a href="/" className="footer-logo" aria-label="Go to top">
          {siteSettings.logoUrl ? <img src={siteSettings.logoUrl} alt={siteSettings.siteName || "logo"} /> : null}
        </a>

        <p className="footer-tagline">{siteSettings.footerTagline || ""}</p>

        <div className="footer-socials" aria-label="Social links">
          {socialLinks.map((item) => {
            const Icon = item.icon;
            return (
              <a key={item.label} href={item.href} aria-label={item.label} className="footer-social">
                <Icon />
              </a>
            );
          })}
        </div>

        <span className="footer-divider" aria-hidden="true"></span>

        <nav className="footer-links" aria-label="Footer navigation">
          {footerLinks.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {siteSettings.siteName || ""}</span>
        <span>All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
