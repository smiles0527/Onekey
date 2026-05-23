import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BEHOLD_FEED_ID, INSTAGRAM_HANDLE, INSTAGRAM_URL, INSTAGRAM_SINCE } from '../config/instagram';
import { useVanstringStore } from '../store/vanstringStore';
import { usePhotoStore } from '../store/photoStore';

gsap.registerPlugin(ScrollTrigger);

const MEMBER_PHOTOS = [
  { src: 'vanstring_member_1.jpg', alt: 'Current Vanstring members performing for a senior community' },
  { src: 'vanstring_member_2.jpg', alt: 'Current Vanstring members playing chamber music' },
  { src: 'vanstring_member_3.jpg', alt: 'Current Vanstring members posing with instruments' },
];

const VanstringHome: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const SECTION_GROUPS = useVanstringStore(s => s.sections);
  const fetchSections  = useVanstringStore(s => s.fetchSections);
  const fetchPhotos    = usePhotoStore(s => s.fetchPhotos);
  const uploadedVS     = usePhotoStore(s => s.photos.filter(p => p.category === 'vanstring'));

  useEffect(() => { fetchSections(); fetchPhotos(); }, [fetchSections, fetchPhotos]);

  // Refresh ScrollTrigger when async data lands so trigger positions stay accurate
  useEffect(() => {
    if (SECTION_GROUPS.length === 0 && uploadedVS.length === 0) return;
    const t = setTimeout(() => ScrollTrigger.refresh(), 250);
    return () => clearTimeout(t);
  }, [SECTION_GROUPS.length, uploadedVS.length]);

  useLayoutEffect(() => {
    if (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = gsap.context(() => {

      /* ── Initial states (before paint to prevent flash) ──────────────── */
      gsap.set('.vs-hero-image',      { scale: 1.06 });
      gsap.set('.vs-hero-accent',     { scaleX: 0, transformOrigin: 'left center' });
      gsap.set('.vs-hero-title',      { y: 40, opacity: 0, clipPath: 'inset(0 0 100% 0)' });
      gsap.set('.vs-hero-desc',       { y: 24, opacity: 0 });
      gsap.set('.vs-card',            { y: 60, opacity: 0, scale: 0.92 });
      gsap.set('.vs-section-accent',  { scaleX: 0, transformOrigin: 'left center' });
      gsap.set('.vs-section-heading', { y: 40, opacity: 0, clipPath: 'inset(0 0 100% 0)' });
      gsap.set('.vs-member-photo',    { y: 60, opacity: 0, scale: 0.9 });
      gsap.set('.vs-group-card',      { y: 50, opacity: 0, scale: 0.95 });

      /* ── Hero entrance ───────────────────────────────────────────────── */
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      intro
        .to('.vs-hero-image', { scale: 1, duration: 1.4, ease: 'power2.out', delay: 0.1 })
        .to('.vs-hero-accent', { scaleX: 1, duration: 0.55 }, '-=1.1')
        .to('.vs-hero-title',
          { y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.8 },
          '-=0.35'
        )
        .to('.vs-hero-desc', { y: 0, opacity: 1, duration: 0.6 }, '-=0.45');

      /* ── Hero parallax on scroll ─────────────────────────────────────── */
      gsap.to('.vs-hero-image', {
        yPercent: -6,
        ease: 'none',
        scrollTrigger: { trigger: '.vs-hero', start: 'top top', end: 'bottom top', scrub: 0.8 },
      });

      /* ── Link cards fly in from sides ────────────────────────────────── */
      gsap.utils.toArray<HTMLElement>('.vs-card').forEach((card, i) => {
        const startX = i === 0 ? -100 : 100;
        const startR = i === 0 ? -3 : 3;
        gsap.set(card, { x: startX, y: 60, opacity: 0, scale: 0.92, rotation: startR });
        gsap.to(card, {
          x: 0, y: 0, opacity: 1, scale: 1, rotation: 0,
          duration: 0.95, ease: 'power4.out',
          scrollTrigger: { trigger: '.vs-cards', start: 'top 85%', once: true },
          delay: i * 0.12,
        });
      });

      /* ── Current Members accent + heading ────────────────────────────── */
      const memberTl = gsap.timeline({
        scrollTrigger: { trigger: '.vs-members-section', start: 'top 82%', once: true },
        defaults: { ease: 'power3.out' },
      });
      memberTl
        .to('.vs-section-accent',  { scaleX: 1, duration: 0.5 })
        .to('.vs-section-heading', { y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.7 }, '-=0.25');

      /* ── Member photos — staggered reveal ────────────────────────────── */
      gsap.to('.vs-member-photo', {
        y: 0, opacity: 1, scale: 1,
        duration: 0.75, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: '.vs-member-photos', start: 'top 82%', once: true },
      });

      /* ── Group cards — staggered reveal ──────────────────────────────── */
      gsap.to('.vs-group-card', {
        y: 0, opacity: 1, scale: 1,
        duration: 0.65, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: '.vs-group-cards', start: 'top 85%', once: true },
      });

    }, rootRef);

    return () => ctx.revert();
  }, []);

  // Load Behold widget script once, only when a feed ID is configured
  useEffect(() => {
    if (!BEHOLD_FEED_ID) return;
    if (document.querySelector('script[data-behold-widget]')) return;
    const script = document.createElement('script');
    script.src = 'https://w.behold.so/widget.js';
    script.type = 'module';
    script.setAttribute('data-behold-widget', 'true');
    document.body.appendChild(script);
  }, []);

  return (
    <div ref={rootRef} className="min-h-screen bg-stone-900 text-white">
      <section className="vs-hero relative overflow-hidden pt-[4.5rem]">
        <div className="relative h-[44vw] min-h-[420px] max-h-[calc(100vh-4.5rem)] overflow-hidden">
          <img
            src={`${process.env.PUBLIC_URL}/pics/vanstring.jpg`}
            alt="Vanstring orchestra performing on stage"
            className="vs-hero-image absolute inset-0 h-full w-full object-contain object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/82 to-stone-950/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-stone-950/70" />

          <div className="container relative z-10 mx-auto flex h-full items-center justify-start px-6 pb-10 pt-8 text-left md:pt-12">
            <div className="max-w-2xl">
              <span className="vs-hero-accent mb-5 block h-px w-16 bg-indigo-400" aria-hidden="true" />
              <h1 className="vs-hero-title font-display text-4xl font-semibold leading-tight text-white md:text-6xl">
                About Vanstring
              </h1>
              <p className="vs-hero-desc mt-8 text-lg font-light leading-8 text-stone-300 md:text-xl md:leading-9">
                Vanstring is OneKey&apos;s student-led string ensemble, created to
                bring live music into senior homes and community spaces. Through
                weekly chamber performances and collaborative rehearsals, students
                share their passion of classical music while building confidence,
                leadership, and connection.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container relative z-20 mx-auto -mt-16 px-6 pb-16 pt-0 md:-mt-20 md:pb-20">
        <div className="vs-cards mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          <Link
            to="/team"
            className="vs-card cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-stone-800/45 shadow-xl shadow-black/10 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:border-indigo-300/35 hover:bg-stone-800/70 hover:shadow-2xl hover:shadow-black/25"
          >
            <div className="aspect-[16/9] border-b border-indigo-300/20 bg-stone-900/55 p-3 transition-all duration-300 ease-out hover:border-indigo-300/45 hover:bg-stone-900/75">
              <div className="h-full overflow-hidden rounded-xl border border-white/10 bg-stone-900/45">
                <img
                  src={`${process.env.PUBLIC_URL}/pics/vanstring_team.jpg`}
                  alt="Vanstring students performing on cello"
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>
            <div className="p-8 md:p-10">
              <h2 className="font-display text-2xl font-semibold text-white">
                Our Team
              </h2>
              <p className="mt-4 text-base font-light leading-7 text-stone-300">
                Meet the students who allowed us to maintain our collective goal of sharing music and help keep Vanstring running.
              </p>
            </div>
          </Link>

          <Link
            to="/timeline"
            className="vs-card cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-stone-800/45 shadow-xl shadow-black/10 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:border-indigo-300/35 hover:bg-stone-800/70 hover:shadow-2xl hover:shadow-black/25"
          >
            <div className="aspect-[16/9] border-b border-indigo-300/20 bg-stone-900/55 p-3 transition-all duration-300 ease-out hover:border-indigo-300/45 hover:bg-stone-900/75">
              <div className="h-full overflow-hidden rounded-xl border border-white/10 bg-stone-900/45">
                <img
                  src={`${process.env.PUBLIC_URL}/pics/vanstring_history.jpg`}
                  alt="Vanstring orchestra performing in a concert hall"
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>
            <div className="p-8 md:p-10">
              <h2 className="font-display text-2xl font-semibold text-white">
                Our History
              </h2>
              <p className="mt-4 text-base font-light leading-7 text-stone-300">
                Founded in 2007, our 19 years of Vanstring history represents our unwavering dedication to the arts, and giving to others.
              </p>
            </div>
          </Link>
        </div>

        <div className="vs-members-section mx-auto mt-16 max-w-6xl md:mt-20">
          <span className="vs-section-accent mb-5 block h-px w-16 bg-indigo-400" aria-hidden="true" />
          <h2 className="vs-section-heading font-display text-3xl font-semibold text-white md:text-5xl">
            Current Members
          </h2>

          <div className="vs-member-photos mt-10 grid gap-5 md:grid-cols-3">
            {MEMBER_PHOTOS.map(memberPhoto => (
              <div
                key={memberPhoto.src}
                className="vs-member-photo aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-stone-800/45 p-3 shadow-xl shadow-black/10"
              >
                <div className="h-full overflow-hidden rounded-xl border border-white/10 bg-stone-900/45">
                  <img
                    src={`${process.env.PUBLIC_URL}/pics/${memberPhoto.src}`}
                    alt={memberPhoto.alt}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              </div>
            ))}
            {uploadedVS.map(photo => (
              <div
                key={photo.id}
                className="vs-member-photo aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-stone-800/45 p-3 shadow-xl shadow-black/10"
              >
                <div className="h-full overflow-hidden rounded-xl border border-white/10 bg-stone-900/45">
                  <img
                    src={photo.url}
                    alt={photo.filename}
                    loading="lazy"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="vs-group-cards mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {SECTION_GROUPS.map(group => (
              <div
                key={group.section}
                className="vs-group-card rounded-2xl border border-white/10 bg-stone-800/45 p-6 shadow-xl shadow-black/10"
              >
                <h3 className="font-display text-xl font-semibold text-white">
                  {group.section}
                </h3>
                <ul className="mt-4 space-y-2 text-sm font-light leading-6 text-stone-300">
                  {group.members.map((member, index) => (
                    <li key={`${group.section}-${member}-${index}`}>
                      {member}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Instagram feed ─────────────────────────────────────────────── */}
      <section className="container relative mx-auto px-6 pb-20 md:pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <span className="mb-5 block h-px w-16 bg-indigo-400" aria-hidden="true" />
              <h2 className="font-display text-3xl font-semibold text-white md:text-5xl">
                Follow Along
              </h2>
              <p className="mt-3 text-base font-light leading-7 text-stone-300/90 md:text-lg">
                See what we've been up to <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-indigo-300 hover:text-indigo-200 transition-colors">@{INSTAGRAM_HANDLE}</a> · sharing since {INSTAGRAM_SINCE}
              </p>
            </div>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-indigo-400/30 bg-indigo-500/10 text-indigo-200 text-sm font-medium hover:bg-indigo-500/20 hover:border-indigo-400/50 transition-all"
            >
              <Instagram size={16} />
              Open Instagram
            </a>
          </div>

          {BEHOLD_FEED_ID ? (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-stone-800/35 p-4 shadow-xl shadow-black/10">
              <behold-widget feed-id={BEHOLD_FEED_ID} />
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-indigo-400/25 bg-stone-800/30 p-10 text-center">
              <Instagram size={32} className="mx-auto mb-4 text-indigo-300/60" />
              <p className="text-base font-light text-stone-300/80">
                Instagram feed coming soon.
              </p>
              <p className="mt-2 text-xs text-stone-500">
                Configure <code className="px-1.5 py-0.5 rounded bg-stone-900/60 text-indigo-300">BEHOLD_FEED_ID</code> in <code className="px-1.5 py-0.5 rounded bg-stone-900/60 text-indigo-300">src/config/instagram.ts</code> to enable.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default VanstringHome;
