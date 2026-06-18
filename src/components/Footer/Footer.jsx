import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* BRAND COLUMN WITH LOGO */}
        <div className="footer-brand">
          <div className="footer-logo-group">
            <img src="/images/logo.png" alt="RedPulse Footer Logo" className="footer-logo-img" />
            <h3>RED<span>PULSE</span></h3>
          </div>
          <p>Connecting lives through seamless digital blood coordination platforms.</p>
        </div>
        
        {/* QUICK NAVIGATION */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </div>
        
        {/* MEDICAL PORTALS SERVICES */}
        <div className="footer-services">
          <h4>Services</h4>
          <a href="#">Find Donor</a>
          <a href="#">Blood Banks</a>
          <a href="#">Emergency Request</a>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2026 RedPulse. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;