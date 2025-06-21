import React, { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useFavoritesContext } from "../../context/FavoritesContext";
import { useAuthContext } from "../../context/AuthContext";
import styles from "./FavoriteButton.module.css";

const FavoriteButton = ({ game, size = "medium", showText = false }) => {
  const { toggleFavorite, isFavorite } = useFavoritesContext();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const isGameFavorite = isFavorite(game.id);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setMessage("Faça login para favoritar jogos");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const result = await toggleFavorite(game);
    } catch (error) {
      setMessage("Erro ao atualizar favoritos");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case "small":
        return styles.small;
      case "large":
        return styles.large;
      default:
        return styles.medium;
    }
  };
  return (
    <div className={styles.container}>
      <button
        onClick={handleToggleFavorite}
        disabled={loading}
        className={`${styles.favoriteButton} ${getSizeClass()} ${
          showText ? styles.withText : ""
        } ${isGameFavorite ? styles.favorited : ""}`}
        title={
          isGameFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
        }
        aria-label={
          isGameFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
        }
      >
        {loading ? (
          <div className={styles.spinner}></div>
        ) : (
          <>
            {isGameFavorite ? (
              <FaHeart className={styles.heartIcon} />
            ) : (
              <FaRegHeart className={styles.heartIcon} />
            )}
            {showText && (
              <span className={styles.text}>
                {isGameFavorite ? "Favoritado" : "Favoritar"}
              </span>
            )}
          </>
        )}
      </button>
    </div>
  );
};

export default FavoriteButton;
