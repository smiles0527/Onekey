import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useTeamStore, TeamMember, SectionKey } from '../store/teamStore';
import TeamMemberCard from '../components/TeamMemberCard';
import TeamCarousel from '../components/TeamCarousel';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TeamSectionProps {
  title: string;
  description?: string;
  members: TeamMember[];
  compact?: boolean;
  hideBio?: boolean;
  grid?: boolean;
  currentSection?: SectionKey;
}

const TeamSection: React.FC<TeamSectionProps> = ({ title, description, members, compact, hideBio, grid, currentSection }) => (
  <section className="team-section">
    <div className="container">
      <header className="team-section__intro">
        <h2 className="team-section__heading">{title}</h2>
        {description && <p className="team-section__desc">{description}</p>}
      </header>

      {grid ? (
        <div className={compact ? 'team-grid team-grid--compact' : 'team-grid'}>
          {members.map((m) => (
            <TeamMemberCard key={m.id} member={m} compact={compact} hideBio={hideBio} currentSection={currentSection} />
          ))}
        </div>
      ) : (
        <TeamCarousel members={members} compact={compact} hideBio={hideBio} currentSection={currentSection} />
      )}
    </div>
  </section>
);

interface SplitSectionProps {
  title: string;
  description?: string;
  leftMembers: TeamMember[];
  rightMembers: TeamMember[];
  leftLabel?: string;
  rightLabel?: string;
  fitCards?: boolean;
  hideBio?: boolean;
  currentSection?: SectionKey;
  leftGroup?: 'onekey' | 'vanstring';
  rightGroup?: 'onekey' | 'vanstring';
}

const SplitSection: React.FC<SplitSectionProps> = ({
  title, description, leftMembers, rightMembers,
  leftLabel, rightLabel, fitCards, hideBio, currentSection,
  leftGroup, rightGroup,
}) => (
  <section className="team-section">
    <div className="container">
      <header className="team-section__intro">
        <h2 className="team-section__heading">{title}</h2>
        {description && <p className="team-section__desc">{description}</p>}
      </header>
      <div className={`leadership-split${fitCards ? ' leadership-split--fit' : ''}`}>
        <div className="leadership-split__left" style={{ flex: Math.max(leftMembers.length, 1) }}>
          {leftLabel && <span className="leadership-split__label">{leftLabel}</span>}
          <TeamCarousel members={leftMembers} hideBio={hideBio} currentSection={currentSection} currentGroup={leftGroup} />
        </div>
        <div className="leadership-split__divider" />
        <div className="leadership-split__right" style={{ flex: Math.max(rightMembers.length, 1) }}>
          {rightLabel && <span className="leadership-split__label">{rightLabel}</span>}
          <TeamCarousel members={rightMembers} hideBio={hideBio} currentSection={currentSection} currentGroup={rightGroup} />
        </div>
      </div>
    </div>
  </section>
);

