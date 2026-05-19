import React, { useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import Slideshow from '../components/Slideshow';
import { getRandomPhotos } from '../data/photos';

// Swap these out for specific partner photos once available
const RICHMOND_PHOTO = `${process.env.PUBLIC_URL}/slideshow/041A0050.JPG`;
const VTC_PHOTO      = `${process.env.PUBLIC_URL}/slideshow/041A1349.JPG`;

const Fundraisers: React.FC = () => {
  const heroImages = useMemo(() => getRandomPhotos(5), []);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 180]);

  return (
    <div className="relative overflow-hidden bg-stone-900">

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="hero-section">
        <motion.div style={{ y: heroY }} className="hero-section__media">
          <Slideshow images={heroImages} interval={7000} overlay={false} />
        </motion.div>
        <div className="hero-section__scrim" aria-hidden="true" />

        <motion.div className="hero-section__content container">
          <motion.div
            className="hero-section__panel"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c8a46e', marginBottom: 14 }}>
              text
            </p>
            <h1 className="hero-section__title">text</h1>
            <p className="hero-section__subtitle">text</p>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Richmond Hospital Foundation ───────────────────────────────── */}
      <motion.section
        className="relative py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
      >
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
            gap: 48,
            alignItems: 'center',
          }}>
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '4/3', flexShrink: 0 }}
            >
              <img
                src={RICHMOND_PHOTO}
                alt="text"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c8a46e', marginBottom: 12 }}>
                text
              </p>
              <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700, color: '#f5f0eb', margin: '0 0 18px', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                text
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: '#9d9390', margin: '0 0 16px' }}>
                text
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: '#9d9390', margin: 0 }}>
                text
              </p>

              <div style={{ marginTop: 28, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {['text', 'text', 'text'].map((tag, i) => (
                  <span key={i} style={{
                    fontSize: 12, fontWeight: 600, padding: '5px 13px', borderRadius: 20,
                    background: 'rgba(200,164,110,0.12)', border: '1px solid rgba(200,164,110,0.25)',
                    color: '#c8a46e',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 auto', maxWidth: 900 }} />

      {/* ── VTC ────────────────────────────────────────────────────────── */}
      <motion.section
        className="relative py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
      >
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
            gap: 48,
            alignItems: 'center',
          }}>
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ order: 0 }}
            >
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6ca58a', marginBottom: 12 }}>
                text
              </p>
              <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700, color: '#f5f0eb', margin: '0 0 18px', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                text
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: '#9d9390', margin: '0 0 16px' }}>
                text
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: '#9d9390', margin: '0 0 28px' }}>
                text
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                {['text', 'text', 'text'].map((tag, i) => (
                  <span key={i} style={{
                    fontSize: 12, fontWeight: 600, padding: '5px 13px', borderRadius: 20,
                    background: 'rgba(108,165,138,0.12)', border: '1px solid rgba(108,165,138,0.25)',
                    color: '#6ca58a',
                  }}>
                    {tag}
                  </span>
                ))}
                <motion.a
                  href="https://voluntaryteachingforchina.wordpress.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontSize: 12, fontWeight: 600, padding: '5px 13px', borderRadius: 20,
                    background: 'rgba(108,165,138,0.06)', border: '1px solid rgba(108,165,138,0.25)',
                    color: '#8ec4a8', textDecoration: 'none',
                  }}
                >
                  text <ExternalLink size={11} strokeWidth={2.2} />
                </motion.a>
              </div>
            </motion.div>

            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '4/3', order: 1 }}
            >
              <img
                src={VTC_PHOTO}
                alt="text"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ── Footer CTA ─────────────────────────────────────────────────── */}
      <motion.section
        className="relative py-16"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14,
            padding: '32px 48px',
          }}>
            <p style={{ margin: '0 0 6px', fontSize: 13, color: '#6b6460' }}>text</p>
            <a
              href="mailto:on3keymusic@gmail.com"
              style={{ fontSize: 16, fontWeight: 600, color: '#c8a46e', textDecoration: 'none' }}
            >
              on3keymusic@gmail.com
            </a>
          </div>
        </div>
      </motion.section>

    </div>
  );
};

export default Fundraisers;
