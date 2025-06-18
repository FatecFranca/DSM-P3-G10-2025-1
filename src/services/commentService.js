import { apiRequest } from './api';

class CommentService {
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

  // Criar novo comentário
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

  // Atualizar comentário
  async updateComment(commentId, commentData) {
    try {
      const updatedComment = await apiRequest(`/comments/${commentId}`, {
        method: 'PUT',
        body: JSON.stringify(commentData)
      });

      return {
        success: true,
        data: updatedComment
      };
    } catch (error) {
      console.error('Erro ao atualizar comentário:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Deletar comentário
  async deleteComment(commentId) {
    try {
      await apiRequest(`/comments/${commentId}`, {
        method: 'DELETE'
      });

      return {
        success: true,
        message: 'Comentário deletado com sucesso'
      };
    } catch (error) {
      console.error('Erro ao deletar comentário:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }
}

export default new CommentService();
