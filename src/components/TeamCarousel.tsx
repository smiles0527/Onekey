import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TeamMember } from '../store/teamStore';
import TeamMemberCard from './TeamMemberCard';

interface Props {
  members: TeamMember[];
  compact?: boolean;
}

const TeamCarousel: React.FC<Props> = ({ members, compact }) => {
  const trackRef  = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const showArrows = members.length > 4;

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener('scroll', updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', updateArrows); ro.disconnect(); };
  }, [updateArrows]);

  const scroll = (dir: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -el.clientWidth : el.clientWidth, behavior: 'smooth' });
  };

  return (
    <div className="tc">
      {showArrows && (
        <motion.button
          className="tc__arrow tc__arrow--prev"
          onClick={() => scroll('left')}
          disabled={!canPrev}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} strokeWidth={2} />
        </motion.button>
      )}

      <div ref={trackRef} className="tc__track">
        {members.map((m) => (
          <div key={m.id} className="tc__item">
            <TeamMemberCard member={m} compact={compact} />
          </div>
        ))}
      </div>

      {showArrows && (
        <motion.button
          className="tc__arrow tc__arrow--next"
          onClick={() => scroll('right')}
          disabled={!canNext}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          aria-label="Scroll right"
        >
          <ChevronRight size={20} strokeWidth={2} />
        </motion.button>
      )}
    </div>
  );
};

export default TeamCarousel;
