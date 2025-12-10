/**
 * Available session types
 */
export type SessionType = 'AMRAP' | 'HIIT' | 'EMOM';

/**
 * Possible session statuses
 */
export type SessionStatus = 'in_progress' | 'completed' | 'abandoned';

/**
 * Exercise categories
 */
export type ExerciseCategory = 'Force' | 'Cardio' | 'Core' | 'Mobility' | 'Other';

/**
 * Difficulty levels
 */
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

/**
 * Training types
 */
export type TrainingType = 'Strength' | 'Cardio' | 'HIIT' | 'Yoga' | 'Other';

/**
 * User objectives
 */
export type UserObjective = 'Lose weight' | 'Build muscle' | 'Get fit' | 'Endurance' | 'Strength';

/**
 * User structure
 */
export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  age: number | null;
  weight: number | null; // in kg
  height: number | null; // in cm
  objective: UserObjective | null;
  level: DifficultyLevel | null;
  created_at: string;
}

/**
 * Article structure
 */
export interface Article {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  published_at: string;
}

/**
 * Training program structure
 */
export interface Program {
  id: number;
  name: string;
  type: TrainingType;
  duration_weeks: number;
  sessions_per_week: number;
  difficulty_level: DifficultyLevel;
  description: string | null;
  objective: UserObjective | null;
  created_at: string;
  updated_at: string;
}

/**
 * Session structure
 */
export interface Session {
  id: number;
  program_id: number;
  name: string;
  day_of_week: string | null; // Monday, Tuesday, etc.
  duration_minutes: number;
  description: string | null;
  order: number; // Position in the week
  created_at: string;
}

/**
 * Exercise structure
 */
export interface Exercise {
  id: number;
  session_id: number;
  name: string;
  muscle_group: string | null;
  sets: number | null;
  reps: number | null;
  rest_minutes: number | null;
  illustration_url: string | null;
  description: string | null;
  created_at: string;
}

/**
 * Program-User association table
 */
export interface ProgramUser {
  id: number;
  user_id: number;
  program_id: number;
  start_date: string;
  end_date: string | null;
  completed: number; // 0 = not completed, 1 = completed
  progression: number; // Percentage 0-100
  user_comment: string | null;
}

/**
 * Session-User association table
 */
export interface SessionUser {
  id: number;
  user_id: number;
  session_id: number;
  program_user_id: number;
  completed_at: string;
  completed: number; // 0 = not completed, 1 = completed
  difficulty_rating: number | null; // Rating 1 to 5
  actual_duration: number | null; // Actual duration in minutes
}

/**
 * Exercise-User association table
 */
export interface ExerciseUser {
  id: number;
  user_id: number;
  exercise_id: number;
  session_user_id: number;
  completed_at: string;
  completed: number; // 0 = failed, 1 = succeeded
  sets_completed: number | null;
  reps_completed: number | null;
  comment: string | null;
}

/**
 * Session with exercises data
 */
export interface SessionWithExercises extends Session {
  exercises: Exercise[];
}

/**
 * Program with sessions data
 */
export interface ProgramWithSessions extends Program {
  sessions: Session[];
}

/**
 * Session exercise (for session-exercise relationship)
 */
export interface SessionExercise {
  id: number;
  session_id: number;
  exercise_id: number;
  exercise_order: number;
  sets: number | null;
  reps: number | null;
  rest_time: number | null;
}

/**
 * Parameters to create a user
 */
export interface CreateUserParams {
  username: string;
  email: string;
  password: string;
  age?: number;
  weight?: number;
  height?: number;
  objective?: UserObjective;
  level?: DifficultyLevel;
}

/**
 * Parameters to create an article
 */
export interface CreateArticleParams {
  title: string;
  content: string;
  image_url?: string;
}

/**
 * Parameters to create a program
 */
export interface CreateProgramParams {
  name: string;
  type: TrainingType;
  duration_weeks: number;
  sessions_per_week: number;
  difficulty_level: DifficultyLevel;
  description?: string;
  objective?: UserObjective;
}

/**
 * Parameters to create a session
 */
export interface CreateSessionParams {
  program_id: number;
  name: string;
  day_of_week?: string;
  duration_minutes: number;
  description?: string;
  order: number;
}

/**
 * Parameters to create an exercise
 */
export interface CreateExerciseParams {
  session_id: number;
  name: string;
  muscle_group?: string;
  sets?: number;
  reps?: number;
  rest_minutes?: number;
  illustration_url?: string;
  description?: string;
}

/**
 * Parameters to associate a program with a user
 */
export interface CreateProgramUserParams {
  user_id: number;
  program_id: number;
  start_date: string;
  end_date?: string;
}

/**
 * Parameters to record a user session
 */
export interface CreateSessionUserParams {
  user_id: number;
  session_id: number;
  program_user_id: number;
  completed_at: string;
  completed?: number;
  difficulty_rating?: number;
  actual_duration?: number;
}

/**
 * Parameters to record a user exercise
 */
export interface CreateExerciseUserParams {
  user_id: number;
  exercise_id: number;
  session_user_id: number;
  completed_at: string;
  completed?: number;
  sets_completed?: number;
  reps_completed?: number;
  comment?: string;
}

/**
 * Session log structure (for tracking)
 */
export interface SessionLog {
  id: number;
  session_id: number;
  start_time: string;
  end_time: string | null;
  status: SessionStatus;
  total_time: number | null;
  created_at: string;
}

/**
 * Session log with statistics
 */
export interface SessionLogWithStats extends SessionLog {
  session: Session;
  total_reps: number;
  total_sets: number;
  exercises_count: number;
}

/**
 * Rep log structure
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
 * Comment structure
 */
export interface Comment {
  id: number;
  log_id: number;
  exercise_id: number | null;
  text: string | null;
  audio_path: string | null;
  created_at: string;
}

/**
 * Parameters to start a session log
 */
export interface StartSessionLogParams {
  session_id: number;
  start_time: string;
}

/**
 * Parameters to log reps
 */
export interface LogRepParams {
  log_id: number;
  exercise_id: number;
  set_number: number;
  reps_completed: number;
  time_seconds?: number;
}

/**
 * Parameters to add a comment
 */
export interface AddCommentParams {
  log_id: number;
  exercise_id?: number;
  text?: string;
  audio_path?: string;
}
