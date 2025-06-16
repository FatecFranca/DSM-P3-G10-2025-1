import api from './api';

export const ReviewService = {
  // Listar todas as reviews
  getAllReviews: async (params = {}) => {
    const response = await api.get('/reviews', { params });
    return response.data;
  },

  // Obter review por ID
  getReviewById: async (id) => {
    const response = await api.get(`/reviews/${id}`);
    return response.data;
  },

  // Criar nova review (requer autenticação)
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  // Atualizar review existente (requer autenticação)
  updateReview: async (id, reviewData) => {
    const response = await api.put(`/reviews/${id}`, reviewData);
    return response.data;
  },

  // Excluir review (requer autenticação)
  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },
};