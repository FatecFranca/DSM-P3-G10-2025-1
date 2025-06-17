import { apiRequest } from './api';

class GameProgressService {
  constructor() {
    this.baseURL = this.getBaseURL();
  }

  getBaseURL() {
    if (typeof window !== 'undefined' && window.location) {
      return window.location.hostname === 'localhost' 
        ? 'http://localhost:3001/api'
        : '/api';
    }
    return 'http://localhost:3001/api';
  }

  // Atualizar progresso de jogo
  async updateGameProgress(progressData) {
    try {
      const progress = await apiRequest('/game-progress', {
        method: 'POST',
        body: JSON.stringify(progressData)
      });

      return {
        success: true,
        data: progress
      };
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Buscar progresso de jogos por usuário
  async getUserGameProgress(userId) {
    try {
      const progress = await apiRequest(`/game-progress/user/${userId}`);
      return {
        success: true,
        data: progress
      };
    } catch (error) {
      console.error('Erro ao buscar progresso do usuário:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Buscar usuários por progresso de jogo
  async getGameProgress(gameId) {
    try {
      const progress = await apiRequest(`/game-progress/game/${gameId}`);
      return {
        success: true,
        data: progress
      };
    } catch (error) {
      console.error('Erro ao buscar progresso do jogo:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }
}

export default new GameProgressService();