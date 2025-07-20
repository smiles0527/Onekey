import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const AdminMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { hasPermission, user } = useAuthStore();

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
          <div className="dropdown-header">
            <strong>Admin Tools</strong>
            <small>Management & Control</small>
          </div>
          
          <hr className="dropdown-divider" />
          
          <Link to="/admin" className="dropdown-item" onClick={() => setIsOpen(false)}>
            <i className="fas fa-tachometer-alt"></i>
            Admin Dashboard
          </Link>
          
          {hasPermission('manage_users') && (
            <Link to="/admin?tab=users" className="dropdown-item" onClick={() => setIsOpen(false)}>
              <i className="fas fa-users-cog"></i>
              User Management
            </Link>
          )}
          
          {hasPermission('view_activity_logs') && (
            <Link to="/admin?tab=logs" className="dropdown-item" onClick={() => setIsOpen(false)}>
              <i className="fas fa-history"></i>
              Activity Logs
            </Link>
          )}
          
          {hasPermission('manage_timeline') && (
            <Link to="/admin?tab=timeline" className="dropdown-item" onClick={() => setIsOpen(false)}>
              <i className="fas fa-calendar-alt"></i>
              Timeline Management
            </Link>
          )}
          
          <hr className="dropdown-divider" />
          
          <Link to="/dashboard" className="dropdown-item" onClick={() => setIsOpen(false)}>
            <i className="fas fa-user-circle"></i>
            User Dashboard
          </Link>
        </div>
      )}
    </div>
  );
};

export default AdminMenu; 