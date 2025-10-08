import { getDatabase } from './index';
import type { CreateProgramParams, Program } from './types';

/**
 * Récupère tous les programmes
 */
export const getAllPrograms = async (): Promise<Program[]> => {
  const db = await getDatabase();
  const programs = await db.getAllAsync<Program>(
    'SELECT * FROM programs ORDER BY created_at DESC'
  );
  return programs;
};

/**
 * Récupère un programme par son ID
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
 * Crée un nouveau programme
 */
export const createProgram = async (params: CreateProgramParams): Promise<number> => {
  const db = await getDatabase();
  const result = await db.runAsync(
    'INSERT INTO programs (name, description) VALUES (?, ?)',
    [params.name, params.description || null]
  );
  return result.lastInsertRowId;
};

/**
 * Met à jour un programme existant
 */
export const updateProgram = async (
  id: number,
  params: Partial<CreateProgramParams>
): Promise<void> => {
  const db = await getDatabase();
  
  const updates: string[] = [];
  const values: any[] = [];

  if (params.name !== undefined) {
    updates.push('name = ?');
    values.push(params.name);
  }

  if (params.description !== undefined) {
    updates.push('description = ?');
    values.push(params.description);
  }

  if (updates.length > 0) {
    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    await db.runAsync(
      `UPDATE programs SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
  }
};

/**
 * Supprime un programme et toutes ses séances associées
 */
export const deleteProgram = async (id: number): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM programs WHERE id = ?', [id]);
};

/**
 * Compte le nombre de séances dans un programme
 */
export const countProgramSessions = async (programId: number): Promise<number> => {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM sessions WHERE program_id = ?',
    [programId]
  );
  return result?.count || 0;
};
