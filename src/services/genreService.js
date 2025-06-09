import api from "../Hooks/useApi";

export const genreService = {
  getAllGenres: async () => {
    const response = await api.get("/genres");
    return response.data;
  },
  
  getGenreById: async (id) => {
    const response = await api.get(`/genres/${id}`);
    return response.data;
  },
  
  getGenreBySlug: async (slug) => {
    const response = await api.get(`/genres/slug/${slug}`);
    return response.data;
  }
};