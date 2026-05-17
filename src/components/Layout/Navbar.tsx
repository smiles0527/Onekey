import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Timeline', path: '/timeline' },
    { name: 'Team', path: '/team' },
  ];

  const navShellClass = [
    'site-nav',
    isScrolled ? 'site-nav--scrolled' : '',
    !isHome ? 'site-nav--solid' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <nav className={navShellClass}>
      <motion.div
        className="site-nav__inner"
        initial={false}
        animate={{ paddingTop: isScrolled ? 12 : 16, paddingBottom: isScrolled ? 12 : 16 }}
        transition={{ duration: 0.25 }}
      >
        <Link to="/" className="site-nav__logo">
          One<span className="text-earth-300">Key</span>
        </Link>

        <motion.div
          className="site-nav__desktop"
          initial={false}
          animate={{ opacity: isOpen ? 0.4 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`site-nav__link ${isActive ? 'site-nav__link--active' : ''}`}
              >
                {link.name}
              </Link>
            );
          })}
          <Link to="/admin" className="site-nav__cta">
            Get Involved
          </Link>
        </motion.div>

        <button
          type="button"
          className="site-nav__toggle md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <X size={22} strokeWidth={2.25} /> : <Menu size={22} strokeWidth={2.25} />}
        </button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              type="button"
              className="site-nav__backdrop md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-label="Close menu"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="site-nav__mobile md:hidden"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`site-nav__mobile-link ${isActive ? 'site-nav__mobile-link--active' : ''}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <Link
                to="/admin"
                className="site-nav__cta site-nav__cta--mobile"
                onClick={() => setIsOpen(false)}
              >
                Get Involved
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
