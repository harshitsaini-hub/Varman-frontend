import React, { createContext, useState, useEffect } from 'react';
import api from '../api';
import { deriveVaultKey, persistVaultKey, restoreVaultKey, clearVaultKey } from '../utils/cryptoVault';
import { clearVaultCache } from '../utils/vaultDB';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vaultKey, setVaultKey] = useState(null);

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
    const init = async () => {
      if (localStorage.getItem('varman_token')) {
        // Try to restore vault key from sessionStorage (survives page refresh)
        const restoredKey = await restoreVaultKey();
        if (restoredKey) {
          setVaultKey(restoredKey);
        }
        await fetchUser();
      } else {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email); // FastAPI OAuth2 uses 'username'
    formData.append('password', password);

    const res = await api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    
    localStorage.setItem('varman_token', res.data.access_token);

    // ── Vault Key Derivation ──────────────────────────────────────────
    // Derive AES-256-GCM key from password + user's vault salt.
    // The key lives in React state + sessionStorage ONLY — never sent to backend.
    const vaultSalt = res.data.vault_salt;
    if (vaultSalt) {
      const key = await deriveVaultKey(password, vaultSalt);
      setVaultKey(key);
      await persistVaultKey(key);
    }

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
    sessionStorage.removeItem('varman_guide_dashboard');
    sessionStorage.removeItem('varman_guide_upload');
    sessionStorage.removeItem('varman_guide_gallery');
    sessionStorage.removeItem('varman_guide_forensic');
    // ── Vault Cleanup ─────────────────────────────────────────────────
    clearVaultKey();        // Remove vault key from sessionStorage
    clearVaultCache();      // Wipe decrypted images from IndexedDB
    setVaultKey(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, vaultKey }}>
      {children}
    </AuthContext.Provider>
  );
};
