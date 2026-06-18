import React, { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
  const faqs = [
    { q: "Who can donate blood?", a: "Individuals aged between 18-65, weighing over 45kg with optimal hemoglobin markers." },
    { q: "How often can I donate?", a: "Safe interval guidelines require a wait time of 56 days between standard red blood cell drops." },
    { q: "Is blood donation safe?", a: "Yes, fully single-use sterile medical packs ensure no transmission parameters exist." }
  ];

  const [openIdx, setOpenIdx] = useState(null);

  return (
    <section className="faq-section">
      <div className="section-header">
        <h2>Frequently Asked Questions</h2>
      </div>
      <div className="faq-container">
        {faqs.map((faq, idx) => (
          <div key={idx} className="faq-item" onClick={() => setOpenIdx(openIdx === idx ? null : idx)}>
            <div className="faq-question">
              <h4>{faq.q}</h4>
              <span>{openIdx === idx ? '−' : '+'}</span>
            </div>
            {openIdx === idx && <div className="faq-answer"><p>{faq.a}</p></div>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;