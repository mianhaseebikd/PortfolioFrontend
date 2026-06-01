import React from 'react';
import TimelineHeading from './heading.jsx';
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';

const contactItems = [
  {
    icon: FaMapMarkerAlt,
    label: 'Address',
    value: '20, Somewhere in world',
    iconClass: 'contact-icon-address',
  },
  {
    icon: FaEnvelope,
    label: 'Email',
    value: 'hello@dizme.com',
    iconClass: 'contact-icon-email',
  },
  {
    icon: FaPhoneAlt,
    label: 'Phone',
    value: '+123 456 7890',
    iconClass: 'contact-icon-phone',
  },
];

const Contact = () => {
  return (
    <section className="contact-wrapper" id="contact">
      <TimelineHeading
        title="Contact Me"
        subtitle="I Want To Hear From You"
        accentWord="From"
        description="Please fill out the form on this section to contact with me. Or call between 9:00 a.m. and 8:00 p.m. ET, Monday through Friday."
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

        <form className="contact-form-panel" onSubmit={(e) => e.preventDefault()}>
          <div className="contact-field">
            <label htmlFor="contact-name" className="sr-only">Your Name</label>
            <input id="contact-name" type="text" name="name" placeholder="Your Name" required />
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
            />
          </div>

          <div className="contact-field">
            <label htmlFor="contact-phone" className="sr-only">Your Phone</label>
            <input id="contact-phone" type="tel" name="phone" placeholder="Your Phone" />
          </div>

          <div className="contact-field">
            <label htmlFor="contact-subject" className="sr-only">Subject</label>
            <input id="contact-subject" type="text" name="subject" placeholder="Subject" required />
          </div>

          <div className="contact-field contact-full">
            <label htmlFor="contact-message" className="sr-only">Message</label>
            <textarea
              id="contact-message"
              name="message"
              rows="7"
              placeholder="Write your message here"
              required
            ></textarea>
          </div>

          <div className="contact-actions">
            <button type="submit" className="newsletter-submit">Submit Now</button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contact;
