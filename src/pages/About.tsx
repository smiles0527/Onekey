import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TIMELINE_EVENTS = [
  {
    year: '2020',
    title: 'OneKey is founded',
    description: 'Jack Wang founds OneKey as a student-led initiative to share music with senior communities.',
  },
  {
    year: '2021',
    title: 'Homework help launches',
    description: 'We expand beyond music — offering tutoring to younger students alongside our performance work.',
  },
  {
    year: '2022',
    title: 'Performances expand',
    description: 'Younger musicians begin joining our trips to senior homes, broadening our reach across generations.',
  },
  {
    year: '2022',
    title: 'Partnership with Vanstring',
    description: 'OneKey teams up with the Vanstring student string ensemble — broadening our community impact.',
  },
];

const About: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = gsap.context(() => {
      // Initial hidden states (before paint)
      gsap.set('.about-tl-eyebrow', { clipPath: 'inset(0 100% 0 0)', opacity: 0 });
      gsap.set('.about-tl-heading', { y: 30, opacity: 0, clipPath: 'inset(0 0 100% 0)' });
      gsap.set('.about-tl-spine',   { scaleX: 0, transformOrigin: 'left center' });
      gsap.set('.about-tl-event',   { y: 32, opacity: 0 });
      gsap.set('.about-tl-dot',     { scale: 0 });

      // Heading + intro reveal
      const introTl = gsap.timeline({
        scrollTrigger: { trigger: '.about-tl-section', start: 'top 78%', once: true },
        defaults: { ease: 'power3.out' },
      });
      introTl
        .to('.about-tl-eyebrow', { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 0.65 })
        .to('.about-tl-heading', { y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.8 }, '-=0.35');

      // Spine draws + events stagger
      gsap.to('.about-tl-spine', {
        scaleX: 1, duration: 1.4, ease: 'power2.out',
        scrollTrigger: { trigger: '.about-tl-list', start: 'top 75%', once: true },
      });
      gsap.to('.about-tl-dot', {
        scale: 1, duration: 0.45, stagger: 0.18, ease: 'back.out(2)',
        scrollTrigger: { trigger: '.about-tl-list', start: 'top 75%', once: true },
        delay: 0.2,
      });
      gsap.to('.about-tl-event', {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.18, ease: 'power3.out',
        scrollTrigger: { trigger: '.about-tl-list', start: 'top 75%', once: true },
        delay: 0.2,
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="min-h-screen bg-stone-900 text-white">
      <section className="container mx-auto px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
          <div className="max-w-2xl">
            <span className="mb-5 block h-px w-16 bg-earth-400" aria-hidden="true" />
            <h1 className="font-display text-4xl font-semibold leading-tight text-white md:text-6xl">
              About Onekey
            </h1>
            <p className="mt-8 text-lg font-light leading-8 text-stone-300 md:text-xl md:leading-9">
              OneKey was founded on the belief that music has the power to heal,
              connect, and inspire. Our student volunteers dedicate their time and
              talent to bring joy to senior communities, fostering intergenerational
              bonds that enrich lives on both sides.
            </p>
          </div>

          <div className="relative">
            <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl border border-earth-300/20 bg-stone-800/60 p-3 shadow-2xl shadow-black/20 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:border-earth-300/60 hover:shadow-earth-900/30 sm:aspect-[4/5] lg:aspect-[3/4]">
              <div className="h-full overflow-hidden rounded-xl border border-white/10 bg-stone-900/45">
                <img
                  src={`${process.env.PUBLIC_URL}/pics/onekey_cavell.jpg`}
                  alt="OneKey student musicians visiting Cavell Gardens to perform for seniors"
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Timeline ───────────────────────────────────────────────── */}
        <div className="about-tl-section mx-auto mt-20 max-w-3xl lg:mt-24">
          <p className="about-tl-eyebrow inline-block text-xs font-bold uppercase tracking-[0.18em] text-earth-300">
            Our Story
          </p>
          <h2 className="about-tl-heading mt-4 font-display text-3xl font-semibold text-white md:text-5xl">
            How OneKey began
          </h2>

          <div className="about-tl-list relative mt-14">
            {/* Horizontal spine (extends across all dots) */}
            <span
              aria-hidden="true"
              className="about-tl-spine absolute top-[9px] left-[8px] right-[8px] h-px md:top-[11px] md:left-[10px] md:right-[10px]"
              style={{ background: 'linear-gradient(to right, rgba(200,164,110,0.55), rgba(200,164,110,0.15))' }}
            />

            <ol className="relative grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-x-8">
              {TIMELINE_EVENTS.map((e, i) => (
                <li
                  key={`${e.year}-${i}`}
                  className="about-tl-event relative"
                >
                  {/* Dot sits on the spine */}
                  <span
                    aria-hidden="true"
                    className="about-tl-dot block h-4 w-4 rounded-full border-2 border-earth-400 bg-stone-900 md:h-5 md:w-5"
                  />
                  <div className="mt-4 font-display text-sm font-bold tracking-wider text-earth-300 md:text-base">
                    {e.year}
                  </div>
                  <h3 className="mt-1 font-display text-base font-semibold text-white md:text-lg">
                    {e.title}
                  </h3>
                  <p className="mt-2 text-sm font-light leading-6 text-stone-300/85">
                    {e.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* ── Team / History cards ───────────────────────────────────── */}
        <div className="mx-auto mt-20 grid max-w-6xl gap-8 md:grid-cols-2 lg:mt-24">
          <Link
            to="/team"
            className="cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-stone-800/45 shadow-xl shadow-black/10 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:border-earth-300/35 hover:bg-stone-800/70 hover:shadow-2xl hover:shadow-black/25"
          >
            <div className="aspect-[16/9] border-b border-earth-300/20 bg-stone-900/55 p-3 transition-all duration-300 ease-out hover:border-earth-300/45 hover:bg-stone-900/75">
              <div className="h-full overflow-hidden rounded-xl border border-white/10 bg-stone-900/45">
                <img
                  src={`${process.env.PUBLIC_URL}/pics/onekey_cellos.jpg`}
                  alt="OneKey student musicians gathered with their cello cases"
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>
            <div className="p-8 md:p-10">
              <h2 className="font-display text-2xl font-semibold text-white">
                Our Team
              </h2>
              <p className="mt-4 text-base font-light leading-7 text-stone-300">
                Meet the students who support our mission and help us reach new heights.
              </p>
            </div>
          </Link>

          <Link
            to="/timeline"
            className="cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-stone-800/45 shadow-xl shadow-black/10 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:border-earth-300/35 hover:bg-stone-800/70 hover:shadow-2xl hover:shadow-black/25"
          >
            <div className="aspect-[16/9] border-b border-earth-300/20 bg-stone-900/55 p-3 transition-all duration-300 ease-out hover:border-earth-300/45 hover:bg-stone-900/75">
              <div className="h-full overflow-hidden rounded-xl border border-white/10 bg-stone-900/45">
                <img
                  src={`${process.env.PUBLIC_URL}/pics/onekey_history.jpg`}
                  alt="OneKey musicians performing in a senior community space"
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>
            <div className="p-8 md:p-10">
              <h2 className="font-display text-2xl font-semibold text-white">
                Our History
              </h2>
              <p className="mt-4 text-base font-light leading-7 text-stone-300">
                Each part of our history is a testament to our dedication to spread the joy of music. Learn more here.
              </p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
