import { createContext, useContext, useMemo, useState } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('ipda_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  async function login(email, password) {
    try {
      setLoading(true);
      const result = await api.login(email, password);
      const authenticatedUser = result.user || null;
      localStorage.setItem('ipda_user', JSON.stringify(authenticatedUser));
      setUser(authenticatedUser);
      return { ok: true, user: authenticatedUser };
    } catch (error) {
      return { ok: false, message: error.message || 'Usuário ou senha inválidos.' };
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem('ipda_user');
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, login, logout, loading, isAuthenticated: Boolean(user) }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }
  return context;
}
