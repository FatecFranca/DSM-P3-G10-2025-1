import { apiRequest } from './api';

class ReactionService {
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

  // Reagir a uma review
  async reactToReview(reviewId, type) {
    try {
      const reaction = await apiRequest('/review-reactions', {
        method: 'POST',
        body: JSON.stringify({
          reviewId,
          type // 'like' ou 'dislike'
        })
      });

      return {
        success: true,
        data: reaction
      };
    } catch (error) {
      console.error('Erro ao reagir à review:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Buscar reações de uma review
  async getReviewReactions(reviewId) {
    try {
      const reactions = await apiRequest(`/review-reactions/review/${reviewId}`);
      return {
        success: true,
        data: reactions
      };
    } catch (error) {
      console.error('Erro ao buscar reações da review:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Remover reação de review
  async removeReviewReaction(reactionId) {
    try {
      await apiRequest(`/review-reactions/${reactionId}`, {
        method: 'DELETE'
      });

      return {
        success: true,
        message: 'Reação removida com sucesso'
      };
    } catch (error) {
      console.error('Erro ao remover reação:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Reagir a um comentário
  async reactToComment(commentId, type) {
    try {
      const reaction = await apiRequest('/comment-reactions', {
        method: 'POST',
        body: JSON.stringify({
          commentId,
          type // 'like' ou 'dislike'
        })
      });

      return {
        success: true,
        data: reaction
      };
    } catch (error) {
      console.error('Erro ao reagir ao comentário:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Buscar reações de um comentário
  async getCommentReactions(commentId) {
    try {
      const reactions = await apiRequest(`/comment-reactions/comment/${commentId}`);
      return {
        success: true,
        data: reactions
      };
    } catch (error) {
      console.error('Erro ao buscar reações do comentário:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Remover reação de comentário
  async removeCommentReaction(reactionId) {
    try {
      await apiRequest(`/comment-reactions/${reactionId}`, {
        method: 'DELETE'
      });

      return {
        success: true,
        message: 'Reação removida com sucesso'
      };
    } catch (error) {
      console.error('Erro ao remover reação:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }
}

export default new ReactionService();
