import React from 'react';
import './CTA.css';

const CTA = () => {
  return (
    <section className="cta">
      <div className="container cta-content">
        <div className="cta-text">
          <h2>Ready to <span className="gradient-text">Study Smarter?</span></h2>
          <p>Join thousands of students already transforming their learning.</p>
        </div>
        <button className="btn-primary cta-btn">Get Started Free</button>
      </div>
    </section>
  );
};

export default CTA;