import React from "react";
import { Link } from "react-router-dom";
import { useFavoritesContext } from "../../context/FavoritesContext";
import { useAuthContext } from "../../context/AuthContext";
import SafeImage from "../Helper/SafeImage";
import FavoriteButton from "../FavoriteButton/FavoriteButton";
import styles from "./UserFavorites.module.css";

const UserFavorites = () => {
  const { favorites, loading } = useFavoritesContext();
  const { user } = useAuthContext();

  if (!user) {
    return (
      <div className={styles.userFavorites}>
        <div className={styles.emptyState}>
          <h2>Acesso Restrito</h2>
          <p>Você precisa estar logado para ver seus favoritos.</p>
          <Link to="/login" className={styles.exploreButton}>
            Fazer Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.userFavorites}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Carregando favoritos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.userFavorites}>
      <div className={styles.favoritesHeader}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Meus Jogos Favoritos</h2>
          <p className={styles.subtitle}>
            {favorites.length === 0
              ? "Você ainda não tem jogos favoritos"
              : `Descubra e jogue seus títulos favoritos`}
          </p>
        </div>
        {favorites.length > 0 && (
          <div className={styles.favoritesCount}>
            <div className={styles.countNumber}>{favorites.length}</div>
            <div className={styles.countLabel}>
              {favorites.length === 1 ? "Favorito" : "Favoritos"}
            </div>
          </div>
        )}
      </div>{" "}
      {favorites.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>💫</div>
          <h3>Nenhum favorito ainda</h3>
          <p>Explore nosso catálogo e adicione jogos aos seus favoritos!</p>
          <Link to="/jogos" className={styles.exploreButton}>
            <span className={styles.exploreIcon}>🎮</span>
            Explorar Jogos
          </Link>
        </div>
      ) : (
        <div className={styles.favoritesGrid}>
          {favorites.map((game) => (
            <div key={game.id} className={styles.favoriteCard}>
              <div className={styles.removeButton}>
                <FavoriteButton game={game} size="small" />
              </div>

              <Link to={`/jogo/${game.id}`} className={styles.gameLink}>
                <div className={styles.gameImageContainer}>
                  <SafeImage
                    src={
                      game.coverUrl ||
                      game.cover_url ||
                      game.imageUrl ||
                      game.image_url ||
                      game.imagem ||
                      game.image
                    }
                    alt={game.title || game.titulo || "Imagem do jogo"}
                    className={styles.gameImage}
                    fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIwIiBoZWlnaHQ9IjI5MyIgdmlld0JveD0iMCAwIDIyMCAyOTMiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMjAiIGhlaWdodD0iMjkzIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMTAgMTMwQzEyMC40NiAxMzAgMTI5IDEyMS40NiAxMjkgMTExQzEyOSAxMDAuNTQgMTIwLjQ2IDkyIDExMCA5MkM5OS41NCA5MiA5MSAxMDAuNTQgOTEgMTExQzkxIDEyMS40NiA5OS41NCAxMzAgMTEwIDEzMFoiIGZpbGw9IiM5N0EzQUYiLz4KPHA+PHBhdGggZD0iTTE1NSAxODBDMTQwIDE3MyAxMTAgMTQwIDExMCAxNzNDMTEwIDE3MyA4MCAxNzMgODAgMTgwSDE1NVoiIGZpbGw9IiM5N0EzQUYiLz4KPHA+PHRleHQgeD0iMTEwIiB5PSIyMjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk3QTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Sk9HTzwvdGV4dD4KPC9zdmc+Cg=="
                  />
                  {(game.averageRating || game.average_rating) && (
                    <div className={styles.gameRating}>
                      <span className={styles.ratingStar}>★</span>
                      <span className={styles.ratingNumber}>
                        {(game.averageRating || game.average_rating).toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                <div className={styles.gameInfo}>
                  <h3 className={styles.gameTitle}>
                    {game.title || game.titulo || "Jogo sem título"}
                  </h3>

                  {(game.genres || game.genreIds) && (
                    <div className={styles.gameGenres}>
                      {Array.isArray(game.genres) ? (
                        game.genres.slice(0, 3).map((genre, index) => (
                          <span key={index} className={styles.genreTag}>
                            {genre}
                          </span>
                        ))
                      ) : (
                        <span className={styles.genreTag}>
                          Diversos Gêneros
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserFavorites;
