import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const RICHMOND_PHOTO = `${process.env.PUBLIC_URL}/pics/richmondhospital.jpg`;

const Fundraisers: React.FC = () => {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 180]);

  return (
    <div className="relative overflow-hidden bg-stone-900">

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="hero-section" style={{ background: '#1c1917' }}>
        <motion.div style={{ y: heroY }} className="hero-section__media">
          {/* Blurred fill for left/right letterbox bars */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${RICHMOND_PHOTO})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(24px) brightness(0.35)',
            transform: 'scale(1.08)',
          }} />
          {/* Main image, fully visible */}
          <img
            src={RICHMOND_PHOTO}
            alt="OneKey presenting cheque to Richmond Hospital Foundation"
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', position: 'relative', zIndex: 1 }}
          />
        </motion.div>

        {/* Bottom gradient so text is legible */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 160, zIndex: 2,
          background: 'linear-gradient(to top, rgba(12,10,9,0.75) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* Centered title */}
        <motion.div
          style={{
            position: 'absolute', bottom: 56, left: 0, right: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3,
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
        >
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c8a46e', marginBottom: 8 }}>
            Fundraiser Partner
          </p>
          <h1 style={{
            fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)',
            fontWeight: 700,
            color: '#fafaf9',
            letterSpacing: '-0.02em',
            textAlign: 'center',
            textShadow: '0 2px 24px rgba(0,0,0,0.7)',
            margin: 0,
          }}>
            Richmond Hospital Foundation
          </h1>
        </motion.div>

        {/* Scroll tug */}
        <motion.div
          aria-hidden="true"
          style={{
            position: 'absolute', bottom: 18, left: '50%', x: '-50%',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            pointerEvents: 'none', zIndex: 4,
          }}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div style={{ width: 1.5, height: 24, borderRadius: 2, background: 'rgba(255,255,255,0.4)' }} />
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />
        </motion.div>
      </section>

      {/* ── Description ─────────────────────────────────────────────────── */}
      <motion.section
        className="relative py-24"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
      >
        <div className="container" style={{ padding: '0 24px' }}>
          {/* Text goes here */}
        </div>
      </motion.section>

    </div>
  );
};

export default Fundraisers;
