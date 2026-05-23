import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePhotoStore } from '../store/photoStore';

gsap.registerPlugin(ScrollTrigger);

const AQUARIUM_PHOTO = `${process.env.PUBLIC_URL}/pics/aquarium-fundraiser.jpg`;

const VIDEOS = [
  { id: 'McZ33QKRQpg', title: 'Concert Recording — Part 1' },
  { id: '9EAbSrZVo6o', title: 'Concert Recording — Part 2' },
];

const RAISED = 5715;
const GOAL   = 10000;

/* ──────────────────────────────────────────────────────────────────────── */

interface VideoEmbedProps {
  id: string;
  title: string;
  index: number;
  total: number;
}

const VideoEmbed: React.FC<VideoEmbedProps> = ({ id, title, index, total }) => {
  const [playing, setPlaying] = useState(false);
  const thumb = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

  return (
    <div className="video-card">
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: 14, overflow: 'hidden', background: '#0a0a0a', boxShadow: '0 8px 40px rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.07)' }}>
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            aria-label={`Play ${title}`}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', padding: 0, cursor: 'pointer', background: 'transparent' }}
          >
            <img src={thumb} alt={title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 80, height: 80, borderRadius: '50%',
                background: 'rgba(200,164,110,0.92)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
              }}
            >
              <div style={{ width: 0, height: 0, borderTop: '13px solid transparent', borderBottom: '13px solid transparent', borderLeft: '22px solid #1c1917', marginLeft: 5 }} />
            </motion.div>
          </button>
        )}
      </div>
      <p style={{ marginTop: 10, fontSize: '0.82rem', color: '#57534e', fontWeight: 500, letterSpacing: '0.02em' }}>
        {index + 1} / {total} — {title}
      </p>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────────────── */

