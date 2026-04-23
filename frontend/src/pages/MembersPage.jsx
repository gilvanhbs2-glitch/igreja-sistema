import { useEffect, useMemo, useState } from 'react';
import MemberForm from '../components/MemberForm';
import BadgeCard from '../components/BadgeCard';
import { api } from '../services/api';

function maskCpf(cpf) {
  if (!cpf) return '-';
  const digits = String(cpf).replace(/\D/g, '');
  if (digits.length !== 11) return cpf;
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState(null);

  async function load() {
    const data = await api.listMembers();
    setMembers(data);
  }

  useEffect(() => {
    load().catch((error) => setMessage(error.message));
  }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return members.filter((m) => [m.full_name, m.congregation, m.role, m.cpf].join(' ').toLowerCase().includes(term));
  }, [members, search]);

  async function handleUpdate(payload) {
    if (!selected) return;
    try {
      const updated = await api.updateMember(selected.id, payload);
      setMessage('Membro atualizado com sucesso.');
      await load();
      setSelected(updated);
      setMode('badge');
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="page-stack">
      <div className="page-header split refined-header">
        <div>
          <span className="eyebrow">Cadastro geral</span>
          <h1>Membros</h1>
          <p>Lista enxuta com nome, função, congregação, CPF e ações principais.</p>
        </div>
        <input
          className="search"
          placeholder="Buscar por nome, função, congregação ou CPF"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {message && <div className="notice">{message}</div>}
      <div className="members-grid members-simple-grid modern-members-grid">
        <div className="card table-card">
          <table className="table modern-table">
            <thead>
              <tr><th>Nome</th><th>Função</th><th>Congregação</th><th>CPF</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {filtered.map((member) => (
                <tr key={member.id}>
                  <td><strong>{member.full_name}</strong></td>
                  <td>{member.role || 'Membro'}</td>
                  <td>{member.congregation || '-'}</td>
                  <td>{maskCpf(member.cpf)}</td>
                  <td>
                    <div className="inline-actions">
                      <button className="btn small" onClick={() => { setSelected(member); setMode('badge'); }}>Ver crachá</button>
                      <button className="btn small ghost" onClick={() => { setSelected(member); setMode('edit'); }}>Editar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="side-column sticky-column">
          {!selected && (
            <div className="card empty-state-card">
              <h2>Selecione um membro</h2>
              <p className="muted">Use “Ver crachá” para visualizar o cartão ou “Editar” para alterar os dados.</p>
            </div>
          )}
          {selected && mode === 'badge' && (
            <div className="card preview-card">
              <div className="section-head">
                <div>
                  <span className="eyebrow">Visualização</span>
                  <h2>Crachá do membro</h2>
                </div>
              </div>
              <BadgeCard member={selected} compact />
            </div>
          )}
          {selected && mode === 'edit' && (
            <MemberForm initialValues={selected} onSubmit={handleUpdate} submitLabel="Salvar alterações" />
          )}
        </div>
      </div>
    </div>
  );
}
