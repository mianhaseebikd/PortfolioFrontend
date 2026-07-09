import React, { useState } from 'react';
import TimelineHeading from './heading.jsx';
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import { useSiteContent } from "../context/SiteContentContext.jsx";
import { publicApi } from "../lib/api.js";

const Contact = () => {
  const { content } = useSiteContent();
  const siteSettings = content?.siteSettings || {};
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({ loading: false, success: "", error: "" });
  const contactItems = [
    {
      icon: FaMapMarkerAlt,
      label: "Address",
      value: siteSettings.address || "",
      iconClass: "contact-icon-address",
    },
    {
      icon: FaEnvelope,
      label: "Email",
      value: siteSettings.primaryEmail || "",
      iconClass: "contact-icon-email",
    },
    {
      icon: FaPhoneAlt,
      label: "Phone",
      value: siteSettings.primaryPhone || "",
      iconClass: "contact-icon-phone",
    },
  ].filter((item) => item.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setStatus({ loading: true, success: "", error: "" });
      await publicApi.contact(form);
      setStatus({ loading: false, success: "Message sent successfully.", error: "" });
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      setStatus({ loading: false, success: "", error: error.message || "Failed to send message." });
    }
  };

  return (
    <section className="contact-wrapper" id="contact">
      <TimelineHeading
        title={siteSettings.contactTitle || ""}
        subtitle={siteSettings.contactSubtitle || ""}
        accentWord=""
        description={siteSettings.contactDescription || ""}
      />

      <div className="row80 contact-row">
        <aside className="contact-info-panel" aria-label="Contact information">
          <div className="contact-items">
            {contactItems.map((item) => {
              const Icon = item.icon;
              return (
                <div className="contact-item" key={item.label}>
                  <span className={`contact-icon ${item.iconClass}`} aria-hidden="true">
                    <Icon />
                  </span>
                  <div className="contact-item-text">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        <form className="contact-form-panel" onSubmit={handleSubmit}>
          <div className="contact-field">
            <label htmlFor="contact-name" className="sr-only">Your Name</label>
            <input
              id="contact-name"
              type="text"
              name="name"
              placeholder="Your Name"
              required
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="contact-field">
            <label htmlFor="contact-email" className="sr-only">Your Email</label>
            <input
              id="contact-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Your Email"
              required
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div className="contact-field">
            <label htmlFor="contact-phone" className="sr-only">Your Phone</label>
            <input
              id="contact-phone"
              type="tel"
              name="phone"
              placeholder="Your Phone"
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            />
          </div>

          <div className="contact-field">
            <label htmlFor="contact-subject" className="sr-only">Subject</label>
            <input
              id="contact-subject"
              type="text"
              name="subject"
              placeholder="Subject"
              required
              value={form.subject}
              onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
            />
          </div>

          <div className="contact-field contact-full">
            <label htmlFor="contact-message" className="sr-only">Message</label>
            <textarea
              id="contact-message"
              name="message"
              rows="7"
              placeholder="Write your message here"
              required
              value={form.message}
              onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
            ></textarea>
          </div>

          <div className="contact-actions">
            <button type="submit" className="newsletter-submit" disabled={status.loading}>
              {status.loading ? "Sending..." : siteSettings.contactButtonLabel || ""}
            </button>
          </div>
          {status.success ? <p className="form-success">{status.success}</p> : null}
          {status.error ? <p className="form-error">{status.error}</p> : null}
        </form>
      </div>
    </section>
  );
};

export default Contact;
