import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Testing: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (!isAuthenticated || !user) {
      navigate('/');
      return;
    }

    // Check if user has admin role (admin or super_admin)
    if (user.role !== 'admin' && user.role !== 'super_admin') {
      navigate('/');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  // Don't render anything if user is not authenticated or not an admin
  if (!isAuthenticated || !user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return null;
  }

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'white',
      margin: 0,
      padding: 0,
      zIndex: 9999,
      overflow: 'hidden'
    }}>
      {/* Top-left arrow button */}
      <button
        onClick={handleBackToHome}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          backgroundColor: 'transparent',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          padding: '10px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.2s ease',
          color: '#333',
          width: '50px',
          height: '50px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f0f0f0';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
        title="Back to Home"
      >
        ←
      </button>
    </div>
  );
};

export default Testing;