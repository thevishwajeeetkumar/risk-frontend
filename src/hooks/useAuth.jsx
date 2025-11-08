import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

// Shared Axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  withCredentials: false,
});

export function attachInterceptors(getToken, onUnauthorized) {
  api.interceptors.request.use((config) => {
    const token = getToken?.();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        onUnauthorized?.();
      }
      throw error;
    }
  );
}

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem('token') || '');
  const [user, setUser] = useState(() => {
    const raw = sessionStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  const saveSession = (newToken, profile) => {
    setToken(newToken || '');
    setUser(profile || null);
    if (newToken) sessionStorage.setItem('token', newToken);
    else sessionStorage.removeItem('token');
    if (profile) sessionStorage.setItem('user', JSON.stringify(profile));
    else sessionStorage.removeItem('user');
  };

  const logout = () => saveSession('', null);

  useEffect(() => {
    attachInterceptors(
      () => sessionStorage.getItem('token'),
      logout
    );
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const { data } = await api.get('/auth/me');
        setUser(data);
        sessionStorage.setItem('user', JSON.stringify(data));
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
    // only run on mount with existing token
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (username, password) => {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    const { data } = await api.post('/auth/login', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const profile = { id: data.user_id, username: data.username, role: data.role };
    saveSession(data.access_token, profile);
    return profile;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    return data;
  };

  const value = useMemo(
    () => ({
      api,
      token,
      user,
      loading,
      login,
      register,
      logout,
      isCRO: user?.role === 'CRO',
    }),
    [token, user, loading]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const context = useContext(AuthCtx);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
