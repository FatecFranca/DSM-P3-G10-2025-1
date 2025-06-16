// src/services/genreService.js
import apiRequest from './api';

export const genreService = {
  // Obter todos os gêneros
  async getGenres() {
    return await apiRequest('/genres');
  },

  // Obter gênero por ID
  async getGenreById(id) {
    return await apiRequest(`/genres/${id}`);
  },

  // Obter gênero por slug
  async getGenreBySlug(slug) {
    return await apiRequest(`/genres/slug/${slug}`);
  },

  // Criar novo gênero (admin)
  async createGenre(genreData) {
    return await apiRequest('/genres', {
      method: 'POST',
      body: JSON.stringify(genreData),
    });
  },

  // Atualizar gênero (admin)
  async updateGenre(id, genreData) {
    return await apiRequest(`/genres/${id}`, {
      method: 'PUT',
      body: JSON.stringify(genreData),
    });
  },

  // Deletar gênero (admin)
  async deleteGenre(id) {
    return await apiRequest(`/genres/${id}`, {
      method: 'DELETE',
    });
  },
};