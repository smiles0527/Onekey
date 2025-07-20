import React, { useEffect, useState } from 'react';

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: '/pics/Slide_1.jpg',
      title: 'OneKey',
      subtitle: 'Student volunteers making a difference through music and community service'
    },
    {
      image: '/pics/Slide_2.jpg',
      title: 'Our Mission',
      subtitle: 'Bridging generations through the universal language of music'
    },
    {
      image: '/pics/Slide_3.JPG',
      title: 'Community Impact',
      subtitle: 'Creating lasting connections across our community'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // Smooth scrolling animations - Constance style with parallax
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
          const children = entry.target.querySelectorAll('.value-item, .landmark-item, .stat-box, .area-card, .snapshot-card');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('animate');
            }, index * 75);
          });
        }
      });
    }, observerOptions);

    // Add animation classes to main sections
    const animateElements = document.querySelectorAll('.philosophy-section, .values-section, .history-section, .statistics-section, .service-areas-section, .snapshot-section, .join-cta-section');
    
    animateElements.forEach((el, index) => {
      el.classList.add('animate-on-scroll');
      el.classList.add(`animate-delay-${Math.min(index + 1, 5)}`);
      observer.observe(el);
    });

    // Individual element animations with delays
    const childElements = document.querySelectorAll('.value-item, .landmark-item, .stat-box, .area-card, .snapshot-card');
    childElements.forEach((el, index) => {
      el.classList.add('animate-on-scroll');
      el.classList.add(`animate-delay-${(index % 3) + 1}`);
      observer.observe(el);
    });

    // Parallax scroll effect
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.landmark-image img, .area-image img');
      
      parallaxElements.forEach((element) => {
        const rate = scrolled * -0.2;
        (element as HTMLElement).style.transform = `translate3d(0, ${rate}px, 0)`;
      });
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section - Constance Style */}
      <section className="hero-main">
        <div className="hero-slideshow">
        <div className="slideshow-container">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
                <div className="slide-overlay"></div>
              <div className="slide-content">
                <h1>{slide.title}</h1>
                <p>{slide.subtitle}</p>
              </div>
            </div>
          ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section - Our DNA */}
      <section className="philosophy-section">
        <div className="container">
          <div className="philosophy-header">
            <h2>OUR PHILOSOPHY</h2>
          </div>
          
          <div className="philosophy-content">
            <div className="dna-section">
              <h3>Our DNA</h3>
              <p className="highlight-text">A genuine passion for music and community service.</p>
              <p>It is where we come from, our student heritage.<br />
              We believe that our passion allows us to create connections.</p>
            </div>
            
            <div className="ambition-section">
              <h3>Our Ambition</h3>
              <p className="highlight-text">Be the reference of student-driven community impact.</p>
              <p>Growing while keeping our volunteer spirit.</p>
            </div>
            
            <div className="origin-section">
              <h3>Where we come from</h3>
              <p>OneKey was created in 2020, with music education as the main activity.<br />
              A clear vision and determination enabled the diversification and progress of our organization.</p>
              <p>In 2021, we took our first step in community service with senior home concerts.<br />
              This ignited our passion and allowed us to discover our DNA: A genuine passion for bridging generations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - Like Constance */}
      <section className="values-section">
        <div className="container">
          <div className="values-grid">
            <div className="value-item">
              <div className="value-icon">
                <i className="fas fa-heart"></i>
              </div>
              <h3>GENEROSITY</h3>
              <p>Generosity of the heart</p>
            </div>
            
            <div className="value-item">
              <div className="value-icon">
                <i className="fas fa-handshake"></i>
              </div>
              <h3>SINCERITY</h3>
              <p>Transparency as a behaviour</p>
            </div>
            
            <div className="value-item">
              <div className="value-icon">
                <i className="fas fa-star"></i>
              </div>
              <h3>EXCELLENCE</h3>
              <p>Our professionalism and dedication</p>
            </div>
            
            <div className="value-item">
              <div className="value-icon">
                <i className="fas fa-lightbulb"></i>
              </div>
              <h3>INVENTIVENESS</h3>
              <p>A blend of innovation & creativity</p>
            </div>
            
            <div className="value-item">
              <div className="value-icon">
                <i className="fas fa-leaf"></i>
              </div>
              <h3>RESPECT</h3>
              <p>Respect of people and community</p>
            </div>
          </div>
        </div>
      </section>

      {/* History Timeline - Constance Style */}
      <section className="history-section">
        <div className="container">
          <div className="section-header">
            <h2>History</h2>
            <p>Landmarks</p>
          </div>
          
          <div className="timeline-landmarks">
            <div className="landmark-item">
              <div className="landmark-year">2020</div>
              <div className="landmark-content">
                <h3>Birth of OneKey</h3>
                <p>Founded by Curtis Wei and Ethan Xie with a mission to bridge generations through music. Started with small music lessons for elementary students.</p>
                <div className="landmark-tag">FOUNDING</div>
              </div>
              <div className="landmark-image">
                <img src="/pics/curtiswei.jpg" alt="OneKey Founding" />
              </div>
            </div>
            
            <div className="landmark-item reverse">
              <div className="landmark-year">2021</div>
              <div className="landmark-content">
                <h3>Senior Home Concerts Launch</h3>
                <p>First community service initiative bringing weekly musical performances to senior living facilities across the region.</p>
                <div className="landmark-tag">COMMUNITY SERVICE</div>
              </div>
              <div className="landmark-image">
                <img src="/pics/ethanxie.jpg" alt="Senior Home Concerts" />
              </div>
            </div>
            
            <div className="landmark-item">
              <div className="landmark-year">2022</div>
              <div className="landmark-content">
                <h3>Tutoring Program Expansion</h3>
                <p>Launch of comprehensive academic support program serving students from elementary through high school in multiple subjects.</p>
                <div className="landmark-tag">EDUCATION</div>
              </div>
              <div className="landmark-image">
                <img src="/pics/selenayu.jpg" alt="Tutoring Program" />
              </div>
            </div>
            
            <div className="landmark-item reverse">
              <div className="landmark-year">2023</div>
              <div className="landmark-content">
                <h3>Fundraising Initiatives</h3>
                <p>Major expansion into community fundraising, raising over $15,000 for local families and organizations in need.</p>
                <div className="landmark-tag">FUNDRAISING</div>
              </div>
              <div className="landmark-image">
                <img src="/pics/jessicayu.jpg" alt="Fundraising" />
              </div>
            </div>
            
            <div className="landmark-item">
              <div className="landmark-year">2024</div>
              <div className="landmark-content">
                <h3>Recognition & Growth</h3>
                <p>Received multiple community service awards and expanded to serve 5 senior facilities and 3 schools with over 85 student volunteers.</p>
                <div className="landmark-tag">RECOGNITION</div>
              </div>
              <div className="landmark-image">
                <img src="/pics/gabbyliu.jpg" alt="Recognition" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section - The Group in Numbers */}
      <section className="statistics-section">
        <div className="container">
          <div className="stats-header">
            <h2>THE ORGANIZATION IN NUMBERS</h2>
            <p>as at December 2024</p>
          </div>
          
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-number">4</div>
              <div className="stat-label">Years of Impact</div>
            </div>
            
            <div className="stat-box">
              <div className="stat-number">3</div>
              <div className="stat-label">Service Areas</div>
            </div>
            
            <div className="stat-box">
              <div className="stat-number">85+</div>
              <div className="stat-label">Student Volunteers</div>
            </div>
            
            <div className="stat-box">
              <div className="stat-number">200+</div>
              <div className="stat-label">Seniors Served</div>
            </div>
            
            <div className="stat-box">
              <div className="stat-number">2,500+</div>
              <div className="stat-label">Volunteer Hours</div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas - Business Activities */}
      <section className="service-areas-section">
        <div className="container">
          <div className="areas-intro">
            <h2>Our Service Areas</h2>
            <p>OneKey's activities are structured around 3 Principal Service Areas</p>
          </div>
          
          <div className="areas-grid">
            <div className="area-card music">
              <div className="area-image">
                <img src="/pics/alexzhang.jpg" alt="Music Services" />
              </div>
              <div className="area-content">
                <h3>Music</h3>
                <p>Senior home concerts and community performances bringing joy through music</p>
              </div>
            </div>
            
            <div className="area-card education">
              <div className="area-image">
                <img src="/pics/shanezhang.jpg" alt="Education Services" />
              </div>
              <div className="area-content">
                <h3>Education</h3>
                <p>Tutoring and academic support for students across all grade levels</p>
              </div>
            </div>
            
            <div className="area-card community">
              <div className="area-image">
                <img src="/pics/elizasun.jpg" alt="Community Services" />
              </div>
              <div className="area-content">
                <h3>Community</h3>
                <p>Fundraising and volunteer opportunities for meaningful community impact</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Snapshot Section */}
      <section className="snapshot-section">
        <div className="container">
          <div className="snapshot-header">
            <h2>Program SNAPSHOT</h2>
          </div>
          
          <div className="snapshot-grid">
            <div className="snapshot-card">
              <div className="snapshot-header-card">
                <h3>Music Program</h3>
                <div className="program-type">Senior Home Concerts</div>
              </div>
              <div className="snapshot-stats">
                <div className="snapshot-stat">
                  <span className="stat-label">Partner Facilities</span>
                  <span className="stat-value">5</span>
                </div>
                <div className="snapshot-stat">
                  <span className="stat-label">Weekly Performances</span>
                  <span className="stat-value">150+</span>
                </div>
                <div className="snapshot-stat">
                  <span className="stat-label">Seniors Reached</span>
                  <span className="stat-value">200+</span>
                </div>
              </div>
              <div className="snapshot-cta">
                <a href="/projects" className="view-details">View Details</a>
              </div>
            </div>
            
            <div className="snapshot-card">
              <div className="snapshot-header-card">
                <h3>Education Program</h3>
                <div className="program-type">Academic Support</div>
              </div>
              <div className="snapshot-stats">
                <div className="snapshot-stat">
                  <span className="stat-label">Partner Schools</span>
                  <span className="stat-value">3</span>
                </div>
                <div className="snapshot-stat">
                  <span className="stat-label">Students Tutored</span>
                  <span className="stat-value">85+</span>
                </div>
                <div className="snapshot-stat">
                  <span className="stat-label">Subjects Covered</span>
                  <span className="stat-value">All Grade Levels</span>
                </div>
              </div>
              <div className="snapshot-cta">
                <a href="/projects" className="view-details">View Details</a>
              </div>
            </div>
            
            <div className="snapshot-card">
              <div className="snapshot-header-card">
                <h3>Community Program</h3>
                <div className="program-type">Fundraising & Service</div>
              </div>
              <div className="snapshot-stats">
                <div className="snapshot-stat">
                  <span className="stat-label">Funds Raised</span>
                  <span className="stat-value">$15,000+</span>
                </div>
                <div className="snapshot-stat">
                  <span className="stat-label">Families Helped</span>
                  <span className="stat-value">50+</span>
                </div>
                <div className="snapshot-stat">
                  <span className="stat-label">Volunteer Hours</span>
                  <span className="stat-value">2,500+</span>
                </div>
              </div>
              <div className="snapshot-cta">
                <a href="/get-involved" className="view-details">View Details</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Join Us */}
      <section className="join-cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Make a Difference?</h2>
            <p>Join OneKey and become part of a student-driven organization dedicated to creating positive change through music, education, and community service.</p>
            <div className="cta-buttons">
              <a href="/get-involved" className="btn-primary">Become a Volunteer</a>
              <a href="/contact" className="btn-secondary">Contact Us</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 