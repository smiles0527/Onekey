import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const GetInvolved: React.FC = () => {
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
          const children = entry.target.querySelectorAll('.opportunity-card, .step-item, .volunteer-card');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('animate');
            }, index * 100);
          });
        }
      });
    }, observerOptions);

    // Add animation classes to sections
    const animateElements = document.querySelectorAll('.involved-hero, .opportunities-section, .process-section, .volunteer-spotlight, .requirements-section, .involved-cta');
    
    animateElements.forEach((el, index) => {
      el.classList.add('animate-on-scroll');
      el.classList.add(`animate-delay-${Math.min(index + 1, 5)}`);
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="get-involved-page">
      {/* Hero Section - Constance Style */}
      <section className="involved-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <div className="container">
            <div className="hero-content">
              <h1>Get Involved</h1>
              <p className="hero-subtitle">Join our community of passionate volunteers and make a meaningful impact through music, education, and service</p>
              <div className="hero-accent-line"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Opportunities Section */}
      <section className="opportunities-section">
        <div className="container">
          <div className="opportunities-header">
            <h2>VOLUNTEER OPPORTUNITIES</h2>
            <p>Find the perfect way to contribute to our mission</p>
          </div>
          
          <div className="opportunities-grid">
            <div className="opportunity-card featured">
              <div className="opportunity-icon">
                <i className="fas fa-music"></i>
              </div>
              <div className="opportunity-content">
                <h3>Musicians & Performers</h3>
                <p className="opportunity-subtitle">Share your musical talents</p>
                <p>Join our weekly concert series at senior living facilities. Perfect for students of all skill levels who want to bring joy through music while gaining valuable performance experience.</p>
                <div className="opportunity-details">
                  <div className="detail-item">
                    <i className="fas fa-calendar"></i>
                    <span>Weekly commitment</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-clock"></i>
                    <span>2-3 hours per week</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-users"></i>
                    <span>All skill levels</span>
                  </div>
                </div>
                <div className="opportunity-requirements">
                  <h4>What You'll Need:</h4>
                  <ul>
                    <li>Basic musical ability (instrument or voice)</li>
                    <li>Reliable transportation</li>
                    <li>Enthusiasm for community service</li>
                    <li>Commitment to weekly schedule</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="opportunity-card featured">
              <div className="opportunity-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <div className="opportunity-content">
                <h3>Academic Tutors</h3>
                <p className="opportunity-subtitle">Help students succeed</p>
                <p>Provide one-on-one and small group tutoring for students from elementary through high school. Make a direct impact on educational outcomes in your community.</p>
                <div className="opportunity-details">
                  <div className="detail-item">
                    <i className="fas fa-calendar"></i>
                    <span>Flexible schedule</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-clock"></i>
                    <span>2-4 hours per week</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-book"></i>
                    <span>Various subjects</span>
                  </div>
                </div>
                <div className="opportunity-requirements">
                  <h4>What You'll Need:</h4>
                  <ul>
                    <li>Strong academic skills in target subjects</li>
                    <li>Patience and communication skills</li>
                    <li>Background check (provided)</li>
                    <li>Training attendance (provided)</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="opportunity-card">
              <div className="opportunity-icon">
                <i className="fas fa-hands-helping"></i>
              </div>
              <div className="opportunity-content">
                <h3>Event Coordinators</h3>
                <p className="opportunity-subtitle">Organize community events</p>
                <p>Help plan and execute fundraising events, community outreach programs, and special concerts. Perfect for students interested in event management and leadership.</p>
                <div className="opportunity-requirements">
                  <h4>Skills Needed:</h4>
                  <ul>
                    <li>Organizational abilities</li>
                    <li>Communication skills</li>
                    <li>Creative thinking</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="opportunity-card">
              <div className="opportunity-icon">
                <i className="fas fa-camera"></i>
              </div>
              <div className="opportunity-content">
                <h3>Media & Documentation</h3>
                <p className="opportunity-subtitle">Capture our impact</p>
                <p>Document our programs through photography, videography, and social media content. Help us share our story and attract new volunteers and supporters.</p>
                <div className="opportunity-requirements">
                  <h4>Skills Needed:</h4>
                  <ul>
                    <li>Photography/video skills</li>
                    <li>Social media knowledge</li>
                    <li>Creative storytelling</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="opportunity-card">
              <div className="opportunity-icon">
                <i className="fas fa-handshake"></i>
              </div>
              <div className="opportunity-content">
                <h3>Community Outreach</h3>
                <p className="opportunity-subtitle">Expand our reach</p>
                <p>Connect with local organizations, schools, and community groups to build partnerships and identify new opportunities for service.</p>
                <div className="opportunity-requirements">
                  <h4>Skills Needed:</h4>
                  <ul>
                    <li>Strong communication</li>
                    <li>Networking abilities</li>
                    <li>Relationship building</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="opportunity-card">
              <div className="opportunity-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="opportunity-content">
                <h3>Administrative Support</h3>
                <p className="opportunity-subtitle">Keep us organized</p>
                <p>Assist with scheduling, volunteer coordination, data management, and general administrative tasks that keep OneKey running smoothly.</p>
                <div className="opportunity-requirements">
                  <h4>Skills Needed:</h4>
                  <ul>
                    <li>Attention to detail</li>
                    <li>Computer proficiency</li>
                    <li>Time management</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Process Section */}
      <section className="process-section">
        <div className="container">
          <div className="process-header">
            <h2>How to Join</h2>
            <p>Simple steps to become a OneKey volunteer</p>
          </div>
          
          <div className="process-steps">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Submit Application</h3>
                <p>Complete our online application form with your interests, availability, and relevant experience. The process takes just 5-10 minutes.</p>
              </div>
            </div>
            
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Interview & Matching</h3>
                <p>Meet with our volunteer coordinator to discuss your goals and find the perfect volunteer opportunity that matches your skills and interests.</p>
              </div>
            </div>
            
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Orientation & Training</h3>
                <p>Attend our comprehensive orientation session and receive role-specific training to ensure you feel confident and prepared.</p>
              </div>
            </div>
            
            <div className="step-item">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Start Making Impact</h3>
                <p>Begin your volunteer journey with ongoing support from our team. Track your hours and see the direct impact of your contributions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Spotlight Section */}
      <section className="volunteer-spotlight">
        <div className="container">
          <div className="spotlight-header">
            <h2>Volunteer Spotlight</h2>
            <p>Meet some of our amazing volunteers</p>
          </div>
          
          <div className="volunteers-grid">
            <div className="volunteer-card">
              <div className="volunteer-image">
                <img src="/Onekey/pics/alexzhang.jpg" alt="Alex Zhang" />
              </div>
              <div className="volunteer-info">
                <h3>Alex Zhang</h3>
                <span className="volunteer-role">Pianist & Music Coordinator</span>
                <p>"Being part of OneKey has been incredibly rewarding. Seeing the joy on residents' faces during our performances reminds me why music is such a powerful force for connection."</p>
                <div className="volunteer-stats">
                  <span>2 years with OneKey</span>
                  <span>150+ performances</span>
                </div>
              </div>
            </div>
            
            <div className="volunteer-card">
              <div className="volunteer-image">
                <img src="/Onekey/pics/selenayu.jpg" alt="Selena Yu" />
              </div>
              <div className="volunteer-info">
                <h3>Selena Yu</h3>
                <span className="volunteer-role">Math Tutor</span>
                <p>"Tutoring through OneKey has helped me develop patience and teaching skills while making a real difference in students' academic success. It's incredibly fulfilling."</p>
                <div className="volunteer-stats">
                  <span>1.5 years with OneKey</span>
                  <span>25+ students helped</span>
                </div>
              </div>
            </div>
            
            <div className="volunteer-card">
              <div className="volunteer-image">
                <img src="/pics/jiaweiwang.jpg" alt="Jiawei Wang" />
              </div>
              <div className="volunteer-info">
                <h3>Jiawei Wang</h3>
                <span className="volunteer-role">Event Coordinator</span>
                <p>"Organizing events for OneKey has taught me valuable leadership skills and shown me how much impact we can have when we work together as a team."</p>
                <div className="volunteer-stats">
                  <span>1 year with OneKey</span>
                  <span>12+ events organized</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="requirements-section">
        <div className="container">
          <div className="requirements-content">
            <div className="requirements-text">
              <h2>General Requirements</h2>
              <p>We welcome volunteers from all backgrounds and experience levels. Here are our basic requirements:</p>
              
              <div className="requirements-list">
                <div className="requirement-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Ages 14+ (with parental consent for minors)</span>
                </div>
                <div className="requirement-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Commitment to our mission and values</span>
                </div>
                <div className="requirement-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Reliable attendance and communication</span>
                </div>
                <div className="requirement-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Background check for certain roles (we provide)</span>
                </div>
                <div className="requirement-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Completion of orientation and training</span>
                </div>
              </div>
            </div>
            
            <div className="benefits-text">
              <h2>Volunteer Benefits</h2>
              <p>Volunteering with OneKey offers valuable rewards and experiences:</p>
              
              <div className="benefits-list">
                <div className="benefit-item">
                  <i className="fas fa-certificate"></i>
                  <span>Community service hours documentation</span>
                </div>
                <div className="benefit-item">
                  <i className="fas fa-users"></i>
                  <span>Leadership and teamwork experience</span>
                </div>
                <div className="benefit-item">
                  <i className="fas fa-award"></i>
                  <span>Volunteer recognition and awards</span>
                </div>
                <div className="benefit-item">
                  <i className="fas fa-heart"></i>
                  <span>Meaningful community connections</span>
                </div>
                <div className="benefit-item">
                  <i className="fas fa-graduation-cap"></i>
                  <span>Skill development and training</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="involved-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Make a Difference?</h2>
            <p>Take the first step towards meaningful community service. Join OneKey today and discover how your skills and passion can create lasting positive impact.</p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn-primary">Apply Now</Link>
              <Link to="/projects" className="btn-secondary">Learn More</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GetInvolved; 