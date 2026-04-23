import crypto from 'crypto';
import db from '../db/database.js';

const DEFAULT_ADMIN_EMAIL = process.env.IPDA_ADMIN_EMAIL || 'admin@ipda.local';
const DEFAULT_ADMIN_PASSWORD = process.env.IPDA_ADMIN_PASSWORD || '123456';
const DEFAULT_ADMIN_NAME = process.env.IPDA_ADMIN_NAME || 'Administrador IPDA';

function hashPassword(password) {
  return crypto.createHash('sha256').update(String(password)).digest('hex');
}

const findUserByEmailStmt = db.prepare(`
  SELECT id, full_name, email, role, password_hash, is_active, created_at, updated_at
  FROM users
  WHERE email = ?
  LIMIT 1
`);

const insertUserStmt = db.prepare(`
  INSERT INTO users (
    full_name,
    email,
    password_hash,
    role,
    is_active,
    created_at,
    updated_at
  ) VALUES (
    @full_name,
    @email,
    @password_hash,
    @role,
    @is_active,
    @created_at,
    @updated_at
  )
`);

export function ensureDefaultAdminUser() {
  const existing = findUserByEmailStmt.get(DEFAULT_ADMIN_EMAIL.toLowerCase());
  if (existing) return existing;

  const now = new Date().toISOString();
  const payload = {
    full_name: DEFAULT_ADMIN_NAME,
    email: DEFAULT_ADMIN_EMAIL.toLowerCase(),
    password_hash: hashPassword(DEFAULT_ADMIN_PASSWORD),
    role: 'admin',
    is_active: 1,
    created_at: now,
    updated_at: now,
  };

  insertUserStmt.run(payload);
  return findUserByEmailStmt.get(DEFAULT_ADMIN_EMAIL.toLowerCase());
}

export function authenticateUser(email, password) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedPassword = String(password || '');

  if (!normalizedEmail || !normalizedPassword) {
    throw new Error('Informe usuário e senha.');
  }

  const user = findUserByEmailStmt.get(normalizedEmail);
  if (!user || !user.is_active) {
    throw new Error('Usuário ou senha inválidos.');
  }

  const receivedHash = hashPassword(normalizedPassword);
  if (receivedHash !== user.password_hash) {
    throw new Error('Usuário ou senha inválidos.');
  }

  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
  };
}
