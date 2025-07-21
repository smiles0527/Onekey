import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTeamStore } from '../store/teamStore';

const MeetOurTeam: React.FC = () => {
  const { getTeamMembersBySection } = useTeamStore();
  
  const leadershipMembers = getTeamMembersBySection('leadership');
  const communicationsMembers = getTeamMembersBySection('communications');
  const coordinatorsMembers = getTeamMembersBySection('coordinators');
  const alumniMembers = getTeamMembersBySection('alumni');
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
          const children = entry.target.querySelectorAll('.team-member-card, .alumni-card, .leadership-card, .volunteer-card');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('animate');
            }, index * 100);
          });
        }
      });
    }, observerOptions);

    // Add animation classes to sections
    const animateElements = document.querySelectorAll('.team-hero, .leadership-section, .communications-section, .coordinators-section, .alumni-section, .join-team-section');
    
    animateElements.forEach((el, index) => {
      el.classList.add('animate-on-scroll');
      el.classList.add(`animate-delay-${Math.min(index + 1, 5)}`);
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="team-page">
      {/* Hero Section - Constance Style */}
      <section className="team-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <div className="container">
            <div className="hero-content">
              <h1>Meet Our Team</h1>
              <p className="hero-subtitle">The passionate students and volunteers who bring OneKey's mission to life through music, education, and community service</p>
              <div className="hero-accent-line"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="leadership-section">
        <div className="container">
          <div className="section-header">
            <h2>LEADERSHIP</h2>
            <p>Founders driving OneKey's vision</p>
          </div>
          
          <div className="leadership-grid">
            {leadershipMembers.map((member) => (
              <div key={member.id} className="team-member-card">
                <div className="member-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <div className="member-details">
                    <span className="member-school">{member.school}</span>
                    <span className="member-role">{member.role}</span>
                  </div>
                  <p className="member-bio">{member.bio}</p>
                  {member.instagram && (
                    <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="instagram-btn">
                      <i className="fab fa-instagram"></i>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Communications Team Section */}
      <section className="communications-section">
        <div className="container">
          <div className="section-header">
            <h2>COMMUNICATIONS</h2>
            <p>Managing outreach and community connections</p>
          </div>
          
          <div className="communications-grid">
            {communicationsMembers.map((member) => (
              <div key={member.id} className="team-member-card">
                <div className="member-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <div className="member-details">
                    <span className="member-school">{member.school}</span>
                    <span className="member-role">{member.role}</span>
                  </div>
                  <p className="member-bio">{member.bio}</p>
                  {member.instagram && (
                    <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="instagram-btn">
                      <i className="fab fa-instagram"></i>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Coordinators Section */}
      <section className="coordinators-section">
        <div className="container">
          <div className="section-header">
            <h2>COORDINATORS</h2>
            <p>Leading our educational and musical programs</p>
          </div>
          
          <div className="coordinators-grid">
            {coordinatorsMembers.map((member) => (
              <div key={member.id} className="team-member-card">
                <div className="member-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <div className="member-details">
                    <span className="member-school">{member.school}</span>
                    <span className="member-role">{member.role}</span>
                  </div>
                  <p className="member-bio">{member.bio}</p>
                  {member.instagram && (
                    <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="instagram-btn">
                      <i className="fab fa-instagram"></i>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alumni Section */}
      <section className="alumni-section">
        <div className="container">
          <div className="section-header">
            <h2>ALUMNI</h2>
            <p>Founding members who continue to inspire our mission</p>
          </div>
          
          <div className="alumni-grid">
            {alumniMembers.map((member) => (
              <div key={member.id} className="alumni-card">
                <div className="member-image">
                  {member.image ? (
                    <img src={member.image} alt={member.name} />
                  ) : (
                    <div className="member-image-placeholder">
                      <i className="fas fa-user"></i>
                    </div>
                  )}
                </div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <div className="member-details">
                    <span className="member-school">{member.school}</span>
                    <span className="member-role">{member.role}</span>
                  </div>
                  <p className="member-bio">{member.bio}</p>
                  {member.instagram && (
                    <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="instagram-btn">
                      <i className="fab fa-instagram"></i>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Team Section */}
      <section className="join-team-section">
        <div className="container">
          <div className="join-content">
            <h2>Join Our Team</h2>
            <p>Ready to make a difference? OneKey is always looking for passionate students who want to give back to their community through music and education.</p>
            
            <div className="join-opportunities">
              <div className="opportunity-card">
                <div className="opportunity-icon">
                  <i className="fas fa-music"></i>
                </div>
                <h3>Musicians</h3>
                <p>Share your musical talents with senior residents through weekly concerts and performances.</p>
              </div>
              
              <div className="opportunity-card">
                <div className="opportunity-icon">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <h3>Tutors</h3>
                <p>Help students succeed academically through our after-school tutoring programs.</p>
              </div>
              
              <div className="opportunity-card">
                <div className="opportunity-icon">
                  <i className="fas fa-users"></i>
                </div>
                <h3>Leaders</h3>
                <p>Take on leadership roles and help expand OneKey's impact in the community.</p>
              </div>
            </div>
            
            <div className="join-actions">
              <Link to="/about" className="btn-primary">
                <i className="fas fa-info-circle"></i>
                About Us
              </Link>
              <a href="mailto:on3keymusic@gmail.com" className="btn-secondary">
                <i className="fas fa-envelope"></i>
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MeetOurTeam; 