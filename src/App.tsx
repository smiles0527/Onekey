import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Timeline from './pages/Timeline';
import GetInvolved from './pages/GetInvolved';
import Contact from './pages/Contact';
import Mission from './pages/Mission';

function App() {
  // Delayed Smooth Scrolling Effect - Constance Hotels Style
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
      } else if (href && href.startsWith('/') && target.closest('.nav-links')) {
        // Add delay for navigation transitions
        e.preventDefault();
        target.style.opacity = '0.7';
        
        setTimeout(() => {
          window.location.href = href;
        }, 150);
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
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/get-involved" element={<GetInvolved />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/mission" element={<Mission />} />
      </Routes>
    </Layout>
  );
}

export default App; 