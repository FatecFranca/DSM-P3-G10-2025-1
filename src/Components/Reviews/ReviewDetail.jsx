// src/Components/Reviews/ReviewDetail.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import styles from './ReviewDetail.module.css';
import { useAuthContext } from '../../context/AuthContext';

const ReviewDetail = () => {
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext || { isAuthenticated: false };

  // Dados mockados para uma única review
  const mockReview = {
    id: parseInt(id),
    rating: 5,
    comment: "Jogo absolutamente incrível! A narrativa é profundamente envolvente e os gráficos são de tirar o fôlego. Os personagens são bem desenvolvidos e você realmente se importa com eles ao longo da jornada. O sistema de combate é fluido e responsivo, oferecendo desafios significativos sem ser frustrante.\n\nO mundo aberto é imenso e cheio de atividades interessantes para descobrir. Cada região tem sua própria personalidade e história para contar. As missões secundárias são tão bem elaboradas quanto a história principal, muitas vezes com reviravoltas surpreendentes e escolhas morais difíceis.\n\nA trilha sonora complementa perfeitamente a experiência, criando uma atmosfera imersiva que eleva momentos-chave da história. Recomendo fortemente para todos os fãs de RPG e jogadores que apreciam narrativas bem construídas.",
    pros: [
      "Gráficos impressionantes",
      "Narrativa envolvente",
      "Mundo aberto detalhado",
      "Sistema de combate fluido",
      "Trilha sonora incrível"
    ],
    cons: [
      "Alguns bugs menores",
      "Tempos de carregamento ocasionalmente longos"
    ],
    createdAt: "2024-12-01T10:00:00Z",
    updatedAt: "2024-12-02T15:30:00Z",
    likes: 42,
    user: {
      id: 1,
      name: "João Silva",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    game: {
      id: 1,
      title: "CyberStrike 2077",
      coverUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=300&fit=crop",
      developer: "CD Projekt Red",
      releaseYear: "2024"
    }
  };

  useEffect(() => {
    const fetchReviewDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simular chamada de API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Em uma aplicação real, aqui faria uma chamada de API baseada no ID
        // const response = await reviewService.getReviewById(id);
        
        // Se a review existe no mock data
        if (mockReview) {
          setReview(mockReview);
        } else {
          setError("Review não encontrada");
        }
      } catch (err) {
        console.error("Erro ao buscar detalhes da review:", err);
        setError(err.message || "Ocorreu um erro ao carregar os detalhes da review");
      } finally {
        setLoading(false);
      }
    };

    fetchReviewDetail();
  }, [id]);

  const handleLikeClick = () => {
    if (!isAuthenticated) {
      // Redirecionar para login ou mostrar um modal
      navigate('/login', { state: { from: `/review/${id}` } });
      return;
    }
    
    setLiked(!liked);
    setReview(prev => ({
      ...prev,
      likes: liked ? prev.likes - 1 : prev.likes + 1
    }));
    
    // Em uma aplicação real, aqui faria uma chamada de API para registrar o like
    // await reactionService.reactToReview(id, 'like');
  };
  
  const handleShareClick = () => {
    // Copiar o link para a área de transferência
    navigator.clipboard.writeText(window.location.href);
    
    // Em uma aplicação real, você poderia usar uma biblioteca de toast
    alert("Link copiado para a área de transferência!");
  };

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
  
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Carregando detalhes da review...</p>
        </div>
      </div>
    );
  }
  
  if (error || !review) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h1>Review não encontrada</h1>
          <p>{error || "A review que você está procurando não existe ou foi removida."}</p>
          <Link to="/reviews" className={styles.backButton}>
            ← Voltar para Reviews
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to="/reviews" className={styles.backLink}>
          ← Voltar para Reviews
        </Link>
      </div>
      
      <article className={styles.reviewCard}>
        <div className={styles.gameSection}>
          <img 
            src={review.game.coverUrl} 
            alt={review.game.title}
            className={styles.gameCover}
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/200x300/1a1a1a/ffffff?text=${encodeURIComponent(review.game.title)}`;
            }}
          />
          
          <div className={styles.gameInfo}>
            <h1 className={styles.title}>Review: {review.game.title}</h1>
            <p className={styles.subtitle}>
              {review.game.developer} • {review.game.releaseYear}
            </p>
            <Link to={`/jogo/${review.game.id}`} className={styles.gameLink}>
              Ver página do jogo →
            </Link>
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
                  e.target.src = `https://via.placeholder.com/50x50/333/fff?text=${review.user.name.charAt(0)}`;
                }}
              />
              <div>
                <h3 className={styles.userName}>{review.user.name}</h3>
                <time className={styles.reviewDate} dateTime={review.createdAt}>
                  Publicado em {formatDate(review.createdAt)}
                </time>
              </div>
            </div>
            
            <div className={styles.rating}>
              <div className={styles.stars}>
                {renderStars(review.rating)}
              </div>
              <span className={styles.ratingNumber}>{review.rating}/5</span>
            </div>
          </div>
          
          <div className={styles.commentSection}>
            <h2 className={styles.commentTitle}>Avaliação completa:</h2>
            <div className={styles.comment}>
              {review.comment.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
          
          <div className={styles.prosConsSection}>
            <div className={styles.prosColumn}>
              <h3 className={styles.prosTitle}>Pontos positivos</h3>
              <ul className={styles.prosList}>
                {review.pros.map((pro, index) => (
                  <li key={index} className={styles.prosItem}>
                    <span className={styles.checkIcon}>✓</span> {pro}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className={styles.consColumn}>
              <h3 className={styles.consTitle}>Pontos negativos</h3>
              <ul className={styles.consList}>
                {review.cons.map((con, index) => (
                  <li key={index} className={styles.consItem}>
                    <span className={styles.xIcon}>✕</span> {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className={styles.actions}>
            <button 
              className={`${styles.likeButton} ${liked ? styles.liked : ''}`}
              onClick={handleLikeClick}
              aria-label="Curtir review"
            >
              {liked ? '❤️' : '🤍'} Curtir ({review.likes})
            </button>
            
            <button 
              className={styles.shareButton}
              onClick={handleShareClick}
              aria-label="Compartilhar review"
            >
              📤 Compartilhar
            </button>
          </div>
        </div>
      </article>
      
      <div className={styles.relatedSection}>
        <h2 className={styles.relatedTitle}>Gostou desta review?</h2>
        <p className={styles.relatedDescription}>Confira mais avaliações de outros jogadores</p>
        <Link to="/reviews" className={styles.viewAllButton}>
          Ver todas as reviews
        </Link>
      </div>
    </div>
  );
};

export default ReviewDetail;