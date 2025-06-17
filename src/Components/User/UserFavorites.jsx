import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import styles from './UserFavorites.module.css';

const UserFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  // Dados mockados para demonstração
  const MOCK_FAVORITES = [
    {
      id: 1,
      title: "God of War: Ragnarok",
      coverUrl: "https://cdn.cdkeys.com/media/catalog/product/g/o/godofwarragnaroek_1.jpg",
      averageRating: 4.8,
      genres: [{ name: "Ação" }, { name: "Aventura" }],
      platforms: ["PS5", "PS4"],
      releaseDate: "2022-11-09",
      addedAt: "2023-11-15T14:22:00Z"
    },
    {
      id: 2,
      title: "Elden Ring",
      coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202110/2000/phvVT0qZfcRms5qDAk0SI3CM.png",
      averageRating: 4.9,
      genres: [{ name: "RPG" }, { name: "Mundo Aberto" }],
      platforms: ["PC", "PS5", "Xbox Series X/S"],
      releaseDate: "2022-02-25",
      addedAt: "2023-10-28T10:15:00Z"
    },
    {
      id: 3,
      title: "The Last of Us Part II",
      coverUrl: "https://image.api.playstation.com/vulcan/img/rnd/202010/2618/Y02ljdVJyuJ5j7JoFJacBAAY.png",
      averageRating: 4.7,
      genres: [{ name: "Ação" }, { name: "Sobrevivência" }],
      platforms: ["PS4", "PS5"],
      releaseDate: "2020-06-19",
      addedAt: "2023-09-15T10:00:00Z"
    }
  ];

  useEffect(() => {
    const loadFavorites = () => {
      setLoading(true);
      // Simular carregamento
      setTimeout(() => {
        setFavorites(MOCK_FAVORITES);
        setLoading(false);
      }, 1000);
    };
    
    loadFavorites();
  }, []);

  const renderStars = (rating) => {
    return Array(5).fill().map((_, i) => (
      <span 
        key={i} 
        className={i < Math.floor(rating) ? styles.starFilled : styles.starEmpty}
      >
        ★
      </span>
    ));
  };

  const handleRemoveFavorite = (gameId) => {
    if (window.confirm('Remover este jogo dos seus favoritos?')) {
      setFavorites(prev => prev.filter(game => game.id !== gameId));
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Carregando jogos favoritos...</p>
      </div>
    );
  }

  return (
    <div className={styles.userFavorites}>
      <div className={styles.favoritesHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Jogos Favoritos</h1>
          <p className={styles.subtitle}>Seus jogos mais queridos em um só lugar</p>
        </div>
        <div className={styles.favoritesCount}>
          <span className={styles.countNumber}>{favorites.length}</span>
          <span className={styles.countLabel}>jogos</span>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>❤️</div>
          <h3>Nenhum jogo favorito ainda</h3>
          <p>Explore nossa biblioteca e adicione jogos aos seus favoritos para encontrá-los facilmente depois.</p>
          <Link to="/jogos" className={styles.exploreButton}>
            <span className={styles.exploreIcon}>🎮</span>
            Explorar Jogos
          </Link>
        </div>
      ) : (
        <div className={styles.favoritesGrid}>
          {favorites.map(game => (
            <div key={game.id} className={styles.favoriteCard}>
              <button 
                className={styles.removeButton}
                onClick={() => handleRemoveFavorite(game.id)}
                title="Remover dos favoritos"
              >
                ❌
              </button>

              <Link to={`/jogo/${game.id}`} className={styles.gameLink}>
                <div className={styles.gameImageContainer}>
                  <img 
                    src={game.coverUrl || '/placeholder-game.jpg'} 
                    alt={game.title}
                    className={styles.gameImage}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x400?text=Game';
                    }}
                  />
                  
                  <div className={styles.gameRating}>
                    <span className={styles.ratingValue}>
                      {game.averageRating || '?'}
                    </span>
                    <small>/5</small>
                  </div>
                </div>

                <div className={styles.gameInfo}>
                  <h3 className={styles.gameTitle}>{game.title}</h3>
                  
                  <div className={styles.gameGenres}>
                    {game.genres?.slice(0, 2).map((genre, index) => (
                      <span key={index} className={styles.genreTag}>
                        {genre.name}
                      </span>
                    ))}
                    {game.genres?.length > 2 && (
                      <span className={styles.genreTag}>
                        +{game.genres.length - 2}
                      </span>
                    )}
                  </div>

                  <div className={styles.gamePlatforms}>
                    {game.platforms?.slice(0, 3).map((platform, index) => (
                      <span key={index} className={styles.platformTag}>
                        {platform}
                      </span>
                    ))}
                    {game.platforms?.length > 3 && (
                      <span className={styles.platformTag}>
                        +{game.platforms.length - 3}
                      </span>
                    )}
                  </div>

                  <div className={styles.gameRatingStars}>
                    {renderStars(game.averageRating)}
                  </div>
                </div>
              </Link>

              <div className={styles.favoriteFooter}>
                <span className={styles.addedDate}>
                  Adicionado em {new Date(game.addedAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserFavorites;