import * as SQLite from 'expo-sqlite';

// Nom de la base de données
const DATABASE_NAME = 'kabelfit.db';

// Instance unique de la base de données
let db: SQLite.SQLiteDatabase | null = null;

/**
 * Initialise et retourne l'instance de la base de données
 * Crée la base si elle n'existe pas déjà
 */
export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) {
    return db;
  }

  db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  return db;
};

/**
 * Initialise toutes les tables de la base de données
 * Doit être appelé au démarrage de l'application
 */
export const initDatabase = async (): Promise<void> => {
  const database = await getDatabase();

  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    -- Table des programmes d'entraînement
    CREATE TABLE IF NOT EXISTS programs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Index pour améliorer les performances de recherche
    CREATE INDEX IF NOT EXISTS idx_programs_created_at ON programs(created_at);

    -- Table des exercices (bibliothèque globale)
    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT,
      is_custom INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_exercises_category ON exercises(category);
    CREATE INDEX IF NOT EXISTS idx_exercises_custom ON exercises(is_custom);

    -- Table des séances planifiées
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      program_id INTEGER,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('AMRAP', 'HIIT', 'EMOM')),
      duration INTEGER NOT NULL,
      scheduled_date DATETIME,
      recurrence_pattern TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_program ON sessions(program_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(scheduled_date);
    CREATE INDEX IF NOT EXISTS idx_sessions_type ON sessions(type);

    -- Table de liaison entre séances et exercices
    CREATE TABLE IF NOT EXISTS session_exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      exercise_id INTEGER NOT NULL,
      exercise_order INTEGER NOT NULL,
      sets INTEGER,
      reps INTEGER,
      rest_time INTEGER,
      FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
      FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_session_exercises_session ON session_exercises(session_id);
    CREATE INDEX IF NOT EXISTS idx_session_exercises_order ON session_exercises(session_id, exercise_order);

    -- Table des logs de séances effectuées
    CREATE TABLE IF NOT EXISTS session_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      start_time DATETIME NOT NULL,
      end_time DATETIME,
      status TEXT DEFAULT 'in_progress' CHECK(status IN ('in_progress', 'completed', 'abandoned')),
      total_time INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_session_logs_session ON session_logs(session_id);
    CREATE INDEX IF NOT EXISTS idx_session_logs_date ON session_logs(start_time);
    CREATE INDEX IF NOT EXISTS idx_session_logs_status ON session_logs(status);

    -- Table des répétitions enregistrées pendant une séance
    CREATE TABLE IF NOT EXISTS rep_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      log_id INTEGER NOT NULL,
      exercise_id INTEGER NOT NULL,
      set_number INTEGER NOT NULL,
      reps_completed INTEGER NOT NULL,
      time_seconds INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (log_id) REFERENCES session_logs(id) ON DELETE CASCADE,
      FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_rep_logs_log ON rep_logs(log_id);
    CREATE INDEX IF NOT EXISTS idx_rep_logs_exercise ON rep_logs(exercise_id);

    -- Table des commentaires sur les séances
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      log_id INTEGER NOT NULL,
      exercise_id INTEGER,
      text TEXT,
      audio_path TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (log_id) REFERENCES session_logs(id) ON DELETE CASCADE,
      FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS idx_comments_log ON comments(log_id);
    CREATE INDEX IF NOT EXISTS idx_comments_exercise ON comments(exercise_id);
  `);
};

/**
 * Insère des données de démonstration pour faciliter le développement
 */
export const seedDatabase = async (): Promise<void> => {
  const database = await getDatabase();

  // Vérifie si des données existent déjà
  const result = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM exercises'
  );

  if (result && result.count > 0) {
    return; // Données déjà présentes
  }

  // Insertion des exercices prédéfinis
  await database.execAsync(`
    INSERT INTO exercises (name, description, category, is_custom) VALUES
      ('Pompes', 'Exercice de musculation pour le haut du corps', 'Force', 0),
      ('Squats', 'Exercice pour les jambes et fessiers', 'Force', 0),
      ('Burpees', 'Exercice cardio complet', 'Cardio', 0),
      ('Tractions', 'Exercice pour le dos et les bras', 'Force', 0),
      ('Abdos', 'Exercice pour la sangle abdominale', 'Core', 0),
      ('Jumping Jacks', 'Exercice cardio pour échauffement', 'Cardio', 0),
      ('Planche', 'Exercice isométrique pour le core', 'Core', 0),
      ('Fentes', 'Exercice pour les jambes', 'Force', 0),
      ('Mountain Climbers', 'Exercice cardio et core', 'Cardio', 0),
      ('Dips', 'Exercice pour triceps et pectoraux', 'Force', 0);
  `);
};

/**
 * Réinitialise complètement la base de données
 * Attention: supprime toutes les données
 */
export const resetDatabase = async (): Promise<void> => {
  const database = await getDatabase();

  await database.execAsync(`
    DROP TABLE IF EXISTS comments;
    DROP TABLE IF EXISTS rep_logs;
    DROP TABLE IF EXISTS session_logs;
    DROP TABLE IF EXISTS session_exercises;
    DROP TABLE IF EXISTS sessions;
    DROP TABLE IF EXISTS exercises;
    DROP TABLE IF EXISTS programs;
  `);

  await initDatabase();
  await seedDatabase();
};

// Export des services
export * from './exerciseService';
export * from './logService';
export * from './programService';
export * from './sessionService';
export * from './types';

