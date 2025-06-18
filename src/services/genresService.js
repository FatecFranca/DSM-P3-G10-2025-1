import { apiRequest } from './api';

class GenresService {
  constructor() {
    this.baseURL = this.getBaseURL();
  }

  getBaseURL() {
    if (typeof window !== 'undefined' && window.location) {
      return window.location.hostname === 'localhost' 
        ? 'http://localhost:5000/api'
        : '/api';
    }
    return 'http://localhost:5000/api';
  }

  // Buscar todos os gêneros
  async getGenres(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          queryParams.append(key, value);
        }
      });

      const genres = await apiRequest(`/genres?${queryParams}`);
      return {
        success: true,
        data: genres
      };

    } catch (error) {
      console.error('Erro ao buscar gêneros:', error);
      // Fallback para gêneros padrão
      return {
        success: false,
        message: error.message,
        data: [
          'Ação', 'RPG', 'Estratégia', 'FPS', 'Aventura', 
          'Simulação', 'Terror', 'Indie', 'Corrida', 'Esporte'
        ]
      };
    }
  }

  // Buscar gêneros populares
  async getPopularGenres(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          queryParams.append(key, value);
        }
      });

      const genres = await apiRequest(`/genres/popular?${queryParams}`);
      return {
        success: true,
        data: genres
      };

    } catch (error) {
      console.error('Erro ao buscar gêneros populares:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Buscar gênero por ID
  async getGenre(id) {
    try {
      const genre = await apiRequest(`/genres/${id}`);
      return {
        success: true,
        data: genre
      };

    } catch (error) {
      console.error('Erro ao buscar gênero:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Criar novo gênero
  async createGenre(genreData) {
    try {
      const newGenre = await apiRequest('/genres', {
        method: 'POST',
        body: JSON.stringify(genreData)
      });

      return {
        success: true,
        data: newGenre
      };

    } catch (error) {
      console.error('Erro ao criar gênero:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Atualizar gênero
  async updateGenre(id, genreData) {
    try {
      const updatedGenre = await apiRequest(`/genres/${id}`, {
        method: 'PUT',
        body: JSON.stringify(genreData)
      });

      return {
        success: true,
        data: updatedGenre
      };

    } catch (error) {
      console.error('Erro ao atualizar gênero:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Deletar gênero
  async deleteGenre(id) {
    try {
      await apiRequest(`/genres/${id}`, {
        method: 'DELETE'
      });

      return {
        success: true,
        message: 'Gênero deletado com sucesso'
      };

    } catch (error) {
      console.error('Erro ao deletar gênero:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }
}

export default new GenresService();
