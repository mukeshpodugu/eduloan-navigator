import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Create an axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set Authorization header for all requests
  const setAuthHeader = (authToken) => {
    if (authToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('eduloan_token');
    const storedUser = localStorage.getItem('eduloan_user');

    if (storedToken && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setToken(storedToken);
      setUser(parsedUser);
      setAuthHeader(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token: authToken, id, email, role } = response.data;
      
      const userData = { id, username, email, role };
      
      localStorage.setItem('eduloan_token', authToken);
      localStorage.setItem('eduloan_user', JSON.stringify(userData));
      
      setToken(authToken);
      setUser(userData);
      setAuthHeader(authToken);
      return { success: true, user: userData };
    } catch (error) {
      console.error("Login failed", error);
      const message = error.response?.data?.message || 'Invalid credentials or server unreachable';
      return { success: false, message };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await api.post('/auth/register', { username, email, password });
      if (response.data.success) {
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error("Registration failed", error);
      const message = error.response?.data?.message || 'Registration failed. Try again.';
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('eduloan_token');
    localStorage.removeItem('eduloan_user');
    setToken(null);
    setUser(null);
    setAuthHeader(null);
  };

  const isAdmin = () => {
    return user?.role === 'ROLE_ADMIN';
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAdmin,
    api
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
