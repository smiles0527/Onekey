import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TimelineEvent {
  id: string;
  name: string;
  date: string;
  category: 'performances' | 'homework' | 'charity';
  location?: string;
  time?: string;
  attendees?: string;
  performers?: string;
  duration?: string;
  description?: string;
  photo?: string | null;
  photos?: string[];
  createdAt: string;
  createdBy: string;
}

interface TimelineState {
  events: TimelineEvent[];
  addEvent: (eventData: Omit<TimelineEvent, 'id' | 'createdAt'>) => TimelineEvent;
  removeEvent: (eventId: string) => void;
  updateEvent: (eventId: string, updates: Partial<TimelineEvent>) => void;
  getEventsByCategory: (category: TimelineEvent['category']) => TimelineEvent[];
  getEventById: (eventId: string) => TimelineEvent | undefined;
}

export const useTimelineStore = create<TimelineState>()(
  persist(
    (set, get) => ({
      events: [],

      addEvent: (eventData) => {
        const newEvent: TimelineEvent = {
          ...eventData,
          id: `event-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        
        console.log('Adding new event:', newEvent);
        
        set(state => {
          const updatedEvents = [...state.events, newEvent].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          console.log('Updated events array:', updatedEvents);
          console.log('Saving to localStorage...');
          return { events: updatedEvents };
        });
        
        // Force localStorage update
        setTimeout(() => {
          const currentState = get();
          console.log('Current state after add:', currentState);
          console.log('localStorage after add:', localStorage.getItem('onekey-timeline'));
        }, 100);
        
        return newEvent;
      },

      removeEvent: (eventId) => {
        console.log('Removing event:', eventId);
        set(state => ({
          events: state.events.filter(event => event.id !== eventId)
        }));
      },

      updateEvent: (eventId, updates) => {
        console.log('Updating event:', eventId, updates);
        set(state => ({
          events: state.events.map(event => 
            event.id === eventId ? { ...event, ...updates } : event
          )
        }));
      },

      getEventsByCategory: (category) => {
        const { events } = get();
        return events
          .filter(event => event.category === category)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },

      getEventById: (eventId) => {
        const { events } = get();
        return events.find(event => event.id === eventId);
      },
    }),
    {
      name: 'onekey-timeline',
      partialize: (state) => ({
        events: state.events,
      }),
      onRehydrateStorage: () => (state) => {
        console.log('Timeline store rehydrated from localStorage:', state);
        if (state) {
          console.log('Rehydrated events count:', state.events?.length || 0);
        }
      },
      version: 1,
      storage: {
        getItem: (name) => {
          try {
            const value = localStorage.getItem(name);
            console.log(`Getting ${name} from localStorage:`, value ? 'EXISTS' : 'NOT FOUND');
            return value ? JSON.parse(value) : null;
          } catch (error) {
            console.error('Error getting from localStorage:', error);
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            console.log(`Setting ${name} in localStorage:`, value);
            localStorage.setItem(name, JSON.stringify(value));
          } catch (error) {
            console.error('Error setting localStorage:', error);
          }
        },
        removeItem: (name) => {
          try {
            console.log(`Removing ${name} from localStorage`);
            localStorage.removeItem(name);
          } catch (error) {
            console.error('Error removing from localStorage:', error);
          }
        },
      },
    }
  )
); 