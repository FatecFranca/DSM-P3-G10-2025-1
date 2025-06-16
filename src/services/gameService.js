import api from './api';

export const GameService = {
  // Obter jogos em destaque
  async getFeaturedGames() {
    return await apiRequest('/games/featured');
  },

  // Buscar jogos
  async searchGames(query, filters = {}) {
    const params = { search: query, ...filters };
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/games/search?${queryString}`);
  },

  // Obter todos os jogos
  async getGames(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/games?${queryString}` : '/games';
    return await apiRequest(endpoint);
  },

  getAllGames: async (params = {}) => {
    const response = await api.get('/games', { params });
    return response.data;
  },

  getGameById: async (id) => {
    const response = await api.get(`/games/${id}`);
    return response.data;
  },

  createGame: async (gameData) => {
    const response = await api.post('/games', gameData);
    return response.data;
  },
};