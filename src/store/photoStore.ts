import { create } from 'zustand';
import { apiService, PhotoRecord, PhotoCategory } from '../services/firebaseService';

interface PhotoState {
  photos: PhotoRecord[];
  isLoading: boolean;
  error: string | null;
  hasLoaded: boolean;

  fetchPhotos: () => Promise<void>;
  uploadPhoto: (file: File, category: PhotoCategory) => Promise<PhotoRecord | null>;
  deletePhoto: (photo: PhotoRecord) => Promise<boolean>;
  recategorizePhoto: (id: string, category: PhotoCategory) => Promise<boolean>;

  photosFor: (category: PhotoCategory) => PhotoRecord[];
}

export const usePhotoStore = create<PhotoState>()((set, get) => ({
  photos: [],
  isLoading: false,
  error: null,
  hasLoaded: false,

  fetchPhotos: async () => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });
    const res = await apiService.listPhotos();
    if (!res.success || !res.data) {
      set({ isLoading: false, error: res.error ?? 'Failed to load photos', hasLoaded: true });
      return;
    }
    set({ photos: res.data.photos, isLoading: false, hasLoaded: true });
  },

  uploadPhoto: async (file, category) => {
    const res = await apiService.uploadPhoto(file, category);
    if (!res.success || !res.data) {
      set({ error: res.error ?? 'Upload failed' });
      return null;
    }
    const created = res.data;
    set(state => ({ photos: [created, ...state.photos], error: null }));
    return created;
  },

  deletePhoto: async (photo) => {
    const res = await apiService.deletePhoto(photo);
    if (!res.success) {
      set({ error: res.error ?? 'Delete failed' });
      return false;
    }
    set(state => ({ photos: state.photos.filter(p => p.id !== photo.id), error: null }));
    return true;
  },

  recategorizePhoto: async (id, category) => {
    const res = await apiService.updatePhotoCategory(id, category);
    if (!res.success) {
      set({ error: res.error ?? 'Update failed' });
      return false;
    }
    set(state => ({
      photos: state.photos.map(p => p.id === id ? { ...p, category } : p),
      error: null,
    }));
    return true;
  },

  photosFor: (category) => get().photos.filter(p => p.category === category),
}));
