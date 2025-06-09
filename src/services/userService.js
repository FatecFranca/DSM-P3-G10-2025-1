import api from "../services/api";  // Corrigido para importar do local correto

const userService = {
  getUserProfile: async () => {
    const response = await api.get("/users/me");
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put("/users/me", userData);
    return response.data;
  },
  
  updatePassword: async (passwordData) => {
    const response = await api.put("/users/me/password", passwordData);
    return response.data;
  },

  uploadAvatar: async (formData) => {
    const response = await api.post("/users/me/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getUserReviews: async () => {
    const response = await api.get("/users/me/reviews");
    return response.data;
  },
  
  getFavoriteGames: async () => {
    const response = await api.get("/users/me/favorites");
    return response.data;
  },
  
  addToFavorites: async (gameId) => {
    const response = await api.post(`/users/me/favorites/${gameId}`);
    return response.data;
  },
  
  removeFromFavorites: async (gameId) => {
    const response = await api.delete(`/users/me/favorites/${gameId}`);
    return response.data;
  },
  
  deleteAccount: async () => {
    const response = await api.delete("/users/me");
    return response.data;
  }
};

export default userService;