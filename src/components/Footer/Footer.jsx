import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3>RED<span>PULSE</span></h3>
          <p>Connecting lives through seamless digital blood coordination platforms.</p>
        </div>
        <div className="footer-links">
          <h4>Quick Links</h4>
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </div>
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