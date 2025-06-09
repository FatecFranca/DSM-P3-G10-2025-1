import React, { createContext, useState, useContext, useEffect } from 'react';

// Criar o contexto
const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar autenticação quando o componente for montado
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Aqui você pode verificar a validade do token 
          // com uma chamada à API, por exemplo
          setUser({ id: 1, name: 'Usuário', email: 'usuario@exemplo.com' }); // Temporário
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Funções de autenticação
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulando login (substitua por chamada API real)
      if (email === 'teste@teste.com' && password === '123456') {
        const userData = { id: 1, name: 'Usuário Teste', email };
        localStorage.setItem('token', 'token-simulado');
        setUser(userData);
        return true;
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulando registro (substitua por chamada API real)
      const newUser = { id: Date.now(), ...userData };
      localStorage.setItem('token', 'token-simulado');
      setUser(newUser);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext deve ser usado dentro de um AuthProvider');
  }
  return context;
};