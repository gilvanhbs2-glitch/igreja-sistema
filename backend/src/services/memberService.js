import db from '../db/database.js';

const tableInfo = db.prepare('PRAGMA table_info(members)').all();
if (!tableInfo.some((col) => col.name === 'role')) {
  db.exec('ALTER TABLE members ADD COLUMN role TEXT');
}
if (!tableInfo.some((col) => col.name === 'photo_data')) {
  db.exec('ALTER TABLE members ADD COLUMN photo_data TEXT');
}

const listStmt = db.prepare(`
  SELECT * FROM members
  ORDER BY created_at DESC
`);

const getByIdStmt = db.prepare(`SELECT * FROM members WHERE id = ?`);
const getByCodeStmt = db.prepare(`SELECT * FROM members WHERE member_code = ?`);
const insertStmt = db.prepare(`
  INSERT INTO members (
    member_code, full_name, birth_date, cpf, rg,
    baptism_date, address, marital_status, congregation, role, photo_data,
    created_at, updated_at
  ) VALUES (
    @member_code, @full_name, @birth_date, @cpf, @rg,
    @baptism_date, @address, @marital_status, @congregation, @role, @photo_data,
    @created_at, @updated_at
  )
`);
const updateStmt = db.prepare(`
  UPDATE members SET
    full_name = @full_name,
    birth_date = @birth_date,
    cpf = @cpf,
    rg = @rg,
    baptism_date = @baptism_date,
    address = @address,
    marital_status = @marital_status,
    congregation = @congregation,
    role = @role,
    photo_data = @photo_data,
    updated_at = @updated_at
  WHERE id = @id
`);
const deleteStmt = db.prepare(`DELETE FROM members WHERE id = ?`);

function pad(n) {
  return String(n).padStart(2, '0');
}

function generateMemberCode() {
  const now = new Date();
  const year = now.getFullYear();
  const serial = `${now.getHours()}${pad(now.getMinutes())}${pad(now.getSeconds())}${Math.floor(Math.random() * 90 + 10)}`;
  return `MEM-${year}-${serial}`;
}

export function listMembers() {
  return listStmt.all();
}

export function getMemberById(id) {
  return getByIdStmt.get(id);
}

export function getMemberByCode(code) {
  return getByCodeStmt.get(code);
}

export function createMember(data) {
  const now = new Date().toISOString();
  const payload = {
    member_code: generateMemberCode(),
    full_name: (data.full_name || '').trim(),
    birth_date: data.birth_date || '',
    cpf: data.cpf || '',
    rg: data.rg || '',
    baptism_date: data.baptism_date || '',
    address: data.address || '',
    marital_status: data.marital_status || '',
    congregation: data.congregation || '',
    role: (data.role || 'Membro').trim(),
    photo_data: data.photo_data || '',
    created_at: now,
    updated_at: now,
  };

  if (!payload.full_name) throw new Error('Nome completo é obrigatório.');

  const result = insertStmt.run(payload);
  return getByIdStmt.get(result.lastInsertRowid);
}

export function updateMember(id, data) {
  const existing = getByIdStmt.get(id);
  if (!existing) throw new Error('Membro não encontrado.');

  const payload = {
    id,
    full_name: (data.full_name || '').trim(),
    birth_date: data.birth_date || '',
    cpf: data.cpf || '',
    rg: data.rg || '',
    baptism_date: data.baptism_date || '',
    address: data.address || '',
    marital_status: data.marital_status || '',
    congregation: data.congregation || '',
    role: (data.role || 'Membro').trim(),
    photo_data: data.photo_data || existing.photo_data || '',
    updated_at: new Date().toISOString(),
  };

  if (!payload.full_name) throw new Error('Nome completo é obrigatório.');
  updateStmt.run(payload);
  return getByIdStmt.get(id);
}

export function deleteMember(id) {
  deleteStmt.run(id);
}
