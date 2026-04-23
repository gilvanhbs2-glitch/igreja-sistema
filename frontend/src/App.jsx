import { NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage.jsx';
import MembersPage from './pages/MembersPage.jsx';
import CadastroPage from './pages/CadastroPage.jsx';
import PresencasPage from './pages/PresencasPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '◫' },
  { to: '/membros', label: 'Membros', icon: '◉' },
  { to: '/cadastro', label: 'Cadastro', icon: '✎' },
  { to: '/presencas', label: 'Presenças', icon: '✓' },
];

function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <img src="/logo-ipda.png" alt="Igreja Pentecostal Deus é Amor" className="sidebar-logo" />
          <div>
            <strong>IPDA Sede Central</strong>
            <span>Pinhais • Sistema de membros</span>
          </div>
        </div>

        <nav className="nav">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'}>
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-helper">
          Gestão de cadastro, crachá e presença em um só lugar.
        </div>
        <button type="button" className="btn danger sidebar-logout" onClick={handleLogout}>
          Sair do sistema
        </button>
      </div>
    </aside>
  );
}

function ProtectedLayout() {
  return (
    <div className="layout">
      <Sidebar />
      <main className="content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/membros" element={<MembersPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/presencas" element={<PresencasPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={(
          <PrivateRoute>
            <ProtectedLayout />
          </PrivateRoute>
        )}
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
