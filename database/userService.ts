import { getDatabase } from './index';
import { User, CreateUserParams } from './types';

/**
 * Creates a new user
 */
export const createUser = async (params: CreateUserParams): Promise<number> => {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO users (username, email, password, age, weight, height, objective, level)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    params.username,
    params.email,
    params.password,
    params.age ?? null,
    params.weight ?? null,
    params.height ?? null,
    params.objective ?? null,
    params.level ?? null
  );
  return result.lastInsertRowId;
};

/**
 * Gets a user by ID
 */
export const getUserById = async (id: number): Promise<User | null> => {
  const db = await getDatabase();
  const user = await db.getFirstAsync<User>(
    'SELECT * FROM users WHERE id = ?',
    id
  );
  return user ?? null;
};

/**
 * Gets a user by email
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const db = await getDatabase();
  const user = await db.getFirstAsync<User>(
    'SELECT * FROM users WHERE email = ?',
    email
  );
  return user ?? null;
};

/**
 * Gets a user by username
 */
export const getUserByUsername = async (username: string): Promise<User | null> => {
  const db = await getDatabase();
  const user = await db.getFirstAsync<User>(
    'SELECT * FROM users WHERE username = ?',
    username
  );
  return user ?? null;
};

/**
 * Gets all users
 */
export const getAllUsers = async (): Promise<User[]> => {
  const db = await getDatabase();
  const users = await db.getAllAsync<User>('SELECT * FROM users ORDER BY created_at DESC');
  return users;
};

/**
 * Updates user information
 */
export const updateUser = async (
  id: number,
  updates: Partial<Omit<User, 'id' | 'created_at'>>
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
    `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
    ...values
  );
};

/**
 * Deletes a user
 */
export const deleteUser = async (id: number): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM users WHERE id = ?', id);
};

/**
 * Checks if an email already exists
 */
export const emailExists = async (email: string): Promise<boolean> => {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM users WHERE email = ?',
    email
  );
  return (result?.count ?? 0) > 0;
};

/**
 * Checks if a username already exists
 */
export const usernameExists = async (username: string): Promise<boolean> => {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM users WHERE username = ?',
    username
  );
  return (result?.count ?? 0) > 0;
};
