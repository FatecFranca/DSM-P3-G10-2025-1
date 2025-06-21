import api from "./api";

const favoritesService = {
  addToFavorites: async (gameId) => {
    try {
      const response = await api.post("/favorites", {
        gameId,
        userId: "507f1f77bcf86cd799439012",
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Erro ao adicionar aos favoritos:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Erro ao adicionar aos favoritos",
      };
    }
  },
  removeFromFavorites: async (gameId) => {
    try {
      const response = await api.delete(`/favorites/${gameId}`, {
        data: { userId: "507f1f77bcf86cd799439012" },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Erro ao remover dos favoritos:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Erro ao remover dos favoritos",
      };
    }
  },
  getUserFavorites: async (userId = "507f1f77bcf86cd799439012") => {
    try {
      const response = await api.get(`/favorites?userId=${userId}`);
      return {
        success: true,
        data: response.data.data || [],
      };
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || "Erro ao buscar favoritos",
      };
    }
  },
  isFavorite: async (gameId) => {
    try {
      const response = await api.get(
        `/favorites/check/${gameId}?userId=507f1f77bcf86cd799439012`
      );
      return {
        success: true,
        isFavorite: response.data.isFavorite,
      };
    } catch (error) {
      return {
        success: false,
        isFavorite: false,
      };
    }
  },
};

export default favoritesService;
