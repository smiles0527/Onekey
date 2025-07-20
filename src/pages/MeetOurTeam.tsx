import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const MeetOurTeam: React.FC = () => {
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
            <div className="team-member-card">
              <div className="member-image">
                <img src="/pics/alexzhang.jpg" alt="Alex Zhang" />
              </div>
              <div className="member-info">
                <h3>Alex Zhang</h3>
                <div className="member-details">
                  <span className="member-school">Fraser Heights Secondary</span>
                  <span className="member-role">Vanstrings / Onekey Manager</span>
                </div>
                <p className="member-bio">Currently a senior at Fraser Heights Secondary School, Alex Zhang is honored to serve as the General Manager of Vanstring and as the Principal Second Violinist. Outside of music, Alex enjoys playing volleyball and basketball, spending time in nature, and reading a wide range of literature. With a strong interest in the sciences, Alex aspires to study biomedicine with the goal of pursuing a career in medicine.</p>
                <a href="https://www.instagram.com/alexzhang_05/" target="_blank" rel="noopener noreferrer" className="instagram-btn">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
            
            <div className="team-member-card">
              <div className="member-image">
                <img src="/pics/curtiswei.jpg" alt="Curtis Wei" />
              </div>
              <div className="member-info">
                <h3>Curtis Wei</h3>
                <div className="member-details">
                  <span className="member-school">Collingwood School</span>
                  <span className="member-role">Co-Founder & President</span>
                </div>
                <p className="member-bio">I'm Curtis, a grade 10 student at Collingwood Secondary School. I'm grateful to be serving as one of the founders of Onekey as well as the General Manager of Vanstring. I have a passion for sciences and I waste much of my time preparing for the international science olympiads. In my spare time, I play the piano and conduct research on group theory as well as doing my little engineering projects.</p>
                <a href="https://www.instagram.com/icyz_wx/" target="_blank" rel="noopener noreferrer" className="instagram-btn">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
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
            <div className="team-member-card">
              <div className="member-image">
                <img src="/pics/jessicayu.jpg" alt="Jessica Yu" />
              </div>
              <div className="member-info">
                <h3>Jessica Yu</h3>
                <div className="member-details">
                  <span className="member-school">Lincoln High School</span>
                  <span className="member-role">Communications Team</span>
                </div>
                <p className="member-bio">Hi, I'm Jessica! I'm super passionate about music and spreading joy through music. As part of the communications team, I help young musicians gain more experience through performances in senior homes. In my spare time, I love to crochet and listen to music!</p>
                <a href="https://www.instagram.com/j.1ca0/" target="_blank" rel="noopener noreferrer" className="instagram-btn">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
            
            <div className="team-member-card">
              <div className="member-image">
                <img src="/pics/gabbyliu.jpg" alt="Gabby Liu" />
              </div>
              <div className="member-info">
                <h3>Gabby Liu</h3>
                <div className="member-details">
                  <span className="member-school">Lord Byng Secondary School</span>
                  <span className="member-role">Communications Team</span>
                </div>
                <p className="member-bio">Gabrielle is a grade 11 student at Lord Byng Secondary School, where she is part of the Byng Arts mini school program for music. Her musical journey began when she was five, and since then, she has competed in, and won numerous music competitions. In addition to performing, Gabrielle shares her passion by teaching violin and piano to students of all ages. She has a strong passion for the arts, especially singing and painting. Alongside her artistic interests, Gabrielle is passionate about science and aspires to pursue a career in dermatology.</p>
                <a href="https://www.instagram.com/gabriel_w.le/" target="_blank" rel="noopener noreferrer" className="instagram-btn">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
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
            <div className="team-member-card">
              <div className="member-image">
                <img src="/pics/ethanxie.jpg" alt="Ethan Xie" />
              </div>
              <div className="member-info">
                <h3>Ethan Xie</h3>
                <div className="member-details">
                  <span className="member-school">West Point Grey Academy</span>
                  <span className="member-role">Technology Coordinator</span>
                </div>
                <p className="member-bio">Hi there! I'm a student entering grade 10, and I'm passionate about music, technology, and engineering. I enjoy creating projects such as building drones. At OneKey, I've volunteered through music, and this year, I've been one of the main developers of this site. I look forward to working with OneKey in the future!</p>
                <a href="https://www.instagram.com/ethanx421/" target="_blank" rel="noopener noreferrer" className="instagram-btn">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
            
            <div className="team-member-card">
              <div className="member-image">
                <img src="/pics/shanezhang.jpg" alt="Shane Zhang" />
              </div>
              <div className="member-info">
                <h3>Shane Zhang</h3>
                <div className="member-details">
                  <span className="member-school">St Georges</span>
                  <span className="member-role">Homework Help Coordinator</span>
                </div>
                <p className="member-bio">Shane is a student entering Grade 10 who is passionate about science, outdoor activities, and history. He also has ample volunteering and tutoring experience. For two years, he has tutored Math and English to younger students both with and outside of Onekey. This year, he took on the role of helping coordinate homework help at Onekey. He has also volunteered with ski school at Grouse Mountain, helping classes of various age groups and abilities. He hopes to further develop his leadership abilities by continuing to participate in the Onekey team.</p>
                <a href="https://www.instagram.com/shanezhang021/" target="_blank" rel="noopener noreferrer" className="instagram-btn">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
            
            <div className="team-member-card">
              <div className="member-image">
                <img src="/pics/selenayu.jpg" alt="Selena Yu" />
              </div>
              <div className="member-info">
                <h3>Selena Yu</h3>
                <div className="member-details">
                  <span className="member-school">Crofton House School</span>
                  <span className="member-role">Homework Help Coordinator</span>
                </div>
                <p className="member-bio">Selena is a Grade 9 student at Crofton House school. She is a part of the executive of Vankey Onekey and serves as the concertmaster of Vanstring, as well as playing as a first violinist of her school's orchestra. Selena loves playing badminton and skiing in the winter.</p>
                <a href="https://www.instagram.com/selena.yxy/" target="_blank" rel="noopener noreferrer" className="instagram-btn">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
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
            <div className="alumni-card">
              <div className="member-image">
                <img src="/pics/elizasun.jpg" alt="Eliza Sun" />
              </div>
              <div className="member-info">
                <h3>Eliza Sun</h3>
                <div className="member-details">
                  <span className="member-school">Haverford University</span>
                  <span className="member-role">Alumni</span>
                </div>
                <p className="member-bio">Eliza is one of the co-founders and co-managers at Onekey. She is currently attending university in Philadelphia at Haverford University. One fun fact about her is that she has an extensive collection of stuffed animals, most of which are… jellycat pigs. When she's not performing at senior homes, Eliza enjoys spending her free time participating in robotics and making pottery.</p>
                <a href="https://www.instagram.com/elizasun530/" target="_blank" rel="noopener noreferrer" className="instagram-btn">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
            
            <div className="alumni-card">
              <div className="member-image">
                {/* Grace Xu photo not available - using text placeholder */}
                <div className="member-image-placeholder">
                  <i className="fas fa-user"></i>
                </div>
              </div>
              <div className="member-info">
                <h3>Grace Xu</h3>
                <div className="member-details">
                  <span className="member-school">School Name</span>
                  <span className="member-role">Alumni</span>
                </div>
                <p className="member-bio">Grace is a passionate musician and one of the co-founders of OneKey. With an ARCT-level piano background and a love for community, Grace helped create OneKey to connect music students and let others see the joy of sharing music and knowledge. She finds fulfillment in sharing joy through through student-led concerts and tutoring to create a meaningful impact. Grace is dedicated to fostering supportive, inspiring spaces where young musicians can grow and support one another.</p>
                <a href="https://www.instagram.com/joyleaf7/" target="_blank" rel="noopener noreferrer" className="instagram-btn">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
            
            <div className="alumni-card">
              <div className="member-image">
                <img src="/pics/jiaweiwang.jpg" alt="Jack" />
              </div>
              <div className="member-info">
                <h3>Jack Wang</h3>
                <div className="member-details">
                  <span className="member-school">Pomona College</span>
                  <span className="member-role">Alumni</span>
                </div>
                <p className="member-bio">Jack is an undergraduate student at Pomona College studying International Relations. He's greatly enjoyed working with the Onekey team and sharing his love for music with seniors and young performers.</p>
                <a href="https://www.instagram.com/jiawei_wang_06/" target="_blank" rel="noopener noreferrer" className="instagram-btn">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
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