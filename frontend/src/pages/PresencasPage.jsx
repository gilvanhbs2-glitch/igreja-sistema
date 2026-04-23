import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function PresencasPage() {
  const [presences, setPresences] = useState([]);
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  async function load() {
    const data = await api.listPresences();
    setPresences(data);
  }

  useEffect(() => {
    load().catch((error) => setMessage(error.message));
  }, []);

  async function handleManualRegister(e) {
    e.preventDefault();
    try {
      const result = await api.registerPresence(code);
      setMessage(result.message);
      setCode('');
      await load();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="page-stack">
      <div className="page-header refined-header">
        <span className="eyebrow">Registro diário</span>
        <h1>Presenças</h1>
        <p>Histórico do que foi lido pelo QR Code e registro manual para testes.</p>
      </div>
      {message && <div className="notice">{message}</div>}
      <form className="card manual-form polished-manual-form" onSubmit={handleManualRegister}>
        <input placeholder="Digite ou cole o código do membro (ex.: MEM-2026-123456)" value={code} onChange={(e) => setCode(e.target.value)} />
        <button className="btn primary" type="submit">Registrar presença</button>
      </form>
      <div className="card panel-card">
        <div className="section-head">
          <div>
            <span className="eyebrow">Histórico</span>
            <h2>Últimas presenças</h2>
          </div>
        </div>
        <div className="list-stack clean-list">
          {presences.length === 0 ? <p className="muted">Nenhuma presença registrada.</p> : presences.map((item) => (
            <div key={item.id} className="list-row">
              <div>
                <strong>{item.full_name}</strong>
                <small>{item.congregation || 'Congregação não informada'}</small>
              </div>
              <span className="soft-pill time-pill">{new Date(item.scanned_at).toLocaleString('pt-BR')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
