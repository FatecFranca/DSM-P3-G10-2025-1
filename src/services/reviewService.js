// src/services/reviewService.js
import apiRequest from './api';

export const reviewService = {
  // Obter todas as reviews
  async getReviews(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/reviews?${queryString}` : '/reviews';
    return await apiRequest(endpoint);
  },

  // Obter review por ID
  async getReviewById(id) {
    return await apiRequest(`/reviews/${id}`);
  },

  // Obter reviews por jogo
  async getReviewsByGame(gameId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/reviews/game/${gameId}?${queryString}` : `/reviews/game/${gameId}`;
    return await apiRequest(endpoint);
  },

  // Obter reviews por usuário
  async getReviewsByUser(userId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/reviews/user/${userId}?${queryString}` : `/reviews/user/${userId}`;
    return await apiRequest(endpoint);
  },

  // Criar nova review
  async createReview(reviewData) {
    return await apiRequest('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  // Atualizar review
  async updateReview(id, reviewData) {
    return await apiRequest(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });
  },

  // Deletar review
  async deleteReview(id) {
    return await apiRequest(`/reviews/${id}`, {
      method: 'DELETE',
    });
  },

  // Obter reviews populares
  async getPopularReviews(limit = 10) {
    return await apiRequest(`/reviews/popular?limit=${limit}`);
  },

  // Obter reviews recentes
  async getRecentReviews(limit = 10) {
    return await apiRequest(`/reviews/recent?limit=${limit}`);
  },
};