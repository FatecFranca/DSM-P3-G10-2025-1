import { apiRequest } from "./api";

class ReactionService {
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
  // Reagir a uma review
  async reactToReview(reviewId, type) {
    try {
      // Primeiro, obter o usuário atual do localStorage
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (!token || !userData) {
        throw new Error("Usuário não autenticado");
      }

      // Tentar obter userId do userData primeiro (mais simples)
      let userId;
      try {
        const user = JSON.parse(userData);
        userId = user.id;
      } catch (parseError) {
        // Se falhar, tentar decodificar o token
        if (!token.includes(".")) {
          throw new Error("Token inválido");
        }

        const base64Url = token.split(".")[1];
        if (!base64Url) {
          throw new Error("Token malformado");
        }

        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );
        const payload = JSON.parse(jsonPayload);
        userId = payload.id;
      }

      if (!userId) {
        throw new Error("ID do usuário não encontrado");
      }

      const reaction = await apiRequest("/review-reactions", {
        method: "POST",
        body: JSON.stringify({
          userId,
          reviewId,
          type, // 'LIKE' ou 'DISLIKE'
        }),
      });
      return {
        success: true,
        data: reaction,
      };
    } catch (error) {
      console.error("Erro ao reagir à review:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Reagir a uma review com userId direto
  async reactToReviewWithUser(reviewId, type, userId) {
    try {
      const reaction = await apiRequest("/review-reactions", {
        method: "POST",
        body: JSON.stringify({
          userId,
          reviewId,
          type, // 'LIKE' ou 'DISLIKE'
        }),
      });

      return {
        success: true,
        data: reaction,
      };
    } catch (error) {
      console.error("Erro ao reagir à review:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Buscar reações de uma review
  async getReviewReactions(reviewId) {
    try {
      const reactions = await apiRequest(
        `/review-reactions/review/${reviewId}`
      );
      return {
        success: true,
        data: reactions,
      };
    } catch (error) {
      console.error("Erro ao buscar reações da review:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Remover reação de review
  async removeReviewReaction(reactionId) {
    try {
      await apiRequest(`/review-reactions/${reactionId}`, {
        method: "DELETE",
      });

      return {
        success: true,
        message: "Reação removida com sucesso",
      };
    } catch (error) {
      console.error("Erro ao remover reação:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }
  // Reagir a um comentário
  async reactToComment(commentId, type) {
    try {
      // Obter o usuário atual do localStorage
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (!token || !userData) {
        throw new Error("Usuário não autenticado");
      }

      // Tentar obter userId do userData primeiro
      let userId;
      try {
        const user = JSON.parse(userData);
        userId = user.id;
      } catch (parseError) {
        // Se falhar, tentar decodificar o token
        if (!token.includes(".")) {
          throw new Error("Token inválido");
        }

        const base64Url = token.split(".")[1];
        if (!base64Url) {
          throw new Error("Token malformado");
        }

        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );
        const payload = JSON.parse(jsonPayload);
        userId = payload.id;
      }

      if (!userId) {
        throw new Error("ID do usuário não encontrado");
      }

      const reaction = await apiRequest("/comment-reactions", {
        method: "POST",
        body: JSON.stringify({
          userId,
          commentId,
          type, // 'LIKE' ou 'DISLIKE'
        }),
      });

      return {
        success: true,
        data: reaction,
      };
    } catch (error) {
      console.error("Erro ao reagir ao comentário:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Buscar reações de um comentário
  async getCommentReactions(commentId) {
    try {
      const reactions = await apiRequest(
        `/comment-reactions/comment/${commentId}`
      );
      return {
        success: true,
        data: reactions,
      };
    } catch (error) {
      console.error("Erro ao buscar reações do comentário:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Remover reação de comentário
  async removeCommentReaction(reactionId) {
    try {
      await apiRequest(`/comment-reactions/${reactionId}`, {
        method: "DELETE",
      });

      return {
        success: true,
        message: "Reação removida com sucesso",
      };
    } catch (error) {
      console.error("Erro ao remover reação:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }
}

export default new ReactionService();
