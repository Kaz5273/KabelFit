import { getDatabase } from './index';
import type { CreateExerciseParams, Exercise } from './types';

/**
 * Gets all exercises
 */
export const getAllExercises = async (): Promise<Exercise[]> => {
  const db = await getDatabase();
  const exercises = await db.getAllAsync<Exercise>(
    'SELECT * FROM exercises ORDER BY muscle_group, name'
  );
  return exercises;
};

/**
 * Gets exercises by muscle group
 */
export const getExercisesByMuscleGroup = async (muscleGroup: string): Promise<Exercise[]> => {
  const db = await getDatabase();
  const exercises = await db.getAllAsync<Exercise>(
    'SELECT * FROM exercises WHERE muscle_group = ? ORDER BY name',
    [muscleGroup]
  );
  return exercises;
};

/**
 * Gets exercises by session
 */
export const getExercisesBySession = async (sessionId: number): Promise<Exercise[]> => {
  const db = await getDatabase();
  const exercises = await db.getAllAsync<Exercise>(
    'SELECT * FROM exercises WHERE session_id = ? ORDER BY id ASC',
    [sessionId]
  );
  return exercises;
};

/**
 * Gets an exercise by ID
 */
export const getExerciseById = async (id: number): Promise<Exercise | null> => {
  const db = await getDatabase();
  const exercise = await db.getFirstAsync<Exercise>(
    'SELECT * FROM exercises WHERE id = ?',
    [id]
  );
  return exercise || null;
};

/**
 * Creates a new exercise
 */
export const createExercise = async (params: CreateExerciseParams): Promise<number> => {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO exercises (session_id, name, muscle_group, sets, reps, rest_minutes, illustration_url, description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      params.session_id,
      params.name,
      params.muscle_group || null,
      params.sets || null,
      params.reps || null,
      params.rest_minutes || null,
      params.illustration_url || null,
      params.description || null
    ]
  );
  return result.lastInsertRowId;
};

/**
 * Updates an existing exercise
 */
export const updateExercise = async (
  id: number,
  params: Partial<Omit<CreateExerciseParams, 'session_id'>>
): Promise<void> => {
  const db = await getDatabase();

  const updates: string[] = [];
  const values: any[] = [];

  if (params.name !== undefined) {
    updates.push('name = ?');
    values.push(params.name);
  }

  if (params.muscle_group !== undefined) {
    updates.push('muscle_group = ?');
    values.push(params.muscle_group);
  }

  if (params.sets !== undefined) {
    updates.push('sets = ?');
    values.push(params.sets);
  }

  if (params.reps !== undefined) {
    updates.push('reps = ?');
    values.push(params.reps);
  }

  if (params.rest_minutes !== undefined) {
    updates.push('rest_minutes = ?');
    values.push(params.rest_minutes);
  }

  if (params.illustration_url !== undefined) {
    updates.push('illustration_url = ?');
    values.push(params.illustration_url);
  }

  if (params.description !== undefined) {
    updates.push('description = ?');
    values.push(params.description);
  }

  if (updates.length > 0) {
    values.push(id);
    await db.runAsync(
      `UPDATE exercises SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
  }
};

/**
 * Deletes an exercise
 */
export const deleteExercise = async (id: number): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM exercises WHERE id = ?', [id]);
};

/**
 * Searches exercises by name
 */
export const searchExercises = async (query: string): Promise<Exercise[]> => {
  const db = await getDatabase();
  const exercises = await db.getAllAsync<Exercise>(
    'SELECT * FROM exercises WHERE name LIKE ? ORDER BY name',
    [`%${query}%`]
  );
  return exercises;
};

/**
 * Gets unique muscle groups
 */
export const getMuscleGroups = async (): Promise<string[]> => {
  const db = await getDatabase();
  const result = await db.getAllAsync<{ muscle_group: string }>(
    'SELECT DISTINCT muscle_group FROM exercises WHERE muscle_group IS NOT NULL ORDER BY muscle_group ASC'
  );
  return result.map(r => r.muscle_group);
};

/**
 * Counts exercises in a session
 */
export const countExercisesBySession = async (sessionId: number): Promise<number> => {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM exercises WHERE session_id = ?',
    [sessionId]
  );
  return result?.count || 0;
};

/**
 * Gets exercise statistics
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
