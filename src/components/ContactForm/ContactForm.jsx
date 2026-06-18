import React from 'react';
import Button from '../Button/Button';
import './ContactForm.css';

const ContactForm = () => {
  return (
    <section className="contact-section">
      <div className="contact-grid">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>Have operational or connectivity questions? Reach our processing team directly.</p>
          <div className="details-list">
            <p>📧 support@redpulse.org</p>
            <p>📞 +1 (555) 019-2831</p>
            <p>📍 Medical Hub Crossing, Building 4B</p>
          </div>
        </div>
        <form className="contact-form-element" onSubmit={(e) => e.preventDefault()}>
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Write message..." rows="4" required></textarea>
          <Button variant="primary" type="submit">Send Message</Button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;