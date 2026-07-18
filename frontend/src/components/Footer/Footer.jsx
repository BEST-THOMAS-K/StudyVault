import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <h2>StudyVault</h2>
          <p>© 2026 All rights reserved.</p>
        </div>
        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/notes">Notes</a>
          <a href="/ai">AI Assistant</a>
          <a href="/pyqs">PYQs</a>
          <a href="/contact">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;