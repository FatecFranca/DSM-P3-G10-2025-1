import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import styles from './CreateReview.module.css';

const CreateReview = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthContext();
  
  // Estados para o formulário
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [gameId, setGameId] = useState('');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Verificar se o usuário está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      // Redirecionar para login se não estiver autenticado
      navigate('/login', { state: { from: '/criar/review' } });
    }
  }, [isAuthenticated, navigate]);
  
  // Buscar lista de jogos para o select
  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      
      try {
        // Em um app real, você faria uma requisição para o backend
        // const response = await fetch('/api/games');
        // const data = await response.json();
        
        // Simulando dados
        setTimeout(() => {
          const mockGames = [
            { id: '1', title: 'The Last of Us Part II' },
            { id: '2', title: 'God of War Ragnarök' },
            { id: '3', title: 'Elden Ring' },
            { id: '4', title: 'Horizon Forbidden West' },
            { id: '5', title: 'Cyberpunk 2077' },
            { id: '6', title: 'Spider-Man Miles Morales' },
            { id: '7', title: 'Hades' },
            { id: '8', title: 'Red Dead Redemption 2' },
          ];
          
          setGames(mockGames);
          setLoading(false);
        }, 800);
        
      } catch (err) {
        console.error('Erro ao buscar jogos:', err);
        setError('Não foi possível carregar a lista de jogos');
        setLoading(false);
      }
    };
    
    fetchGames();
  }, []);
  
  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validações
    if (!title.trim()) {
      setError('O título da review é obrigatório');
      return;
    }
    
    if (!content.trim() || content.length < 50) {
      setError('A review deve ter pelo menos 50 caracteres');
      return;
    }
    
    if (rating === 0) {
      setError('Por favor, selecione uma avaliação');
      return;
    }
    
    if (!gameId) {
      setError('Por favor, selecione um jogo');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Dados da review
      const reviewData = {
        title,
        content,
        rating,
        gameId,
        userId: user.id
      };
      
      console.log('Dados da review a ser criada:', reviewData);
      
      // Simular envio para o backend
      setTimeout(() => {
        // Em um app real, você faria algo como:
        // await fetch('/api/reviews', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(reviewData)
        // });
        
        // Simular sucesso 
        // Redirecionar para a página da review recém-criada
        // em um app real, você usaria o ID retornado pela API
        const mockNewReviewId = Math.floor(Math.random() * 1000);
        navigate(`/review/${mockNewReviewId}`, { 
          state: { 
            message: 'Review criada com sucesso!',
            success: true
          }
        });
      }, 1500);
      
    } catch (err) {
      console.error('Erro ao criar review:', err);
      setError('Ocorreu um erro ao criar a review. Por favor, tente novamente.');
      setSubmitting(false);
    }
  };
  
  // Função para lidar com a seleção de estrelas
  const handleRatingClick = (selectedRating) => {
    setRating(selectedRating);
  };
  
  // Se estiver carregando, mostrar indicador
  if (loading && !isAuthenticated) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Criar Nova Review</h1>
        <p className={styles.subtitle}>Compartilhe sua opinião sobre um jogo</p>
      </div>
      
      <form className={styles.form} onSubmit={handleSubmit}>
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}
        
        <div className={styles.formGroup}>
          <label htmlFor="game">Jogo</label>
          <select 
            id="game" 
            value={gameId} 
            onChange={(e) => setGameId(e.target.value)}
            disabled={submitting}
            required
          >
            <option value="">Selecione um jogo</option>
            {games.map(game => (
              <option key={game.id} value={game.id}>
                {game.title}
              </option>
            ))}
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="title">Título da Review</label>
          <input 
            type="text" 
            id="title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Uma obra-prima do gênero"
            disabled={submitting}
            maxLength={100}
            required
          />
          <small className={styles.charactersCount}>
            {title.length}/100 caracteres
          </small>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="rating">Avaliação</label>
          <div className={styles.starsRating}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span 
                key={star}
                className={`${styles.star} ${star <= rating ? styles.active : ''}`}
                onClick={() => handleRatingClick(star)}
                title={`${star} estrela${star !== 1 ? 's' : ''}`}
              >
                ★
              </span>
            ))}
            {rating > 0 && (
              <span className={styles.ratingText}>
                {rating}/5
              </span>
            )}
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="content">Sua Review</label>
          <textarea 
            id="content" 
            value={content} 
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escreva uma review detalhada sobre o jogo. O que você gostou? O que poderia ser melhor? Recomenda para outros jogadores?"
            rows={10}
            disabled={submitting}
            required
          />
          <small className={styles.charactersCount}>
            {content.length} caracteres (mínimo 50)
          </small>
        </div>
        
        <div className={styles.formActions}>
          <button 
            type="button" 
            className={styles.cancelButton}
            onClick={() => navigate('/reviews')}
            disabled={submitting}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={submitting}
          >
            {submitting ? 'Enviando...' : 'Publicar Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateReview;