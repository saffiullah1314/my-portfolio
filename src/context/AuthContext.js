import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setAdmin(res.data.data);
        }
      } catch (err) {
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        // Fetch full profile after login
        const meRes = await api.get('/auth/me');
        setAdmin(meRes.data.data);
        toast.success('Logged in successfully');
        return true;
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setAdmin(null);
      toast.success('Logged out successfully');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
