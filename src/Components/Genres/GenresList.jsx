// src/Components/Genres/GenresList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './GenresList.module.css';

const GenresList = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dados mockados
  const mockGenres = [
    { id: 1, name: "Ação", description: "Jogos cheios de adrenalina", _count: { games: 45 } },
    { id: 2, name: "Aventura", description: "Explore mundos incríveis", _count: { games: 32 } },
    { id: 3, name: "RPG", description: "Role-playing games épicos", _count: { games: 28 } },
    { id: 4, name: "Estratégia", description: "Teste suas habilidades táticas", _count: { games: 23 } },
    { id: 5, name: "Simulação", description: "Simule a realidade", _count: { games: 19 } },
    { id: 6, name: "Corrida", description: "Velocidade máxima", _count: { games: 15 } },
    { id: 7, name: "Terror", description: "Para os corajosos", _count: { games: 12 } },
    { id: 8, name: "Indie", description: "Criatividade independente", _count: { games: 38 } }
  ];

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        // Simular chamada API
        await new Promise(resolve => setTimeout(resolve, 800));
        setGenres(mockGenres);
      } catch (error) {
        console.error('Erro ao buscar gêneros:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const getGenreIcon = (name) => {
    const icons = {
      'Ação': '⚔️',
      'Aventura': '🗺️',
      'RPG': '🐉',
      'Estratégia': '♟️',
      'Simulação': '🎯',
      'Corrida': '🏎️',
      'Terror': '👻',
      'Indie': '🎨'
    };
    return icons[name] || '🎮';
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Carregando gêneros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>🎮 Gêneros de Jogos</h1>
        <p className={styles.subtitle}>
          Descubra jogos organizados por categoria
        </p>
      </div>
      
      <div className={styles.genresGrid}>
        {genres.map(genre => (
          <Link 
            to={`/genero/${genre.name.toLowerCase().replace(/\s+/g, '-')}`} 
            key={genre.id} 
            className={styles.genreCard}
          >
            <div className={styles.genreIcon}>
              {getGenreIcon(genre.name)}
            </div>
            <div className={styles.genreInfo}>
              <h3 className={styles.genreName}>{genre.name}</h3>
              <p className={styles.genreDescription}>{genre.description}</p>
              <div className={styles.gameCount}>
                {genre._count.games} {genre._count.games === 1 ? 'jogo' : 'jogos'}
              </div>
            </div>
            <div className={styles.arrow}>→</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GenresList;