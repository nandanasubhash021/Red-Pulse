import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Hero from '../../components/Hero/Hero';
import AboutSection from '../../components/AboutSection/AboutSection';
import StatsSection from '../../components/StatsSection/StatsSection';
import BloodInfo from '../../components/BloodInfo/BloodInfo';
import FAQ from '../../components/FAQ/FAQ';
import ContactForm from '../../components/ContactForm/ContactForm';
import Footer from '../../components/Footer/Footer';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page-wrapper">
      <Navbar />
      <Hero />
      <AboutSection />
      <StatsSection />
      
      {/* Dynamic Emergency Call-out Strip */}
      <div className="emergency-banner-strip">
        <div className="banner-content">
          <h3>Need Blood Urgently in your area?</h3>
          <p>Submit immediate verified medical broadcast requests out to target regions directly.</p>
        </div>
        <button className="banner-btn">Request Blood Now</button>
      </div>

      <BloodInfo />
      <FAQ />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Home;