import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const redirectTo = location.state?.from || '/';

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    const result = await login(form.email, form.password);
    if (result.ok) {
      navigate(redirectTo, { replace: true });
      return;
    }
    setError(result.message || 'Não foi possível entrar.');
  }

  return (
    <div className="login-shell">
      <div className="login-wrapper">
        <section className="login-side card">
          <div className="login-side-header">
            <img src="/logo-ipda.png" alt="Igreja Pentecostal Deus é Amor" className="login-side-logo" />
            <span className="login-chip">IPDA • Sistema interno</span>
          </div>
          <h2>Controle de membros, crachás e presença em um painel só.</h2>
          <p>
            Acesse o sistema da igreja com uma estrutura simples, segura e pronta para uso diário.
          </p>
          <div className="login-highlights">
            <div>
              <strong>Cadastro completo</strong>
              <span>Foto, função, congregação e crachá com QR Code.</span>
            </div>
            <div>
              <strong>Presença rápida</strong>
              <span>Leitura por celular com registro instantâneo.</span>
            </div>
          </div>
          <div className="login-ribbon" />
        </section>

        <section className="login-card">
          <div className="login-brand compact-login-brand">
            <div>
              <span className="eyebrow">Acesso ao painel</span>
              <h1>Entrar no sistema</h1>
              <p>Use seu usuário e senha para acessar as áreas administrativas.</p>
            </div>
          </div>

          {error && <div className="notice login-error">{error}</div>}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="field full">
              <label>Usuário / e-mail</label>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="Digite seu usuário"
                autoComplete="username"
                required
              />
            </div>
            <div className="field full">
              <label>Senha</label>
              <div className="password-row">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  required
                />
                <button type="button" className="btn ghost" onClick={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>
            <div className="login-actions">
              <button type="submit" className="btn primary login-submit" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
