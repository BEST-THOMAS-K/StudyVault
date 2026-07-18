import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-gradient"></div>
      <div className="container hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            Study Smarter.
            <br />
            <span className="gradient-text">Learn Faster.</span>
          </h1>
          <p className="hero-description">
            StudyVault is your all-in-one academic platform. Access notes, 
            previous year papers, AI-powered summaries, and collaborate 
            with classmates – all in one modern workspace.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary">Get Started</button>
            <button className="btn-secondary">Explore Notes</button>
          </div>
        </div>
        <div className="hero-illustration">
          <div className="illustration-grid">
            <div className="icon-box box-1">📚</div>
            <div className="icon-box box-2">🤖</div>
            <div className="icon-box box-3">📝</div>
            <div className="icon-box box-4">👥</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;