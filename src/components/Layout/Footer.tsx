import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import AuthModal from '../Auth/AuthModal';

const Footer: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const handleAuthClick = () => {
    if (isAuthenticated) {
      return;
    }
    setShowAuthModal(true);
  };

  return (
    <>
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
            <Link to="/timeline">Timeline</Link>
            <Link to="/team">Meet Our Team</Link>
          </div>
          
          <div className="footer-connect">
            <h4>Connect With Us</h4>
            <div className="footer-social">
              <a href="https://instagram.com/onekey" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="mailto:on3keymusic@gmail.com" aria-label="Email">
                <i className="fas fa-envelope"></i>
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <p className="footer-school">Website made by Curtis Wei and Ethan Xie</p>
          </div>
          <div className="footer-bottom-center">
            <p>&copy; 2023 OneKey Student Volunteers. All rights reserved.</p>
          </div>
          <div className="footer-bottom-right">
            {!isAuthenticated && (
              <button className="footer-login-btn" onClick={handleAuthClick}>
                <i className="fas fa-sign-in-alt"></i>
                Login
              </button>
            )}
          </div>
        </div>
      </footer>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};

export default Footer; 