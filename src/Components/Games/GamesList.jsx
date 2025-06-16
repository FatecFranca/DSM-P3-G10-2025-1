// src/Components/Games/GamesList.jsx
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { gameService } from '../../services';
import { useApi } from '../../Hooks/useApi';
import styles from './GamesList.module.css';

const GamesList = ({ featured = false, searchMode = false }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const search = searchParams.get('q');

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let data;
        
        if (featured) {
          data = await gameService.getFeaturedGames();
        } else if (search && searchMode) {
          data = await gameService.searchGames(search);
        } else {
          data = await gameService.getGames();
        }
        
        setGames(data || []);
      } catch (err) {
        console.error('Erro ao buscar jogos:', err);
        setError(err.message);
        // Fallback para dados mockados se a API falhar
        setGames(mockGames);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [featured, search, searchMode]);

  // Dados mockados como fallback
  const mockGames = [
    {
      id: 1,
      titulo: "CyberStrike 2077",
      imagem: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop",
      avaliacao: "9.2",
      descricao: "Um RPG futurista com elementos cyberpunk",
      genero: "RPG",
      desenvolvedor: "CD Projekt Red",
      dataLancamento: "2024-12-01"
    },
    {
      id: 2,
      titulo: "Fantasy Realms",
      imagem: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
      avaliacao: "8.7",
      descricao: "Aventure-se em um mundo mágico",
      genero: "Aventura",
      desenvolvedor: "Fantasy Studios",
      dataLancamento: "2024-11-15"
    },
    {
      id: 3,
      titulo: "Speed Horizon",
      imagem: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=600&fit=crop",
      avaliacao: "9.0",
      descricao: "Corridas em alta velocidade",
      genero: "Corrida",
      desenvolvedor: "Speed Games",
      dataLancamento: "2024-10-20"
    }
  ];

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Carregando jogos...</p>
        </div>
      </div>
    );
  }

  if (error && games.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Erro ao carregar jogos</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {featured ? '🌟 Jogos em Destaque' : 
           searchMode ? `🔍 Resultados para: "${search}"` : 
           '🎮 Todos os Jogos'}
        </h1>
        
        {search && (
          <p className={styles.searchInfo}>
            {games.length > 0 
              ? `${games.length} jogo(s) encontrado(s)`
              : 'Nenhum jogo encontrado'
            }
          </p>
        )}
      </div>
      
      {games.length === 0 ? (
        <div className={styles.noResults}>
          <div className={styles.noResultsIcon}>🎮</div>
          <h3>Nenhum jogo encontrado</h3>
          <p>Tente buscar por outro termo ou explore nossas categorias.</p>
          <Link to="/generos" className={styles.exploreButton}>
            Explorar Gêneros
          </Link>
        </div>
      ) : (
        <div className={styles.gamesGrid}>
          {games.map(game => (
            <Link to={`/jogo/${game.id}`} key={game.id} className={styles.gameCard}>
              <div className={styles.imageWrapper}>
                <img 
                  src={game.imagem || game.capa} 
                  alt={game.titulo || game.nome}
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/400x600/1a1a1a/ffffff?text=${encodeURIComponent(game.titulo || game.nome)}`;
                  }}
                />
                <div className={styles.ratingBadge}>
                  ⭐ {game.avaliacao}
                </div>
                <div className={styles.overlay}>
                  <span className={styles.playButton}>▶️</span>
                  <span className={styles.viewDetails}>Ver Detalhes</span>
                </div>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.gameTitle}>{game.titulo || game.nome}</h3>
                <p className={styles.description}>{game.descricao}</p>
                <div className={styles.gameInfo}>
                  <span className={styles.genre}>{game.genero}</span>
                  <span className={styles.developer}>{game.desenvolvedor}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default GamesList;