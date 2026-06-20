import React from 'react';
import { Link, useLocation } from "react-router-dom";
import Button from '../Button/Button';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* LOGO BRANDING SECTION */}
        <div className="logo-section">
          <img src="/images/logo.png" alt="RedPulse Logo" className="logo-img" />
          <span className="logo-text">RED<span className="accent">PULSE</span></span>
        </div>
        
        {/* MIDDLE NAVIGATION LINKS */}
        <ul className="nav-links">
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          </li>
          <li>
            <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
          </li>
          <li>
            <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link>
          </li>
        </ul>

        {/* AUTHENTICATION ACTION BUTTONS */}
        <div className="nav-auth">
          <Link to="/login">
            <Button variant="secondary">Login</Button>
          </Link>
          <Link to="/register">
            <Button variant="primary">Register</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;