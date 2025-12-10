import { getDatabase } from './index';
import type {
  AddCommentParams,
  Comment,
  LogRepParams,
  RepLog,
  Session,
  SessionLog,
  SessionLogWithStats,
  StartSessionLogParams
} from './types';

/**
 * Starts a new session log
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
 * Completes a session log
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
 * Abandons a session log
 */
export const abandonSessionLog = async (logId: number, endTime: string): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE session_logs SET end_time = ?, status = ? WHERE id = ?',
    [endTime, 'abandoned', logId]
  );
};

/**
 * Gets a session log by ID
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
 * Gets all logs for a specific session
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
 * Gets complete session history with statistics
 */
export const getSessionLogsWithStats = async (limit: number = 50): Promise<SessionLogWithStats[]> => {
  const db = await getDatabase();

  const logs = await db.getAllAsync<SessionLog>(
    `SELECT * FROM session_logs ORDER BY start_time DESC LIMIT ?`,
    [limit]
  );

  const result: SessionLogWithStats[] = [];

  for (const log of logs) {
    const session = await db.getFirstAsync<Session>(
      'SELECT * FROM sessions WHERE id = ?',
      [log.session_id]
    );

    const stats = await db.getFirstAsync<{
      exercises_count: number;
      total_reps: number;
      total_sets: number;
    }>(
      `SELECT
        COUNT(DISTINCT exercise_id) as exercises_count,
        SUM(reps_completed) as total_reps,
        COUNT(*) as total_sets
      FROM rep_logs
      WHERE log_id = ?`,
      [log.id]
    );

    if (session) {
      result.push({
        ...log,
        session,
        total_reps: stats?.total_reps || 0,
        total_sets: stats?.total_sets || 0,
        exercises_count: stats?.exercises_count || 0
      });
    }
  }

  return result;
};

/**
 * Logs reps performed during a session
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
 * Gets all rep logs for a session log
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
 * Gets rep logs by exercise for a session log
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
 * Adds a comment to a session or exercise
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
 * Gets all comments for a session log
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
 * Gets comments for a specific exercise
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
 * Deletes a comment
 */
export const deleteComment = async (id: number): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM comments WHERE id = ?', [id]);
};

/**
 * Gets global user statistics
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
