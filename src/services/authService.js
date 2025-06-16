import api from './api';

export const AuthService = {
  // Login de usuário
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('gameReviews_token', response.data.token);
      localStorage.setItem('gameReviews_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Registro de novo usuário
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Obter usuário atual
  getCurrentUser: () => {
    const user = localStorage.getItem('gameReviews_user');
    return user ? JSON.parse(user) : null;
  },

  // Verificar se usuário está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('gameReviews_token');
  },

  // Logout
  logout: () => {
    localStorage.removeItem('gameReviews_token');
    localStorage.removeItem('gameReviews_user');
  },
};