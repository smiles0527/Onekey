import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Timeline from './pages/Timeline';
import MeetOurTeam from './pages/MeetOurTeam';
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';
import Testing from './pages/Testing';

function App() {
  const location = useLocation();

  // Force scroll to top on route change and initial load
  useEffect(() => {
    // Immediate scroll to top
    window.scrollTo(0, 0);
    
    // Also try with a slight delay to ensure DOM is ready
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }, 100);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Additional effect to ensure scroll position on mount
  useEffect(() => {
    const handleLoad = () => {
      // Multiple approaches to ensure scroll to top
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      
      // Force scroll behavior
      document.body.style.scrollBehavior = 'auto';
      document.documentElement.style.scrollBehavior = 'auto';
      
      // Additional scroll to top after a brief delay
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }, 50);
    };
    
    // Run immediately
    handleLoad();
    
    // Also run when window loads
    window.addEventListener('load', handleLoad);
    
    // Also run when DOM content is loaded
    document.addEventListener('DOMContentLoaded', handleLoad);
    
    return () => {
      window.removeEventListener('load', handleLoad);
      document.removeEventListener('DOMContentLoaded', handleLoad);
    };
  }, []);

  // Smooth scrolling animations - Constance Hotels Style
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    // Custom smooth scroll function with delay
    const smoothScrollWithDelay = (target: Element, delay: number = 200) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 90;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          resolve();
        }, delay);
      });
    };

    // Handle anchor link clicks with delay
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      const href = target.getAttribute('href');
      
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(href);
        
        if (targetElement) {
          // Add visual feedback
          target.style.opacity = '0.7';
          
          // Delayed scroll
          smoothScrollWithDelay(targetElement, 200).then(() => {
            target.style.opacity = '1';
          });
        }
      }
    };

    // Handle scroll events with momentum
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      document.body.classList.add('scrolling');
      
      scrollTimeout = setTimeout(() => {
        document.body.classList.remove('scrolling');
      }, 150);
    };

    // Add event listeners
    document.addEventListener('click', handleAnchorClick);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Ensure page starts at the top
    window.scrollTo(0, 0);

    // Smooth page load animation
    document.body.style.opacity = '0';
    setTimeout(() => {
      document.body.style.transition = 'opacity 0.3s ease-in-out';
      document.body.style.opacity = '1';
    }, 50);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <Routes>
      {/* Testing page without layout */}
      <Route path="/testing" element={<Testing />} />
      
      {/* All other pages with layout */}
      <Route path="/*" element={
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/team" element={<MeetOurTeam />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Layout>
      } />
    </Routes>
  );
}

export default App; 