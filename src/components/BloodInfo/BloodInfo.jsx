import React from 'react';
import './BloodInfo.css';

const BloodInfo = () => {
  const matrix = [
    { group: 'O-', type: 'Universal Donor', give: 'All Blood Types', receive: 'O- Only' },
    { group: 'O+', type: 'Most Common Type', give: 'O+, A+, B+, AB+', receive: 'O-, O+' },
    { group: 'A-', type: 'Rare Type', give: 'A-, A+, AB-, AB+', receive: 'O-, A-' },
    { group: 'A+', type: 'High Demand Type', give: 'A+, AB+', receive: 'O-, O+, A-, A+' },
    { group: 'B-', type: 'Highly Rare Type', give: 'B-, B+, AB-, AB+', receive: 'O-, B-' },
    { group: 'B+', type: 'Critical Type', give: 'B+, AB+', receive: 'O-, O+, B-, B+' },
    { group: 'AB-', type: 'Rarest Patient Type', give: 'AB-, AB+', receive: 'O-, A-, B-, AB-' },
    { group: 'AB+', type: 'Universal Recipient', give: 'AB+ Only', receive: 'All Blood Types' }
  ];

  return (
    <section className="blood-info-section">
      <div className="section-header">
        <h2>Clinical Compatibility Matrix</h2>
        <p>Accurate biological compatibility pathways for emergency response coordination.</p>
      </div>
      <div className="info-grid">
        {matrix.map((item, index) => (
          <div key={index} className="matrix-card">
            <div className="blood-badge">{item.group}</div>
            <h4>{item.type}</h4>
            <div className="matrix-details">
              <p><strong>Can Give To:</strong> {item.give}</p>
              <p><strong>Can Receive From:</strong> {item.receive}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BloodInfo;