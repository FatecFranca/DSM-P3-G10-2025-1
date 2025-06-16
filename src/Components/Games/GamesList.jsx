import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './GamesList.module.css';

const GamesList = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        
        // Exemplo de como buscar dados do backend
        // const response = await fetch('http://localhost:5000/api/games');
        // const data = await response.json();
        
        // Dados de exemplo para teste
        const data = {
          games: [
            { id: '1', title: 'The Last of Us Part II', coverUrl: 'https://example.com/tlou2.jpg', averageRating: 4.8 },
            { id: '2', title: 'God of War Ragnarök', coverUrl: 'https://example.com/gow.jpg', averageRating: 4.7 },
            { id: '3', title: 'Elden Ring', coverUrl: 'https://example.com/elden.jpg', averageRating: 4.9 },
            { id: '4', title: 'Horizon Forbidden West', coverUrl: 'https://example.com/horizon.jpg', averageRating: 4.5 },
            { id: '5', title: 'Cyberpunk 2077', coverUrl: 'https://example.com/cyberpunk.jpg', averageRating: 3.8 },
            { id: '6', title: 'Spider-Man Miles Morales', coverUrl: 'https://example.com/spiderman.jpg', averageRating: 4.6 },
          ]
        };
        
        setGames(data.games);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar jogos:', error);
        setError('Não foi possível carregar a lista de jogos. Por favor, tente novamente mais tarde.');
        setLoading(false);
      }
    };
    
    fetchGames();
  }, []);
  
  // Filtrar jogos com base no termo de pesquisa
  const filteredGames = games.filter(game => 
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Catálogo de Jogos</h1>
        <p className={styles.subtitle}>Explore nossa coleção completa de jogos</p>
        
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Buscar jogos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </section>
      
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Carregando jogos...</p>
        </div>
      ) : error ? (
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Tentar novamente</button>
        </div>
      ) : (
        <div className={styles.gamesGrid}>
          {filteredGames.length > 0 ? (
            filteredGames.map(game => (
              <Link to={`/jogo/${game.id}`} key={game.id} className={styles.gameCard}>
                <div className={styles.gameImage}>
                  <img 
                    src={game.coverUrl || 'https://via.placeholder.com/300x400?text=Sem+Imagem'} 
                    alt={game.title}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x400?text=Sem+Imagem';
                    }}
                  />
                </div>
                <div className={styles.gameInfo}>
                  <h3 className={styles.gameTitle}>{game.title}</h3>
                  <div className={styles.gameRating}>
                    <span className={styles.starIcon}>★</span>
                    <span>{game.averageRating?.toFixed(1) || 'N/A'}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className={styles.noGames}>
              {searchTerm 
                ? `Nenhum jogo encontrado para "${searchTerm}".`
                : 'Nenhum jogo disponível no momento.'
              }
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default GamesList;