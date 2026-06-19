import React from 'react';
import Button from '../Button/Button';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        
        {/* BRAND LOGO & TITLE */}
        <div className="logo-section">
          {/* Vite pulls directly from the public/ folder via the absolute '/' path */}
          <img src="/images/logo.png" alt="RedPulse Logo" className="logo-img" />
          <span className="logo-text">RED<span className="accent">PULSE</span></span>
        </div>
        
        {/* NAVIGATION LINKS */}
        <ul className="nav-links">
          <li><a href="#" className="active">Home</a></li>
          <li><a href="#">About Us</a></li>
          <li><a href="#">Contact</a></li>
        </ul>

        {/* AUTHENTICATION ACTION BUTTONS */}
        <div className="nav-auth">
          <Button variant="secondary">Login</Button>
          <Button variant="primary">Register</Button>
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;