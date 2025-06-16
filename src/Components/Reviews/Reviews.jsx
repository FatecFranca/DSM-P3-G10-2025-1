// src/Components/Reviews/Reviews.jsx
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import styles from './Reviews.module.css';

const Reviews = ({ filter, createMode = false }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const gameId = searchParams.get('gameId');

  // Dados mockados
  const mockReviews = [
    {
      id: 1,
      rating: 5,
      comment: "Jogo incrível! A narrativa é envolvente e os gráficos são de tirar o fôlego. Recomendo fortemente para todos os fãs de RPG.",
      createdAt: "2024-12-01T10:00:00Z",
      user: {
        id: 1,
        name: "João Silva",
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
      },
      game: {
        id: 1,
        title: "CyberStrike 2077",
        coverUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=300&fit=crop"
      }
    },
    {
      id: 2,
      rating: 4,
      comment: "Muito bom jogo! Alguns bugs menores, mas a experiência geral é excelente. A jogabilidade é fluida e divertida.",
      createdAt: "2024-11-28T15:30:00Z",
      user: {
        id: 2,
        name: "Maria Santos",
        avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
      },
      game: {
        id: 2,
        title: "Fantasy Realms",
        coverUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=300&fit=crop"
      }
    },
    {
      id: 3,
      rating: 5,
      comment: "Perfeito! Este jogo superou todas as minhas expectativas. A física é realista e as corridas são emocionantes.",
      createdAt: "2024-11-25T09:15:00Z",
      user: {
        id: 3,
        name: "Carlos Oliveira",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
      },
      game: {
        id: 3,
        title: "Speed Horizon",
        coverUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=200&h=300&fit=crop"
      }
    },
    {
      id: 4,
      rating: 3,
      comment: "Jogo mediano. Tem potencial, mas precisa de algumas melhorias na jogabilidade e correção de bugs.",
      createdAt: "2024-11-20T14:45:00Z",
      user: {
        id: 4,
        name: "Ana Costa",
        avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
      },
      game: {
        id: 4,
        title: "Battle Arena",
        coverUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200&h=300&fit=crop"
      }
    },
    {
      id: 5,
      rating: 5,
      comment: "Obra-prima! A atmosfera de terror é perfeita, me deixou com medo de jogar sozinho. Excelente trabalho!",
      createdAt: "2024-11-18T20:30:00Z",
      user: {
        id: 5,
        name: "Pedro Lima",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
      },
      game: {
        id: 5,
        title: "Mystery House",
        coverUrl: "https://images.unsplash.com/photo-1551731409-43eb3e517a1a?w=200&h=300&fit=crop"
      }
    }
  ];

  useEffect(() => {
    const fetchReviews = () => {
      setLoading(true);
      
      // Simular carregamento
      setTimeout(() => {
        let filteredReviews = mockReviews;
        
        if (filter === 'popular') {
          filteredReviews = mockReviews.filter(review => review.rating >= 4);
        } else if (filter === 'recent') {
          filteredReviews = mockReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (gameId) {
          filteredReviews = mockReviews.filter(review => review.game.id === parseInt(gameId));
        }
        
        setReviews(filteredReviews);
        setLoading(false);
      }, 800);
    };

    if (!createMode) {
      fetchReviews();
    } else {
      setLoading(false);
    }
  }, [filter, gameId, createMode]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`${styles.star} ${index < rating ? styles.filled : ''}`}>
        ★
      </span>
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (createMode) {
    return (
      <div className={styles.container}>
        <div className={styles.createForm}>
          <h1>Criar Nova Review</h1>
          <p>Funcionalidade de criação em desenvolvimento...</p>
          <div className={styles.formPreview}>
            <h3>Em breve você poderá:</h3>
            <ul>
              <li>✨ Avaliar jogos com sistema de estrelas</li>
              <li>📝 Escrever reviews detalhadas</li>
              <li>📷 Adicionar screenshots</li>
              <li>🎯 Marcar jogos como favoritos</li>
            </ul>
          </div>
          <Link to="/reviews" className={styles.backButton}>
            ← Voltar para Reviews
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Carregando reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {filter === 'popular' ? '⭐ Reviews Populares' :
           filter === 'recent' ? '🕒 Reviews Recentes' :
           gameId ? '🎮 Reviews do Jogo' :
           '📝 Todas as Reviews'}
        </h1>
        
        <div className={styles.actions}>
          <Link to="/criar/review" className={styles.createButton}>
            + Nova Review
          </Link>
        </div>
      </div>
      
      <div className={styles.reviewsList}>
        {reviews.map(review => (
          <Link to={`/review/${review.id}`} key={review.id} className={styles.reviewCard}>
            <div className={styles.gameInfo}>
              <img 
                src={review.game.coverUrl} 
                alt={review.game.title}
                className={styles.gameCover}
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/100x150/1a1a1a/ffffff?text=${encodeURIComponent(review.game.title)}`;
                }}
              />
              <div className={styles.gameDetails}>
                <h3 className={styles.gameTitle}>{review.game.title}</h3>
              </div>
            </div>
            
            <div className={styles.reviewContent}>
              <div className={styles.reviewHeader}>
                <div className={styles.userInfo}>
                  <img 
                    src={review.user.avatarUrl} 
                    alt={review.user.name}
                    className={styles.userAvatar}
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/40x40/333/fff?text=${review.user.name.charAt(0)}`;
                    }}
                  />
                  <div>
                    <span className={styles.userName}>{review.user.name}</span>
                    <span className={styles.reviewDate}>{formatDate(review.createdAt)}</span>
                  </div>
                </div>
                
                <div className={styles.rating}>
                  <div className={styles.stars}>
                    {renderStars(review.rating)}
                  </div>
                  <span className={styles.ratingNumber}>{review.rating}/5</span>
                </div>
              </div>
              
              <p className={styles.comment}>{review.comment}</p>
            </div>
          </Link>
        ))}
      </div>
      
      {reviews.length === 0 && (
        <div className={styles.noReviews}>
          <div className={styles.noReviewsIcon}>📝</div>
          <h3>Nenhuma review encontrada</h3>
          <p>Seja o primeiro a compartilhar sua opinião!</p>
          <Link to="/criar/review" className={styles.createFirstButton}>
            Criar Primeira Review
          </Link>
        </div>
      )}
    </div>
  );
};

export default Reviews;