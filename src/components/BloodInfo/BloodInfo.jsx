import React from 'react';
import './BloodInfo.css';

const BloodInfo = () => {
  const matrix = [
    { group: 'O-', type: 'Universal Donor', give: 'All Groups', receive: 'O-' },
    { group: 'O+', type: 'Common Group', give: 'O+, A+, B+, AB+', receive: 'O-, O+' },
    { group: 'AB+', type: 'Universal Recipient', give: 'AB+ Only', receive: 'All Groups' },
    { group: 'A-', type: 'Rare Profile', give: 'A-, A+, AB-, AB+', receive: 'O-, A-' }
  ];

  return (
    <section className="blood-info-section">
      <div className="section-header">
        <h2>Blood Group Compatibility Matrix</h2>
        <p>Understanding targeted blood profiling helps optimize critical care timelines.</p>
      </div>
      <div className="info-grid">
        {matrix.map((item, index) => (
          <div key={index} className="matrix-card">
            <div className="blood-badge">{item.group}</div>
            <h4>{item.type}</h4>
            <div className="matrix-details">
              <p><strong>Can Donate To:</strong> {item.give}</p>
              <p><strong>Can Receive From:</strong> {item.receive}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BloodInfo;