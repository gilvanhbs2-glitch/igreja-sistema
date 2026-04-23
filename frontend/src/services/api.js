const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3333/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    throw new Error(data.error || 'Erro na requisição.');
  }

  return data;
}

export const api = {
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  listMembers: () => request('/members'),
  createMember: (payload) => request('/members', { method: 'POST', body: JSON.stringify(payload) }),
  updateMember: (id, payload) => request(`/members/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteMember: (id) => request(`/members/${id}`, { method: 'DELETE' }),
  listPresences: () => request('/presences'),
  registerPresence: (codigo) => request('/presences', { method: 'POST', body: JSON.stringify({ codigo }) }),
};
