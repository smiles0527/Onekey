import React, { useEffect } from 'react';
import { useTeamStore, TeamMember, SectionKey } from '../store/teamStore';
import TeamMemberCard from '../components/TeamMemberCard';
import TeamCarousel from '../components/TeamCarousel';

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
  const { getTeamMembersBySection, getTeamMembersBySectionAndGroup, fetchTeamMembers } = useTeamStore();
  useEffect(() => { fetchTeamMembers(); }, [fetchTeamMembers]);

  return (
    <div className="team-page">
      <header className="team-hero container">
        <h1 className="team-hero__title">Meet the Team</h1>
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
        hideBio
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
