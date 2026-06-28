import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('varman_token')) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email); // FastAPI OAuth2 uses 'username'
    formData.append('password', password);

    const res = await api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    
    localStorage.setItem('varman_token', res.data.access_token);
    await fetchUser();
  };

  const register = async (email, password, displayName) => {
    await api.post('/auth/register', {
      email,
      password,
      display_name: displayName
    });
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('varman_token');
    sessionStorage.removeItem('varman_upload_logs');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
