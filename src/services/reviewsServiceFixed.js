import { apiRequest } from "./api";

class ReviewsService {
  constructor() {
    this.baseURL = this.getBaseURL();
  }

  getBaseURL() {
    if (typeof window !== "undefined" && window.location) {
      return window.location.hostname === "localhost"
        ? "http://localhost:5000/api"
        : "/api";
    }
    return "http://localhost:5000/api";
  }

  async getReviewsByGame(gameId) {
    try {
      const reviews = await apiRequest(`/reviews?gameId=${gameId}`);
      return {
        success: true,
        data: reviews,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: error.message || "Erro ao buscar reviews do jogo",
      };
    }
  }

  async getReviewsByUser(userId) {
    try {
      const reviews = await apiRequest(`/reviews?userId=${userId}`);
      return {
        success: true,
        data: reviews,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: error.message || "Erro ao buscar reviews do usuário",
      };
    }
  }

  async createReview(reviewData) {
    try {
      const review = await apiRequest("/reviews", {
        method: "POST",
        body: JSON.stringify(reviewData),
      });
      return {
        success: true,
        data: review,
        message: "Review criada com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Erro ao criar review",
      };
    }
  }

  async updateReview(reviewId, reviewData) {
    try {
      const review = await apiRequest(`/reviews/${reviewId}`, {
        method: "PUT",
        body: JSON.stringify(reviewData),
      });
      return {
        success: true,
        data: review,
        message: "Review atualizada com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Erro ao atualizar review",
      };
    }
  }

  async deleteReview(reviewId) {
    try {
      await apiRequest(`/reviews/${reviewId}`, {
        method: "DELETE",
      });
      return {
        success: true,
        message: "Review deletada com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Erro ao deletar review",
      };
    }
  }
}

export default new ReviewsService();

// Exportações nomeadas para compatibilidade
export const getReviewsByUser = (userId) => {
  return new ReviewsService().getReviewsByUser(userId);
};

export const getReviewsByGame = (gameId) => {
  return new ReviewsService().getReviewsByGame(gameId);
};

export const createReview = (reviewData) => {
  return new ReviewsService().createReview(reviewData);
};

export const updateReview = (reviewId, reviewData) => {
  return new ReviewsService().updateReview(reviewId, reviewData);
};

export const deleteReview = (reviewId) => {
  return new ReviewsService().deleteReview(reviewId);
};
