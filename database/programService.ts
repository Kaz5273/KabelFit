import { getDatabase } from './index';
import type { CreateProgramParams, Program, ProgramWithSessions, Session } from './types';

/**
 * Gets all programs
 */
export const getAllPrograms = async (): Promise<Program[]> => {
  const db = await getDatabase();
  const programs = await db.getAllAsync<Program>(
    'SELECT * FROM programs ORDER BY created_at DESC'
  );
  return programs;
};

/**
 * Gets a program by ID
 */
export const getProgramById = async (id: number): Promise<Program | null> => {
  const db = await getDatabase();
  const program = await db.getFirstAsync<Program>(
    'SELECT * FROM programs WHERE id = ?',
    [id]
  );
  return program || null;
};

/**
 * Gets a program with all its sessions
 */
export const getProgramWithSessions = async (id: number): Promise<ProgramWithSessions | null> => {
  const db = await getDatabase();
  const program = await getProgramById(id);
  if (!program) return null;

  const sessions = await db.getAllAsync<Session>(
    'SELECT * FROM sessions WHERE program_id = ? ORDER BY "order" ASC',
    [id]
  );

  return {
    ...program,
    sessions,
  };
};

/**
 * Creates a new program
 */
export const createProgram = async (params: CreateProgramParams): Promise<number> => {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO programs (name, type, duration_weeks, sessions_per_week, difficulty_level, description, objective)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      params.name,
      params.type,
      params.duration_weeks,
      params.sessions_per_week,
      params.difficulty_level,
      params.description || null,
      params.objective || null
    ]
  );
  return result.lastInsertRowId;
};

/**
 * Updates an existing program
 */
export const updateProgram = async (
  id: number,
  params: Partial<Omit<CreateProgramParams, 'type'>>
): Promise<void> => {
  const db = await getDatabase();

  const updates: string[] = ['updated_at = CURRENT_TIMESTAMP'];
  const values: any[] = [];

  if (params.name !== undefined) {
    updates.push('name = ?');
    values.push(params.name);
  }

  if (params.duration_weeks !== undefined) {
    updates.push('duration_weeks = ?');
    values.push(params.duration_weeks);
  }

  if (params.sessions_per_week !== undefined) {
    updates.push('sessions_per_week = ?');
    values.push(params.sessions_per_week);
  }

  if (params.difficulty_level !== undefined) {
    updates.push('difficulty_level = ?');
    values.push(params.difficulty_level);
  }

  if (params.description !== undefined) {
    updates.push('description = ?');
    values.push(params.description);
  }

  if (params.objective !== undefined) {
    updates.push('objective = ?');
    values.push(params.objective);
  }

  values.push(id);
  await db.runAsync(
    `UPDATE programs SET ${updates.join(', ')} WHERE id = ?`,
    values
  );
};

/**
 * Deletes a program and all its associated sessions
 */
export const deleteProgram = async (id: number): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM programs WHERE id = ?', [id]);
};

/**
 * Gets programs by difficulty level
 */
export const getProgramsByLevel = async (level: string): Promise<Program[]> => {
  const db = await getDatabase();
  const programs = await db.getAllAsync<Program>(
    'SELECT * FROM programs WHERE difficulty_level = ? ORDER BY created_at DESC',
    [level]
  );
  return programs;
};

/**
 * Gets programs by type
 */
export const getProgramsByType = async (type: string): Promise<Program[]> => {
  const db = await getDatabase();
  const programs = await db.getAllAsync<Program>(
    'SELECT * FROM programs WHERE type = ? ORDER BY created_at DESC',
    [type]
  );
  return programs;
};

/**
 * Gets programs by objective
 */
export const getProgramsByObjective = async (objective: string): Promise<Program[]> => {
  const db = await getDatabase();
  const programs = await db.getAllAsync<Program>(
    'SELECT * FROM programs WHERE objective = ? ORDER BY created_at DESC',
    [objective]
  );
  return programs;
};

/**
 * Searches programs by name
 */
export const searchPrograms = async (query: string): Promise<Program[]> => {
  const db = await getDatabase();
  const programs = await db.getAllAsync<Program>(
    'SELECT * FROM programs WHERE name LIKE ? ORDER BY created_at DESC',
    [`%${query}%`]
  );
  return programs;
};

/**
 * Counts total programs
 */
export const countPrograms = async (): Promise<number> => {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM programs'
  );
  return result?.count || 0;
};

/**
 * Counts sessions in a program
 */
export const countProgramSessions = async (programId: number): Promise<number> => {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM sessions WHERE program_id = ?',
    [programId]
  );
  return result?.count || 0;
};
