import api from './api';

export const UserService = {
  // Obter perfil do usuário
  getUserProfile: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Obter perfil do usuário autenticado
  getMyProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  // Atualizar perfil do usuário (requer autenticação)
  updateProfile: async (userData) => {
    const response = await api.put('/users/me', userData);
    return response.data;
  },

  // Alterar senha (requer autenticação)
  changePassword: async (passwordData) => {
    const response = await api.put('/users/me/password', passwordData);
    return response.data;
  },

  // Excluir conta (requer autenticação)
  deleteAccount: async () => {
    const response = await api.delete('/users/me');
    return response.data;
  },
  
  // Obter jogos favoritos do usuário
  getFavorites: async () => {
    const response = await api.get('/users/me/favorites');
    return response.data;
  },
  
  // Adicionar jogo aos favoritos
  addFavorite: async (gameId) => {
    const response = await api.post(`/users/me/favorites/${gameId}`);
    return response.data;
  },
  
  // Remover jogo dos favoritos
  removeFavorite: async (gameId) => {
    const response = await api.delete(`/users/me/favorites/${gameId}`);
    return response.data;
  },
};