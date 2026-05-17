import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTeamStore } from '../store/teamStore';
import { getRandomPhotos } from '../data/photos';

const MeetOurTeam: React.FC = () => {
  const { getTeamMembersBySection } = useTeamStore();
  const heroImage = useMemo(() => getRandomPhotos(1)[0], []);

  const leadershipMembers = getTeamMembersBySection('leadership');
  const communicationsMembers = getTeamMembersBySection('communications');
  const coordinatorsMembers = getTeamMembersBySection('coordinators');
  const alumniMembers = getTeamMembersBySection('alumni');

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');

          const children = entry.target.querySelectorAll(
            '.team-member-card, .alumni-card, .leadership-card, .volunteer-card'
          );
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('animate');
            }, index * 100);
          });
        }
      });
    }, observerOptions);

    const animateElements = document.querySelectorAll(
      '.team-hero, .leadership-section, .communications-section, .coordinators-section, .alumni-section, .join-team-section'
    );

    animateElements.forEach((el, index) => {
      el.classList.add('animate-on-scroll');
      el.classList.add(`animate-delay-${Math.min(index + 1, 5)}`);
      observer.observe(el);
    });

    // Parallax scrolling for hero background
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroBgImage = document.querySelector('.team-hero .hero-bg-image') as HTMLElement | null;
      const leadershipBgImage = document.querySelector('.leadership-section .leadership-bg-image') as HTMLElement | null;
      const communicatorsBgImage = document.querySelector('.communications-section .communications-bg-image') as HTMLElement | null;
      const coordinatorsBgImage = document.querySelector('.coordinators-section .coordinators-bg-image') as HTMLElement | null;
      
      if (heroBgImage) {
        heroBgImage.style.transform = `translateY(${scrollY * 0.3}px)`;
      }
      if (leadershipBgImage) {
        leadershipBgImage.style.transform = `translateY(${scrollY * 0.3}px)`;
      }
      if (communicatorsBgImage) {
        communicatorsBgImage.style.transform = `translateY(${scrollY * 0.3}px)`;
      }
      if (coordinatorsBgImage) {
        coordinatorsBgImage.style.transform = `translateY(${scrollY * 0.3}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <div className="relative bg-gradient-to-br from-surface-900 via-surface-800 to-surface-900">
      {/* Hexagon Pattern Overlay */}
      <div className="fixed inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='28' height='49' viewBox='0 0 28 49' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fb923c' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden lg:pt-40 lg:pb-20">
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src={heroImage} 
            alt="Team Hero" 
            className="object-cover w-full h-full"
          />
        </div>
        
        <div className="container relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-4xl font-semibold tracking-tight text-gray-100 md:text-6xl"
          >
            text
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg leading-relaxed text-gray-200"
          >
            text
          </motion.p>
        </div>
      </section>
  
      {/* Leadership Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="container relative">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-2xl font-semibold text-gray-100">Leadership</h2>
            <p className="text-gray-400">Founders driving OneKey's vision</p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {leadershipMembers.map((member, index) => (
              <motion.div 
                key={member.id} 
                className="overflow-hidden transition-all duration-300 border cursor-pointer card-enhanced backdrop-blur-sm bg-white/5 border-white/5 rounded-2xl group hover:bg-white/8 hover:border-amber-400/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              >
                <div className="relative overflow-hidden aspect-w-3 aspect-h-4 bg-black/20">
                  <motion.img 
                    src={`${process.env.PUBLIC_URL}${member.image}`} 
                    alt={member.name}
                    className="object-cover w-full h-full"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-semibold tracking-tight text-gray-100">{member.name}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-medium tracking-wider uppercase text-amber-300">{member.role}</span>
                    <span className="text-xs text-gray-400">{member.school}</span>
                  </div>
                  <p className="mb-4 text-sm leading-relaxed text-gray-300">{member.bio}</p>
                  {member.instagram && (
                    <a
                      href={member.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 transition-colors hover:text-amber-400"
                    >
                      <i className="text-lg fab fa-instagram" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
  
      {/* Communications Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="container relative">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-2xl font-semibold text-gray-100">Communications</h2>
            <p className="text-gray-400">Managing outreach and community connections</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {communicationsMembers.map((member, index) => (
              <motion.div 
                key={member.id} 
                className="overflow-hidden transition-all duration-300 border cursor-pointer card-enhanced backdrop-blur-sm bg-white/5 border-white/5 rounded-2xl group hover:bg-white/8 hover:border-amber-400/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              >
                <div className="relative overflow-hidden aspect-w-3 aspect-h-4 bg-black/20">
                  <motion.img 
                    src={`${process.env.PUBLIC_URL}${member.image}`} 
                    alt={member.name}
                    className="object-cover w-full h-full"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-semibold tracking-tight text-gray-100">{member.name}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-medium tracking-wider uppercase text-amber-300">{member.role}</span>
                    <span className="text-xs text-gray-400">{member.school}</span>
                  </div>
                  <p className="mb-4 text-sm leading-relaxed text-gray-300">{member.bio}</p>
                  {member.instagram && (
                    <a
                      href={member.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 transition-colors hover:text-amber-400"
                    >
                      <i className="text-lg fab fa-instagram" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
  
      {/* Homework Help Coordinators Section */}
      <section className="relative py-16 overflow-hidden bg-surface-900 coordinators-section">
        <div className="container relative">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-2xl font-semibold text-gray-100">Homework Help Coordinators</h2>
            <p className="text-gray-400">Supporting students through tutoring and academic assistance</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {coordinatorsMembers.map((member, index) => (
              <motion.div 
                key={member.id} 
                className="overflow-hidden transition-all duration-300 border cursor-pointer card-enhanced backdrop-blur-sm bg-white/5 border-white/5 rounded-2xl group hover:bg-white/8 hover:border-amber-400/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              >
                <div className="relative overflow-hidden aspect-w-3 aspect-h-4 bg-black/20">
                  {member.image ? (
                    <motion.img 
                      src={`${process.env.PUBLIC_URL}${member.image}`} 
                      alt={member.name}
                      className="object-cover w-full h-full"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-4xl text-gray-500 bg-black/30">
                      <i className="fas fa-user" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-semibold tracking-tight text-gray-100">{member.name}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-medium tracking-wider uppercase text-amber-300">{member.role}</span>
                    <span className="text-xs text-gray-400">{member.school}</span>
                  </div>
                  <p className="mb-4 text-sm leading-relaxed text-gray-300">{member.bio}</p>
                  {member.instagram && (
                    <a
                      href={member.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 transition-colors hover:text-amber-400"
                    >
                      <i className="text-lg fab fa-instagram" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
  
      {/* Alumni Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="container relative">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-2xl font-semibold text-gray-100">Alumni</h2>
            <p className="text-gray-400">Founding members who continue to inspire our mission</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {alumniMembers.map((member) => (
              <div key={member.id} className="overflow-hidden transition-all duration-300 border card-enhanced backdrop-blur-sm bg-white/5 border-white/5 rounded-2xl group hover:bg-white/8 hover:border-orange-400/20">
                <div className="relative overflow-hidden aspect-w-1 aspect-h-1 bg-black/20">
                  {member.image ? (
                    <img 
                      src={`${process.env.PUBLIC_URL}${member.image}`} 
                      alt={member.name}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-4xl text-gray-500 bg-black/30">
                      <i className="fas fa-user" />
                    </div>
                  )}
                </div>
                <div className="p-5 text-center">
                  <h3 className="mb-2 text-lg font-semibold text-gray-100">{member.name}</h3>
                  <div className="mb-2 font-mono text-xs font-medium tracking-wider uppercase text-amber-300">{member.role}</div>
                  <div className="text-xs text-gray-400">{member.school}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
  
      {/* Join Our Team Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mb-4 text-2xl font-semibold text-gray-100">Join Our Team</h2>
            <p className="mb-8 text-base text-gray-300">
              Ready to make a difference? OneKey is always looking for passionate students.
            </p>
            
            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
              {[
                { icon: 'music', title: 'Musicians', desc: 'Share your musical talents with senior residents.' },
                { icon: 'graduation-cap', title: 'Tutors', desc: 'Help students succeed academically.' },
                { icon: 'users', title: 'Leaders', desc: 'Take on leadership roles and help expand impact.' }
              ].map((item, index) => (
                <div key={index} className="p-6 transition-all duration-300 border card-enhanced backdrop-blur-sm bg-white/5 rounded-xl border-white/5 hover:bg-white/8 hover:border-amber-400/20">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-xl text-white rounded-lg bg-gradient-to-r from-amber-400 to-orange-500">
                    <i className={`fas fa-${item.icon}`} />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-gray-100">{item.title}</h3>
                  <p className="text-sm text-gray-300">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4">
              <Link to="/about" className="inline-block px-6 py-3 text-sm font-medium text-white transition-all duration-300 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 hover:shadow-md hover:shadow-amber-500/15">
                About Us
              </Link>
              <a href="mailto:on3keymusic@gmail.com" className="inline-block px-6 py-3 text-sm font-medium text-gray-100 transition-all duration-300 border rounded-full backdrop-blur-sm bg-white/5 border-white/10 hover:bg-white/10">
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