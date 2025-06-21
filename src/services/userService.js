import { apiRequest } from "./api";

class UserService {
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

  // Obter perfil do usuário
  async getUserProfile(id) {
    try {
      const user = await apiRequest(`/users/${id}`);
      return {
        success: true,
        data: user,
      };
    } catch (error) {
      console.error("Erro ao buscar perfil do usuário:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Atualizar perfil do usuário
  async updateUserProfile(id, userData) {
    try {
      const updatedUser = await apiRequest(`/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(userData),
      });

      return {
        success: true,
        data: updatedUser,
      };
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Deletar usuário
  async deleteUser(id) {
    try {
      await apiRequest(`/users/${id}`, {
        method: "DELETE",
      });

      return {
        success: true,
        message: "Usuário deletado com sucesso",
      };
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Listar todos os usuários
  async getUsers() {
    try {
      const users = await apiRequest("/users");
      return {
        success: true,
        data: users,
      };
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Buscar estatísticas do usuário
  async getUserStats(userId) {
    try {
      const stats = await apiRequest(`/users/${userId}/stats`);
      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      console.error("Erro ao buscar estatísticas do usuário:", error);
      return {
        success: false,
        message: error.message,
        data: {
          likesReceived: 0,
          dislikesReceived: 0,
          reviewsCount: 0,
          gamesCreated: 0,
        },
      };
    }
  }
}

export default new UserService();
