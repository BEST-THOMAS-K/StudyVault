import React from 'react';
import './Stats.css';

const stats = [
  { number: '10K+', label: 'Study Notes' },
  { number: '1.2K+', label: 'PYQs Solved' },
  { number: '98%', label: 'Student Satisfaction' },
  { number: '24/7', label: 'AI Support' },
];

const Stats = () => {
  return (
    <section className="stats">
      <div className="container stats-grid">
        {stats.map((stat, index) => (
          <div className="stat-card fade-in" key={index} style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="stat-number">{stat.number}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;