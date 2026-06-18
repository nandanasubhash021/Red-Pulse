import React from 'react';
import './AboutSection.css';

const AboutSection = () => {
  const cards = [
    { title: 'Fast Donor Search', desc: 'Find verified nearby blood donors instantly during medical critical alerts.', icon: '🩸' },
    { title: 'Blood Bank Network', desc: 'Direct secure connection with registered hospitals and local banks.', icon: '🏥' },
    { title: 'Emergency Requests', desc: 'Raise open broadcasts to gather rare configurations fast.', icon: '🚨' },
    { title: 'Secure Platform', desc: 'Completely privacy-compliant role verified infrastructure ecosystem.', icon: '🔒' }
  ];

  return (
    <section className="about-section">
      <div className="section-header">
        <h2>Why Choose RedPulse</h2>
        <p>Our intelligent system is engineered to solve modern supply logistics safely.</p>
      </div>
      <div className="about-grid">
        {cards.map((card, i) => (
          <div key={i} className="about-card">
            <div className="card-icon">{card.icon}</div>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutSection;