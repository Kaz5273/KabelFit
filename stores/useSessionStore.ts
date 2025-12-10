import type { Session } from '@/database/types';
import { create } from 'zustand';

/**
 * Interface pour le state du store des séances
 */
interface SessionState {
  // State
  sessions: Session[];
  currentSession: Session | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    programId?: number;
    dayOfWeek?: string;
    searchQuery?: string;
  };

  // Actions
  setSessions: (sessions: Session[]) => void;
  addSession: (session: Session) => void;
  updateSession: (sessionId: number, updates: Partial<Session>) => void;
  removeSession: (sessionId: number) => void;
  
  setCurrentSession: (session: Session | null) => void;
  
  setFilters: (filters: Partial<SessionState['filters']>) => void;
  clearFilters: () => void;
  
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

/**
 * Store Zustand pour la gestion des séances
 */
export const useSessionStore = create<SessionState>((set) => ({
  // Initial state
  sessions: [],
  currentSession: null,
  isLoading: false,
  error: null,
  filters: {},

  // Actions
  setSessions: (sessions) => set({ sessions, error: null }),
  
  addSession: (session) =>
    set((state) => ({
      sessions: [...state.sessions, session],
      error: null,
    })),
  
  updateSession: (sessionId, updates) =>
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId ? { ...session, ...updates } : session
      ),
      currentSession:
        state.currentSession?.id === sessionId
          ? { ...state.currentSession, ...updates }
          : state.currentSession,
      error: null,
    })),
  
  removeSession: (sessionId) =>
    set((state) => ({
      sessions: state.sessions.filter((session) => session.id !== sessionId),
      currentSession:
        state.currentSession?.id === sessionId ? null : state.currentSession,
      error: null,
    })),
  
  setCurrentSession: (session) => set({ currentSession: session }),
  
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  
  clearFilters: () => set({ filters: {} }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  reset: () =>
    set({
      sessions: [],
      currentSession: null,
      isLoading: false,
      error: null,
      filters: {},
    }),
}));
