import * as SQLite from 'expo-sqlite';

// Database name
const DATABASE_NAME = 'kabelfit.db';

// Singleton database instance
let db: SQLite.SQLiteDatabase | null = null;

/**
 * Initializes and returns the database instance
 * Creates the database if it doesn't exist
 */
export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) {
    return db;
  }

  db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  return db;
};

/**
 * Initializes all database tables
 * Should be called at application startup
 */
export const initDatabase = async (): Promise<void> => {
  const database = await getDatabase();

  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      age INTEGER,
      weight REAL,
      height REAL,
      objective TEXT,
      level TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

    -- Articles table
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      image_url TEXT,
      published_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_articles_date ON articles(published_at);

    -- Programs table
    CREATE TABLE IF NOT EXISTS programs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      duration_weeks INTEGER NOT NULL,
      sessions_per_week INTEGER NOT NULL,
      difficulty_level TEXT NOT NULL,
      description TEXT,
      objective TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_programs_level ON programs(difficulty_level);
    CREATE INDEX IF NOT EXISTS idx_programs_type ON programs(type);

    -- Sessions table
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      program_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      day_of_week TEXT,
      duration_minutes INTEGER NOT NULL,
      description TEXT,
      "order" INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_program ON sessions(program_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_order ON sessions(program_id, "order");

    -- Exercises table
    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      muscle_group TEXT,
      sets INTEGER,
      reps INTEGER,
      rest_minutes REAL,
      illustration_url TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_exercises_session ON exercises(session_id);
    CREATE INDEX IF NOT EXISTS idx_exercises_muscle_group ON exercises(muscle_group);

    -- Session exercises table (for many-to-many relationship)
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
    CREATE INDEX IF NOT EXISTS idx_session_exercises_exercise ON session_exercises(exercise_id);

    -- Program-User association table
    CREATE TABLE IF NOT EXISTS program_user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      program_id INTEGER NOT NULL,
      start_date DATETIME NOT NULL,
      end_date DATETIME,
      completed INTEGER DEFAULT 0,
      progression INTEGER DEFAULT 0,
      user_comment TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_program_user_user ON program_user(user_id);
    CREATE INDEX IF NOT EXISTS idx_program_user_program ON program_user(program_id);

    -- Session-User association table
    CREATE TABLE IF NOT EXISTS session_user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      session_id INTEGER NOT NULL,
      program_user_id INTEGER NOT NULL,
      completed_at DATETIME NOT NULL,
      completed INTEGER DEFAULT 0,
      difficulty_rating INTEGER,
      actual_duration INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
      FOREIGN KEY (program_user_id) REFERENCES program_user(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_session_user_user ON session_user(user_id);
    CREATE INDEX IF NOT EXISTS idx_session_user_session ON session_user(session_id);
    CREATE INDEX IF NOT EXISTS idx_session_user_program ON session_user(program_user_id);
    CREATE INDEX IF NOT EXISTS idx_session_user_date ON session_user(completed_at);

    -- Exercise-User association table
    CREATE TABLE IF NOT EXISTS exercise_user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      exercise_id INTEGER NOT NULL,
      session_user_id INTEGER NOT NULL,
      completed_at DATETIME NOT NULL,
      completed INTEGER DEFAULT 0,
      sets_completed INTEGER,
      reps_completed INTEGER,
      comment TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE,
      FOREIGN KEY (session_user_id) REFERENCES session_user(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_exercise_user_user ON exercise_user(user_id);
    CREATE INDEX IF NOT EXISTS idx_exercise_user_exercise ON exercise_user(exercise_id);
    CREATE INDEX IF NOT EXISTS idx_exercise_user_session ON exercise_user(session_user_id);
    CREATE INDEX IF NOT EXISTS idx_exercise_user_date ON exercise_user(completed_at);

    -- Session logs table (for tracking workout sessions)
    CREATE TABLE IF NOT EXISTS session_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      start_time DATETIME NOT NULL,
      end_time DATETIME,
      status TEXT DEFAULT 'in_progress',
      total_time INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_session_logs_session ON session_logs(session_id);
    CREATE INDEX IF NOT EXISTS idx_session_logs_status ON session_logs(status);

    -- Rep logs table (for tracking individual reps)
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

    -- Comments table (for session/exercise comments)
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
  `);
};

/**
 * Inserts demo data for development
 */
export const seedDatabase = async (): Promise<void> => {
  const database = await getDatabase();

  // Check if data already exists
  const result = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM programs'
  );

  if (result && result.count > 0) {
    return; // Data already present
  }

  // Insert sample articles
  await database.execAsync(`
    INSERT INTO articles (title, content, image_url) VALUES
      ('Welcome to KabelFit', 'Start your transformation today with our programs adapted to all levels.', null),
      ('The importance of warming up', 'A good warm-up prepares your muscles and reduces the risk of injury. Take 5-10 minutes before each session.', null),
      ('Nutrition and muscle building', 'Diet represents 70% of your results. Make sure to consume enough protein.', null);
  `);

  // Insert sample program
  await database.execAsync(`
    INSERT INTO programs (name, type, duration_weeks, sessions_per_week, difficulty_level, description, objective) VALUES
      ('Full Body Beginner', 'Strength', 8, 3, 'Beginner', 'Complete program for beginners in strength training', 'Get fit');
  `);

  // Insert sample sessions
  await database.execAsync(`
    INSERT INTO sessions (program_id, name, day_of_week, duration_minutes, description, "order") VALUES
      (1, 'Upper Body Session', 'Monday', 45, 'Chest, back and arms workout', 1),
      (1, 'Lower Body Session', 'Wednesday', 45, 'Legs and glutes workout', 2),
      (1, 'Full Body Session', 'Friday', 50, 'Complete body workout', 3);
  `);

  // Insert sample exercises
  await database.execAsync(`
    INSERT INTO exercises (session_id, name, muscle_group, sets, reps, rest_minutes, description) VALUES
      (1, 'Push-ups', 'Chest', 3, 12, 1.5, 'Basic upper body exercise'),
      (1, 'Pull-ups', 'Back', 3, 8, 2, 'Exercise to develop the back'),
      (2, 'Squats', 'Legs', 4, 15, 2, 'Basic leg exercise'),
      (2, 'Lunges', 'Legs', 3, 12, 1.5, 'Exercise for thighs and glutes'),
      (3, 'Burpees', 'Full Body', 3, 10, 2, 'Complete cardio exercise');
  `);
};

/**
 * Completely resets the database
 * Warning: deletes all data
 */
export const resetDatabase = async (): Promise<void> => {
  const database = await getDatabase();

  await database.execAsync(`
    DROP TABLE IF EXISTS comments;
    DROP TABLE IF EXISTS rep_logs;
    DROP TABLE IF EXISTS session_logs;
    DROP TABLE IF EXISTS exercise_user;
    DROP TABLE IF EXISTS session_user;
    DROP TABLE IF EXISTS program_user;
    DROP TABLE IF EXISTS session_exercises;
    DROP TABLE IF EXISTS exercises;
    DROP TABLE IF EXISTS sessions;
    DROP TABLE IF EXISTS programs;
    DROP TABLE IF EXISTS articles;
    DROP TABLE IF EXISTS users;
  `);

  await initDatabase();
  await seedDatabase();
};

// Export services
export * from './userService';
export * from './programService';
export * from './sessionService';
export * from './exerciseService';
export * from './logService';
export * from './programUserService';
export * from './sessionUserService';
export * from './exerciseUserService';
export * from './types';
