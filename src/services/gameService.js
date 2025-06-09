import api from "../Hooks/useApi";

export const gameService = {
  getAllGames: async (params) => {
    const response = await api.get("/games", { params });
    return response.data;
  },

  getGameById: async (id) => {
    const response = await api.get(`/games/${id}`);
    return response.data;
  },

  getFeaturedGames: async () => {
    const response = await api.get("/games/featured");
    return response.data;
  },

  getGamesByCategory: async (categoryId) => {
    const response = await api.get(`/categories/${categoryId}/games`);
    return response.data;
  },

  searchGames: async (query) => {
    const response = await api.get("/games/search", { params: { q: query } });
    return response.data;
  },
  
  getGameReviews: async (gameId) => {
    const response = await api.get(`/games/${gameId}/reviews`);
    return response.data;
  },

  getUpcomingGames: async () => {
    const response = await api.get("/games/upcoming");
    return response.data;
  },
  
  getTopRatedGames: async () => {
    const response = await api.get("/games/top-rated");
    return response.data;
  }
};