import db from '../db/database.js';
import { getMemberByCode } from './memberService.js';

const listStmt = db.prepare(`
  SELECT p.*, m.full_name, m.congregation
  FROM presences p
  INNER JOIN members m ON m.id = p.member_id
  ORDER BY p.scanned_at DESC
  LIMIT ?
`);

const lastForMemberStmt = db.prepare(`
  SELECT * FROM presences
  WHERE member_id = ?
  ORDER BY scanned_at DESC
  LIMIT 1
`);

const insertStmt = db.prepare(`
  INSERT INTO presences (member_id, member_code, scanned_at, scan_date, created_at)
  VALUES (@member_id, @member_code, @scanned_at, @scan_date, @created_at)
`);

function parseQrPayload(rawText) {
  const raw = String(rawText || '').trim();
  if (!raw) throw new Error('QR Code vazio.');

  try {
    const parsed = JSON.parse(raw);
    if (parsed.memberCode) return String(parsed.memberCode).toUpperCase();
  } catch {}

  const match = raw.match(/MEM-\d{4}-\d+/i);
  if (match) return match[0].toUpperCase();

  return raw.toUpperCase();
}

function canRegister(lastPresence, scannedAt) {
  if (!lastPresence) return true;
  const diffMinutes = (new Date(scannedAt) - new Date(lastPresence.scanned_at)) / 1000 / 60;
  return diffMinutes >= 5;
}

export function listPresences(limit = 50) {
  return listStmt.all(limit);
}

export function registerPresenceByQr(qrText) {
  const memberCode = parseQrPayload(qrText);
  const member = getMemberByCode(memberCode);
  if (!member) throw new Error('Membro não encontrado para este QR Code.');

  const scannedAt = new Date().toISOString();
  const lastPresence = lastForMemberStmt.get(member.id);

  if (!canRegister(lastPresence, scannedAt)) {
    return {
      status: 'duplicate',
      message: 'Presença já registrada há poucos minutos.',
      member,
      presence: lastPresence,
    };
  }

  const payload = {
    member_id: member.id,
    member_code: member.member_code,
    scanned_at: scannedAt,
    scan_date: scannedAt.slice(0, 10),
    created_at: scannedAt,
  };

  const result = insertStmt.run(payload);
  const presence = db.prepare('SELECT * FROM presences WHERE id = ?').get(result.lastInsertRowid);

  return {
    status: 'registered',
    message: 'Presença registrada com sucesso.',
    member,
    presence,
  };
}
