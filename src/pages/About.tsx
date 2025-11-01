import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentMonthYear } from '../utils/dateUtils';

const About: React.FC = () => {
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
          
          // Add staggered animations for child elements
          const children = entry.target.querySelectorAll('.value-card, .team-member, .milestone-item');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('animate');
            }, index * 100);
          });
        }
      });
    }, observerOptions);

    // Add animation classes to sections
    const animateElements = document.querySelectorAll('.about-hero, .philosophy-about, .story-timeline, .leadership-section, .impact-stats, .join-about');
    
    animateElements.forEach((el, index) => {
      el.classList.add('animate-on-scroll');
      el.classList.add(`animate-delay-${Math.min(index + 1, 5)}`);
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-page">
      {/* Hero Section - Constance Style */}
      <section className="about-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <div className="container">
            <div className="hero-content">
              <h1>About OneKey</h1>
              <p className="hero-subtitle">A student-driven organization bridging generations through music, education, and community service</p>
              <div className="hero-accent-line"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section - Like Constance */}
      <section className="philosophy-about">
        <div className="container">
          <div className="philosophy-header">
            <h2>OUR STORY</h2>
          </div>
          
          <div className="philosophy-content">
            <div className="philosophy-main">
              <h3>Where Passion Meets Purpose</h3>
              <p className="lead-text">OneKey was born from a simple belief: that music has the power to bridge generations and create lasting connections in our community.</p>
              <p>Founded in 2020, our organization began as a small initiative to bring musical performances to local senior living facilities. What started as weekend concerts has grown into a comprehensive community service program touching the lives of hundreds of students and seniors alike.</p>
              <p>Today, OneKey stands as a testament to the impact young people can make when given the opportunity to serve. Our volunteers don't just perform music—they create moments of joy, forge meaningful relationships, and develop leadership skills that will serve them throughout their lives.</p>
            </div>
            <div className="story-image">
              <img src={`${process.env.PUBLIC_URL}/pics/onekey.jpg`} alt="OneKey Team" />
            </div>
          </div>
        </div>
      </section>

      {/* Story Timeline - Constance Landmark Style */}
      <section className="story-timeline">
        <div className="container">
          <div className="timeline-header">
            <h2>Our Journey</h2>
            <p>Milestones that shaped our mission</p>
          </div>
          
          <div className="timeline-milestones">
            <div className="milestone-item">
              <div className="milestone-year">2020</div>
              <div className="milestone-content">
                <h3>The Beginning</h3>
                <p>OneKey organizes the first senior home concert with just 5 student volunteers, performing for 20 residents at Sunset Manor.</p>
                <div className="milestone-tag">FOUNDING</div>
              </div>
            </div>
            
            <div className="milestone-item reverse">
              <div className="milestone-year">2021</div>
              <div className="milestone-content">
                <h3>Program Expansion</h3>
                <p>Launch of weekly concert series across 3 senior facilities, establishing our signature blend of classical and contemporary performances.</p>
                <div className="milestone-tag">GROWTH</div>
              </div>
            </div>
            
            <div className="milestone-item">
              <div className="milestone-year">2022</div>
              <div className="milestone-content">
                <h3>Educational Outreach</h3>
                <p>Introduction of tutoring programs, expanding our mission beyond music to include academic support for students of all ages.</p>
                <div className="milestone-tag">EDUCATION</div>
              </div>
            </div>
            
            <div className="milestone-item reverse">
              <div className="milestone-year">2023</div>
              <div className="milestone-content">
                <h3>Community Recognition</h3>
                <p>Received the Youth Volunteer Excellence Award and began our major fundraising initiatives for local families in need.</p>
                <div className="milestone-tag">RECOGNITION</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics - Dark Section */}
      <section className="impact-stats">
        <div className="container">
          <div className="stats-header">
            <h2>OUR IMPACT IN NUMBERS</h2>
            <p>as of {getCurrentMonthYear()}</p>
          </div>
          
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">200+</div>
              <div className="stat-label">Seniors Served Weekly</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-number">85+</div>
              <div className="stat-label">Student Volunteers</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-number">2,500+</div>
              <div className="stat-label">Volunteer Hours</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-number">$15,000+</div>
              <div className="stat-label">Funds Raised</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-number">5</div>
              <div className="stat-label">Partner Facilities</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-number">150+</div>
              <div className="stat-label">Performances Given</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid - Constance Style */}
      {/* 
      <section className="values-about">
        <div className="container">
          <div className="values-header">
            <h2>Our Values</h2>
            <p>The principles that guide our mission</p>
          </div>
          
          <div className="values-grid-about">
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-heart"></i>
              </div>
              <h3>COMPASSION</h3>
              <p>We lead with empathy and genuine care for every person we serve, creating meaningful connections across generations.</p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-star"></i>
              </div>
              <h3>EXCELLENCE</h3>
              <p>We strive for the highest standards in our performances, programs, and service to the community.</p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>INCLUSIVITY</h3>
              <p>We welcome volunteers from all backgrounds and ensure everyone has a place in our community of service.</p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-seedling"></i>
              </div>
              <h3>GROWTH</h3>
              <p>We believe in the power of service to develop character, leadership, and lifelong skills in our volunteers.</p>
            </div>
          </div>
        </div>
      </section>
      */}

      {/* Join Section - Luxury CTA */}
      <section className="join-about">
        <div className="container">
          <div className="join-content">
            <h2>Ready to Make a Difference?</h2>
            <p>Join OneKey and become part of a student-driven organization that's transforming communities through music, education, and service. Whether you're a performer, tutor, or community supporter, there's a place for you in our mission.</p>
            <div className="join-buttons">
              <Link to="/contact" className="btn-secondary">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 