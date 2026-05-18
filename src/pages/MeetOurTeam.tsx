import React, { useEffect } from 'react';
import { useTeamStore, TeamMember } from '../store/teamStore';
import TeamMemberCard from '../components/TeamMemberCard';
import TeamCarousel from '../components/TeamCarousel';

interface TeamSectionProps {
  title: string;
  description?: string;
  members: TeamMember[];
  compact?: boolean;
  grid?: boolean;
}

const TeamSection: React.FC<TeamSectionProps> = ({ title, description, members, compact, grid }) => (
  <section className="team-section">
    <div className="container">
      <header className="team-section__intro">
        <h2 className="team-section__heading">{title}</h2>
        {description && <p className="team-section__desc">{description}</p>}
      </header>

      {grid ? (
        <div className={compact ? 'team-grid team-grid--compact' : 'team-grid'}>
          {members.map((m) => (
            <TeamMemberCard key={m.id} member={m} compact={compact} />
          ))}
        </div>
      ) : (
        <TeamCarousel members={members} compact={compact} />
      )}
    </div>
  </section>
);

interface SplitSectionProps {
  title: string;
  description: string;
  onekeyMembers: TeamMember[];
  vanstringMembers: TeamMember[];
}

const SplitSection: React.FC<SplitSectionProps> = ({ title, description, onekeyMembers, vanstringMembers }) => (
  <section className="team-section">
    <div className="container">
      <header className="team-section__intro">
        <h2 className="team-section__heading">{title}</h2>
        <p className="team-section__desc">{description}</p>
      </header>
      <div className="leadership-split">
        <div className="leadership-split__left" style={{ flex: Math.max(onekeyMembers.length, 1) }}>
          <span className="leadership-split__label">OneKey</span>
          <TeamCarousel members={onekeyMembers} />
        </div>
        <div className="leadership-split__divider" />
        <div className="leadership-split__right" style={{ flex: Math.max(vanstringMembers.length, 1) }}>
          <span className="leadership-split__label">Vanstring</span>
          <TeamCarousel members={vanstringMembers} />
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
        description="Founders driving OneKey's vision"
        onekeyMembers={getTeamMembersBySectionAndGroup('leadership', 'onekey')}
        vanstringMembers={getTeamMembersBySectionAndGroup('leadership', 'vanstring')}
      />

      <SplitSection
        title="Communications"
        description="Managing outreach and community connections"
        onekeyMembers={getTeamMembersBySectionAndGroup('communications', 'onekey')}
        vanstringMembers={getTeamMembersBySectionAndGroup('communications', 'vanstring')}
      />

      <TeamSection
        title="Homework Help Coordinators"
        description="Supporting students through tutoring and academic assistance"
        members={getTeamMembersBySection('coordinators')}
      />

      <TeamSection
        title="Alumni"
        description="Founding members who continue to inspire our mission"
        members={getTeamMembersBySection('alumni')}
        compact
        grid
      />
    </div>
  );
};

export default MeetOurTeam;
