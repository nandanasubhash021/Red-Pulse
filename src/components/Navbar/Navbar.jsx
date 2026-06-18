import React from 'react';
import {Link} from "react-router-dom";
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
          <li><Link to="/" className="active">Home</Link></li>
<li><Link to="/about">About</Link></li>
<li><Link to="/contact">Contact</Link></li>
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