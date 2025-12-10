import { create } from 'zustand';

/**
 * Interface pour les préférences utilisateur
 */
export interface UserPreferences {
  theme: 'light' | 'dark';
  language: 'fr' | 'en';
  notifications: {
    workoutReminders: boolean;
    achievements: boolean;
  };
  units: {
    weight: 'kg' | 'lbs';
    distance: 'km' | 'mi';
  };
}

/**
 * Interface pour le profil utilisateur
 */
export interface UserProfile {
  id?: number;
  name: string;
  email?: string;
  age?: number;
  weight?: number;
  height?: number;
  fitnessGoal?: 'lose_weight' | 'gain_muscle' | 'maintain' | 'endurance' | 'strength';
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Interface pour le state du store utilisateur
 */
interface UserState {
  // State
  profile: UserProfile | null;
  preferences: UserPreferences;
  isLoading: boolean;
  error: string | null;
  isLoggedIn: boolean;

  // Actions
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  clearProfile: () => void;
  
  setPreferences: (preferences: Partial<UserPreferences>) => void;
  updatePreference: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => void;
  
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setLoggedIn: (value: boolean) => void;
  reset: () => void;
}

/**
 * Préférences par défaut
 */
const defaultPreferences: UserPreferences = {
  theme: 'dark',
  language: 'fr',
  notifications: {
    workoutReminders: true,
    achievements: true,
  },
  units: {
    weight: 'kg',
    distance: 'km',
  },
};

const initialState = {
  profile: null,
  preferences: defaultPreferences,
  isLoading: false,
  error: null,
  isLoggedIn: false,
};

/**
 * Store Zustand pour la gestion de l'utilisateur
 */
export const useUserStore = create<UserState>((set) => ({
  ...initialState,

  // Actions
  setProfile: (profile) => set({ profile, error: null }),
  
  updateProfile: (updates) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updates } : null,
      error: null,
    })),
  
  clearProfile: () => set({ profile: null, error: null }),
  
  setPreferences: (preferences) =>
    set((state) => ({
      preferences: { ...state.preferences, ...preferences },
    })),
  
  updatePreference: (key, value) =>
    set((state) => ({
      preferences: { ...state.preferences, [key]: value },
    })),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),

  setLoggedIn: (value) => set({ isLoggedIn: value }),
  
  reset: () => set(initialState),
}));
