import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const AdminMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, hasPermission, logout } = useAuthStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Only show admin menu if user has admin permissions
  if (!hasPermission('basic_admin')) {
    return null;
  }

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div className="admin-menu" ref={menuRef}>
      <button 
        className="admin-menu-btn" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="fas fa-cog"></i>
        <span>Admin</span>
        <i className={`fas fa-chevron-down ${isOpen ? 'rotated' : ''}`}></i>
      </button>
      
      {isOpen && (
        <div className="admin-dropdown active">
          <Link to="/admin" className="dropdown-item" onClick={() => setIsOpen(false)}>
            <i className="fas fa-tachometer-alt"></i>
            View Admin Panel
          </Link>
          
          <hr className="dropdown-divider" />
          
          <button className="dropdown-item" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminMenu; 