import React from 'react';
import './StatsSection.css';

const StatsSection = () => {
  const stats = [
    { value: '10,000+', label: 'Registered Donors' },
    { value: '500+', label: 'Lives Saved' },
    { value: '100+', label: 'Partner Blood Banks' },
    { value: '24/7', label: 'Emergency Support' }
  ];

  return (
    <section className="stats-section">
      <div className="stats-container">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <h3>{stat.value}</h3>
            <p>{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;