const VancouverAquarium: React.FC = () => {
  const rootRef       = useRef<HTMLDivElement>(null);
  const counterRef    = useRef<HTMLSpanElement>(null);
  const fetchPhotos   = usePhotoStore(s => s.fetchPhotos);
  const uploadedVA    = usePhotoStore(s => s.photos.filter(p => p.category === 'vancouver-aquarium'));

  useEffect(() => { fetchPhotos(); }, [fetchPhotos]);

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* ── 1. HERO ENTRANCE (on mount) ───────────────────────────────── */
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });

      intro
        .fromTo('.hero-eyebrow',
          { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
          { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 0.9, delay: 0.2 }
        )
        .fromTo('.hero-title',
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          '-=0.4'
        )
        .fromTo('.hero-badge',
          { scale: 0.7, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.8)' },
          '-=0.3'
        );

      /* ── 2. HERO PARALLAX (scrub on scroll) ────────────────────────── */
      // Image zooms slightly + drifts up as you scroll past hero
      gsap.to('.hero-image', {
        scale: 1.15,
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        },
      });

      // Hero text moves up and fades as you scroll away
      gsap.to('.hero-content', {
        y: -80,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom 30%',
          scrub: 0.6,
        },
      });

      /* ── 3. STAT SECTION — count-up plays once, then stays ──────────── */
      ScrollTrigger.create({
        trigger: '.stat-section',
        start: 'top 70%',
        once: true,
        onEnter: () => {
          const counter = { val: 0 };
          gsap.to(counter, {
            val: RAISED,
            duration: 2.2,
            ease: 'power2.out',
            onUpdate: () => {
              if (counterRef.current) {
                counterRef.current.textContent = '$' + Math.round(counter.val).toLocaleString();
              }
            },
          });
          gsap.to('.stat-bar-fill', {
            scaleX: RAISED / GOAL,
            duration: 1.8,
            ease: 'power3.out',
          });
        },
      });

      // Stat labels fade in as section enters
      gsap.fromTo('.stat-label',
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.stat-section', start: 'top 80%' },
        }
      );

      /* ── 4. ABOUT — line-by-line clip-path reveal ──────────────────── */
      gsap.utils.toArray<HTMLElement>('.reveal-line').forEach((line) => {
        gsap.fromTo(line,
          { y: 40, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
          {
            y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)',
            duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: line, start: 'top 88%' },
          }
        );
      });

      /* ── 5. VIDEO CARDS — fly in from sides with rotation ──────────── */
      gsap.fromTo('.video-card',
        {
          x: (i) => (i === 0 ? -180 : 180),
          y: 60,
          opacity: 0,
          scale: 0.82,
          rotation: (i) => (i === 0 ? -8 : 8),
        },
        {
          x: 0, y: 0, opacity: 1, scale: 1, rotation: 0,
          duration: 1.2, stagger: 0.18, ease: 'power4.out',
          scrollTrigger: { trigger: '.videos-section', start: 'top 78%' },
        }
      );

    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative overflow-hidden bg-stone-900">

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="hero hero-section--short" style={{ background: '#1c1917', position: 'relative' }}>
        {/* Image layer */}
        <div className="hero-image" style={{ position: 'absolute', inset: 0, willChange: 'transform' }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${AQUARIUM_PHOTO})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            filter: 'brightness(0.45)',
          }} />
        </div>

        {/* Bottom gradient */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 240, zIndex: 2,
          background: 'linear-gradient(to top, rgba(12,10,9,0.95) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* Hero content (parallax target) */}
        <div className="hero-content" style={{
          position: 'absolute', inset: 0, zIndex: 3,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
          paddingBottom: 64, willChange: 'transform',
        }}>
          <p className="hero-eyebrow" style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.16em',
            textTransform: 'uppercase', color: '#c8a46e', marginBottom: 12,
          }}>
            Vanstring · 2019 · Virtual Concert
          </p>
          <h1 className="hero-title" style={{
            fontSize: 'clamp(1.7rem, 3.6vw, 3rem)', fontWeight: 700, color: '#fafaf9',
            letterSpacing: '-0.025em', textAlign: 'center',
            textShadow: '0 2px 24px rgba(0,0,0,0.8)', margin: 0,
            padding: '0 24px',
          }}>
            Vancouver Aquarium Donation Concert
          </h1>
          <div className="hero-badge" style={{ marginTop: 16 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '4px 14px', borderRadius: 999,
              background: 'rgba(40,40,40,0.6)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#78716c' }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a8a29e' }}>Completed</span>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div aria-hidden="true"
          style={{
            position: 'absolute', bottom: 18, left: '50%', x: '-50%',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            pointerEvents: 'none', zIndex: 4,
          }}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
        >
          <div style={{ width: 1.5, height: 24, borderRadius: 2, background: 'rgba(255,255,255,0.4)' }} />
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />
        </motion.div>
      </section>

      {/* ── Stat (count-up + scroll-driven bar) ─────────────────────────── */}
      <section className="stat-section relative" style={{ padding: '120px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <p className="stat-label" style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.16em',
            textTransform: 'uppercase', color: '#c8a46e', marginBottom: 24,
          }}>
            Together, our community raised
          </p>
          <h2 style={{
            fontSize: 'clamp(3.5rem, 9vw, 6rem)', fontWeight: 700, color: '#fafaf9',
            letterSpacing: '-0.04em', lineHeight: 1, margin: 0,
          }}>
            <span ref={counterRef}>$0</span>
          </h2>
          <p className="stat-label" style={{ fontSize: '1rem', color: '#78716c', marginTop: 16 }}>
            of a <span style={{ color: '#a8a29e' }}>$10,000</span> goal · 57% achieved
          </p>

          {/* Scroll-driven progress bar */}
          <div style={{
            marginTop: 36, height: 6, borderRadius: 3,
            background: 'rgba(255,255,255,0.07)', overflow: 'hidden',
          }}>
            <div className="stat-bar-fill" style={{
              height: '100%', width: '100%', borderRadius: 3,
              background: 'linear-gradient(90deg, #c8a46e 0%, #d9b888 100%)',
              transformOrigin: 'left center', transform: 'scaleX(0)',
            }} />
          </div>
        </div>
      </section>

      {/* ── About ───────────────────────────────────────────────────────── */}
      <section className="relative" style={{ padding: '40px 24px 100px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <p className="reveal-line" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c8a46e', marginBottom: 16 }}>
            About This Event
          </p>
          <h2 className="reveal-line" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700, color: '#fafaf9', letterSpacing: '-0.02em', marginBottom: 28 }}>
            Save the Vancouver Aquarium
          </h2>
          <p className="reveal-line" style={{ fontSize: '1rem', color: '#a8a29e', lineHeight: 1.8, marginBottom: 16 }}>
            In 2019, Vanstring hosted a virtual concert fundraiser in support of the Ocean Wise Conservation Association's campaign to save the Vancouver Aquarium. The aquarium — a cornerstone of marine education and conservation on the West Coast — faced significant challenges, and this concert was one way our community answered the call.
          </p>
          <p className="reveal-line" style={{ fontSize: '1rem', color: '#a8a29e', lineHeight: 1.8 }}>
            Performers shared their music online, turning screens into a stage and turning viewers into donors for one of Vancouver's most beloved institutions.
          </p>
        </div>
      </section>

      {/* ── Concert Recordings ──────────────────────────────────────────── */}
      <section className="videos-section relative" style={{ padding: '0 32px 120px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <p className="reveal-line" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c8a46e', marginBottom: 32 }}>
            Concert Recordings
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            {VIDEOS.map((v, i) => (
              <VideoEmbed key={v.id} id={v.id} title={v.title} index={i} total={VIDEOS.length} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Uploaded photo gallery (admin-managed) ───────────────────── */}
      {uploadedVA.length > 0 && (
        <section className="relative" style={{ padding: '0 32px 120px' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <p className="reveal-line" style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: '#c8a46e', marginBottom: 24,
            }}>
              Photo Gallery
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 20,
            }}>
              {uploadedVA.map(photo => (
                <div key={photo.id} style={{
                  borderRadius: 14, overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: '#231f1c',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  aspectRatio: '4/3',
                }}>
                  <img
                    src={photo.url}
                    alt={photo.filename}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default VancouverAquarium;
