import React, { createContext, useContext, useState, useEffect } from "react";
import favoritesService from "../services/favoritesService";
import { useAuthContext } from "./AuthContext";

const FavoritesContext = createContext();

export const useFavoritesContext = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error(
      "useFavoritesContext deve ser usado dentro de FavoritesProvider"
    );
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();

  const loadFavorites = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const response = await favoritesService.getUserFavorites(user.id);
      if (response.success) {
        setFavorites(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (game) => {
    if (!user?.id) {
      throw new Error("Usuário não logado");
    }

    try {
      const response = await favoritesService.addToFavorites(game.id);
      if (response.success) {
        setFavorites((prev) => [...prev, game]);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error("Erro ao adicionar favorito:", error);
      return { success: false, message: "Erro ao adicionar aos favoritos" };
    }
  };

  const removeFromFavorites = async (gameId) => {
    if (!user?.id) {
      throw new Error("Usuário não logado");
    }

    try {
      const response = await favoritesService.removeFromFavorites(gameId);
      if (response.success) {
        setFavorites((prev) => prev.filter((game) => game.id !== gameId));
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
      return { success: false, message: "Erro ao remover dos favoritos" };
    }
  };
  const isFavorite = (gameId) => {
    if (!Array.isArray(favorites)) return false;
    return favorites.some((game) => game.id === gameId);
  };

  const toggleFavorite = async (game) => {
    if (isFavorite(game.id)) {
      return await removeFromFavorites(game.id);
    } else {
      return await addToFavorites(game);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [user?.id]);

  const value = {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    loadFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
