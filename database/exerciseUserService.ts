import { getDatabase } from './index';
import { ExerciseUser, CreateExerciseUserParams } from './types';

/**
 * Records an exercise completed by a user
 */
export const createExerciseUser = async (params: CreateExerciseUserParams): Promise<number> => {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO exercise_user (user_id, exercise_id, session_user_id, completed, sets_completed, reps_completed, comment, completed_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      params.user_id,
      params.exercise_id,
      params.session_user_id,
      params.completed ?? 0,
      params.sets_completed ?? null,
      params.reps_completed ?? null,
      params.comment ?? null,
      params.completed_at
    ]
  );
  return result.lastInsertRowId;
};

/**
 * Gets an exercise-user record by ID
 */
export const getExerciseUserById = async (id: number): Promise<ExerciseUser | null> => {
  const db = await getDatabase();
  const exerciseUser = await db.getFirstAsync<ExerciseUser>(
    'SELECT * FROM exercise_user WHERE id = ?',
    [id]
  );
  return exerciseUser ?? null;
};

/**
 * Gets all exercises completed by a user
 */
export const getExercisesByUser = async (userId: number): Promise<ExerciseUser[]> => {
  const db = await getDatabase();
  const exercises = await db.getAllAsync<ExerciseUser>(
    'SELECT * FROM exercise_user WHERE user_id = ? ORDER BY completed_at DESC',
    [userId]
  );
  return exercises;
};

/**
 * Gets exercises for a specific session-user
 */
export const getExercisesBySessionUser = async (sessionUserId: number): Promise<ExerciseUser[]> => {
  const db = await getDatabase();
  const exercises = await db.getAllAsync<ExerciseUser>(
    'SELECT * FROM exercise_user WHERE session_user_id = ? ORDER BY id ASC',
    [sessionUserId]
  );
  return exercises;
};

/**
 * Gets completed exercises for a user
 */
export const getCompletedExercisesByUser = async (userId: number): Promise<ExerciseUser[]> => {
  const db = await getDatabase();
  const exercises = await db.getAllAsync<ExerciseUser>(
    'SELECT * FROM exercise_user WHERE user_id = ? AND completed = 1 ORDER BY completed_at DESC',
    [userId]
  );
  return exercises;
};

/**
 * Gets history for a specific exercise for a user
 */
export const getExerciseHistory = async (userId: number, exerciseId: number): Promise<ExerciseUser[]> => {
  const db = await getDatabase();
  const exercises = await db.getAllAsync<ExerciseUser>(
    'SELECT * FROM exercise_user WHERE user_id = ? AND exercise_id = ? ORDER BY completed_at DESC',
    [userId, exerciseId]
  );
  return exercises;
};

/**
 * Updates an exercise-user record
 */
export const updateExerciseUser = async (
  id: number,
  updates: Partial<Omit<ExerciseUser, 'id' | 'user_id' | 'exercise_id' | 'session_user_id'>>
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
    `UPDATE exercise_user SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
};

/**
 * Marks an exercise as completed
 */
export const markExerciseAsCompleted = async (id: number): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE exercise_user SET completed = 1 WHERE id = ?',
    [id]
  );
};

/**
 * Adds a comment to an exercise user record
 */
export const addExerciseUserComment = async (id: number, comment: string): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE exercise_user SET comment = ? WHERE id = ?',
    [comment, id]
  );
};

/**
 * Deletes an exercise-user record
 */
export const deleteExerciseUser = async (id: number): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM exercise_user WHERE id = ?', [id]);
};

/**
 * Counts total exercises completed by a user
 */
export const countExercisesByUser = async (userId: number): Promise<number> => {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM exercise_user WHERE user_id = ?',
    [userId]
  );
  return result?.count ?? 0;
};

/**
 * Counts completed exercises by a user
 */
export const countCompletedExercisesByUser = async (userId: number): Promise<number> => {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM exercise_user WHERE user_id = ? AND completed = 1',
    [userId]
  );
  return result?.count ?? 0;
};

/**
 * Gets exercise user statistics for a user
 */
export const getExerciseUserStats = async (userId: number): Promise<{
  total: number;
  completed: number;
  totalSets: number;
  totalReps: number;
}> => {
  const db = await getDatabase();

  const stats = await db.getFirstAsync<{
    total: number;
    completed: number;
    total_sets: number;
    total_reps: number;
  }>(
    `SELECT
      COUNT(*) as total,
      SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed,
      SUM(sets_completed) as total_sets,
      SUM(reps_completed) as total_reps
    FROM exercise_user
    WHERE user_id = ?`,
    [userId]
  );

  return {
    total: stats?.total ?? 0,
    completed: stats?.completed ?? 0,
    totalSets: stats?.total_sets ?? 0,
    totalReps: stats?.total_reps ?? 0,
  };
};

/**
 * Gets exercise progression for a user (last performances)
 */
export const getExerciseProgression = async (
  userId: number,
  exerciseId: number,
  limit: number = 10
): Promise<ExerciseUser[]> => {
  const db = await getDatabase();
  const exercises = await db.getAllAsync<ExerciseUser>(
    `SELECT * FROM exercise_user
     WHERE user_id = ? AND exercise_id = ? AND completed = 1
     ORDER BY completed_at DESC
     LIMIT ?`,
    [userId, exerciseId, limit]
  );
  return exercises;
};
