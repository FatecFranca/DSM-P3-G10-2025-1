import { apiRequest } from './api';

class ReviewsService {
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

  // Buscar reviews com filtros e paginação
  async getReviews(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          queryParams.append(key, value);
        }
      });

      console.log('Buscando reviews em:', `${this.baseURL}/reviews?${queryParams}`);
      
      const reviews = await apiRequest(`/reviews?${queryParams}`);
      return {
        success: true,
        data: reviews
      };

    } catch (error) {
      console.error('Erro ao buscar reviews:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Buscar reviews populares
  async getPopularReviews(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          queryParams.append(key, value);
        }
      });

      const reviews = await apiRequest(`/reviews/popular?${queryParams}`);
      return {
        success: true,
        data: reviews
      };

    } catch (error) {
      console.error('Erro ao buscar reviews populares:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Buscar reviews recentes
  async getRecentReviews(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          queryParams.append(key, value);
        }
      });

      const reviews = await apiRequest(`/reviews/recent?${queryParams}`);
      return {
        success: true,
        data: reviews
      };

    } catch (error) {
      console.error('Erro ao buscar reviews recentes:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Buscar uma review específica
  async getReview(id) {
    try {
      const review = await apiRequest(`/reviews/${id}`);
      return {
        success: true,
        data: review
      };

    } catch (error) {
      console.error('Erro ao buscar review:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Criar nova review
  async createReview(reviewData) {
    try {
      const newReview = await apiRequest('/reviews', {
        method: 'POST',
        body: JSON.stringify(reviewData)
      });

      return {
        success: true,
        data: newReview
      };

    } catch (error) {
      console.error('Erro ao criar review:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Atualizar review
  async updateReview(reviewId, reviewData) {
    try {
      const updatedReview = await apiRequest(`/reviews/${reviewId}`, {
        method: 'PUT',
        body: JSON.stringify(reviewData)
      });

      return {
        success: true,
        data: updatedReview
      };

    } catch (error) {
      console.error('Erro ao atualizar review:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Deletar review
  async deleteReview(reviewId) {
    try {
      await apiRequest(`/reviews/${reviewId}`, {
        method: 'DELETE'
      });

      return {
        success: true,
        message: 'Review deletada com sucesso'
      };

    } catch (error) {
      console.error('Erro ao deletar review:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Reagir a uma review (like/dislike)
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
      console.error('Erro ao buscar reações:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Remover reação
  async removeReaction(reactionId) {
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

  // Buscar comentários de uma review
  async getReviewComments(reviewId) {
    try {
      const comments = await apiRequest(`/comments/review/${reviewId}`);
      return {
        success: true,
        data: comments
      };

    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Criar comentário
  async createComment(commentData) {
    try {
      const newComment = await apiRequest('/comments', {
        method: 'POST',
        body: JSON.stringify(commentData)
      });

      return {
        success: true,
        data: newComment
      };

    } catch (error) {
      console.error('Erro ao criar comentário:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }
}

export default new ReviewsService();