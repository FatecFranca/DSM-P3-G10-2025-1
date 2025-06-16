// src/services/commentService.js
import apiRequest from './api';

export const commentService = {
  // Obter comentários de uma review
  async getCommentsByReview(reviewId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/comments/review/${reviewId}?${queryString}` : `/comments/review/${reviewId}`;
    return await apiRequest(endpoint);
  },

  // Obter comentário por ID
  async getCommentById(id) {
    return await apiRequest(`/comments/${id}`);
  },

  // Criar novo comentário
  async createComment(commentData) {
    return await apiRequest('/comments', {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  },

  // Atualizar comentário
  async updateComment(id, commentData) {
    return await apiRequest(`/comments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(commentData),
    });
  },

  // Deletar comentário
  async deleteComment(id) {
    return await apiRequest(`/comments/${id}`, {
      method: 'DELETE',
    });
  },

  // Responder a um comentário
  async replyToComment(parentId, commentData) {
    return await apiRequest(`/comments/${parentId}/reply`, {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  },
};