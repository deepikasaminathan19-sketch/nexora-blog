import { createContext, useContext, useState } from 'react';
import { api } from '../services/api.js';
const Ctx = createContext();
export const useAuth = () => useContext(Ctx);
export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('nexora_token'));
  const login = async (email, password) => { const d = await api('/auth/login', { method: 'POST', body: { email, password } }); localStorage.setItem('nexora_token', d.token); setToken(d.token); };
  const logout = () => { localStorage.removeItem('nexora_token'); setToken(null); };
  return <Ctx.Provider value={{ token, login, logout }}>{children}</Ctx.Provider>;
}
