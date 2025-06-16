// src/services/gameService.js - verificar se tem estes métodos
export const gameService = {
  // ...outros métodos

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
};