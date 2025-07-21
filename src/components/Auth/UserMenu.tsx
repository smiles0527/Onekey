import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore, User } from '../../store/authStore';
import UserManagement from './UserManagement';
import ActivityLogs from './ActivityLogs';

interface UserMenuProps {
  user: User;
}

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showActivityLogs, setShowActivityLogs] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { logout, hasPermission } = useAuthStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleIcon = (role: string) => {
    // Use generic user icon for all roles to hide admin status
    return 'fas fa-user';
  };

  const getDisplayName = () => {
    // Return empty string to hide user name display
    return '';
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const handleManageUsers = () => {
    setShowUserManagement(true);
    setIsOpen(false);
  };

  const handleViewLogs = () => {
    setShowActivityLogs(true);
    setIsOpen(false);
  };

  return (
    <div className="user-menu" ref={menuRef}>
      <button 
        className="user-btn" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className={getRoleIcon(user.role)}></i>
        <i className={`fas fa-chevron-down ${isOpen ? 'rotated' : ''}`}></i>
      </button>
      
      {isOpen && (
        <div className="user-dropdown active">
          {/* User info hidden */}
          
          <hr className="dropdown-divider" />
          
          <Link to="/dashboard" className="dropdown-item" onClick={() => setIsOpen(false)}>
            <i className="fas fa-tachometer-alt"></i>
            Dashboard
          </Link>
          
          {hasPermission('basic_admin') && (
            <Link to="/admin" className="dropdown-item" onClick={() => setIsOpen(false)}>
              <i className="fas fa-cog"></i>
              Admin Portal
            </Link>
          )}
          
          {hasPermission('basic_admin') && hasPermission('manage_users') && (
            <button className="dropdown-item" onClick={(e) => { e.preventDefault(); handleManageUsers(); }}>
              <i className="fas fa-users-cog"></i>
              Manage Users
            </button>
          )}
          
          {hasPermission('basic_admin') && hasPermission('view_activity_logs') && (
            <button className="dropdown-item" onClick={(e) => { e.preventDefault(); handleViewLogs(); }}>
              <i className="fas fa-history"></i>
              Activity Logs
            </button>
          )}
          
          <hr className="dropdown-divider" />
          
          <button className="dropdown-item" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      )}

      {/* User Management Modal */}
      <UserManagement 
        isOpen={showUserManagement}
        onClose={() => setShowUserManagement(false)}
      />
      
      {/* Activity Logs Modal */}
      <ActivityLogs 
        isOpen={showActivityLogs}
        onClose={() => setShowActivityLogs(false)}
      />
    </div>
  );
};

export default UserMenu; 