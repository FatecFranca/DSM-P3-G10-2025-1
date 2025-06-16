import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthService } from '../services/authService';

// Criando o contexto
const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se o usuário está autenticado ao carregar a aplicação
    const checkAuth = () => {
      if (AuthService.isAuthenticated()) {
        const currentUser = AuthService.getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Função de login
  const login = async (email, password) => {
    try {
      const data = await AuthService.login(email, password);
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Erro no login:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Falha no login. Verifique suas credenciais.'
      };
    }
  };

  // Função de registro
  const register = async (userData) => {
    try {
      await AuthService.register(userData);
      return { success: true };
    } catch (error) {
      console.error('Erro no registro:', error);
      return {
        success: false,
        message: error.response?.data?.error || 'Falha no registro. Tente novamente.'
      };
    }
  };

  // Função de logout
  const logout = () => {
    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    setUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook para utilizar o contexto
export const useAuthContext = () => useContext(AuthContext);