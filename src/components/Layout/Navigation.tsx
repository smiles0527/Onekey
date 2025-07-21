import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import AuthModal from '../Auth/AuthModal';
import RegisterModal from '../Auth/RegisterModal';
// UserMenu removed
import AdminMenu from './AdminMenu';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  
  const location = useLocation();
  const { isAuthenticated, user, hasPermission } = useAuthStore();
  
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navClass = `navigation ${isScrolled ? 'scrolled' : ''} ${!isHomePage ? 'subpage-nav' : ''}`;

  return (
    <>
      <header>
        <nav className={navClass}>
          <div className="menu-toggle" onClick={toggleMenu}>
            <i className="fas fa-bars"></i>
          </div>
          
          <Link to="/" className="logo" onClick={closeMenu}>
            ONEKEY
          </Link>
          
          {/* Login button moved to footer */}
          
          <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <li>
              <Link to="/" onClick={closeMenu}>Home</Link>
            </li>
            <li>
              <Link to="/about" onClick={closeMenu}>About</Link>
            </li>
            <li>
              <Link to="/timeline" onClick={closeMenu}>Timeline</Link>
            </li>
            <li>
              <Link to="/team" onClick={closeMenu}>Meet Our Team</Link>
            </li>
            {isAuthenticated && user && hasPermission('basic_admin') && (
              <li className="admin-menu-item">
                <AdminMenu />
              </li>
            )}
          </ul>
        </nav>
      </header>

      {/* AuthModal moved to footer */}

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div 
          className="menu-overlay" 
          onClick={closeMenu}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998,
          }}
        />
      )}

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      
      <RegisterModal 
        isOpen={showRegisterModal} 
        onClose={() => setShowRegisterModal(false)} 
      />
    </>
  );
};

export default Navigation; 