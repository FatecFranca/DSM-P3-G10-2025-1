import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Carregar usuário do storage quando inicializar
  useEffect(() => {
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);
  
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.login({ email, password });
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao realizar login');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.register(userData);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao realizar cadastro');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);
  
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedUser = await userService.updateProfile(userData);
      setUser({...user, ...updatedUser});
      // Atualiza no localStorage também
      const storedUser = authService.getCurrentUser();
      if (storedUser) {
        localStorage.setItem('user', JSON.stringify({...storedUser, ...updatedUser}));
      }
      return updatedUser;
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao atualizar perfil');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile
  };
}