import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import Slideshow from '../components/Slideshow';
import PhotoGallery from '../components/PhotoGallery';
import { LogoMark } from '../components/Layout/Navbar';
import { getRandomPhotos, PAGE_PHOTOS } from '../data/photos';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Home: React.FC = () => {
  const heroImages    = useMemo(() => PAGE_PHOTOS, []);
  const galleryImages = useMemo(() => getRandomPhotos(12), []);
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = gsap.context(() => {

      /* ── Initial hidden state (before paint) ────────────────────────── */
      gsap.set('.home-hero__media',    { scale: 1.06 });
      gsap.set('.home-hero__logo',     { opacity: 0, y: 30, scale: 1.15 });
      gsap.set('.home-hero__glow',     { opacity: 0, scale: 0.6 });
      gsap.set('.home-hero__scroll',   { opacity: 0 });
      gsap.set('.home-gallery__inner', { y: 50, opacity: 0 });

      /* ── Hero entrance — dramatic logo with glow ─────────────────────── */
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      intro
        .to('.home-hero__media', { scale: 1, duration: 1.8, ease: 'power2.out', delay: 0.1 })
        // Glow rises behind logo
        .to('.home-hero__glow', { opacity: 1, scale: 1, duration: 1.4, ease: 'power2.out' }, '-=1.6')
        // Logo settles down from a larger scale (spacious entrance)
        .to('.home-hero__logo', { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: 'power3.out' }, '-=1.5')
        .to('.home-hero__scroll', { opacity: 1, duration: 0.6 }, '-=0.4');

      /* ── Hero parallax — slideshow drifts up as you scroll ──────────── */
      gsap.to('.home-hero__media', {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: { trigger: '.home-hero', start: 'top top', end: 'bottom top', scrub: 0.8 },
      });

      /* ── Scroll hint hides when you start scrolling ─────────────────── */
      gsap.to('.home-hero__scroll', {
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: '.home-hero', start: 'top top', end: '15% top', scrub: 0.4 },
      });

      /* ── Gallery wrapper fade-up on scroll ───────────────────────────── */
      gsap.to('.home-gallery__inner', {
        y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.home-gallery', start: 'top 80%', once: true },
      });

    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative overflow-hidden bg-stone-900">

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="home-hero hero-section">
        <div className="home-hero__media hero-section__media">
          <Slideshow images={heroImages} interval={6000} overlay={false} />
        </div>
        <div className="hero-section__scrim" aria-hidden="true" />

        {/* Soft glow behind logo */}
        <div className="home-hero__glow" aria-hidden="true" style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 540, height: 540, transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(200,164,110,0.22) 0%, rgba(200,164,110,0.08) 35%, transparent 65%)',
          filter: 'blur(20px)', pointerEvents: 'none', zIndex: 2,
        }} />

        <div className="home-hero__logo hero-section__logo" style={{ zIndex: 3 }}>
          <LogoMark />
        </div>

        {/* Scroll hint */}
        <motion.div
          className="home-hero__scroll"
          aria-hidden="true"
          style={{
            position: 'absolute', bottom: 24, left: '50%', x: '-50%',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            pointerEvents: 'none', zIndex: 4,
          }}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div style={{ width: 1.5, height: 24, borderRadius: 2, background: 'rgba(255,255,255,0.45)' }} />
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.45)' }} />
        </motion.div>
      </section>

      {/* ── Photo Gallery ─────────────────────────────────────────────── */}
      <section className="home-gallery relative py-16">
        <div className="home-gallery__inner container">
          <PhotoGallery images={galleryImages} title="" />
        </div>
      </section>

    </div>
  );
};

export default Home;
