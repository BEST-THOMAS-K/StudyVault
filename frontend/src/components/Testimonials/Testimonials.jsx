import React from 'react';
import './Testimonials.css';

const testimonials = [
  { name: 'Ananya', role: 'Student', text: 'StudyVault made my exam prep so much easier. The AI summaries are a lifesaver!', avatar: '👩‍🎓' },
  { name: 'Rahul', role: 'Graduate', text: 'I love the community workspace – collaborating with peers has never been this smooth.', avatar: '👨‍🎓' },
  { name: 'Priya', role: 'Teacher', text: 'A fantastic platform for students. The resources are curated perfectly.', avatar: '👩‍🏫' },
];

const Testimonials = () => {
  return (
    <section className="testimonials">
      <div className="container">
        <h2 className="section-title">What Students <span className="gradient-text">Say</span></h2>
        <p className="section-subtitle">Real stories from real learners.</p>
        <div className="testimonial-grid">
          {testimonials.map((t, index) => (
            <div className="testimonial-card fade-in" key={index} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="testimonial-avatar">{t.avatar}</div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <strong>{t.name}</strong>
                <span>{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;