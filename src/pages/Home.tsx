
import React, { useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import Slideshow from '../components/Slideshow';
import PhotoGallery from '../components/PhotoGallery';
import { getRandomPhotos } from '../data/photos';

const Home: React.FC = () => {
  const heroImages = useMemo(() => getRandomPhotos(6), []);
  const galleryImages = useMemo(() => getRandomPhotos(12), []);
  
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <div className="relative overflow-hidden bg-stone-900">
      {/* Subtle texture overlay */}
      <div className="fixed inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      {/* Hero Section */}
      <section className="hero-section">
        <motion.div style={{ y }} className="hero-section__media">
          <Slideshow images={heroImages} interval={6000} overlay={false} />
        </motion.div>

        <div className="hero-section__scrim" aria-hidden="true" />

        <motion.div className="hero-section__content container">
          <motion.div
            className="hero-section__panel"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
          >
              <h1 className="hero-section__title">text</h1>
              <p className="hero-section__subtitle">text</p>
              <div className="hero-section__actions">
                <Link to="/about" className="hero-section__btn hero-section__btn--primary">
                  text
                </Link>
                <Link to="/timeline" className="hero-section__btn hero-section__btn--secondary">
                  text
                </Link>
              </div>
          </motion.div>

        </motion.div>
      </section>

      {/* Introduction / Philosophy */}
      <motion.section 
        className="relative py-20 overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container relative">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.h2 
              className="mb-6 text-3xl font-medium leading-tight text-white md:text-4xl font-display"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              text
            </motion.h2>
            <motion.p 
              className="text-base leading-relaxed text-gray-200"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              text
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Impact / Services */}
      <section className="relative py-20 overflow-hidden">
        <div className="container relative">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {[
              { title: 'text', subtitle: 'text', image: heroImages[0], desc: 'text' },
              { title: 'text', subtitle: 'text', image: heroImages[1], desc: 'text' },
              { title: 'text', subtitle: 'text', image: heroImages[2], desc: 'text' },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group"
              >
                <div className="aspect-[4/5] overflow-hidden rounded-2xl mb-6 relative">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-earth-900/30 group-hover:opacity-100" />
                </div>
                <h3 className="mb-2 text-2xl font-medium text-white font-display">{service.title}</h3>
                <p className="mb-3 text-sm font-medium text-earth-400">{service.subtitle}</p>
                <p className="text-sm leading-relaxed text-gray-200">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section className="relative py-16">
        <div className="container">
          <PhotoGallery images={galleryImages} title="text" />
        </div>
      </section>


      {/* CTA Section */}
      <motion.section 
        className="relative py-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container relative">
          <motion.div 
            className="max-w-4xl p-8 mx-auto text-center border shadow-2xl backdrop-blur-md bg-white/5 rounded-2xl border-white/10"
            whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(245, 158, 11, 0.25)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <h2 className="mb-4 text-2xl font-bold text-white">text</h2>
            <p className="max-w-2xl mx-auto mb-6 text-base text-stone-300">text</p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link 
                to="/timeline" 
                className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white transition-all duration-300 rounded-full bg-earth-600 hover:bg-earth-700 hover:shadow-lg"
              >
                text
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
