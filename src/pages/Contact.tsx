import React, { useEffect, useState } from 'react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  })

  //smooth scrolling (doesn't work)
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
    const animateElements = document.querySelectorAll('.contact-hero, .contact-form-section, .contact-info-section, .location-section');
    
    animateElements.forEach((el, index) => {
      el.classList.add('animate-on-scroll');
      el.classList.add(`animate-delay-${Math.min(index + 1, 5)}`);
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      type: 'general'
    });
  };

  return (
    <div className="contact-page">
      {/* Hero Section - Constance Style */}
      <section className="contact-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <div className="container">
            <div className="hero-content">
              <h1>Contact Us</h1>
              <p className="hero-subtitle">Connect with OneKey to explore volunteer opportunities, partnerships, and ways to make a difference in our community</p>
              <div className="hero-accent-line"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form-section">
        <div className="container">
          <div className="contact-grid">
            <div className="form-container">
              <div className="form-header">
                <h2>Send us a Message</h2>
                <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
              </div>
              
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="type">Inquiry Type</label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="general">General Inquiry</option>
                      <option value="volunteer">Volunteer Opportunity</option>
                      <option value="partnership">Partnership</option>
                      <option value="performance">Performance Request</option>
                      <option value="tutoring">Tutoring Services</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      placeholder="Brief subject of your message"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>
                
                <button type="submit" className="submit-btn">
                  <i className="fas fa-paper-plane"></i>
                  Send Message
                </button>
              </form>
            </div>
            
            <div className="contact-sidebar">
              <div className="contact-card">
                <h3>Get in Touch</h3>
                <p>Ready to make a difference? We're here to help you get involved with OneKey's mission of community service through music and education.</p>
                
                <div className="contact-methods">
                  <div className="contact-method">
                    <div className="method-icon">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div className="method-info">
                      <h4>Email</h4>
                      <p>on3keymusic@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="contact-method">
                    <div className="method-icon">
                      <i className="fas fa-clock"></i>
                    </div>
                    <div className="method-info">
                      <h4>Response Time</h4>
                      <p>Within 24-48 hours</p>
                    </div>
                  </div>
                  
                  <div className="contact-method">
                    <div className="method-icon">
                      <i className="fas fa-users"></i>
                    </div>
                    <div className="method-info">
                      <h4>Connect</h4>
                      <p>Join our community of volunteers</p>
                    </div>
                  </div>
                </div>
                
                <div className="quick-links">
                  <h4>Quick Links</h4>
                  <ul>
                    <li><a href="/get-involved">Volunteer Opportunities</a></li>
                    <li><a href="/projects">Our Programs</a></li>
                    <li><a href="/about">About OneKey</a></li>
                    <li><a href="/timeline">Upcoming Events</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="contact-info-section">
        <div className="container">
          <div className="info-header">
            <h2>Ways to Connect</h2>
            <p>Multiple ways to get involved with our community</p>
          </div>
          
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-music"></i>
              </div>
              <h3>Musicians</h3>
              <p>Join our weekly concerts at senior facilities. Perfect for students looking to share their musical talents and gain performance experience.</p>
              <div className="info-details">
                <span>Weekly Commitment</span>
                <span>All Skill Levels Welcome</span>
              </div>
            </div>
            
            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <h3>Tutors</h3>
              <p>Help students succeed academically through our after-school tutoring program. Share your knowledge and make a lasting impact.</p>
              <div className="info-details">
                <span>Flexible Schedule</span>
                <span>All Subjects Needed</span>
              </div>
            </div>
            
            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-handshake"></i>
              </div>
              <h3>Partners</h3>
              <p>Organizations and schools interested in collaborating with OneKey to expand our community impact and reach.</p>
              <div className="info-details">
                <span>Mutual Benefits</span>
                <span>Community Focus</span>
              </div>
            </div>
            
            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-heart"></i>
              </div>
              <h3>Supporters</h3>
              <p>Support our mission through donations, spreading awareness, or helping with fundraising events and community outreach.</p>
              <div className="info-details">
                <span>Various Ways to Help</span>
                <span>Every Contribution Matters</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location/Service Area Section */}
      <section className="location-section">
        <div className="container">
          <div className="location-content">
            <h2>Our Service Area</h2>
            <p>OneKey proudly serves the greater metropolitan area, bringing music and educational support to communities across the region. Our volunteers travel to multiple locations each week to deliver our programs.</p>
            
            <div className="service-areas">
              <div className="service-area">
                <h3>Senior Living Facilities</h3>
                <ul>
                  <li>Sunrise Senior Living</li>
                  <li>Meadowbrook Care Center</li>
                  <li>Golden Years Community</li>
                  <li>Heritage Manor</li>
                  <li>Oakwood Residence</li>
                </ul>
              </div>
              
              <div className="service-area">
                <h3>Educational Partners</h3>
                <ul>
                  <li>Lincoln Elementary School</li>
                  <li>Washington Middle School</li>
                  <li>Jefferson High School</li>
                  <li>Community Learning Center</li>
                  <li>After-School Programs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="contact-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Take the first step towards making a meaningful impact in your community. Join OneKey today and discover the joy of service through music and education.</p>
            <div className="cta-buttons">
              <a href="/get-involved" className="btn-primary">Join Our Team</a>
              <a href="/about" className="btn-secondary">Learn More</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact; 