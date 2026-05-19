import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ABOUT_ITEMS = [
  { name: 'OneKey',    path: '/about' },
  { name: 'Vanstring', path: '/vanstring' },
];

const dropdownVariants = {
  hidden: { opacity: 0, y: -6, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.18, ease: 'easeOut' as const },
  },
  exit: {
    opacity: 0, y: -4, scale: 0.97,
    transition: { duration: 0.13, ease: 'easeIn' as const },
  },
};

const Navbar = () => {
  const [isOpen, setIsOpen]         = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [aboutOpen, setAboutOpen]   = useState(false);
  const [mobileAbout, setMobileAbout] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => { setIsOpen(false); setAboutOpen(false); setMobileAbout(false); }, [location]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) {
        setAboutOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const flatLinks = [
    { name: 'Timeline',    path: '/timeline' },
    { name: 'Fundraisers', path: '/fundraisers' },
    { name: 'Team',        path: '/team' },
  ];

  const isAboutActive = ABOUT_ITEMS.some(i => i.path === location.pathname);

  const navShellClass = [
    'site-nav',
    isScrolled ? 'site-nav--scrolled' : '',
    !isHome ? 'site-nav--solid' : '',
  ].filter(Boolean).join(' ');

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

        {/* Desktop links */}
        <motion.div
          className="site-nav__desktop"
          initial={false}
          animate={{ opacity: isOpen ? 0.4 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {/* About dropdown */}
          <div
            ref={aboutRef}
            className="relative w-fit"
            onMouseEnter={() => setAboutOpen(true)}
            onMouseLeave={() => setAboutOpen(false)}
          >
            <button
              className={`site-nav__link flex items-center gap-1 border-0 cursor-pointer ${isAboutActive ? 'site-nav__link--active' : ''}`}
              onClick={() => setAboutOpen(o => !o)}
              aria-expanded={aboutOpen}
            >
              About
              <motion.span
                animate={{ rotate: aboutOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex' }}
              >
                <ChevronDown size={13} strokeWidth={2.5} />
              </motion.span>
            </button>

            <AnimatePresence>
              {aboutOpen && (
                <motion.div
                  className="nav-dropdown"
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {ABOUT_ITEMS.map((item, i) => (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.18, ease: 'easeOut' }}
                    >
                      <Link
                        to={item.path}
                        className={`nav-dropdown__item ${location.pathname === item.path ? 'nav-dropdown__item--active' : ''}`}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Flat links */}
          {flatLinks.map((link) => {
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

      {/* Mobile menu */}
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
              {/* About accordion */}
              <button
                className={`site-nav__mobile-link w-full text-left flex items-center justify-between bg-transparent border-0 cursor-pointer ${isAboutActive ? 'site-nav__mobile-link--active' : ''}`}
                onClick={() => setMobileAbout(o => !o)}
              >
                About
                <motion.span
                  animate={{ rotate: mobileAbout ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex' }}
                >
                  <ChevronDown size={14} strokeWidth={2.5} />
                </motion.span>
              </button>

              <AnimatePresence>
                {mobileAbout && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    {ABOUT_ITEMS.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`site-nav__mobile-link pl-6 ${location.pathname === item.path ? 'site-nav__mobile-link--active' : ''}`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {flatLinks.map((link) => {
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
