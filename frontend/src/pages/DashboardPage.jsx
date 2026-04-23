import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

export default function DashboardPage() {
  const [members, setMembers] = useState([]);
  const [presences, setPresences] = useState([]);

  useEffect(() => {
    api.listMembers().then(setMembers).catch(() => setMembers([]));
    api.listPresences().then(setPresences).catch(() => setPresences([]));
  }, []);

  const congregations = useMemo(
    () => new Set(members.map((item) => item.congregation).filter(Boolean)).size,
    [members],
  );

  const recentMembers = members.slice(0, 5);
  const recentPresences = presences.slice(0, 5);

  return (
    <div className="page-stack">
      <section className="hero card hero-dashboard clean-hero">
        <div>
          <span className="eyebrow">Painel principal</span>
          <h1>Bem-vindo ao Sistema de Membros da IPDA Sede Central Pinhais</h1>
          <p>R. Leila Diniz, 174 - Maria Antonieta - Pinhais - PR</p>
        </div>
      </section>

      <section className="stats-grid refined-stats">
        <article className="stat green">
          <span>Total de membros</span>
          <strong>{members.length}</strong>
          <small>Cadastros ativos no sistema.</small>
        </article>
        <article className="stat yellow">
          <span>Congregações</span>
          <strong>{congregations}</strong>
          <small>Locais informados nos cadastros.</small>
        </article>
        <article className="stat red">
          <span>Presenças lançadas</span>
          <strong>{presences.length}</strong>
          <small>Histórico total registrado.</small>
        </article>
      </section>

      <section className="dashboard-grid">
        <div className="card panel-card">
          <div className="section-head">
            <div>
              <span className="eyebrow">Cadastro</span>
              <h2>Últimos membros</h2>
            </div>
          </div>
          {recentMembers.length === 0 ? (
            <p className="muted">Nenhum membro cadastrado ainda.</p>
          ) : (
            <div className="list-stack clean-list">
              {recentMembers.map((member) => (
                <div key={member.id} className="list-row">
                  <div>
                    <strong>{member.full_name}</strong>
                    <small>{member.role || 'Membro'} • {member.congregation || 'Congregação não informada'}</small>
                  </div>
                  <span className="soft-pill">{member.member_code}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card panel-card">
          <div className="section-head">
            <div>
              <span className="eyebrow">Presença</span>
              <h2>Últimos registros</h2>
            </div>
          </div>
          {recentPresences.length === 0 ? (
            <p className="muted">Nenhuma presença registrada até o momento.</p>
          ) : (
            <div className="list-stack clean-list">
              {recentPresences.map((item) => (
                <div key={item.id} className="list-row">
                  <div>
                    <strong>{item.full_name}</strong>
                    <small>{item.congregation || 'Congregação não informada'}</small>
                  </div>
                  <span className="soft-pill time-pill">{new Date(item.scanned_at).toLocaleString('pt-BR')}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
