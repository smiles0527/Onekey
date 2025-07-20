import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Mission: React.FC = () => {
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
          const children = entry.target.querySelectorAll('.principle-card, .goal-item');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('animate');
            }, index * 100);
          });
        }
      });
    }, observerOptions);

    // Add animation classes to sections
    const animateElements = document.querySelectorAll('.mission-hero, .mission-statements, .core-principles, .our-goals, .mission-impact, .mission-cta');
    
    animateElements.forEach((el, index) => {
      el.classList.add('animate-on-scroll');
      el.classList.add(`animate-delay-${Math.min(index + 1, 5)}`);
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="mission-page">
      {/* Hero Section - Constance Style */}
      <section className="mission-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <div className="container">
            <div className="hero-content">
              <h1>Our Mission</h1>
              <p className="hero-subtitle">Empowering students to create positive change through music, education, and community service that bridges generations</p>
              <div className="hero-accent-line"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Statements */}
      <section className="mission-statements">
        <div className="container">
          <div className="statements-grid">
            <div className="statement-card mission">
              <div className="statement-header">
                <div className="statement-icon">
                  <i className="fas fa-compass"></i>
                </div>
                <h2>Our Mission</h2>
              </div>
              <div className="statement-content">
                <p className="statement-text">
                  OneKey exists to unlock the potential of young people by providing meaningful opportunities to serve their community through music performances, educational support, and charitable initiatives. We believe in the power of youth to create positive change and foster connections across generations.
                </p>
                <div className="statement-highlight">
                  <span>"Unlocking potential through service"</span>
                </div>
              </div>
            </div>
            
            <div className="statement-card vision">
              <div className="statement-header">
                <div className="statement-icon">
                  <i className="fas fa-eye"></i>
                </div>
                <h2>Our Vision</h2>
              </div>
              <div className="statement-content">
                <p className="statement-text">
                  A community where students are empowered to be leaders, where music brings joy and healing, and where service creates lasting bonds between people of all ages. We envision a future where intergenerational connections flourish through shared experiences and mutual support.
                </p>
                <div className="statement-highlight">
                  <span>"Building bridges across generations"</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles Section */}
      <section className="core-principles">
        <div className="container">
          <div className="principles-header">
            <h2>Core Principles</h2>
            <p>The values that guide everything we do</p>
          </div>
          
          <div className="principles-grid">
            <div className="principle-card">
              <div className="principle-icon">
                <i className="fas fa-music"></i>
              </div>
              <h3>Music as Universal Language</h3>
              <p>We believe music transcends age, background, and circumstance, creating immediate connections and shared joy between performers and audiences.</p>
            </div>
            
            <div className="principle-card">
              <div className="principle-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <h3>Education Empowers</h3>
              <p>Knowledge shared freely multiplies in value. We're committed to providing educational support that builds confidence and opens opportunities.</p>
            </div>
            
            <div className="principle-card">
              <div className="principle-icon">
                <i className="fas fa-hands-helping"></i>
              </div>
              <h3>Service Develops Character</h3>
              <p>Through service to others, students develop empathy, leadership skills, and a deeper understanding of their role in the community.</p>
            </div>
            
            <div className="principle-card">
              <div className="principle-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Intergenerational Connection</h3>
              <p>Young and old have much to learn from each other. We create opportunities for meaningful relationships that benefit all generations.</p>
            </div>
            
            <div className="principle-card">
              <div className="principle-icon">
                <i className="fas fa-seedling"></i>
              </div>
              <h3>Growth Through Experience</h3>
              <p>Real-world experience in service, performance, and leadership provides invaluable learning that can't be found in textbooks.</p>
            </div>
            
            <div className="principle-card">
              <div className="principle-icon">
                <i className="fas fa-heart"></i>
              </div>
              <h3>Compassion in Action</h3>
              <p>True change happens when compassion moves beyond feeling to action. We put care into practice through tangible service.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Goals Section */}
      <section className="our-goals">
        <div className="container">
          <div className="goals-header">
            <h2>Our Goals</h2>
            <p>What we strive to achieve in our community</p>
          </div>
          
          <div className="goals-content">
            <div className="goals-main">
              <div className="goal-item">
                <div className="goal-number">01</div>
                <div className="goal-content">
                  <h3>Expand Musical Outreach</h3>
                  <p>Increase the number of senior facilities we serve from 5 to 10, bringing weekly concerts to 400+ residents across the region while maintaining the personal, intimate nature of our performances.</p>
                </div>
              </div>
              
              <div className="goal-item">
                <div className="goal-number">02</div>
                <div className="goal-content">
                  <h3>Strengthen Educational Support</h3>
                  <p>Double our tutoring capacity to serve 150+ students annually, with specialized programs for STEM subjects, test preparation, and English language learning support.</p>
                </div>
              </div>
              
              <div className="goal-item">
                <div className="goal-number">03</div>
                <div className="goal-content">
                  <h3>Develop Student Leaders</h3>
                  <p>Create a comprehensive leadership development program that prepares our volunteers for future community leadership roles and provides college-level experience in project management.</p>
                </div>
              </div>
              
              <div className="goal-item">
                <div className="goal-number">04</div>
                <div className="goal-content">
                  <h3>Build Community Partnerships</h3>
                  <p>Establish formal partnerships with 15+ local organizations, creating a network of mutual support that amplifies the impact of all community service efforts.</p>
                </div>
              </div>
              
              <div className="goal-item">
                <div className="goal-number">05</div>
                <div className="goal-content">
                  <h3>Ensure Sustainability</h3>
                  <p>Create a sustainable funding model and succession planning that ensures OneKey continues to serve the community for generations to come, with proper training and mentorship programs.</p>
                </div>
              </div>
            </div>
            
            <div className="goals-sidebar">
              <div className="goals-quote">
                <blockquote>
                  "The best way to find yourself is to lose yourself in the service of others."
                </blockquote>
                <cite>— Mahatma Gandhi</cite>
              </div>
              
              <div className="goals-timeline">
                <h4>Target Timeline</h4>
                <div className="timeline-item">
                  <span className="timeline-year">2025</span>
                  <span className="timeline-goal">Expand to 8 facilities</span>
                </div>
                <div className="timeline-item">
                  <span className="timeline-year">2026</span>
                  <span className="timeline-goal">Launch leadership program</span>
                </div>
                <div className="timeline-item">
                  <span className="timeline-year">2027</span>
                  <span className="timeline-goal">Reach sustainability goals</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Impact Section */}
      <section className="mission-impact">
        <div className="container">
          <div className="impact-content">
            <div className="impact-text">
              <h2>Living Our Mission</h2>
              <p>Our mission isn't just words on a page—it's the driving force behind every concert, every tutoring session, and every act of service. Since our founding, we've seen firsthand how young people can transform not only their communities but themselves through meaningful service.</p>
              
              <p>Every Thursday afternoon, when our student musicians perform for senior residents, we see our mission in action. In the quiet moments when a tutor helps a struggling student understand a difficult concept, our vision becomes reality. Through every fundraising dollar raised for families in need, we demonstrate that students can be powerful agents of positive change.</p>
              
              <div className="impact-quote">
                <p>"OneKey has taught us that service isn't just about helping others—it's about discovering who we are and who we can become."</p>
                <cite>— Curtis Wei & Ethan Xie, Co-Founders</cite>
              </div>
            </div>
            
            <div className="impact-visual">
              <div className="impact-stats">
                <div className="impact-stat">
                  <span className="stat-number">4</span>
                  <span className="stat-label">Years of Service</span>
                </div>
                <div className="impact-stat">
                  <span className="stat-number">285+</span>
                  <span className="stat-label">Lives Touched</span>
                </div>
                <div className="impact-stat">
                  <span className="stat-number">2,500+</span>
                  <span className="stat-label">Service Hours</span>
                </div>
                <div className="impact-stat">
                  <span className="stat-number">∞</span>
                  <span className="stat-label">Possibilities</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="mission-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Be Part of Our Mission</h2>
            <p>Our mission becomes reality through the dedication and passion of volunteers like you. Join OneKey and help us continue building bridges across generations through the power of service.</p>
            <div className="cta-buttons">
              <Link to="/get-involved" className="btn-primary">Join Our Mission</Link>
              <Link to="/about" className="btn-secondary">Learn Our Story</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Mission; 