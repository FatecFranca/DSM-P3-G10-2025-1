// src/Components/Genres/GenrePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './GenrePage.module.css';

const GenrePage = () => {
  const { slug } = useParams();
  const [genre, setGenre] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dados mockados
  const mockGenreData = {
    'acao': {
      id: 1,
      name: 'Ação',
      description: 'Jogos cheios de adrenalina com combate intenso e sequências emocionantes.',
      games: [
        {
          id: 1,
          title: "CyberStrike 2077",
          coverUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop",
          averageRating: 9.2
        },
        {
          id: 2,
          title: "Urban Warfare",
          coverUrl: "https://images.unsplash.com/photo-1586182987320-4f376d39d787?w=400&h=600&fit=crop",
          averageRating: 8.5
        }
      ]
    },
    'aventura': {
      id: 2,
      name: 'Aventura',
      description: 'Explore mundos vastos e viva histórias épicas.',
      games: [
        {
          id: 3,
          title: "Fantasy Realms",
          coverUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
          averageRating: 8.7
        }
      ]
    }
  };

  useEffect(() => {
    const fetchGenre = async () => {
      try {
        setLoading(true);
        // Simular chamada API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const genreData = mockGenreData[slug];
        if (genreData) {
          setGenre(genreData);
        }
      } catch (error) {
        console.error('Erro ao buscar gênero:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenre();
  }, [slug]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!genre) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h1>Gênero não encontrado</h1>
          <p>O gênero que você está procurando não existe.</p>
          <Link to="/generos" className={styles.backButton}>
            ← Voltar para Gêneros
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to="/generos" className={styles.backLink}>
          ← Todos os Gêneros
        </Link>
        <h1 className={styles.title}>{genre.name}</h1>
        <p className={styles.description}>{genre.description}</p>
        <div className={styles.stats}>
          {genre.games.length} {genre.games.length === 1 ? 'jogo' : 'jogos'} disponível
        </div>
      </div>
      
      <div className={styles.gamesSection}>
        <h2 className={styles.sectionTitle}>Jogos de {genre.name}</h2>
        
        <div className={styles.gamesGrid}>
          {genre.games.map(game => (
            <Link to={`/jogo/${game.id}`} key={game.id} className={styles.gameCard}>
              <div className={styles.imageWrapper}>
                <img 
                  src={game.coverUrl} 
                  alt={game.title}
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/400x600/1a1a1a/ffffff?text=${encodeURIComponent(game.title)}`;
                  }}
                />
                <div className={styles.ratingBadge}>
                  ⭐ {game.averageRating}
                </div>
                <div className={styles.overlay}>
                  <span className={styles.playButton}>▶️</span>
                </div>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.gameTitle}>{game.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GenrePage;