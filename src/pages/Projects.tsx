import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Projects: React.FC = () => {
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
          const children = entry.target.querySelectorAll('.project-card, .impact-item, .feature-item');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('animate');
            }, index * 100);
          });
        }
      });
    }, observerOptions);

    // Add animation classes to sections
    const animateElements = document.querySelectorAll('.projects-hero, .projects-showcase, .impact-overview, .featured-programs, .testimonials-projects, .get-involved-projects');
    
    animateElements.forEach((el, index) => {
      el.classList.add('animate-on-scroll');
      el.classList.add(`animate-delay-${Math.min(index + 1, 5)}`);
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="projects-page">
      {/* Hero Section - Constance Style */}
      <section className="projects-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <div className="container">
            <div className="hero-content">
              <h1>Our Projects</h1>
              <p className="hero-subtitle">Transforming communities through music, education, and service initiatives that create lasting impact</p>
              <div className="hero-accent-line"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Showcase - Main Programs */}
      <section className="projects-showcase">
        <div className="container">
          <div className="showcase-header">
            <h2>OUR PROGRAMS</h2>
            <p>Three pillars of community service</p>
          </div>
          
          <div className="projects-grid">
            <div className="project-card featured">
              <div className="project-image">
                <img src="/Onekey/pics/alexzhang.jpg" alt="Music Program" />
                <div className="project-overlay">
                  <div className="project-icon">
                    <i className="fas fa-music"></i>
                  </div>
                </div>
              </div>
              <div className="project-content">
                <h3>Senior Home Concerts</h3>
                <p className="project-subtitle">Music Program</p>
                <p>Weekly musical performances bringing joy and connection to 200+ seniors across 5 partner facilities. Our student volunteers perform classical, contemporary, and nostalgic pieces that create meaningful intergenerational bonds.</p>
                <div className="project-stats">
                  <div className="stat">
                    <span className="stat-number">150+</span>
                    <span className="stat-label">Performances</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">5</span>
                    <span className="stat-label">Facilities</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">200+</span>
                    <span className="stat-label">Seniors Served</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="project-card featured">
              <div className="project-image">
                <img src="/Onekey/pics/shanezhang.jpg" alt="Education Program" />
                <div className="project-overlay">
                  <div className="project-icon">
                    <i className="fas fa-graduation-cap"></i>
                  </div>
                </div>
              </div>
              <div className="project-content">
                <h3>Academic Support Program</h3>
                <p className="project-subtitle">Education Initiative</p>
                <p>Comprehensive tutoring and homework assistance for students from elementary through high school. Our volunteer tutors provide personalized support across all subjects, fostering academic confidence and success.</p>
                <div className="project-stats">
                  <div className="stat">
                    <span className="stat-number">85+</span>
                    <span className="stat-label">Students Helped</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">3</span>
                    <span className="stat-label">Partner Schools</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">All</span>
                    <span className="stat-label">Grade Levels</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="project-card featured">
              <div className="project-image">
                <img src="/Onekey/pics/elizasun.jpg" alt="Community Program" />
                <div className="project-overlay">
                  <div className="project-icon">
                    <i className="fas fa-heart"></i>
                  </div>
                </div>
              </div>
              <div className="project-content">
                <h3>Community Fundraising</h3>
                <p className="project-subtitle">Service Initiative</p>
                <p>Organizing fundraising events and donation drives to support local families and organizations in need. Our efforts have raised over $15,000 for community causes, providing essential support where it's needed most.</p>
                <div className="project-stats">
                  <div className="stat">
                    <span className="stat-number">$15,000+</span>
                    <span className="stat-label">Funds Raised</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">50+</span>
                    <span className="stat-label">Families Helped</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">12</span>
                    <span className="stat-label">Events Organized</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Overview - Statistics Section */}
      <section className="impact-overview">
        <div className="container">
          <div className="impact-header">
            <h2>COLLECTIVE IMPACT</h2>
            <p>Measuring our community reach</p>
          </div>
          
          <div className="impact-grid">
            <div className="impact-item">
              <div className="impact-number">2,500+</div>
              <div className="impact-label">Total Volunteer Hours</div>
              <p>Hours dedicated to community service across all our programs</p>
            </div>
            
            <div className="impact-item">
              <div className="impact-number">285+</div>
              <div className="impact-label">Lives Directly Impacted</div>
              <p>Seniors, students, and families who benefit from our services</p>
            </div>
            
            <div className="impact-item">
              <div className="impact-number">85+</div>
              <div className="impact-label">Student Volunteers</div>
              <p>Young people actively contributing to positive change</p>
            </div>
            
            <div className="impact-item">
              <div className="impact-number">8</div>
              <div className="impact-label">Community Partners</div>
              <p>Schools and facilities we collaborate with regularly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Programs - Detailed Showcase */}
      <section className="featured-programs">
        <div className="container">
          <div className="featured-header">
            <h2>Program Highlights</h2>
            <p>Spotlight on our most impactful initiatives</p>
          </div>
          
          <div className="program-details">
            <div className="program-feature">
              <div className="feature-content">
                <h3>Weekly Concert Series</h3>
                <p className="feature-subtitle">Every Thursday at 3:00 PM</p>
                <p>Our flagship program brings live music to senior living facilities across the region. Each performance is carefully curated to include a mix of classical pieces, popular songs from the residents' youth, and contemporary music that bridges generational gaps.</p>
                <div className="feature-highlights">
                  <div className="highlight">
                    <i className="fas fa-calendar-alt"></i>
                    <span>52 concerts annually per facility</span>
                  </div>
                  <div className="highlight">
                    <i className="fas fa-users"></i>
                    <span>20-30 residents per session</span>
                  </div>
                  <div className="highlight">
                    <i className="fas fa-clock"></i>
                    <span>45-minute performances</span>
                  </div>
                </div>
              </div>
              <div className="feature-image">
                <img src="/Onekey/pics/curtiswei.jpg" alt="Concert Series" />
              </div>
            </div>
            
            <div className="program-feature reverse">
              <div className="feature-content">
                <h3>After-School Tutoring</h3>
                <p className="feature-subtitle">Monday through Friday, 3:30-5:30 PM</p>
                <p>Comprehensive academic support program offering one-on-one and small group tutoring sessions. Our volunteer tutors are carefully matched with students based on subject expertise and learning style compatibility.</p>
                <div className="feature-highlights">
                  <div className="highlight">
                    <i className="fas fa-book"></i>
                    <span>All subjects covered</span>
                  </div>
                  <div className="highlight">
                    <i className="fas fa-award"></i>
                    <span>95% improvement rate</span>
                  </div>
                  <div className="highlight">
                    <i className="fas fa-graduation-cap"></i>
                    <span>K-12 grade levels</span>
                  </div>
                </div>
              </div>
              <div className="feature-image">
                <img src="/pics/jessicayu.jpg" alt="Tutoring Program" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-projects">
        <div className="container">
          <div className="testimonials-header">
            <h2>Community Voices</h2>
            <p>Hear from those we serve</p>
          </div>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-quote">
                <p>"The OneKey volunteers have become like family to our residents. Every Thursday, you can see the joy and anticipation on their faces as they prepare for the concert."</p>
              </div>
              <div className="testimonial-author">
                <img src="/pics/gabbyliu.jpg" alt="Facility Director" />
                <div className="author-info">
                  <h4>Margaret Thompson</h4>
                  <span>Activities Director, Sunrise Senior Living</span>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-quote">
                <p>"My daughter's grades improved dramatically thanks to the tutoring program. The volunteers are patient, knowledgeable, and truly care about the students' success."</p>
              </div>
              <div className="testimonial-author">
                <img src="/pics/selenayu.jpg" alt="Parent" />
                <div className="author-info">
                  <h4>David Chen</h4>
                  <span>Parent, Lincoln Elementary</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get Involved CTA */}
      <section className="get-involved-projects">
        <div className="container">
          <div className="involved-content">
            <h2>Join Our Mission</h2>
            <p>Whether you're a musician, tutor, or simply passionate about community service, there's a place for you in OneKey. Help us expand our impact and create more meaningful connections in our community.</p>
            <div className="involved-buttons">
              <Link to="/get-involved" className="btn-primary">Become a Volunteer</Link>
              <Link to="/contact" className="btn-secondary">Partner With Us</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects; 