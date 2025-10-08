import { getDatabase } from './index';
import type {
    AddCommentParams,
    Comment,
    LogRepParams,
    RepLog,
    SessionLog,
    SessionLogWithStats,
    StartSessionLogParams
} from './types';

/**
 * Démarre un nouveau log de séance
 */
export const startSessionLog = async (params: StartSessionLogParams): Promise<number> => {
  const db = await getDatabase();
  const result = await db.runAsync(
    'INSERT INTO session_logs (session_id, start_time, status) VALUES (?, ?, ?)',
    [params.session_id, params.start_time, 'in_progress']
  );
  return result.lastInsertRowId;
};

/**
 * Termine un log de séance
 */
export const completeSessionLog = async (
  logId: number,
  endTime: string,
  totalTime: number
): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE session_logs SET end_time = ?, total_time = ?, status = ? WHERE id = ?',
    [endTime, totalTime, 'completed', logId]
  );
};

/**
 * Abandonne un log de séance
 */
export const abandonSessionLog = async (logId: number, endTime: string): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE session_logs SET end_time = ?, status = ? WHERE id = ?',
    [endTime, 'abandoned', logId]
  );
};

/**
 * Récupère un log de séance par son ID
 */
export const getSessionLogById = async (id: number): Promise<SessionLog | null> => {
  const db = await getDatabase();
  const log = await db.getFirstAsync<SessionLog>(
    'SELECT * FROM session_logs WHERE id = ?',
    [id]
  );
  return log || null;
};

/**
 * Récupère tous les logs d'une séance spécifique
 */
export const getLogsBySession = async (sessionId: number): Promise<SessionLog[]> => {
  const db = await getDatabase();
  const logs = await db.getAllAsync<SessionLog>(
    'SELECT * FROM session_logs WHERE session_id = ? ORDER BY start_time DESC',
    [sessionId]
  );
  return logs;
};

/**
 * Récupère l'historique complet des séances avec statistiques
 */
export const getSessionLogsWithStats = async (limit: number = 50): Promise<SessionLogWithStats[]> => {
  const db = await getDatabase();
  
  const logs = await db.getAllAsync<any>(
    `SELECT 
      sl.*,
      s.*,
      COUNT(DISTINCT rl.exercise_id) as exercises_count,
      SUM(rl.reps_completed) as total_reps,
      COUNT(DISTINCT rl.set_number) as total_sets
    FROM session_logs sl
    INNER JOIN sessions s ON sl.session_id = s.id
    LEFT JOIN rep_logs rl ON sl.id = rl.log_id
    GROUP BY sl.id
    ORDER BY sl.start_time DESC
    LIMIT ?`,
    [limit]
  );

  return logs.map((log: any) => ({
    id: log.id,
    session_id: log.session_id,
    start_time: log.start_time,
    end_time: log.end_time,
    status: log.status,
    total_time: log.total_time,
    created_at: log.created_at,
    session: {
      id: log.session_id,
      program_id: log.program_id,
      name: log.name,
      type: log.type,
      duration: log.duration,
      scheduled_date: log.scheduled_date,
      recurrence_pattern: log.recurrence_pattern,
      created_at: log.created_at
    },
    total_reps: log.total_reps || 0,
    total_sets: log.total_sets || 0,
    exercises_count: log.exercises_count || 0
  }));
};

/**
 * Enregistre des répétitions effectuées pendant une séance
 */
export const logRep = async (params: LogRepParams): Promise<number> => {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO rep_logs (log_id, exercise_id, set_number, reps_completed, time_seconds) 
     VALUES (?, ?, ?, ?, ?)`,
    [
      params.log_id,
      params.exercise_id,
      params.set_number,
      params.reps_completed,
      params.time_seconds || null
    ]
  );
  return result.lastInsertRowId;
};

/**
 * Récupère tous les logs de répétitions d'une séance
 */
export const getRepLogsBySessionLog = async (logId: number): Promise<RepLog[]> => {
  const db = await getDatabase();
  const reps = await db.getAllAsync<RepLog>(
    'SELECT * FROM rep_logs WHERE log_id = ? ORDER BY created_at',
    [logId]
  );
  return reps;
};

/**
 * Récupère les répétitions par exercice pour un log de séance
 */
export const getRepLogsByExercise = async (
  logId: number,
  exerciseId: number
): Promise<RepLog[]> => {
  const db = await getDatabase();
  const reps = await db.getAllAsync<RepLog>(
    'SELECT * FROM rep_logs WHERE log_id = ? AND exercise_id = ? ORDER BY set_number',
    [logId, exerciseId]
  );
  return reps;
};

/**
 * Ajoute un commentaire sur une séance ou un exercice
 */
export const addComment = async (params: AddCommentParams): Promise<number> => {
  const db = await getDatabase();
  const result = await db.runAsync(
    'INSERT INTO comments (log_id, exercise_id, text, audio_path) VALUES (?, ?, ?, ?)',
    [
      params.log_id,
      params.exercise_id || null,
      params.text || null,
      params.audio_path || null
    ]
  );
  return result.lastInsertRowId;
};

/**
 * Récupère tous les commentaires d'une séance
 */
export const getCommentsBySessionLog = async (logId: number): Promise<Comment[]> => {
  const db = await getDatabase();
  const comments = await db.getAllAsync<Comment>(
    'SELECT * FROM comments WHERE log_id = ? ORDER BY created_at',
    [logId]
  );
  return comments;
};

/**
 * Récupère les commentaires d'un exercice spécifique
 */
export const getCommentsByExercise = async (
  logId: number,
  exerciseId: number
): Promise<Comment[]> => {
  const db = await getDatabase();
  const comments = await db.getAllAsync<Comment>(
    'SELECT * FROM comments WHERE log_id = ? AND exercise_id = ? ORDER BY created_at',
    [logId, exerciseId]
  );
  return comments;
};

/**
 * Supprime un commentaire
 */
export const deleteComment = async (id: number): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM comments WHERE id = ?', [id]);
};

/**
 * Calcule les statistiques d'un exercice sur toutes les séances
 */
export const getExerciseStats = async (exerciseId: number) => {
  const db = await getDatabase();
  const stats = await db.getFirstAsync<{
    total_sessions: number;
    total_reps: number;
    avg_reps: number;
    max_reps: number;
  }>(
    `SELECT 
      COUNT(DISTINCT log_id) as total_sessions,
      SUM(reps_completed) as total_reps,
      AVG(reps_completed) as avg_reps,
      MAX(reps_completed) as max_reps
    FROM rep_logs 
    WHERE exercise_id = ?`,
    [exerciseId]
  );
  return stats;
};

/**
 * Récupère les statistiques globales de l'utilisateur
 */
export const getGlobalStats = async () => {
  const db = await getDatabase();
  const stats = await db.getFirstAsync<{
    total_sessions: number;
    completed_sessions: number;
    total_time: number;
    total_reps: number;
  }>(
    `SELECT 
      COUNT(*) as total_sessions,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_sessions,
      SUM(total_time) as total_time,
      (SELECT SUM(reps_completed) FROM rep_logs) as total_reps
    FROM session_logs`
  );
  return stats;
};
