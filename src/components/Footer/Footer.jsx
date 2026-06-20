import React from 'react';
// 🌟 CRITICAL: Import Link from react-router-dom to handle SPA page swapping without refreshes
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  // Handy utility to smoothly pull the page window back to the top when navigating
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
          {/* 🌟 FIXED: Swapped <a> with <Link to="..."> and added top-scrolling */}
          <Link to="/" onClick={scrollToTop}>Home</Link>
          <Link to="/about" onClick={scrollToTop}>About</Link>
          <Link to="/contact" onClick={scrollToTop}>Contact</Link>
        </div>
        
        {/* MEDICAL PORTALS SERVICES */}
        <div className="footer-services">
          <h4>Services</h4>
          <Link to="/find-donor" onClick={scrollToTop}>Find Donor</Link>
          <Link to="/blood-banks" onClick={scrollToTop}>Blood Banks</Link>
          <Link to="/emergency" onClick={scrollToTop}>Emergency Request</Link>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2026 RedPulse. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;