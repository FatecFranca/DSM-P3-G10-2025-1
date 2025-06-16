import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../services/authService';

// Criando o contexto
export const AuthContext = createContext();

// Hook personalizado para usar o contexto
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuthContext deve ser usado dentro de um AuthProvider");
  }
  
  return context;
};

// Provider do contexto
export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (AuthService.isAuthenticated()) {
        setAuthenticated(true);
        setUser(AuthService.getCurrentUser());
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await AuthService.login(email, password);
      setAuthenticated(true);
      setUser(data.user);
      return data;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await AuthService.register(userData);
      setAuthenticated(true);
      setUser(data.user);
      return data;
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  };

  const logout = () => {
    AuthService.logout();
    setAuthenticated(false);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ 
      authenticated, 
      user, 
      loading, 
      login, 
      logout, 
      register,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};