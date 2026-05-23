import { create } from 'zustand';
import { apiService, VanstringSection } from '../services/firebaseService';

// Seed data — used to initialize Firestore on first load if the document is empty
export const VANSTRING_SECTIONS_SEED: VanstringSection[] = [
  {
    section: 'Violin 1',
    members: ['Curtis', 'Gabby', 'Rachel', 'Charles', 'Aliya', 'Eric', 'Anne', 'Emma', 'Ethan', 'Annie', 'Portia', 'Andy', 'Charlotte'],
  },
  {
    section: 'Violin 2',
    members: ['Alex', 'Victoria', 'Lina', 'Claudia', 'Maggie', 'Ella', 'Didi', 'Dora', 'Jason', 'Maggie', 'Shirley'],
  },
  {
    section: 'Violin 3',
    members: ['Jessica', 'Veronica', 'Lucas', 'Aiden', 'Ethan', 'Ole', 'Matthew', 'Jeffery', 'Cloe', 'Zachary', 'Ariana', 'Annie', 'Stephen', 'Joy'],
  },
  {
    section: 'Cello',
    members: ['Dinno', 'Melanie', 'Johnny', 'Sophie', 'Ellen', 'Annabelle', 'Ryan', 'Allen', 'Stacy'],
  },
];

interface VanstringState {
  sections: VanstringSection[];
  isLoading: boolean;
  error: string | null;
  fetchSections: () => Promise<void>;
  saveSections: (sections: VanstringSection[]) => Promise<boolean>;
}

export const useVanstringStore = create<VanstringState>()((set) => ({
  sections: VANSTRING_SECTIONS_SEED, // optimistic: render seed immediately, replace once Firestore loads
  isLoading: false,
  error: null,

  fetchSections: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiService.getVanstringSections();
      if (!res.success || !res.data) {
        set({ isLoading: false, error: res.error ?? 'Failed to load sections' });
        return;
      }

      // First-run seed: if Firestore is empty, push the seed data and use it
      if (res.data.groups.length === 0) {
        await apiService.updateVanstringSections(VANSTRING_SECTIONS_SEED);
        set({ sections: VANSTRING_SECTIONS_SEED, isLoading: false });
        return;
      }

      set({ sections: res.data.groups, isLoading: false });
    } catch (err: unknown) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'An error occurred' });
    }
  },

  saveSections: async (sections) => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiService.updateVanstringSections(sections);
      if (!res.success) {
        set({ isLoading: false, error: res.error ?? 'Failed to save sections' });
        return false;
      }
      set({ sections, isLoading: false });
      return true;
    } catch (err: unknown) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'An error occurred' });
      return false;
    }
  },
}));

// Reference to current state without subscribing
export const getVanstringSections = () => useVanstringStore.getState().sections;
