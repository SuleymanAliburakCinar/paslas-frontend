import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/AuthService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.login(credentials);
      setUser(response.data);
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const register = async (credentials) => {
    try {
      const response = await api.register(credentials);
      setUser(response.data);
    } catch (err) {
      console.error('Register error:', err);
      throw err;
    }
  };

  const fetchUser = async () => {
    try {
      const response = await api.authMe();
      setUser(response.data);
    } catch (err) {
      console.error('Fetch user error:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);