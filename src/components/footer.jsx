import React from 'react';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from 'react-icons/fa';

const footerLinks = [
  { label: 'Home', href: '#' },
  { label: 'About', href: '#about' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Services', href: '#services' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
];

const socialLinks = [
  { label: 'Facebook', href: '#', icon: FaFacebookF },
  { label: 'Instagram', href: '#', icon: FaInstagram },
  { label: 'Twitter', href: '#', icon: FaTwitter },
  { label: 'LinkedIn', href: '#', icon: FaLinkedinIn },
];

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="row80 footer-simple">
        <a href="#" className="footer-logo" aria-label="Go to top">
          <img src="/images/ha-webz.png" alt="ha-webz logo" />
        </a>

        <p className="footer-tagline">
          Clean, modern web design with a strong focus on clarity and user experience.
        </p>

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
        <span>(c) 2026 Haseeb Ahmad</span>
        <span>All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
