import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import PhotoGallery from '../components/PhotoGallery';
import { getRandomPhotos } from '../data/photos';

const About: React.FC = () => {
  const heroImage = useMemo(() => getRandomPhotos(1)[0], []);
  const teamImage = useMemo(() => getRandomPhotos(1)[0], []);
  const galleryImages = useMemo(() => getRandomPhotos(9), []);

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);

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
    <div className="relative bg-gradient-to-br from-surface-900 via-surface-800 to-surface-900">
      {/* Dots Pattern Overlay */}
      <div className="fixed inset-0 opacity-[0.025]" style={{
        backgroundImage: `radial-gradient(circle, rgba(245, 158, 11, 0.4) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }}></div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden lg:pt-40 lg:pb-24">
        <motion.div style={{ y }} className="absolute inset-0 z-0 opacity-20">
          <img 
            src={heroImage} 
            alt="About Hero" 
            className="object-cover w-full h-full"
          />
        </motion.div>
        
        <div className="container relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 text-4xl font-bold tracking-tight text-white md:text-6xl"
          >
            text
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg leading-relaxed text-gray-200"
          >
            text
          </motion.p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl"></div>
        
        <div className="container relative">
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <h2 className="mb-4 text-2xl font-bold text-white">Our Story</h2>
            <p className="text-base leading-relaxed text-surface-400">
              Where passion meets purpose.
            </p>
          </div>
          
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="relative overflow-hidden shadow-2xl rounded-2xl order-2 lg:order-1 group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img src={teamImage} alt="OneKey Team" className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="space-y-5 text-base leading-relaxed backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/10 order-1 lg:order-2">
              <h3 className="text-xl font-bold text-white">Where Passion Meets Purpose</h3>
              <p className="text-surface-300">OneKey was born from a simple belief: that music has the power to bridge generations and create lasting connections in our community.</p>
              <p className="text-surface-300">Founded in 2020, our organization began as a small initiative to bring musical performances to local senior living facilities. What started as weekend concerts has grown into a comprehensive community service program touching the lives of hundreds of students and seniors alike.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Story Timeline */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute -left-20 top-40 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl"></div>
        
        <div className="container relative">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-2xl font-bold text-white">Our Journey</h2>
            <p className="text-surface-400">Milestones that shaped our mission</p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-8">
            {[
              { year: '2020', title: 'The Beginning', desc: 'OneKey organizes the first senior home concert with just 5 student volunteers.', tag: 'FOUNDING' },
              { year: '2021', title: 'Program Expansion', desc: 'Launch of weekly concert series across 3 senior facilities.', tag: 'GROWTH' },
              { year: '2022', title: 'Educational Outreach', desc: 'Introduction of tutoring programs, expanding our mission beyond music.', tag: 'EDUCATION' },
              { year: '2023', title: 'Community Recognition', desc: 'Received the Youth Volunteer Excellence Award and began major fundraising.', tag: 'RECOGNITION' }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-start gap-6 md:flex-row md:items-center group"
              >
                <div className="w-full text-3xl font-bold transition-colors md:w-24 text-amber-400/40 group-hover:text-amber-400">
                  {item.year}
                </div>
                <div className="flex-1 p-5 backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                    <span className="px-2.5 py-1 text-xs font-bold tracking-wider rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-sm text-gray-200">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="py-16 relative">
        <div className="container">
          <PhotoGallery 
            images={galleryImages} 
            title="Meet Our Team" 
          />
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
        
        <div className="container relative">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-2xl font-bold text-white">Our Impact in Numbers</h2>
            <p className="text-surface-400">as at December 2024</p>
          </div>
          
          <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-3 lg:grid-cols-6">
            {[
              { number: "200+", label: "Seniors Served" },
              { number: "85+", label: "Volunteers" },
              { number: "2.5k+", label: "Hours" },
              { number: "$15k+", label: "Raised" },
              { number: "5", label: "Partners" },
              { number: "150+", label: "Concerts" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="p-4 backdrop-blur-sm bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="mb-2 text-2xl font-bold text-amber-400">{stat.number}</div>
                <div className="text-xs font-medium text-surface-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section className="py-16 relative">
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
        
        <div className="container relative">
          <div className="max-w-4xl p-8 mx-auto text-center backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 shadow-2xl">
            <h2 className="mb-4 text-2xl font-bold text-white">Ready to Make a Difference?</h2>
            <p className="max-w-2xl mx-auto mb-6 text-base text-gray-200">
              Join OneKey and become part of a student-driven organization that's transforming communities.
            </p>
            <Link 
              to="/contact" 
              className="inline-block px-6 py-3 text-sm font-semibold text-white transition-all duration-300 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 hover:shadow-lg hover:shadow-amber-500/25"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 