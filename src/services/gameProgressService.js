// src/services/gameProgressService.js
import apiRequest from './api';

export const gameProgressService = {
  // Obter progresso de todos os jogos do usuário
  async getUserGameProgress(userId) {
    return await apiRequest(`/game-progress/user/${userId}`);
  },

  // Obter progresso específico de um jogo
  async getGameProgress(gameId) {
    return await apiRequest(`/game-progress/game/${gameId}`);
  },

  // Atualizar progresso do jogo
  async updateGameProgress(gameId, progressData) {
    return await apiRequest('/game-progress', {
      method: 'POST',
      body: JSON.stringify({ gameId, ...progressData }),
    });
  },

  // Marcar jogo como concluído
  async markGameAsCompleted(gameId, completionData = {}) {
    return await apiRequest(`/game-progress/${gameId}/complete`, {
      method: 'PUT',
      body: JSON.stringify(completionData),
    });
  },

  // Adicionar jogo à lista de desejos
  async addToWishlist(gameId) {
    return await apiRequest('/game-progress/wishlist', {
      method: 'POST',
      body: JSON.stringify({ gameId }),
    });
  },

  // Remover jogo da lista de desejos
  async removeFromWishlist(gameId) {
    return await apiRequest(`/game-progress/wishlist/${gameId}`, {
      method: 'DELETE',
    });
  },

  // Obter estatísticas do usuário
  async getUserStats(userId) {
    return await apiRequest(`/game-progress/stats/${userId}`);
  },
};