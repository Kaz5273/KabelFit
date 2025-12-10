import { getDatabase } from './index';
import { SessionUser, CreateSessionUserParams } from './types';

/**
 * Records a session completed by a user
 */
export const createSessionUser = async (params: CreateSessionUserParams): Promise<number> => {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO session_user (user_id, session_id, program_user_id, completed_at, completed, difficulty_rating, actual_duration)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      params.user_id,
      params.session_id,
      params.program_user_id,
      params.completed_at,
      params.completed ?? 0,
      params.difficulty_rating ?? null,
      params.actual_duration ?? null
    ]
  );
  return result.lastInsertRowId;
};

/**
 * Gets a session-user record by ID
 */
export const getSessionUserById = async (id: number): Promise<SessionUser | null> => {
  const db = await getDatabase();
  const sessionUser = await db.getFirstAsync<SessionUser>(
    'SELECT * FROM session_user WHERE id = ?',
    [id]
  );
  return sessionUser ?? null;
};

/**
 * Gets all sessions completed by a user
 */
export const getSessionsByUser = async (userId: number): Promise<SessionUser[]> => {
  const db = await getDatabase();
  const sessions = await db.getAllAsync<SessionUser>(
    'SELECT * FROM session_user WHERE user_id = ? ORDER BY completed_at DESC',
    [userId]
  );
  return sessions;
};

/**
 * Gets completed sessions for a user
 */
export const getCompletedSessionsByUser = async (userId: number): Promise<SessionUser[]> => {
  const db = await getDatabase();
  const sessions = await db.getAllAsync<SessionUser>(
    'SELECT * FROM session_user WHERE user_id = ? AND completed = 1 ORDER BY completed_at DESC',
    [userId]
  );
  return sessions;
};

/**
 * Gets incomplete sessions for a user
 */
export const getIncompleteSessionsByUser = async (userId: number): Promise<SessionUser[]> => {
  const db = await getDatabase();
  const sessions = await db.getAllAsync<SessionUser>(
    'SELECT * FROM session_user WHERE user_id = ? AND completed = 0 ORDER BY completed_at DESC',
    [userId]
  );
  return sessions;
};

/**
 * Gets sessions for a user within a specific program
 */
export const getSessionsByUserAndProgram = async (userId: number, programUserId: number): Promise<SessionUser[]> => {
  const db = await getDatabase();
  const sessions = await db.getAllAsync<SessionUser>(
    'SELECT * FROM session_user WHERE user_id = ? AND program_user_id = ? ORDER BY completed_at DESC',
    [userId, programUserId]
  );
  return sessions;
};

/**
 * Gets history for a specific session for a user
 */
export const getSessionHistory = async (userId: number, sessionId: number): Promise<SessionUser[]> => {
  const db = await getDatabase();
  const sessions = await db.getAllAsync<SessionUser>(
    'SELECT * FROM session_user WHERE user_id = ? AND session_id = ? ORDER BY completed_at DESC',
    [userId, sessionId]
  );
  return sessions;
};

/**
 * Updates a session-user record
 */
export const updateSessionUser = async (
  id: number,
  updates: Partial<Omit<SessionUser, 'id' | 'user_id' | 'session_id' | 'program_user_id'>>
): Promise<void> => {
  const db = await getDatabase();

  const fields: string[] = [];
  const values: any[] = [];

  Object.entries(updates).forEach(([key, value]) => {
    fields.push(`${key} = ?`);
    values.push(value);
  });

  if (fields.length === 0) return;

  values.push(id);
  await db.runAsync(
    `UPDATE session_user SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
};

/**
 * Marks a session as completed
 */
export const markSessionAsCompleted = async (id: number): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE session_user SET completed = 1 WHERE id = ?',
    [id]
  );
};

/**
 * Adds a difficulty rating to a session
 */
export const addDifficultyRating = async (id: number, rating: number): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE session_user SET difficulty_rating = ? WHERE id = ?',
    [rating, id]
  );
};

/**
 * Deletes a session-user record
 */
export const deleteSessionUser = async (id: number): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM session_user WHERE id = ?', [id]);
};

/**
 * Counts total sessions completed by a user
 */
export const countSessionsByUser = async (userId: number): Promise<number> => {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM session_user WHERE user_id = ?',
    [userId]
  );
  return result?.count ?? 0;
};

/**
 * Counts completed sessions by a user
 */
export const countCompletedSessionsByUser = async (userId: number): Promise<number> => {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM session_user WHERE user_id = ? AND completed = 1',
    [userId]
  );
  return result?.count ?? 0;
};

/**
 * Gets session statistics for a user
 */
export const getSessionStats = async (userId: number): Promise<{
  total: number;
  completed: number;
  averageDuration: number;
  averageDifficulty: number;
}> => {
  const db = await getDatabase();

  const stats = await db.getFirstAsync<{
    total: number;
    completed: number;
    avg_duration: number;
    avg_difficulty: number;
  }>(
    `SELECT
      COUNT(*) as total,
      SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed,
      AVG(actual_duration) as avg_duration,
      AVG(difficulty_rating) as avg_difficulty
    FROM session_user
    WHERE user_id = ?`,
    [userId]
  );

  return {
    total: stats?.total ?? 0,
    completed: stats?.completed ?? 0,
    averageDuration: stats?.avg_duration ?? 0,
    averageDifficulty: stats?.avg_difficulty ?? 0,
  };
};
