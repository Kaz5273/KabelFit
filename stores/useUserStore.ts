import { create } from 'zustand';

interface UserState {
  // Ajoute tes propriétés ici au fur et à mesure
  isLoggedIn: boolean;

  // Actions
  setLoggedIn: (value: boolean) => void;
  reset: () => void;
}

const initialState = {
  isLoggedIn: false,
};

export const useUserStore = create<UserState>((set) => ({
  ...initialState,

  setLoggedIn: (value) => set({ isLoggedIn: value }),

  reset: () => set(initialState),
}));
