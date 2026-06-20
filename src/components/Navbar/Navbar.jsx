import React from 'react';
// 1. Added useLocation to the react-router-dom import
import { Link, useLocation } from "react-router-dom";
import Button from '../Button/Button';
import './Navbar.css';

const Navbar = () => {
  // 2. Initialize the location hook to listen to the browser URL path
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* LOGO BRANDING SECTION */}
        <div className="logo-section">
          {/* Vite reads the public/ directory directly using the absolute root '/' path */}
          <img src="/images/logo.png" alt="RedPulse Logo" className="logo-img" />
          <span className="logo-text">RED<span className="accent">PULSE</span></span>
        </div>
        
        {/* MIDDLE NAVIGATION LINKS */}
        <ul className="nav-links">
          {/* 3. Replaced hardcoded classes with dynamic checks */}
          <li>
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              className={location.pathname === '/about' ? 'active' : ''}
            >
              About
            </Link>
          </li>
          <li>
            <Link 
              to="/contact" 
              className={location.pathname === '/contact' ? 'active' : ''}
            >
              Contact
            </Link>
          </li>
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