import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BiTargetLock, 
  BiShow, 
  BiUserPlus, 
  BiSearchAlt, 
  BiCheckShield, 
  BiHeart 
} from 'react-icons/bi';
import Navbar from "../../components/Navbar/Navbar"; 
import Footer from '../../components/Footer/Footer';
import './About.css';

function About() {
  return (
    <div className="about-page">
      <Navbar />

      {/* 1. Hero Section */}
      {/* 🌟 FIXED PATH: Inline styling references the correct nested static asset directory location */}
      <section 
        className="about-hero"
        style={{
          background: `linear-gradient(rgba(26, 29, 32, 0.75), rgba(26, 29, 32, 0.75)), url('/images/hero-banner.jpg') no-repeat center center/cover`
        }}
      >
        <div className="about-hero-overlay">
          <div className="about-container">
            <h1>About RedPulse</h1>
            <p>Bridging the gap between life-saving donors and patients in need through real-time technology.</p>
          </div>
        </div>
      </section>

      {/* 2 & 3. Mission & Vision Section */}
      <section className="mission-vision-section about-container">
        <div className="mv-card mission-card">
          <div className="mv-icon-wrapper">
            <BiTargetLock className="mv-icon" />
          </div>
          <h2>Our Mission</h2>
          <p>
            To digitize and streamline the blood supply chain, making blood discovery, donor mobilization, 
            and bank inventory management entirely transparent, rapid, and accessible during critical medical emergencies.
          </p>
        </div>

        <div className="mv-card vision-card">
          <div className="mv-icon-wrapper">
            <BiShow className="mv-icon" />
          </div>
          <h2>Our Vision</h2>
          <p>
            To create a world where no life is lost due to a delay in finding blood. We envision an automated, 
            highly responsive ecosystem connecting every hospital, blood bank, and donor seamlessly.
          </p>
        </div>
      </section>

      {/* 4. How RedPulse Works Section */}
      <section className="how-it-works-section">
        <div className="about-container">
          <div className="section-header">
            <h2>How RedPulse Works</h2>
            <div className="header-line"></div>
          </div>
          
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <BiUserPlus className="step-icon" />
              <h3>Register</h3>
              <p>Donors, blood banks, and seekers quickly sign up and complete their verified profiles.</p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <BiSearchAlt className="step-icon" />
              <h3>Search or Request</h3>
              <p>Patients easily locate nearby matching blood types or submit emergency requests instantly.</p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <BiCheckShield className="step-icon" />
              <h3>Match & Save</h3>
              <p>Our smart platform instantly bridges communication to secure the donation safely.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why Blood Donation Matters */}
      <section className="why-donate-section about-container">
        <div className="why-donate-content">
          <div className="section-header align-left">
            <h2>Why Blood Donation Matters</h2>
            <div className="header-line"></div>
          </div>
          <p>
            Blood cannot be manufactured synthetically; it can only come from generous individuals like you. 
            A single blood donation can save up to <strong>three lives</strong>, splitting into components like red cells, 
            plasma, and platelets to treat cancer patients, trauma victims, and complex surgeries.
          </p>
          <ul className="benefits-list">
            <li><BiHeart className="list-icon" /> Sustains local hospital and emergency room inventories.</li>
            <li><BiHeart className="list-icon" /> Offers major health benefits for regular donors (cardiovascular health).</li>
            <li><BiHeart className="list-icon" /> Provides a rapid response mechanism during natural disasters.</li>
          </ul>
        </div>
        <div className="why-donate-image-placeholder">
          <div className="image-graphic-heart">🩸</div>
        </div>
      </section>

      {/* 6. Statistics Section */}
      <section className="about-stats-section">
        <div className="about-container stats-grid">
          <div className="stat-item">
            <h3>10k+</h3>
            <p>Registered Donors</p>
          </div>
          <div className="stat-item">
            <h3>500+</h3>
            <p>Hospitals Connected</p>
          </div>
          <div className="stat-item">
            <h3>25k+</h3>
            <p>Lives Impacted</p>
          </div>
          <div className="stat-item">
            <h3>0</h3>
            <p>Hidden Platform Fees</p>
          </div>
        </div>
      </section>

      {/* 7. Call To Action Section */}
      <section className="about-cta">
        <div className="about-container cta-content">
          <h2>Be the Reason Someone Smiles Today</h2>
          <p>Your small act of courage can rewrite someone's entire future. Join the network today.</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn-primary-about">Become a Donor</Link>
            <Link to="/contact" className="btn-secondary-about">Contact Us</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default About;