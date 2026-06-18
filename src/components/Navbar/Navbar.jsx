import React from 'react';
import Button from '../Button/Button';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo-section">
          <img src="/images/logo.png" alt="RedPulse Logo" className="logo-img" />
          <span className="logo-text">RED<span className="accent">PULSE</span></span>
        </div>
        
        <ul className="nav-links">
          <li><a href="#" className="active">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>

        <div className="nav-auth">
          <Button variant="secondary">Login</Button>
          <Button variant="primary">Register</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;