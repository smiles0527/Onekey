import React, { useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Slideshow from '../components/Slideshow';
import PhotoGallery from '../components/PhotoGallery';
import { getRandomPhotos } from '../data/photos';

const Home: React.FC = () => {
  const heroImages    = useMemo(() => getRandomPhotos(6),  []);
  const galleryImages = useMemo(() => getRandomPhotos(12), []);

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <div className="relative overflow-hidden bg-stone-900">
      {/* Hero */}
      <section className="hero-section">
        <motion.div style={{ y }} className="hero-section__media">
          <Slideshow images={heroImages} interval={6000} overlay={false} />
        </motion.div>
        <div className="hero-section__scrim" aria-hidden="true" />
      </section>

      {/* Photo Gallery */}
      <section className="relative py-16">
        <div className="container">
          <PhotoGallery images={galleryImages} title="" />
        </div>
      </section>
    </div>
  );
};

export default Home;
