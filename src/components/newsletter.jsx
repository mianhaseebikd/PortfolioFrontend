import React from 'react';
import { FaEnvelopeOpenText } from 'react-icons/fa';

const Newsletter = () => {
  return (
    <section className="newsletter-section">
      <div className="newsletter-row row80">
        <div className="newsletter-left">
          <p className="newsletter-pre">Subscribe Now</p>
          <h2 className="newsletter-title">Get My Newsletter</h2>
          <p className="newsletter-desc">Get latest news, updates, tips and tricks in your inbox</p>

          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="newsletter-email" className="sr-only">Email</label>
            <input
              id="newsletter-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Your email here"
              required
            />
            <button type="submit" className="newsletter-submit">Send Now</button>
          </form>
        </div>

        <div className="newsletter-visual" aria-hidden="true">
          <div className="newsletter-visual-card">
            <div className="visual-mail-icon">
              <FaEnvelopeOpenText />
            </div>
            <div className="visual-copy">
              <p className="visual-kicker">Weekly digest</p>
              <h3>Inbox updates made simple</h3>
              <p>Fresh news, quick tips, and short project notes delivered in one clean email.</p>
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
