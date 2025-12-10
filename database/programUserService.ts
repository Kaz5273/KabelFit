import { getDatabase } from './index';
import { ProgramUser, CreateProgramUserParams } from './types';

/**
 * Associates a program with a user
 */
export const createProgramUser = async (params: CreateProgramUserParams): Promise<number> => {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO program_user (user_id, program_id, start_date, end_date)
     VALUES (?, ?, ?, ?)`,
    [
      params.user_id,
      params.program_id,
      params.start_date,
      params.end_date ?? null
    ]
  );
  return result.lastInsertRowId;
};

/**
 * Gets a program-user association by ID
 */
export const getProgramUserById = async (id: number): Promise<ProgramUser | null> => {
  const db = await getDatabase();
  const programUser = await db.getFirstAsync<ProgramUser>(
    'SELECT * FROM program_user WHERE id = ?',
    [id]
  );
  return programUser ?? null;
};

/**
 * Gets all programs for a user
 */
export const getProgramsByUser = async (userId: number): Promise<ProgramUser[]> => {
  const db = await getDatabase();
  const programs = await db.getAllAsync<ProgramUser>(
    'SELECT * FROM program_user WHERE user_id = ? ORDER BY start_date DESC',
    [userId]
  );
  return programs;
};

/**
 * Gets active programs for a user (not completed)
 */
export const getActiveProgramsByUser = async (userId: number): Promise<ProgramUser[]> => {
  const db = await getDatabase();
  const programs = await db.getAllAsync<ProgramUser>(
    'SELECT * FROM program_user WHERE user_id = ? AND completed = 0 ORDER BY start_date DESC',
    [userId]
  );
  return programs;
};

/**
 * Gets completed programs for a user
 */
export const getCompletedProgramsByUser = async (userId: number): Promise<ProgramUser[]> => {
  const db = await getDatabase();
  const programs = await db.getAllAsync<ProgramUser>(
    'SELECT * FROM program_user WHERE user_id = ? AND completed = 1 ORDER BY end_date DESC',
    [userId]
  );
  return programs;
};

/**
 * Gets all users following a program
 */
export const getUsersByProgram = async (programId: number): Promise<ProgramUser[]> => {
  const db = await getDatabase();
  const users = await db.getAllAsync<ProgramUser>(
    'SELECT * FROM program_user WHERE program_id = ? ORDER BY start_date DESC',
    [programId]
  );
  return users;
};

/**
 * Updates a program-user association
 */
export const updateProgramUser = async (
  id: number,
  updates: Partial<Omit<ProgramUser, 'id' | 'user_id' | 'program_id'>>
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
    `UPDATE program_user SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
};

/**
 * Updates user progression on a program
 */
export const updateProgression = async (id: number, progression: number): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE program_user SET progression = ? WHERE id = ?',
    [progression, id]
  );
};

/**
 * Marks a program as completed
 */
export const markProgramAsCompleted = async (id: number, endDate?: string): Promise<void> => {
  const db = await getDatabase();
  const date = endDate ?? new Date().toISOString();
  await db.runAsync(
    'UPDATE program_user SET completed = 1, end_date = ?, progression = 100 WHERE id = ?',
    [date, id]
  );
};

/**
 * Deletes a program-user association
 */
export const deleteProgramUser = async (id: number): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM program_user WHERE id = ?', [id]);
};

/**
 * Counts programs followed by a user
 */
export const countProgramsByUser = async (userId: number): Promise<number> => {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM program_user WHERE user_id = ?',
    [userId]
  );
  return result?.count ?? 0;
};

/**
 * Checks if a user is already following a specific program
 */
export const isUserFollowingProgram = async (userId: number, programId: number): Promise<boolean> => {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM program_user WHERE user_id = ? AND program_id = ? AND completed = 0',
    [userId, programId]
  );
  return (result?.count ?? 0) > 0;
};
