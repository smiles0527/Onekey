import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, hasPermission } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated || !user) {
      navigate('/');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  // Smooth scrolling animations - Constance style
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, observerOptions);

    // Add animation classes to sections
    const animateElements = document.querySelectorAll('.dashboard-hero, .dashboard-content');
    
    animateElements.forEach((el, index) => {
      el.classList.add('animate-on-scroll');
      el.classList.add(`animate-delay-${Math.min(index + 1, 5)}`);
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="dashboard-page">
      {/* Dashboard Hero Section */}
      <div className="dashboard-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1>Dashboard</h1>
            <p className="hero-subtitle">Welcome back, {user.firstName || user.username}</p>
            <div className="hero-accent-line"></div>
          </div>
        </div>
      </div>

      {/* Dashboard Content Section */}
      <div className="dashboard-content">
        <div className="container">
          <div className="dashboard-header">
            <h2>Your Dashboard</h2>
            <p>Manage your account and view your activity</p>
          </div>
          
          <div className="dashboard-main">
            <div className="dashboard-placeholder">
              <div className="placeholder-icon">
                <i className="fas fa-tachometer-alt"></i>
              </div>
              <h3>Dashboard Content</h3>
              <p>This is a blank dashboard page ready for your content.</p>
              <p>You can easily switch between different dashboard sections here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 