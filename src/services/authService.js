import api from './api';

const AuthService = {
  // Login usando o novo endpoint de login
  login: async (email, password) => {
    try {
      // 1. Tenta fazer o login pelo novo endpoint
      const response = await api.post('/login', { email, password });
      
      // 2. Extrai dados da resposta
      const { user, token } = response.data;
      
      // 3. Armazena token e informações do usuário
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { user, token };
    } catch (error) {
      // 4. Trata erros específicos
      if (error.response && error.response.status === 401) {
        throw new Error('Email ou senha incorretos');
      } else {
        throw new Error('Erro ao conectar com o servidor. Tente novamente mais tarde.');
      }
    }
  },

  // Registro usando o endpoint correto
  register: async (userData) => {
    const response = await api.post('/users', userData);
    
    // Se o back-end não retornar um token, crie um mock
    if (!response.data.token) {
      const user = response.data;
      const mockToken = btoa(`${user.id}:${user.email}:${Date.now()}`);
      
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      return {
        user,
        token: mockToken
      };
    }
    
    // Caso contrário, use o token do back-end
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  },

  // Outros métodos
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export default AuthService;