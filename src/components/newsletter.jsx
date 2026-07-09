import React, { useState } from 'react';
import { FaEnvelopeOpenText } from 'react-icons/fa';
import { useSiteContent } from "../context/SiteContentContext.jsx";
import { publicApi } from "../lib/api.js";

const Newsletter = () => {
  const { content } = useSiteContent();
  const siteSettings = content?.siteSettings || {};
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ loading: false, success: "", error: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setStatus({ loading: true, success: "", error: "" });
      await publicApi.newsletter({ email });
      setStatus({ loading: false, success: "Subscribed successfully.", error: "" });
      setEmail("");
    } catch (error) {
      setStatus({ loading: false, success: "", error: error.message || "Failed to subscribe." });
    }
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-row row80">
        <div className="newsletter-left">
          <p className="newsletter-pre">{siteSettings.newsletterPre || ""}</p>
          <h2 className="newsletter-title">{siteSettings.newsletterTitle || ""}</h2>
          <p className="newsletter-desc">{siteSettings.newsletterDescription || ""}</p>

          <form className="newsletter-form" onSubmit={handleSubmit}>
            <label htmlFor="newsletter-email" className="sr-only">Email</label>
            <input
              id="newsletter-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Your email here"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="newsletter-submit" disabled={status.loading}>
              {status.loading ? "Sending..." : siteSettings.newsletterButtonLabel || ""}
            </button>
          </form>
          {status.success ? <p className="form-success">{status.success}</p> : null}
          {status.error ? <p className="form-error">{status.error}</p> : null}
        </div>

        <div className="newsletter-visual" aria-hidden="true">
          <div className="newsletter-visual-card">
            <div className="visual-mail-icon">
              <FaEnvelopeOpenText />
            </div>
            <div className="visual-copy">
              <p className="visual-kicker">Weekly digest</p>
              <h3>Inbox updates made simple</h3>
              <p>Quick tips, useful updates, and short project notes delivered in one clean email.</p>
            </div>
            <div className="visual-tags">
              <span>Design</span>
              <span>Updates</span>
              <span>Tips</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
