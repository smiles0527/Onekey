import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="modern-footer">
      <div className="footer-content">
        <div className="footer-info">
          <div className="footer-logo">ONEKEY</div>
          <p className="footer-tagline">Student volunteers bridging generations through music, education, and community service</p>
          <p className="footer-contact">on3keymusic@gmail.com</p>
        </div>
        
        <div className="footer-links">
          <h4>Navigate</h4>
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/mission">Our Mission</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/timeline">Timeline</Link>
          <Link to="/get-involved">Get Involved</Link>
          <Link to="/contact">Contact</Link>
        </div>
        
        <div className="footer-connect">
          <h4>Connect With Us</h4>
          <div className="footer-social">
            <a href="https://instagram.com/onekey" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://twitter.com/onekey" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://facebook.com/onekey" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="https://linkedin.com/company/onekey" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="mailto:on3keymusic@gmail.com" aria-label="Email">
              <i className="fas fa-envelope"></i>
            </a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 OneKey Student Volunteers. All rights reserved.</p>
        <p className="footer-school">Founded by Curtis Wei and Ethan Xie</p>
      </div>
    </footer>
  );
};

export default Footer; 