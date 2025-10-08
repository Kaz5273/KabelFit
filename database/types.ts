/**
 * Types de séances disponibles dans l'application
 */
export type SessionType = 'AMRAP' | 'HIIT' | 'EMOM';

/**
 * Statuts possibles d'une séance effectuée
 */
export type SessionStatus = 'in_progress' | 'completed' | 'abandoned';

/**
 * Catégories d'exercices
 */
export type ExerciseCategory = 'Force' | 'Cardio' | 'Core' | 'Mobilité' | 'Autre';

/**
 * Structure d'un programme d'entraînement
 */
export interface Program {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Structure d'un exercice
 */
export interface Exercise {
  id: number;
  name: string;
  description: string | null;
  category: string | null;
  is_custom: number; // SQLite utilise 0/1 pour boolean
  created_at: string;
}

/**
 * Structure d'une séance planifiée
 */
export interface Session {
  id: number;
  program_id: number | null;
  name: string;
  type: SessionType;
  duration: number; // Durée en secondes
  scheduled_date: string | null;
  recurrence_pattern: string | null; // Format JSON pour la récurrence
  created_at: string;
}

/**
 * Liaison entre une séance et un exercice avec sa configuration
 */
export interface SessionExercise {
  id: number;
  session_id: number;
  exercise_id: number;
  exercise_order: number;
  sets: number | null;
  reps: number | null;
  rest_time: number | null; // Temps de repos en secondes
}

/**
 * Log d'une séance effectuée
 */
export interface SessionLog {
  id: number;
  session_id: number;
  start_time: string;
  end_time: string | null;
  status: SessionStatus;
  total_time: number | null; // Durée totale en secondes
  created_at: string;
}

/**
 * Log des répétitions effectuées pour un exercice
 */
export interface RepLog {
  id: number;
  log_id: number;
  exercise_id: number;
  set_number: number;
  reps_completed: number;
  time_seconds: number | null;
  created_at: string;
}

/**
 * Commentaire sur une séance ou un exercice spécifique
 */
export interface Comment {
  id: number;
  log_id: number;
  exercise_id: number | null; // Null si commentaire global sur la séance
  text: string | null;
  audio_path: string | null;
  created_at: string;
}

/**
 * Données complètes d'une séance avec ses exercices
 */
export interface SessionWithExercises extends Session {
  exercises: (SessionExercise & Exercise)[];
}

/**
 * Données complètes d'un log de séance avec statistiques
 */
export interface SessionLogWithStats extends SessionLog {
  session: Session;
  total_reps: number;
  total_sets: number;
  exercises_count: number;
}

/**
 * Paramètres pour créer un nouveau programme
 */
export interface CreateProgramParams {
  name: string;
  description?: string;
}

/**
 * Paramètres pour créer une nouvelle séance
 */
export interface CreateSessionParams {
  program_id?: number;
  name: string;
  type: SessionType;
  duration: number;
  scheduled_date?: string;
  recurrence_pattern?: string;
  exercises: {
    exercise_id: number;
    order: number;
    sets?: number;
    reps?: number;
    rest_time?: number;
  }[];
}

/**
 * Paramètres pour créer un nouvel exercice
 */
export interface CreateExerciseParams {
  name: string;
  description?: string;
  category?: string;
  is_custom?: boolean;
}

/**
 * Paramètres pour démarrer un log de séance
 */
export interface StartSessionLogParams {
  session_id: number;
  start_time: string;
}

/**
 * Paramètres pour enregistrer des répétitions
 */
export interface LogRepParams {
  log_id: number;
  exercise_id: number;
  set_number: number;
  reps_completed: number;
  time_seconds?: number;
}

/**
 * Paramètres pour ajouter un commentaire
 */
export interface AddCommentParams {
  log_id: number;
  exercise_id?: number;
  text?: string;
  audio_path?: string;
}
