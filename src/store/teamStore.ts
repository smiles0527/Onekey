import { create } from 'zustand';
import { apiService } from '../services/firebaseService';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  school: string;
  bio: string;
  instagram: string;
  image: string;
  section: 'leadership' | 'communications' | 'coordinators' | 'alumni';
  group?: 'onekey' | 'vanstring';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Seed data — written to Firestore once if the collection is empty
const SEED_MEMBERS: Omit<TeamMember, 'id'>[] = [
  {
    name: 'Alex Zhang',
    role: 'Vanstrings / Onekey Manager',
    school: 'Fraser Heights Secondary',
    bio: 'Currently a senior at Fraser Heights Secondary School, Alex Zhang is honored to serve as the General Manager of Vanstring and as the Principal Second Violinist. Outside of music, Alex enjoys playing volleyball and basketball, spending time in nature, and reading a wide range of literature. With a strong interest in the sciences, Alex aspires to study biomedicine with the goal of pursuing a career in medicine.',
    instagram: 'https://www.instagram.com/alexzhang_05/',
    image: '/pics/alexzhang.jpg',
    section: 'leadership',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    name: 'Curtis Wei',
    role: 'Vanstrings / Onekey Manager',
    school: 'Collingwood School',
    bio: "I'm Curtis, a grade 10 student at Collingwood Secondary School. I'm grateful to be serving as one of the founders of Onekey as well as the General Manager of Vanstring. I have a passion for sciences and I waste much of my time preparing for the international science olympiads. In my spare time, I play the piano and conduct research on group theory as well as doing my little engineering projects.",
    instagram: 'https://www.instagram.com/icyz_wx/',
    image: '/pics/curtiswei.jpg',
    section: 'leadership',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    name: 'Jessica Yu',
    role: 'Communications Team',
    school: 'R.C. Palmer Secondary School',
    bio: "Hi, I'm Jessica! I'm super passionate about music and spreading joy through music. As part of the communications team, I help young musicians gain more experience through performances in senior homes. In my spare time, I love to crochet and listen to music!",
    instagram: 'https://www.instagram.com/j.1ca0/',
    image: '/pics/jessicayu.jpg',
    section: 'communications',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    name: 'Gabrielle Liu',
    role: 'Communications Team',
    school: 'Lord Byng Secondary School',
    bio: 'Gabrielle is a grade 11 student at Lord Byng Secondary School, where she is part of the Byng Arts mini school program for music. Her musical journey began when she was five, and since then, she has competed in, and won numerous music competitions. In addition to performing, Gabrielle shares her passion by teaching violin and piano to students of all ages. She has a strong passion for the arts, especially singing and painting. Alongside her artistic interests, Gabrielle is passionate about science and aspires to pursue a career in dermatology.',
    instagram: 'https://www.instagram.com/gabriel_w.le/',
    image: '/pics/gabbyliu.jpg',
    section: 'communications',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    name: 'Ethan Xie',
    role: 'Technology Coordinator',
    school: 'West Point Grey Academy',
    bio: "Hi there! I'm a student entering grade 10, and I'm passionate about music, technology, and engineering. I enjoy creating projects such as building drones. At OneKey, I've volunteered through music, and this year, I've been one of the main developers of this site. I look forward to working with OneKey in the future!",
    instagram: 'https://www.instagram.com/ethanx421/',
    image: '/pics/ethanxie.jpg',
    section: 'coordinators',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    name: 'Shane Zhang',
    role: 'Homework Help Coordinator',
    school: 'St Georges School',
    bio: 'Shane is a student entering Grade 10 who is passionate about science, outdoor activities, and history. He also has ample volunteering and tutoring experience. For two years, he has tutored Math and English to younger students both with and outside of Onekey. This year, he took on the role of helping coordinate homework help at Onekey. He has also volunteered with ski school at Grouse Mountain, helping classes of various age groups and abilities. He hopes to further develop his leadership abilities by continuing to participate in the Onekey team.',
    instagram: 'https://www.instagram.com/shanezhang021/',
    image: '/pics/shanezhang.jpg',
    section: 'coordinators',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    name: 'Selena Yu',
    role: 'Homework Help Coordinator',
    school: 'Crofton House School',
    bio: "Selena is a Grade 9 student at Crofton House school. She is a part of the executive of Vankey Onekey and serves as the concertmaster of Vanstring, as well as playing as a first violinist of her school's orchestra. Selena loves playing badminton and skiing in the winter.",
    instagram: 'https://www.instagram.com/selena.yxy/',
    image: '/pics/selenayu.jpg',
    section: 'coordinators',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    name: 'Eliza Sun',
    role: 'Alumni',
    school: 'Haverford University',
    bio: "Eliza is one of the co-founders and co-managers at Onekey. She is currently attending university in Philadelphia at Haverford University. One fun fact about her is that she has an extensive collection of stuffed animals, most of which are… jellycat pigs. When she's not performing at senior homes, Eliza enjoys spending her free time participating in robotics and making pottery.",
    instagram: 'https://www.instagram.com/elizasun530/',
    image: '/pics/elizasun.jpg',
    section: 'alumni',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    name: 'Grace Xu',
    role: 'Alumni',
    school: 'University Name',
    bio: 'Grace is a passionate musician and one of the co-founders of OneKey. With an ARCT-level piano background and a love for community, Grace helped create OneKey to connect music students and let others see the joy of sharing music and knowledge. She finds fulfillment in sharing joy through student-led concerts and tutoring to create a meaningful impact. Grace is dedicated to fostering supportive, inspiring spaces where young musicians can grow and support one another.',
    instagram: 'https://www.instagram.com/joyleaf7/',
    image: '/pics/grace.jpg',
    section: 'alumni',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    name: 'Jack Wang',
    role: 'Alumni',
    school: 'Pomona College',
    bio: "Jack is an undergraduate student at Pomona College studying International Relations. He's greatly enjoyed working with the Onekey team and sharing his love for music with seniors and young performers.",
    instagram: 'https://www.instagram.com/jiawei_wang_06/',
    image: '/pics/jiaweiwang.jpg',
    section: 'alumni',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    name: 'Johnny Yang',
    role: 'Vanstring General Manager',
    school: 'Fraser Heights Secondary School',
    bio: "Johnny is a grade 9 student at Fraser Heights Secondary School. He is extremely passionate about music and technology, and enjoys challenging himself through math and science competitions. Johnny wishes to gain leadership experience as a general manager of Vanstring and to help fellow students share their passion for music by coordinating weekly performances with senior homes. Using these skills, his goal is to pursue a career in engineering, where he will be able to bring his ideas into reality. Johnny also enjoys reading in his free time.",
    instagram: '',
    image: '',
    section: 'leadership',
    group: 'vanstring',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

interface TeamState {
  teamMembers: TeamMember[];
  isLoading: boolean;
  error: string | null;
  fetchTeamMembers: () => Promise<void>;
  addTeamMember: (data: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>) => Promise<TeamMember | null>;
  updateTeamMember: (id: string, updates: Partial<Omit<TeamMember, 'id' | 'createdAt'>>) => Promise<boolean>;
  removeTeamMember: (id: string) => Promise<boolean>;
  getTeamMembersBySection: (section: TeamMember['section']) => TeamMember[];
  getTeamMembersBySectionAndGroup: (section: TeamMember['section'], group: 'onekey' | 'vanstring') => TeamMember[];
}

export const useTeamStore = create<TeamState>()((set, get) => ({
  teamMembers: [],
  isLoading: false,
  error: null,

  fetchTeamMembers: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiService.getTeamMembers();
      if (!res.success || !res.data) {
        set({ isLoading: false, error: res.error ?? 'Failed to fetch team' });
        return;
      }

      let members = res.data.members as TeamMember[];

      // Seed Firestore on first run, or top-up any missing seed members by name
      const existingNames = new Set(members.map(m => m.name));
      const missing = SEED_MEMBERS.filter(m => !existingNames.has(m.name));
      if (missing.length > 0) {
        await Promise.all(missing.map(m => apiService.createTeamMember(m)));
        const refreshed = await apiService.getTeamMembers();
        members = (refreshed.data?.members ?? []) as TeamMember[];
      }

      set({ teamMembers: members.filter(m => m.isActive !== false), isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },

  addTeamMember: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiService.createTeamMember({ ...data, isActive: true });
      if (!res.success || !res.data) {
        set({ isLoading: false, error: res.error ?? 'Failed to add member' });
        return null;
      }
      await get().fetchTeamMembers();
      return get().teamMembers.find(m => m.id === res.data!.id) ?? null;
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      return null;
    }
  },

  updateTeamMember: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiService.updateTeamMember(id, updates);
      if (!res.success) {
        set({ isLoading: false, error: res.error ?? 'Failed to update member' });
        return false;
      }
      await get().fetchTeamMembers();
      return true;
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      return false;
    }
  },

  removeTeamMember: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiService.deleteTeamMember(id);
      if (!res.success) {
        set({ isLoading: false, error: res.error ?? 'Failed to delete member' });
        return false;
      }
      await get().fetchTeamMembers();
      return true;
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      return false;
    }
  },

  getTeamMembersBySection: (section) =>
    get().teamMembers.filter(m => m.section === section && m.isActive !== false),

  getTeamMembersBySectionAndGroup: (section, group) =>
    get().teamMembers.filter(m =>
      m.section === section &&
      m.isActive !== false &&
      (group === 'onekey' ? (m.group === 'onekey' || !m.group) : m.group === group)
    ),
}));
