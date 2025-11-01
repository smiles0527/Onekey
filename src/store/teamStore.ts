import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  school: string;
  bio: string;
  instagram: string;
  image: string;
  section: 'leadership' | 'communications' | 'coordinators' | 'alumni';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TeamState {
  teamMembers: TeamMember[];
  addTeamMember: (member: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>) => TeamMember;
  updateTeamMember: (id: string, updates: Partial<Omit<TeamMember, 'id' | 'createdAt'>>) => void;
  removeTeamMember: (id: string) => void;
  toggleTeamMemberStatus: (id: string) => void;
  getTeamMembersBySection: (section: TeamMember['section']) => TeamMember[];
}

export const useTeamStore = create<TeamState>()(
  persist(
    (set, get) => ({
      teamMembers: [
        {
          id: '1',
          name: 'Alex Zhang',
          role: 'Vanstrings / Onekey Manager',
          school: 'Fraser Heights Secondary',
          bio: 'Currently a senior at Fraser Heights Secondary School, Alex Zhang is honored to serve as the General Manager of Vanstring and as the Principal Second Violinist. Outside of music, Alex enjoys playing volleyball and basketball, spending time in nature, and reading a wide range of literature. With a strong interest in the sciences, Alex aspires to study biomedicine with the goal of pursuing a career in medicine.',
          instagram: 'https://www.instagram.com/alexzhang_05/',
          image: '/pics/alexzhang.jpg',
          section: 'leadership',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'Curtis Wei',
          role: 'Vanstrings / Onekey Manager',
          school: 'Collingwood School',
          bio: 'I\'m Curtis, a grade 10 student at Collingwood Secondary School. I\'m grateful to be serving as one of the founders of Onekey as well as the General Manager of Vanstring. I have a passion for sciences and I waste much of my time preparing for the international science olympiads. In my spare time, I play the piano and conduct research on group theory as well as doing my little engineering projects.',
          instagram: 'https://www.instagram.com/icyz_wx/',
          image: '/pics/curtiswei.jpg',
          section: 'leadership',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '3',
          name: 'Jessica Yu',
          role: 'Communications Team',
          school: 'R.C. Palmer Secondary School',
          bio: 'Hi, I\'m Jessica! I\'m super passionate about music and spreading joy through music. As part of the communications team, I help young musicians gain more experience through performances in senior homes. In my spare time, I love to crochet and listen to music!',
          instagram: 'https://www.instagram.com/j.1ca0/',
          image: '/pics/jessicayu.jpg',
          section: 'communications',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '4',
          name: 'Gabrielle Liu',
          role: 'Communications Team',
          school: 'Lord Byng Secondary School',
          bio: 'Gabrielle is a grade 11 student at Lord Byng Secondary School, where she is part of the Byng Arts mini school program for music. Her musical journey began when she was five, and since then, she has competed in, and won numerous music competitions. In addition to performing, Gabrielle shares her passion by teaching violin and piano to students of all ages. She has a strong passion for the arts, especially singing and painting. Alongside her artistic interests, Gabrielle is passionate about science and aspires to pursue a career in dermatology.',
          instagram: 'https://www.instagram.com/gabriel_w.le/',
          image: '/pics/gabbyliu.jpg',
          section: 'communications',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '5',
          name: 'Ethan Xie',
          role: 'Technology Coordinator',
          school: 'West Point Grey Academy',
          bio: 'Hi there! I\'m a student entering grade 10, and I\'m passionate about music, technology, and engineering. I enjoy creating projects such as building drones. At OneKey, I\'ve volunteered through music, and this year, I\'ve been one of the main developers of this site. I look forward to working with OneKey in the future!',
          instagram: 'https://www.instagram.com/ethanx421/',
          image: '/pics/ethanxie.jpg',
          section: 'coordinators',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '6',
          name: 'Shane Zhang',
          role: 'Homework Help Coordinator',
          school: 'St Georges School',
          bio: 'Shane is a student entering Grade 10 who is passionate about science, outdoor activities, and history. He also has ample volunteering and tutoring experience. For two years, he has tutored Math and English to younger students both with and outside of Onekey. This year, he took on the role of helping coordinate homework help at Onekey. He has also volunteered with ski school at Grouse Mountain, helping classes of various age groups and abilities. He hopes to further develop his leadership abilities by continuing to participate in the Onekey team.',
          instagram: 'https://www.instagram.com/shanezhang021/',
          image: '/pics/shanezhang.jpg',
          section: 'coordinators',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '7',
          name: 'Selena Yu',
          role: 'Homework Help Coordinator',
          school: 'Crofton House School',
          bio: 'Selena is a Grade 9 student at Crofton House school. She is a part of the executive of Vankey Onekey and serves as the concertmaster of Vanstring, as well as playing as a first violinist of her school\'s orchestra. Selena loves playing badminton and skiing in the winter.',
          instagram: 'https://www.instagram.com/selena.yxy/',
          image: '/pics/selenayu.jpg',
          section: 'coordinators',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '8',
          name: 'Eliza Sun',
          role: 'Alumni',
          school: 'Haverford University',
          bio: 'Eliza is one of the co-founders and co-managers at Onekey. She is currently attending university in Philadelphia at Haverford University. One fun fact about her is that she has an extensive collection of stuffed animals, most of which are… jellycat pigs. When she\'s not performing at senior homes, Eliza enjoys spending her free time participating in robotics and making pottery.',
          instagram: 'https://www.instagram.com/elizasun530/',
          image: '/pics/elizasun.jpg',
          section: 'alumni',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '9',
          name: 'Grace Xu',
          role: 'Alumni',
          school: 'University Name',
          bio: 'Grace is a passionate musician and one of the co-founders of OneKey. With an ARCT-level piano background and a love for community, Grace helped create OneKey to connect music students and let others see the joy of sharing music and knowledge. She finds fulfillment in sharing joy through student-led concerts and tutoring to create a meaningful impact. Grace is dedicated to fostering supportive, inspiring spaces where young musicians can grow and support one another.',
          instagram: 'https://www.instagram.com/joyleaf7/',
          image: '/pics/grace.jpg',
          section: 'alumni',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '10',
          name: 'Jack Wang',
          role: 'Alumni',
          school: 'Pomona College',
          bio: 'Jack is an undergraduate student at Pomona College studying International Relations. He\'s greatly enjoyed working with the Onekey team and sharing his love for music with seniors and young performers.',
          instagram: 'https://www.instagram.com/jiawei_wang_06/',
          image: '/pics/jiaweiwang.jpg',
          section: 'alumni',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      ],

      addTeamMember: (member) => {
        const newMember: TeamMember = {
          ...member,
          id: Date.now().toString(),
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        set((state) => ({
          teamMembers: [...state.teamMembers, newMember]
        }));
        return newMember;
      },

      updateTeamMember: (id, updates) => {
        set((state) => ({
          teamMembers: state.teamMembers.map((member) =>
            member.id === id
              ? { ...member, ...updates, updatedAt: new Date().toISOString() }
              : member
          )
        }));
      },

      removeTeamMember: (id) => {
        set((state) => ({
          teamMembers: state.teamMembers.filter((member) => member.id !== id)
        }));
      },

      toggleTeamMemberStatus: (id) => {
        set((state) => ({
          teamMembers: state.teamMembers.map((member) =>
            member.id === id
              ? { ...member, isActive: !member.isActive, updatedAt: new Date().toISOString() }
              : member
          )
        }));
      },

      getTeamMembersBySection: (section) => {
        return get().teamMembers.filter((member) => member.section === section && member.isActive);
      }
    }),
    {
      name: 'team-storage'
    }
  )
); 