import React, { useMemo } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import Slideshow from '../components/Slideshow';
import PhotoGallery from '../components/PhotoGallery';
import { LogoMark } from '../components/Layout/Navbar';
import { getRandomPhotos } from '../data/photos';

const Home: React.FC = () => {
  const heroImages    = useMemo(() => getRandomPhotos(6),  []);
  const galleryImages = useMemo(() => getRandomPhotos(12), []);

  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();
  const rawHeroY = useTransform(scrollY, [0, 700], prefersReducedMotion ? [0, 0] : [0, -120]);
  const heroY = useSpring(rawHeroY, { stiffness: 90, damping: 28, mass: 0.35 });

  return (
    <div className="relative overflow-hidden bg-stone-900">
      <section className="hero-section">
        <motion.div style={{ y: heroY }} className="hero-section__media">
          <Slideshow images={heroImages} interval={6000} overlay={false} />
        </motion.div>
        <div className="hero-section__scrim" aria-hidden="true" />
        <motion.div
          className="hero-section__logo"
          initial={{ opacity: 0, y: 10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
        >
          <LogoMark />
        </motion.div>
      </section>

      <section className="relative py-16">
        <div className="container">
          <PhotoGallery images={galleryImages} title="" />
        </div>
      </section>
    </div>
  );
};

export default Home;
