import React, { useState } from 'react';
import { BiPhoneCall, BiEnvelope, BiMap, BiSend } from 'react-icons/bi';
import Navbar from "../../components/Navbar/Navbar"; 
import Footer from '../../components/Footer/Footer';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you, ${formData.name}! Your message has been safely received.`);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page">
      <Navbar />

      {/* 1. HERO HEADER BANNER */}
      <section 
        className="contact-hero"
        style={{
          background: `linear-gradient(rgba(26, 29, 32, 0.8), rgba(26, 29, 32, 0.8)), url('/images/hero-banner.jpg') no-repeat center center/cover`
        }}
      >
        <div className="contact-hero-overlay">
          <h1>Contact Our Team</h1>
          <p>Have questions about donations, partnerships, or platform support? We are here to help 24/7.</p>
        </div>
      </section>

      {/* 2. SPLIT GRID CONTAINER */}
      <div className="contact-container contact-grid">
        
        {/* LEFT COLUMN: BRAND CONTACT CARDS & MAP FRAME */}
        <div className="contact-info-sidebar">
          <div className="section-header align-left">
            <h2>Get In Touch</h2>
            <div className="header-line"></div>
          </div>
          <p className="sidebar-intro">
            Reach out to us directly through any of our support channels. Our administrative and emergency dispatch teams respond as quickly as possible.
          </p>

          <div className="info-cards-list">
            <div className="info-card">
              <div className="info-icon-wrapper">
                <BiPhoneCall className="info-icon" />
              </div>
              <div className="info-text">
                <h3>Phone Number</h3>
                <p>+91 484 234 5678</p>
                <p className="subtext">Emergency Hotline: 24/7 Support</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon-wrapper">
                <BiEnvelope className="info-icon" />
              </div>
              <div className="info-text">
                <h3>Email Address</h3>
                <p>support@redpulse.org</p>
                <p className="subtext">General inquiries: info@redpulse.org</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon-wrapper">
                <BiMap className="info-icon" />
              </div>
              <div className="info-text">
                <h3>Headquarters</h3>
                <p>RedPulse Innovation Hub</p>
                <p className="subtext">MG Road, Ernakulam, Kerala - 682016</p>
              </div>
            </div>
          </div>

          {/* Live Google Map Embedded directly to Ernakulam, Kerala */}
          <div className="map-wrapper">
            <iframe
              title="RedPulse Ernakulam Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.65715975416!2d76.281656!3d9.962451!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d44fb6b9975%3A0x6b4ef8fa526a090b!2sM.G.%20Road%2C%20Ernakulam%2C%20Kochi%2C%20Kerala!5e0!3m2!1sen!2sin!4v1718870000000!5m2!1sen!2sin"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTION CONTACT SUBMISSION FORM */}
        <div className="contact-form-wrapper">
          <div className="section-header align-left">
            <h2>Send Us A Message</h2>
            <div className="header-line"></div>
          </div>

          <form onSubmit={handleSubmit} className="actual-contact-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="johndoe@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we assist you?"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                placeholder="Type your message details regarding emergency requests or system access bugs..."
                required
              ></textarea>
            </div>

            <button type="submit" className="btn-submit-contact">
              <BiSend className="btn-send-icon" /> Send Message
            </button>
          </form>
        </div>

      </div>

      <Footer />
    </div>
  );
}

export default Contact;