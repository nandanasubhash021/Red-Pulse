import React from 'react';
import { Link } from 'react-router-dom'; // 🌟 Added Link for page navigation
import Button from '../Button/Button';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <h1>Save Lives Through <br/><span className="highlight">Blood Donation</span></h1>
          <p>Connecting donors, patients, and blood banks seamlessly in one trusted real-time automated network.</p>
          <div className="hero-actions">
            {/* Redirects to registration page */}
            <Link to="/register">
              <Button variant="primary">Become a Donor</Button>
            </Link>
            
            {/* Redirects to the dynamic search portal */}
            <Link to="/find-donors">
              <Button variant="outline">Find Blood</Button>
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="/images/hero-banner.jpg" alt="Blood Donation Concept Illustrated" />
        </div>
      </div>
    </section>
  );
};

export default Hero;