const MeetOurTeam: React.FC = () => {
  const { teamMembers, getTeamMembersBySection, getTeamMembersBySectionAndGroup, fetchTeamMembers } = useTeamStore();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fetchTeamMembers(); }, [fetchTeamMembers]);

  // Hero animation + hide ALL animatable static elements on mount
  // useLayoutEffect runs synchronously BEFORE browser paint — prevents flash of unhidden content
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hide everything that will eventually animate — even elements that exist before data loads
      gsap.set('.team-hero__title',         { clipPath: 'inset(0 100% 0 0)', y: 30, opacity: 0 });
      gsap.set('.team-hero__line',          { scaleX: 0, transformOrigin: 'left center' });
      gsap.set('.team-section__heading',    { y: 40, opacity: 0, clipPath: 'inset(0 0 100% 0)' });
      gsap.set('.team-section__desc',       { y: 20, opacity: 0 });
      gsap.set('.leadership-split__label',  { y: -8, opacity: 0, scale: 0.8 });
      gsap.set('.leadership-split__divider',{ scaleY: 0, transformOrigin: 'center center' });

      // Animate hero in
      gsap.to('.team-hero__title',
        { clipPath: 'inset(0 0% 0 0)', y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.05 }
      );
      gsap.to('.team-hero__line',
        { scaleX: 1, duration: 0.7, ease: 'power3.out', delay: 0.35 }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  // Section scroll-triggered animations — re-bind whenever team data changes
  useLayoutEffect(() => {
    if (teamMembers.length === 0) return;

    const ctx = gsap.context(() => {
      // Initial states for data-dependent elements (cards, split labels, divider)
      // Also re-set heading/desc in case they were already revealed on a prior render
      gsap.set('.team-section__heading',    { y: 40, opacity: 0, clipPath: 'inset(0 0 100% 0)' });
      gsap.set('.team-section__desc',       { y: 20, opacity: 0 });
      gsap.set('.leadership-split__label',  { y: -8, opacity: 0, scale: 0.8 });
      gsap.set('.leadership-split__divider',{ scaleY: 0, transformOrigin: 'center center' });
      gsap.set('.team-card',                { y: 60, opacity: 0, scale: 0.9 });

      // Then bind scroll-triggered animations
      const sections = gsap.utils.toArray<HTMLElement>('.team-section');

      sections.forEach((section) => {
        const heading = section.querySelector('.team-section__heading');
        const desc    = section.querySelector('.team-section__desc');
        const labels  = section.querySelectorAll('.leadership-split__label');
        const divider = section.querySelector('.leadership-split__divider');
        const cards   = section.querySelectorAll('.team-card');

        const tl = gsap.timeline({
          scrollTrigger: { trigger: section, start: 'top 88%', once: true },
          defaults: { ease: 'power3.out' },
        });

        if (heading) {
          tl.to(heading, { y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.6 });
        }
        if (desc) {
          tl.to(desc, { y: 0, opacity: 1, duration: 0.45 }, '-=0.4');
        }
        if (labels.length > 0) {
          tl.to(labels,
            { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.08, ease: 'back.out(1.7)' },
            '-=0.3'
          );
        }
        if (divider) {
          tl.to(divider, { scaleY: 1, duration: 0.5, ease: 'power2.out' }, '-=0.4');
        }
        if (cards.length > 0) {
          tl.to(cards,
            { y: 0, opacity: 1, scale: 1, duration: 0.55, stagger: 0.05, ease: 'power3.out' },
            '-=0.35'
          );
        }
      });
    }, rootRef);

    // Layout settles after data + images load — refresh ScrollTrigger positions
    const t1 = setTimeout(() => ScrollTrigger.refresh(), 200);
    const t2 = setTimeout(() => ScrollTrigger.refresh(), 800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      ctx.revert();
    };
  }, [teamMembers]);

  return (
    <div ref={rootRef} className="team-page">
      <header className="team-hero container">
        <h1 className="team-hero__title">Meet the Team</h1>
        <div className="team-hero__line" style={{
          width: 72, height: 2, background: '#c8a46e',
          marginTop: 18, borderRadius: 1, transformOrigin: 'left center',
        }} />
      </header>

      <SplitSection
        title="Leadership"
        description="Leaders driving our vision"
        leftMembers={getTeamMembersBySectionAndGroup('leadership', 'onekey')}
        rightMembers={getTeamMembersBySectionAndGroup('leadership', 'vanstring')}
        leftLabel="OneKey"
        rightLabel="Vanstring"
        leftGroup="onekey"
        rightGroup="vanstring"
        currentSection="leadership"
        fitCards
      />

      <SplitSection
        title="Communications"
        description="Managing outreach and community connections"
        leftMembers={getTeamMembersBySectionAndGroup('communications', 'onekey')}
        rightMembers={getTeamMembersBySectionAndGroup('communications', 'vanstring')}
        leftLabel="OneKey"
        rightLabel="Vanstring"
        leftGroup="onekey"
        rightGroup="vanstring"
        currentSection="communications"
        fitCards
      />

      <TeamSection
        title="Homework Help Coordinators"
        description="Supporting students through tutoring and academic assistance"
        members={getTeamMembersBySection('coordinators')}
        currentSection="coordinators"
      />

      <TeamSection
        title="Financial Managers"
        description="Managing budgets and finances to keep our organization running"
        members={getTeamMembersBySection('finance')}
        currentSection="finance"
      />

      <TeamSection
        title="Concertmasters"
        description="Leading Vanstring's performances"
        members={getTeamMembersBySection('concertmasters').filter(m => m.concertmasterType === 'concertmaster' || m.concertmasterType === 'principal_second')}
        currentSection="concertmasters"
        hideBio
      />

      <TeamSection
        title="Tech & Design"
        description="Building the website, designing logos, and creating the tools that keep OneKey running"
        members={getTeamMembersBySection('techdesign')}
        currentSection="techdesign"
      />

      <TeamSection
        title="Alumni"
        description="Founding members who continue to inspire our mission"
        members={getTeamMembersBySection('alumni')}
        currentSection="alumni"
        compact
        grid
      />
    </div>
  );
};

export default MeetOurTeam;
