class ReviewsService {
  constructor() {
    this.baseURL = this.getBaseURL();
  }

  getBaseURL() {
    if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
    return window.location.hostname === 'localhost' 
      ? 'http://localhost:3001/api'
      : '/api';
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

      const response = await fetch(`${this.baseURL}/reviews?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
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

      const response = await fetch(`${this.baseURL}/reviews/popular?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
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

      const response = await fetch(`${this.baseURL}/reviews/recent?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
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
      const response = await fetch(`${this.baseURL}/reviews/${id}`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
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
  async createReview(reviewData, token) {
    try {
      const response = await fetch(`${this.baseURL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
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
  async updateReview(reviewId, reviewData, token) {
    try {
      const response = await fetch(`${this.baseURL}/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
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
  async deleteReview(reviewId, token) {
    try {
      const response = await fetch(`${this.baseURL}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

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
  async reactToReview(reviewId, type, token) {
    try {
      const response = await fetch(`${this.baseURL}/review-reactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          reviewId,
          type // 'like' ou 'dislike'
        })
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
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
      const response = await fetch(`${this.baseURL}/review-reactions/review/${reviewId}`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
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
  async removeReaction(reactionId, token) {
    try {
      const response = await fetch(`${this.baseURL}/review-reactions/${reactionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

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
      const response = await fetch(`${this.baseURL}/comments/review/${reviewId}`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
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
  async createComment(commentData, token) {
    try {
      const response = await fetch(`${this.baseURL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(commentData)
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
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