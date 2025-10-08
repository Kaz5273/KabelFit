import { getDatabase } from './index';
import type {
    CreateSessionParams,
    Exercise,
    Session,
    SessionExercise,
    SessionWithExercises
} from './types';

/**
 * Récupère toutes les séances
 */
export const getAllSessions = async (): Promise<Session[]> => {
  const db = await getDatabase();
  const sessions = await db.getAllAsync<Session>(
    'SELECT * FROM sessions ORDER BY scheduled_date DESC, created_at DESC'
  );
  return sessions;
};

/**
 * Récupère les séances d'un programme spécifique
 */
export const getSessionsByProgram = async (programId: number): Promise<Session[]> => {
  const db = await getDatabase();
  const sessions = await db.getAllAsync<Session>(
    'SELECT * FROM sessions WHERE program_id = ? ORDER BY scheduled_date DESC',
    [programId]
  );
  return sessions;
};

/**
 * Récupère une séance par son ID
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
 * Récupère une séance complète avec tous ses exercices
 */
export const getSessionWithExercises = async (id: number): Promise<SessionWithExercises | null> => {
  const db = await getDatabase();
  
  const session = await getSessionById(id);
  if (!session) {
    return null;
  }

  // Récupère les exercices de la séance avec leurs détails
  const exercises = await db.getAllAsync<SessionExercise & Exercise>(
    `SELECT 
      se.id,
      se.session_id,
      se.exercise_id,
      se.exercise_order,
      se.sets,
      se.reps,
      se.rest_time,
      e.name,
      e.description,
      e.category,
      e.is_custom,
      e.created_at
    FROM session_exercises se
    INNER JOIN exercises e ON se.exercise_id = e.id
    WHERE se.session_id = ?
    ORDER BY se.exercise_order`,
    [id]
  );

  return {
    ...session,
    exercises
  };
};

/**
 * Crée une nouvelle séance avec ses exercices
 * Utilise une transaction pour garantir la cohérence des données
 */
export const createSession = async (params: CreateSessionParams): Promise<number> => {
  const db = await getDatabase();
  
  let sessionId: number = 0;

  // Utilise une transaction pour insérer la séance et ses exercices
  await db.withTransactionAsync(async () => {
    const result = await db.runAsync(
      `INSERT INTO sessions (program_id, name, type, duration, scheduled_date, recurrence_pattern) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        params.program_id || null,
        params.name,
        params.type,
        params.duration,
        params.scheduled_date || null,
        params.recurrence_pattern || null
      ]
    );

    sessionId = result.lastInsertRowId;

    // Insère tous les exercices de la séance
    for (const exercise of params.exercises) {
      await db.runAsync(
        `INSERT INTO session_exercises (session_id, exercise_id, exercise_order, sets, reps, rest_time) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          sessionId,
          exercise.exercise_id,
          exercise.order,
          exercise.sets || null,
          exercise.reps || null,
          exercise.rest_time || null
        ]
      );
    }
  });

  return sessionId;
};

/**
 * Met à jour une séance existante
 */
export const updateSession = async (
  id: number,
  params: Partial<Omit<CreateSessionParams, 'exercises'>>
): Promise<void> => {
  const db = await getDatabase();
  
  const updates: string[] = [];
  const values: any[] = [];

  if (params.program_id !== undefined) {
    updates.push('program_id = ?');
    values.push(params.program_id);
  }

  if (params.name !== undefined) {
    updates.push('name = ?');
    values.push(params.name);
  }

  if (params.type !== undefined) {
    updates.push('type = ?');
    values.push(params.type);
  }

  if (params.duration !== undefined) {
    updates.push('duration = ?');
    values.push(params.duration);
  }

  if (params.scheduled_date !== undefined) {
    updates.push('scheduled_date = ?');
    values.push(params.scheduled_date);
  }

  if (params.recurrence_pattern !== undefined) {
    updates.push('recurrence_pattern = ?');
    values.push(params.recurrence_pattern);
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
 * Supprime une séance et toutes ses données associées
 */
export const deleteSession = async (id: number): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM sessions WHERE id = ?', [id]);
};

/**
 * Récupère les séances planifiées pour une période donnée
 */
export const getSessionsByDateRange = async (
  startDate: string,
  endDate: string
): Promise<Session[]> => {
  const db = await getDatabase();
  const sessions = await db.getAllAsync<Session>(
    `SELECT * FROM sessions 
     WHERE scheduled_date BETWEEN ? AND ? 
     ORDER BY scheduled_date`,
    [startDate, endDate]
  );
  return sessions;
};

/**
 * Récupère les prochaines séances planifiées
 */
export const getUpcomingSessions = async (limit: number = 10): Promise<Session[]> => {
  const db = await getDatabase();
  const now = new Date().toISOString();
  const sessions = await db.getAllAsync<Session>(
    `SELECT * FROM sessions 
     WHERE scheduled_date >= ? 
     ORDER BY scheduled_date 
     LIMIT ?`,
    [now, limit]
  );
  return sessions;
};
