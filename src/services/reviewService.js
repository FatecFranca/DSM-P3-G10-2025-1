import api from "../Hooks/useApi";

export const reviewService = {
  getAllReviews: async (params) => {
    const response = await api.get("/reviews", { params });
    return response.data;
  },

  getReviewById: async (id) => {
    const response = await api.get(`/reviews/${id}`);
    return response.data;
  },
  
  getRecentReviews: async (limit = 10) => {
    const response = await api.get("/reviews/recent", { params: { limit } });
    return response.data;
  },

  getPopularReviews: async (limit = 10) => {
    const response = await api.get("/reviews/popular", { params: { limit } });
    return response.data;
  },

  createReview: async (reviewData) => {
    const response = await api.post("/reviews", reviewData);
    return response.data;
  },

  updateReview: async (id, reviewData) => {
    const response = await api.put(`/reviews/${id}`, reviewData);
    return response.data;
  },

  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },
  
  likeReview: async (id) => {
    const response = await api.post(`/reviews/${id}/like`);
    return response.data;
  },
  
  unlikeReview: async (id) => {
    const response = await api.delete(`/reviews/${id}/like`);
    return response.data;
  }
};