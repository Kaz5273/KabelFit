import { getDatabase } from './index';
import type { CreateExerciseParams, Exercise } from './types';

/**
 * Récupère tous les exercices
 */
export const getAllExercises = async (): Promise<Exercise[]> => {
  const db = await getDatabase();
  const exercises = await db.getAllAsync<Exercise>(
    'SELECT * FROM exercises ORDER BY category, name'
  );
  return exercises;
};

/**
 * Récupère les exercices par catégorie
 */
export const getExercisesByCategory = async (category: string): Promise<Exercise[]> => {
  const db = await getDatabase();
  const exercises = await db.getAllAsync<Exercise>(
    'SELECT * FROM exercises WHERE category = ? ORDER BY name',
    [category]
  );
  return exercises;
};

/**
 * Récupère uniquement les exercices personnalisés
 */
export const getCustomExercises = async (): Promise<Exercise[]> => {
  const db = await getDatabase();
  const exercises = await db.getAllAsync<Exercise>(
    'SELECT * FROM exercises WHERE is_custom = 1 ORDER BY name'
  );
  return exercises;
};

/**
 * Récupère un exercice par son ID
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
 * Crée un nouvel exercice
 */
export const createExercise = async (params: CreateExerciseParams): Promise<number> => {
  const db = await getDatabase();
  const result = await db.runAsync(
    'INSERT INTO exercises (name, description, category, is_custom) VALUES (?, ?, ?, ?)',
    [
      params.name,
      params.description || null,
      params.category || null,
      params.is_custom ? 1 : 0
    ]
  );
  return result.lastInsertRowId;
};

/**
 * Met à jour un exercice existant
 */
export const updateExercise = async (
  id: number,
  params: Partial<CreateExerciseParams>
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

  if (params.category !== undefined) {
    updates.push('category = ?');
    values.push(params.category);
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
 * Supprime un exercice
 * Attention: échouera si l'exercice est utilisé dans des séances
 */
export const deleteExercise = async (id: number): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM exercises WHERE id = ?', [id]);
};

/**
 * Recherche des exercices par nom
 */
export const searchExercises = async (query: string): Promise<Exercise[]> => {
  const db = await getDatabase();
  const exercises = await db.getAllAsync<Exercise>(
    'SELECT * FROM exercises WHERE name LIKE ? ORDER BY name',
    [`%${query}%`]
  );
  return exercises;
};
