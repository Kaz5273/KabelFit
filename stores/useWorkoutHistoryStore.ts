import type { Exercise, RepLog, Session, SessionLog } from '@/database/types';
import { create } from 'zustand';

// Interface pour suivre l'état de chaque exercice pendant l'entraînement
interface ExerciseProgress {
  exercise: Exercise;
  completedSets: number[];
  repsPerSet: { [setNumber: number]: number };
  notes?: string;
}

// Interface pour l'état du store
interface WorkoutHistoryState {
  // Session active
  activeSessionLog: SessionLog | null;
  activeSession: Session | null;
  exerciseProgresses: ExerciseProgress[];
  
  // Timer
  sessionStartTime: Date | null;
  elapsedTime: number; // en secondes
  isTimerRunning: boolean;
  
  // Rest timer entre les séries
  restTimerActive: boolean;
  restTimeRemaining: number; // en secondes
  
  // Historique
  sessionLogs: SessionLog[];
  currentLogReps: RepLog[];
  
  // État de chargement
  isLoading: boolean;
  error: string | null;
}

// Interface pour les actions
interface WorkoutHistoryActions {
  // Démarrer une séance
  startWorkout: (session: Session, exercises: Exercise[], logId: number) => void;
  
  // Compléter une série
  completeSet: (exerciseId: number, setNumber: number, reps: number) => void;
  
  // Ajouter une note à un exercice
  addExerciseNote: (exerciseId: number, note: string) => void;
  
  // Terminer la séance
  completeWorkout: () => void;
  
  // Abandonner la séance
  abandonWorkout: () => void;
  
  // Timer de séance
  startTimer: () => void;
  stopTimer: () => void;
  updateElapsedTime: (seconds: number) => void;
  
  // Timer de repos
  startRestTimer: (duration: number) => void;
  stopRestTimer: () => void;
  decrementRestTimer: () => void;
  
  // Historique
  setSessionLogs: (logs: SessionLog[]) => void;
  addSessionLog: (log: SessionLog) => void;
  setCurrentLogReps: (reps: RepLog[]) => void;
  
  // État
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Reset
  reset: () => void;
}

type WorkoutHistoryStore = WorkoutHistoryState & WorkoutHistoryActions;

const initialState: WorkoutHistoryState = {
  activeSessionLog: null,
  activeSession: null,
  exerciseProgresses: [],
  sessionStartTime: null,
  elapsedTime: 0,
  isTimerRunning: false,
  restTimerActive: false,
  restTimeRemaining: 0,
  sessionLogs: [],
  currentLogReps: [],
  isLoading: false,
  error: null,
};

export const useWorkoutHistoryStore = create<WorkoutHistoryStore>((set, get) => ({
  ...initialState,

  // Démarrer une séance d'entraînement
  startWorkout: (session, exercises, logId) => {
    const now = new Date();
    const exerciseProgresses: ExerciseProgress[] = exercises.map((exercise) => ({
      exercise,
      completedSets: [],
      repsPerSet: {},
      notes: undefined,
    }));

    set({
      activeSession: session,
      activeSessionLog: {
        id: logId,
        session_id: session.id,
        start_time: now.toISOString(),
        end_time: null,
        status: 'in_progress',
        total_time: null,
        created_at: now.toISOString(),
      },
      exerciseProgresses,
      sessionStartTime: now,
      elapsedTime: 0,
      isTimerRunning: true,
    });
  },

  // Compléter une série
  completeSet: (exerciseId, setNumber, reps) => {
    const { exerciseProgresses } = get();
    const updatedProgresses = exerciseProgresses.map((progress) => {
      if (progress.exercise.id === exerciseId) {
        return {
          ...progress,
          completedSets: [...progress.completedSets, setNumber],
          repsPerSet: {
            ...progress.repsPerSet,
            [setNumber]: reps,
          },
        };
      }
      return progress;
    });

    set({ exerciseProgresses: updatedProgresses });
  },

  // Ajouter une note à un exercice
  addExerciseNote: (exerciseId, note) => {
    const { exerciseProgresses } = get();
    const updatedProgresses = exerciseProgresses.map((progress) => {
      if (progress.exercise.id === exerciseId) {
        return {
          ...progress,
          notes: note,
        };
      }
      return progress;
    });

    set({ exerciseProgresses: updatedProgresses });
  },

  // Terminer la séance
  completeWorkout: () => {
    const { activeSessionLog } = get();
    if (activeSessionLog) {
      const endTime = new Date();
      set({
        activeSessionLog: {
          ...activeSessionLog,
          end_time: endTime.toISOString(),
          status: 'completed',
          total_time: Math.floor(
            (endTime.getTime() - new Date(activeSessionLog.start_time).getTime()) / 1000
          ),
        },
        isTimerRunning: false,
      });
    }
  },

  // Abandonner la séance
  abandonWorkout: () => {
    const { activeSessionLog } = get();
    if (activeSessionLog) {
      const endTime = new Date();
      set({
        activeSessionLog: {
          ...activeSessionLog,
          end_time: endTime.toISOString(),
          status: 'abandoned',
        },
        isTimerRunning: false,
      });
    }
  },

  // Démarrer le timer
  startTimer: () => set({ isTimerRunning: true }),

  // Arrêter le timer
  stopTimer: () => set({ isTimerRunning: false }),

  // Mettre à jour le temps écoulé
  updateElapsedTime: (seconds) => set({ elapsedTime: seconds }),

  // Démarrer le timer de repos
  startRestTimer: (duration) =>
    set({
      restTimerActive: true,
      restTimeRemaining: duration,
    }),

  // Arrêter le timer de repos
  stopRestTimer: () =>
    set({
      restTimerActive: false,
      restTimeRemaining: 0,
    }),

  // Décrémenter le timer de repos
  decrementRestTimer: () => {
    const { restTimeRemaining } = get();
    if (restTimeRemaining > 0) {
      set({ restTimeRemaining: restTimeRemaining - 1 });
    } else {
      set({ restTimerActive: false });
    }
  },

  // Définir l'historique des séances
  setSessionLogs: (logs) => set({ sessionLogs: logs }),

  // Ajouter une séance à l'historique
  addSessionLog: (log) => {
    const { sessionLogs } = get();
    set({ sessionLogs: [log, ...sessionLogs] });
  },

  // Définir les reps du log actuel
  setCurrentLogReps: (reps) => set({ currentLogReps: reps }),

  // Définir l'état de chargement
  setLoading: (loading) => set({ isLoading: loading }),

  // Définir une erreur
  setError: (error) => set({ error }),

  // Réinitialiser le store
  reset: () => set(initialState),
}));
