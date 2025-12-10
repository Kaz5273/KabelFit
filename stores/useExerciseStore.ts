import type { Exercise } from '@/database/types';
import { create } from 'zustand';

/**
 * Interface pour le state du store des exercices
 */
interface ExerciseState {
  // State
  exercises: Exercise[];
  currentExercise: Exercise | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    sessionId?: number;
    muscleGroup?: string;
    searchQuery?: string;
  };

  // Actions
  setExercises: (exercises: Exercise[]) => void;
  addExercise: (exercise: Exercise) => void;
  updateExercise: (exerciseId: number, updates: Partial<Exercise>) => void;
  removeExercise: (exerciseId: number) => void;
  
  setCurrentExercise: (exercise: Exercise | null) => void;
  
  setFilters: (filters: Partial<ExerciseState['filters']>) => void;
  clearFilters: () => void;
  
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

/**
 * Store Zustand pour la gestion des exercices
 */
export const useExerciseStore = create<ExerciseState>((set) => ({
  // Initial state
  exercises: [],
  currentExercise: null,
  isLoading: false,
  error: null,
  filters: {},

  // Actions
  setExercises: (exercises) => set({ exercises, error: null }),
  
  addExercise: (exercise) =>
    set((state) => ({
      exercises: [...state.exercises, exercise],
      error: null,
    })),
  
  updateExercise: (exerciseId, updates) =>
    set((state) => ({
      exercises: state.exercises.map((exercise) =>
        exercise.id === exerciseId ? { ...exercise, ...updates } : exercise
      ),
      currentExercise:
        state.currentExercise?.id === exerciseId
          ? { ...state.currentExercise, ...updates }
          : state.currentExercise,
      error: null,
    })),
  
  removeExercise: (exerciseId) =>
    set((state) => ({
      exercises: state.exercises.filter((exercise) => exercise.id !== exerciseId),
      currentExercise:
        state.currentExercise?.id === exerciseId ? null : state.currentExercise,
      error: null,
    })),
  
  setCurrentExercise: (exercise) => set({ currentExercise: exercise }),
  
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  
  clearFilters: () => set({ filters: {} }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  reset: () =>
    set({
      exercises: [],
      currentExercise: null,
      isLoading: false,
      error: null,
      filters: {},
    }),
}));
