import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Logo assembly animation ──────────────────────────────────────────────────
const LOGO_CHARS = [
  { ch: 'O', accent: false },
  { ch: 'n', accent: false },
  { ch: 'e', accent: false },
  { ch: 'K', accent: true  },
  { ch: 'e', accent: true  },
  { ch: 'y', accent: true  },
];

function seededRand(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

// ── Wiggly staff ─────────────────────────────────────────────────────────────
const STAFF_Y = [3, 7.5, 12, 16.5, 21];
const WAVE_PERIOD = 28;
const WAVE_AMP = 1.4;

function wavePath(y: number): string {
  const c = WAVE_PERIOD / 6;
  let d = `M${-WAVE_PERIOD * 2},${y}`;
  for (let x = -WAVE_PERIOD * 2; x < 420; x += WAVE_PERIOD) {
    d += ` C${x + c},${y - WAVE_AMP} ${x + WAVE_PERIOD / 2 - c},${y - WAVE_AMP} ${x + WAVE_PERIOD / 2},${y}`;
    d += ` C${x + WAVE_PERIOD / 2 + c},${y + WAVE_AMP} ${x + WAVE_PERIOD - c},${y + WAVE_AMP} ${x + WAVE_PERIOD},${y}`;
  }
  return d;
}

const WigglyStaff: React.FC = () => (
  <svg
    style={{
      position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
      width: '100%', height: 26, overflow: 'hidden', pointerEvents: 'none',
    }}
  >
    <motion.g
      animate={{ x: [0, -WAVE_PERIOD] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
    >
      {STAFF_Y.map((y, i) => (
        <path key={i} d={wavePath(y)} stroke="rgba(200,164,110,0.22)" strokeWidth="0.65" fill="none" />
      ))}
    </motion.g>
  </svg>
);

export const LogoMark: React.FC = () => {
  const offsets = useMemo(() => LOGO_CHARS.map((_, i) => ({
    x: (seededRand(i * 3)     - 0.5) * 80,
    y: (seededRand(i * 3 + 1) - 0.5) * 60,
    r: (seededRand(i * 3 + 2) - 0.5) * 70,
  })), []);

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 0, position: 'relative' }}>
      {/* Treble clef */}
      <motion.svg
        width="11" height="19" viewBox="0 0 13 22" fill="none"
        style={{ flexShrink: 0, marginRight: 5 }}
        initial={{ opacity: 0, x: -30, y: -20, rotate: -40 }}
        animate={{ opacity: 0.55, x: 0, y: 0, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 18, delay: 0.05 }}
      >
        <path
          d="M6.5 1C6.5 1 3 4 3 7.5C3 10 4.5 11.5 6.5 12C6.5 12 9 12.5 9 15C9 17.5 7 19 5 19C3 19 1.5 17.5 1.5 15.5C1.5 13.5 3 12.5 4.5 12.5M6.5 1C6.5 1 10 4 10 7.5C10 10 8.5 11.5 6.5 12M6.5 1V19M6.5 19V21"
          stroke="#c8a46e" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
        />
      </motion.svg>

      {/* Text with wiggly staff running through it */}
      <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'baseline' }}>
        <WigglyStaff />
        {LOGO_CHARS.map(({ ch, accent }, i) => (
          <motion.span
            key={i}
            style={{ color: accent ? '#c8a46e' : '#fafaf9', display: 'inline-block', position: 'relative', zIndex: 1 }}
            initial={{ x: offsets[i].x, y: offsets[i].y, rotate: offsets[i].r, opacity: 0 }}
            animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22, delay: 0.08 + i * 0.045 }}
          >
            {ch}
          </motion.span>
        ))}
      </span>

      <motion.span
        aria-hidden
        style={{ position: 'absolute', top: -11, right: -12, fontSize: 13, color: '#d6a94a', pointerEvents: 'none', userSelect: 'none', textShadow: '0 0 8px rgba(214,169,74,0.35)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.8, 0.62], y: [0, -3, 0] }}
        transition={{ opacity: { delay: 0.55, duration: 0.4 }, y: { delay: 0.55, duration: 2.8, repeat: Infinity, ease: 'easeInOut' } }}
      >♪</motion.span>
      <motion.span
        aria-hidden
        style={{ position: 'absolute', top: -4, right: -25, fontSize: 10, color: '#d6a94a', pointerEvents: 'none', userSelect: 'none', textShadow: '0 0 7px rgba(214,169,74,0.3)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.65, 0.48], y: [0, -4, 0] }}
        transition={{ opacity: { delay: 0.7, duration: 0.4 }, y: { delay: 0.7, duration: 3.4, repeat: Infinity, ease: 'easeInOut' } }}
      >♫</motion.span>
    </span>
  );
};

interface LogoGlowProps {
  children: React.ReactNode;
  className?: string;
}

export const LogoGlow: React.FC<LogoGlowProps> = ({ children, className = '' }) => {
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--logo-glow-x', `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty('--logo-glow-y', `${event.clientY - bounds.top}px`);
  };

  return (
    <div
      className={`logo-glow ${className}`.trim()}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerMove}
    >
      {children}
    </div>
  );
};

