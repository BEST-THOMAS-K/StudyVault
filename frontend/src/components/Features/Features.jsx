import React from 'react';
import './Features.css';

const features = [
  { icon: '📓', title: 'My Notes', description: '245 Notes Available', link: '/notes' },
  { icon: '🤖', title: 'AI Assistant', description: 'Generate summaries instantly', link: '/ai' },
  { icon: '📄', title: 'Previous Year Papers', description: '1200+ Solved Question Papers', link: '/pyqs' },
  { icon: '👥', title: 'Team Workspace', description: 'Collaborate with classmates', link: '/team' },
];

const Features = () => {
  return (
    <section className="features">
      <div className="container">
        <h2 className="section-title">Your <span className="gradient-text">Workspace</span></h2>
        <p className="section-subtitle">Everything you need to excel in your studies.</p>
        <div className="features-grid">
          {features.map((feature, index) => (
            <a href={feature.link} className="feature-card fade-in" key={index} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
              <span className="feature-link">Open →</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;