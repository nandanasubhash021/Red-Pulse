import React from 'react';
import './StatsSection.css';

const StatsSection = () => {
  const stats = [
    { value: '118.5M', label: 'Global Donations Annually (WHO)' },
    { value: '3', label: 'Lives Saved Per Single Donation' },
    { value: '2 Sec', label: 'How Often Someone Needs Blood' },
    { value: '1 in 7', label: 'Hospital Admissions Requiring Blood' }
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