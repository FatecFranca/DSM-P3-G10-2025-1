// src/services/reactionService.js
import apiRequest from './api';

export const reactionService = {
  // Reagir a uma review
  async reactToReview(reviewId, reactionType) {
    return await apiRequest('/review-reactions', {
      method: 'POST',
      body: JSON.stringify({ reviewId, type: reactionType }),
    });
  },

  // Remover reação de uma review
  async removeReviewReaction(reviewId) {
    return await apiRequest(`/review-reactions/${reviewId}`, {
      method: 'DELETE',
    });
  },

  // Obter reações de uma review
  async getReviewReactions(reviewId) {
    return await apiRequest(`/review-reactions/review/${reviewId}`);
  },

  // Reagir a um comentário
  async reactToComment(commentId, reactionType) {
    return await apiRequest('/comment-reactions', {
      method: 'POST',
      body: JSON.stringify({ commentId, type: reactionType }),
    });
  },

  // Remover reação de um comentário
  async removeCommentReaction(commentId) {
    return await apiRequest(`/comment-reactions/${commentId}`, {
      method: 'DELETE',
    });
  },

  // Obter reações de um comentário
  async getCommentReactions(commentId) {
    return await apiRequest(`/comment-reactions/comment/${commentId}`);
  },
};