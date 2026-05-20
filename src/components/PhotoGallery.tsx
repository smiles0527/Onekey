import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

interface PhotoGalleryProps {
  images: string[];
  title?: string;
  className?: string;
}

const INITIAL = 6;
const STEP    = 6;

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ images, title = '', className = '' }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [visibleCount, setVisibleCount]   = useState(INITIAL);

  if (!images.length) return null;

  const visibleImages = images.slice(0, visibleCount);
  const hasMore = visibleCount < images.length;
  const hasLess = visibleCount > INITIAL;

  return (
    <div className={`py-12 ${className}`}>
      {title && (
        <h3 className="text-4xl font-bold text-white mb-12 text-center">{title}</h3>
      )}

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 px-4">
        {visibleImages.map((src, index) => (
          <motion.div
            key={`${src}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (index % STEP) * 0.05 }}
            className="break-inside-avoid"
          >
            <motion.div
              className="relative group overflow-hidden rounded-lg cursor-pointer"
              onClick={() => setSelectedImage(src)}
              whileHover={{ scale: 1.02, y: -3 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
              <motion.img
                src={src}
                alt={`Gallery ${index + 1}`}
                className="w-full h-auto object-cover"
                loading="lazy"
                decoding="async"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Show more / show less */}
      {(hasMore || hasLess) && (
        <div className="mt-10 flex justify-center gap-3">
          {hasMore && (
            <motion.button
              onClick={() => setVisibleCount(c => Math.min(c + STEP, images.length))}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '9px 20px', borderRadius: 99,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                color: '#c8c0b8', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Show more <ChevronDown size={14} strokeWidth={2.2} />
            </motion.button>
          )}
          {hasLess && (
            <motion.button
              onClick={() => setVisibleCount(INITIAL)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '9px 20px', borderRadius: 99,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                color: '#6b6460', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Show less <ChevronUp size={14} strokeWidth={2.2} />
            </motion.button>
          )}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(12,10,9,0.92)', backdropFilter: 'blur(12px)' }}
            onClick={() => setSelectedImage(null)}
          >
            <button
              style={{
                position: 'absolute', top: 20, right: 24,
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '50%', width: 40, height: 40,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fafaf9', cursor: 'pointer',
              }}
              onClick={() => setSelectedImage(null)}
            >
              <X size={18} strokeWidth={2} />
            </button>
            <motion.img
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={selectedImage}
              alt="Full screen"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhotoGallery;