const ABOUT_ITEMS = [
  { name: 'OneKey',    path: '/about' },
  { name: 'Vanstring', path: '/vanstring' },
];

const FUNDRAISER_ITEMS = [
  { name: 'Richmond Hospital Foundation', path: '/fundraisers' },
  { name: 'Vancouver Aquarium Donation Concert', path: '/fundraisers/vancouver-aquarium' },
  { name: 'Voluntary Teaching for China', path: '/vtc' },
];

const dropdownVariants = {
  hidden: { opacity: 0, y: -4, scale: 0.98 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.1, ease: 'easeOut' as const },
  },
  exit: {
    opacity: 0, y: -3, scale: 0.98,
    transition: { duration: 0.06, ease: 'easeIn' as const },
  },
};

const Navbar = () => {
  const [isOpen, setIsOpen]               = useState(false);
  const [isScrolled, setIsScrolled]       = useState(false);
  const [aboutOpen, setAboutOpen]         = useState(false);
  const [mobileAbout, setMobileAbout]     = useState(false);
  const [fundraiserOpen, setFundraiserOpen]       = useState(false);
  const [mobileFundraiser, setMobileFundraiser]   = useState(false);
  const aboutRef      = useRef<HTMLDivElement>(null);
  const fundraiserRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => { setIsOpen(false); setAboutOpen(false); setMobileAbout(false); setFundraiserOpen(false); setMobileFundraiser(false); }, [location]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) setAboutOpen(false);
      if (fundraiserRef.current && !fundraiserRef.current.contains(e.target as Node)) setFundraiserOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const flatLinks = [
    { name: 'Timeline', path: '/timeline' },
    { name: 'Team',     path: '/team' },
  ];

  const isAboutActive      = ABOUT_ITEMS.some(i => i.path === location.pathname);
  const isFundraiserActive = FUNDRAISER_ITEMS.some(i => i.path === location.pathname);

  const openAboutMenu = () => {
    setFundraiserOpen(false);
    setAboutOpen(true);
  };

  const openFundraiserMenu = () => {
    setAboutOpen(false);
    setFundraiserOpen(true);
  };

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
        <motion.div
          initial={isHome ? { opacity: 0, y: -4 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <Link to="/" className="site-nav__logo" style={{ position: 'relative' }}>
            <LogoGlow>
              <LogoMark />
            </LogoGlow>
          </Link>
        </motion.div>

        {/* Desktop links */}
        <motion.div
          className="site-nav__desktop"
          initial={false}
          animate={{ opacity: isOpen ? 0.4 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {/* Home */}
          <Link to="/" className={`site-nav__link ${location.pathname === '/' ? 'site-nav__link--active' : ''}`}>
            Home
          </Link>

          {/* About dropdown */}
          <div
            ref={aboutRef}
            className="relative w-fit"
            onMouseEnter={openAboutMenu}
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
                      transition={{ delay: i * 0.025, duration: 0.1, ease: 'easeOut' }}
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

          {/* Fundraisers dropdown */}
          <div
            ref={fundraiserRef}
            className="relative w-fit"
            onMouseEnter={openFundraiserMenu}
            onMouseLeave={() => setFundraiserOpen(false)}
          >
            <button
              className={`site-nav__link flex items-center gap-1 border-0 cursor-pointer ${isFundraiserActive ? 'site-nav__link--active' : ''}`}
              onClick={() => setFundraiserOpen(o => !o)}
              aria-expanded={fundraiserOpen}
            >
              Fundraisers
              <motion.span
                animate={{ rotate: fundraiserOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex' }}
              >
                <ChevronDown size={13} strokeWidth={2.5} />
              </motion.span>
            </button>

            <AnimatePresence>
              {fundraiserOpen && (
                <motion.div
                  className="nav-dropdown"
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {FUNDRAISER_ITEMS.map((item, i) => (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.025, duration: 0.1, ease: 'easeOut' }}
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
              {/* Home */}
              <Link
                to="/"
                className={`site-nav__mobile-link ${location.pathname === '/' ? 'site-nav__mobile-link--active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>

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
                    className="site-nav__mobile-submenu overflow-hidden"
                  >
                    {ABOUT_ITEMS.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`site-nav__mobile-link site-nav__mobile-submenu-link ${location.pathname === item.path ? 'site-nav__mobile-link--active' : ''}`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Fundraisers accordion */}
              <button
                className={`site-nav__mobile-link w-full text-left flex items-center justify-between bg-transparent border-0 cursor-pointer ${isFundraiserActive ? 'site-nav__mobile-link--active' : ''}`}
                onClick={() => setMobileFundraiser(o => !o)}
              >
                Fundraisers
                <motion.span
                  animate={{ rotate: mobileFundraiser ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex' }}
                >
                  <ChevronDown size={14} strokeWidth={2.5} />
                </motion.span>
              </button>

              <AnimatePresence>
                {mobileFundraiser && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                    className="site-nav__mobile-submenu overflow-hidden"
                  >
                    {FUNDRAISER_ITEMS.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`site-nav__mobile-link site-nav__mobile-submenu-link ${location.pathname === item.path ? 'site-nav__mobile-link--active' : ''}`}
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
