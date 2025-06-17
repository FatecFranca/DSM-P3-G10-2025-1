import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import styles from './UserReviews.module.css';

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  // Dados mockados para demonstração
  const MOCK_REVIEWS = [
    {
      id: 1,
      title: "Uma obra-prima moderna",
      rating: 5,
      content: "God of War: Ragnarok supera todas as expectativas com uma narrativa emocionante...",
      createdAt: "2023-11-15T14:22:00Z",
      updatedAt: "2023-11-15T14:22:00Z",
      game: {
        id: 1,
        title: "God of War: Ragnarok",
        coverUrl: "https://cdn.cdkeys.com/media/catalog/product/g/o/godofwarragnaroek_1.jpg"
      },
      likes: 24,
      comments: 8
    },
    {
      id: 2,
      title: "Desafiador e viciante",
      rating: 4.5,
      content: "Elden Ring oferece um mundo aberto incrível com desafios constantes...",
      createdAt: "2023-10-28T10:15:00Z",
      updatedAt: "2023-10-28T10:15:00Z",
      game: {
        id: 2,
        title: "Elden Ring",
        coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202110/2000/phvVT0qZfcRms5qDAk0SI3CM.png"
      },
      likes: 18,
      comments: 5
    }
  ];

  useEffect(() => {
    const loadReviews = () => {
      setLoading(true);
      // Simular carregamento
      setTimeout(() => {
        setReviews(MOCK_REVIEWS);
        setLoading(false);
      }, 1000);
    };
    
    loadReviews();
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

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Carregando suas reviews...</p>
      </div>
    );
  }

  return (
    <div className={styles.userReviews}>
      <div className={styles.reviewsHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Minhas Reviews</h1>
          <p className={styles.subtitle}>Gerencie suas avaliações de jogos</p>
        </div>
        <Link to="/criar/review" className={styles.createButton}>
          <span className={styles.createIcon}>➕</span>
          Nova Review
        </Link>
      </div>

      {reviews.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📝</div>
          <h3>Nenhuma review publicada ainda</h3>
          <p>Que tal compartilhar sua opinião sobre um jogo que você jogou recentemente?</p>
          <Link to="/criar/review" className={styles.createFirstReview}>
            Criar minha primeira review
          </Link>
        </div>
      ) : (
        <div className={styles.reviewsList}>
          {reviews.map(review => (
            <div key={review.id} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <div className={styles.gameInfo}>
                  <img 
                    src={review.game?.coverUrl || '/placeholder-game.jpg'} 
                    alt={review.game?.title}
                    className={styles.gameThumb}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80x100?text=Game';
                    }}
                  />
                  <div className={styles.gameDetails}>
                    <h4 className={styles.gameTitle}>{review.game?.title}</h4>
                    <div className={styles.reviewRating}>
                      {renderStars(review.rating)}
                      <span className={styles.ratingNumber}>({review.rating}/5)</span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.reviewActions}>
                  <Link 
                    to={`/review/${review.id}`} 
                    className={styles.viewButton}
                    title="Ver review"
                  >
                    👁️
                  </Link>
                  <Link 
                    to={`/review/${review.id}/editar`} 
                    className={styles.editButton}
                    title="Editar review"
                  >
                    ✏️
                  </Link>
                </div>
              </div>

              <div className={styles.reviewContent}>
                <h3 className={styles.reviewTitle}>{review.title}</h3>
                <p className={styles.reviewExcerpt}>
                  {review.content?.length > 200 
                    ? `${review.content.substring(0, 200)}...` 
                    : review.content
                  }
                </p>
              </div>

              <div className={styles.reviewFooter}>
                <div className={styles.reviewStats}>
                  <span className={styles.stat}>
                    <span className={styles.statIcon}>👍</span>
                    {review.likes || 0} curtidas
                  </span>
                  <span className={styles.stat}>
                    <span className={styles.statIcon}>💬</span>
                    {review.comments || 0} comentários
                  </span>
                </div>
                
                <div className={styles.reviewMeta}>
                  <span className={styles.publishDate}>
                    Publicada em {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserReviews;