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
            <p>📞 +91 484 234 5678</p>
            <p>📍 Red Pulse Innovation Hub ,MG Road,Ernakulam,Kerala-682016</p>
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