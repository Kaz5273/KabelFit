import { getDatabase } from './index';
import type {
  CreateSessionParams,
  Exercise,
  Session,
  SessionWithExercises
} from './types';

/**
 * Gets all sessions
 */
export const getAllSessions = async (): Promise<Session[]> => {
  const db = await getDatabase();
  const sessions = await db.getAllAsync<Session>(
    'SELECT * FROM sessions ORDER BY created_at DESC'
  );
  return sessions;
};

/**
 * Gets sessions by program
 */
export const getSessionsByProgram = async (programId: number): Promise<Session[]> => {
  const db = await getDatabase();
  const sessions = await db.getAllAsync<Session>(
    'SELECT * FROM sessions WHERE program_id = ? ORDER BY "order" ASC',
    [programId]
  );
  return sessions;
};

/**
 * Gets a session by ID
 */
export const getSessionById = async (id: number): Promise<Session | null> => {
  const db = await getDatabase();
  const session = await db.getFirstAsync<Session>(
    'SELECT * FROM sessions WHERE id = ?',
    [id]
  );
  return session || null;
};

/**
 * Gets a session with all its exercises
 */
export const getSessionWithExercises = async (id: number): Promise<SessionWithExercises | null> => {
  const db = await getDatabase();

  const session = await getSessionById(id);
  if (!session) {
    return null;
  }

  const exercises = await db.getAllAsync<Exercise>(
    'SELECT * FROM exercises WHERE session_id = ? ORDER BY id ASC',
    [id]
  );

  return {
    ...session,
    exercises
  };
};

/**
 * Creates a new session
 */
export const createSession = async (params: CreateSessionParams): Promise<number> => {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO sessions (program_id, name, day_of_week, duration_minutes, description, "order")
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      params.program_id,
      params.name,
      params.day_of_week || null,
      params.duration_minutes,
      params.description || null,
      params.order
    ]
  );
  return result.lastInsertRowId;
};

/**
 * Updates a session
 */
export const updateSession = async (
  id: number,
  params: Partial<Omit<CreateSessionParams, 'program_id'>>
): Promise<void> => {
  const db = await getDatabase();

  const updates: string[] = [];
  const values: any[] = [];

  if (params.name !== undefined) {
    updates.push('name = ?');
    values.push(params.name);
  }

  if (params.day_of_week !== undefined) {
    updates.push('day_of_week = ?');
    values.push(params.day_of_week);
  }

  if (params.duration_minutes !== undefined) {
    updates.push('duration_minutes = ?');
    values.push(params.duration_minutes);
  }

  if (params.description !== undefined) {
    updates.push('description = ?');
    values.push(params.description);
  }

  if (params.order !== undefined) {
    updates.push('"order" = ?');
    values.push(params.order);
  }

  if (updates.length > 0) {
    values.push(id);
    await db.runAsync(
      `UPDATE sessions SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
  }
};

/**
 * Deletes a session and all its associated data
 */
export const deleteSession = async (id: number): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM sessions WHERE id = ?', [id]);
};

/**
 * Gets sessions by day of the week
 */
export const getSessionsByDay = async (day: string): Promise<Session[]> => {
  const db = await getDatabase();
  const sessions = await db.getAllAsync<Session>(
    'SELECT * FROM sessions WHERE day_of_week = ? ORDER BY created_at DESC',
    [day]
  );
  return sessions;
};

/**
 * Counts sessions in a program
 */
export const countSessionsByProgram = async (programId: number): Promise<number> => {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM sessions WHERE program_id = ?',
    [programId]
  );
  return result?.count || 0;
};

/**
 * Searches sessions by name
 */
export const searchSessions = async (query: string): Promise<Session[]> => {
  const db = await getDatabase();
  const sessions = await db.getAllAsync<Session>(
    'SELECT * FROM sessions WHERE name LIKE ? ORDER BY created_at DESC',
    [`%${query}%`]
  );
  return sessions;
};
