import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from '../services/api';
import styles from "./Home.module.css";
import BannerCarousel from './BannerCarousel';
import { useAuthContext } from '../context/AuthContext';
import { motion } from "framer-motion"; // Você precisará instalar: npm install framer-motion

// Dados de exemplo para usar quando a API falhar
const MOCK_GAMES = [
  {
    id: 1, 
    title: "God of War: Ragnarok", 
    coverUrl: "https://cdn.cdkeys.com/media/catalog/product/g/o/godofwarragnaroek_1.jpg",
    averageRating: 4.8,
    genres: [
      {id: 1, name: "Ação"}, 
      {id: 2, name: "Aventura"}
    ],
    platforms: ["PS5", "PS4"]
  },
  // ... adicione mais jogos fictícios aqui
];

const MOCK_REVIEWS = [
  {
    id: 1, 
    title: "Obra-prima do gênero", 
    comment: "God of War: Ragnarok é um dos melhores jogos que já joguei...", 
    rating: 5,
    createdAt: "2023-11-15T14:22:00Z",
    user: {id: 1, name: "Carlos Silva", avatarUrl: "https://randomuser.me/api/portraits/men/44.jpg"},
    game: {id: 1, title: "God of War: Ragnarok", coverUrl: "https://cdn.cdkeys.com/media/catalog/product/g/o/godofwarragnaroek_1.jpg"}
  },
  // ... adicione mais reviews fictícias aqui
];

const Home = () => {
  // Estados
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featuredGames, setFeaturedGames] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [useMockData, setUseMockData] = useState(false);
  const { isAuthenticated } = useAuthContext();

  // Lista de banners para o carrossel
  const banners = [
    {
      id: 1,
      title: "Descubra os Melhores Jogos",
      description: "Explore avaliações detalhadas e encontre sua próxima aventura",
      imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      link: "/jogos"
    },
    {
      id: 2,
      title: "Compartilhe Suas Experiências",
      description: "Crie reviews e ajude outros gamers a fazer escolhas informadas",
      imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      link: "/criar/review"
    },
    {
      id: 3,
      title: "Junte-se à Comunidade",
      description: "Participe de discussões e faça parte da maior comunidade de gamers",
      imageUrl: "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      link: "/login/cadastro"
    }
  ];

  // Principais categorias para exibição (destacamos apenas as mais importantes)
  const topCategories = [
    "Todos", "Ação", "Aventura", "RPG", "Estratégia", "Indie", "Terror"
  ];

  // Função para buscar dados da API
  const fetchHomeData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (useMockData) {
        console.log("Usando dados fictícios porque a API falhou anteriormente");
        setFeaturedGames(MOCK_GAMES);
        setRecentReviews(MOCK_REVIEWS);
        return;
      }
      
      // Use Promise.allSettled para evitar que um erro em uma requisição bloqueie a outra
      const [gamesResponse, reviewsResponse] = await Promise.allSettled([
        api.get('/games?featured=true&limit=6'),
        api.get('/reviews?recent=true&limit=3')
      ]);
      
      // Processa os jogos em destaque
      if (gamesResponse.status === 'fulfilled') {
        setFeaturedGames(gamesResponse.value.data.games || []);
      } else {
        console.error('Erro ao carregar jogos:', gamesResponse.reason);
        setFeaturedGames(MOCK_GAMES);
      }
      
      // Processa as reviews recentes
      if (reviewsResponse.status === 'fulfilled') {
        setRecentReviews(reviewsResponse.value.data.reviews || []);
      } else {
        console.error('Erro ao carregar reviews:', reviewsResponse.reason);
        setRecentReviews(MOCK_REVIEWS);
      }
    } catch (err) {
      console.error('Erro ao carregar dados da home:', err);
      setError('Problema ao conectar com o servidor. Usando dados de exemplo.');
      setFeaturedGames(MOCK_GAMES);
      setRecentReviews(MOCK_REVIEWS);
      setUseMockData(true); // Nas próximas chamadas, use diretamente os dados fictícios
    } finally {
      setLoading(false);
    }
  }, [useMockData]);
  
  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  // Componente de estado de carregamento animado
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <motion.div 
          className={styles.loadingSpinner}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Carregando sua experiência de jogos...
        </motion.p>
      </div>
    );
  }

  // Componente de erro com opção de tentar novamente
  if (error) {
    return (
      <motion.div 
        className={styles.errorContainer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.errorIcon}>⚠️</div>
        <h2>Ops! Algo deu errado</h2>
        <p>{error}</p>
        <motion.button 
          className={styles.retryButton}
          onClick={fetchHomeData}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Tentar novamente
        </motion.button>
      </motion.div>
    );
  }

  // Filtragem de jogos por categoria (se necessário)
  const filteredGames = selectedCategory === "Todos" 
    ? featuredGames 
    : featuredGames.filter(game => 
        game.genres?.some(genre => genre.name === selectedCategory)
      );

  return (
    <main className={styles.mainContainer}>
      {/* Hero Carousel Section */}
      <section className={styles.heroSection}>
        <BannerCarousel banners={banners} />
      </section>

      {/* Jogos em Destaque com Categorias */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Jogos em Destaque
          </motion.h2>
          <Link to="/jogos" className={styles.viewAllLink}>
            Ver todos <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Filtro por categorias */}
        <div className={styles.categoryFilter}>
          {topCategories.map((category) => (
            <motion.button
              key={category}
              className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
              onClick={() => setSelectedCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {getCategoryIcon(category)} {category}
            </motion.button>
          ))}
        </div>

        {/* Grid de jogos */}
        <div className={styles.gameGrid}>
          {filteredGames.length > 0 ? (
            filteredGames.map(game => (
              <motion.div
                key={game.id}
                className={styles.gameCard}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -8, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
              >
                <Link to={`/jogo/${game.id}`} className={styles.gameCardLink}>
                  <div className={styles.gameImageContainer}>
                    <img 
                      src={game.coverUrl || 'https://via.placeholder.com/300x400?text=Sem+imagem'} 
                      alt={game.title} 
                      className={styles.gameImage}
                      loading="lazy"
                    />
                    <div className={styles.gameRating}>
                      <span>{game.averageRating || '?'}</span>
                      <small>/5</small>
                    </div>
                  </div>
                  <div className={styles.gameInfo}>
                    <h3 className={styles.gameTitle}>{game.title}</h3>
                    <div className={styles.gameMeta}>
                      {game.genres?.slice(0, 2).map((genre, index) => (
                        <span key={index} className={styles.gameGenre}>{genre.name}</span>
                      ))}
                      {game.genres?.length > 2 && <span className={styles.gameGenre}>+{game.genres.length - 2}</span>}
                    </div>
                    <div className={styles.gamePlatforms}>
                      {game.platforms?.map((platform, index) => (
                        <span key={index} className={styles.platformIcon} title={platform}>
                          {getPlatformIcon(platform)}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🔍</div>
              <p>Nenhum jogo encontrado nesta categoria.</p>
              <button 
                onClick={() => setSelectedCategory("Todos")}
                className={styles.resetButton}
              >
                Ver todos os jogos
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Reviews Recentes */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Reviews Recentes
          </motion.h2>
          <Link to="/reviews" className={styles.viewAllLink}>
            Ver todas <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className={styles.reviewsGrid}>
          {recentReviews.length > 0 ? (
            recentReviews.map((review, index) => (
              <motion.div 
                key={review.id} 
                className={styles.reviewCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -5, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}
              >
                <div className={styles.reviewHeader}>
                  <Link to={`/jogo/${review.game?.id}`} className={styles.reviewGameLink}>
                    <div className={styles.reviewGameThumb}>
                      <img 
                        src={review.game?.coverUrl || 'https://via.placeholder.com/60x60?text=Jogo'} 
                        alt={review.game?.title}
                        loading="lazy" 
                      />
                    </div>
                    <div className={styles.reviewGameInfo}>
                      <span className={styles.reviewGameTitle}>{review.game?.title || 'Jogo'}</span>
                      <div className={styles.ratingStars}>
                        {Array(5).fill().map((_, i) => (
                          <span key={i} className={i < review.rating ? styles.starFilled : styles.starEmpty}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </div>

                <div className={styles.reviewContent}>
                  <Link to={`/review/${review.id}`} className={styles.reviewTitleLink}>
                    <h3 className={styles.reviewTitle}>{review.title}</h3>
                  </Link>
                  <p className={styles.reviewExcerpt}>
                    {review.comment?.length > 150
                      ? `${review.comment.substring(0, 150)}...`
                      : review.comment}
                  </p>
                </div>

                <div className={styles.reviewFooter}>
                  <Link to={`/review/${review.id}`} className={styles.readMoreLink}>
                    Ler review completa <span aria-hidden="true">→</span>
                  </Link>
                  <div className={styles.reviewMeta}>
                    <Link to={`/usuario/${review.user?.id}`} className={styles.reviewAuthor}>
                      <img 
                        src={review.user?.avatarUrl || 'https://via.placeholder.com/30x30?text=User'} 
                        alt={review.user?.name || 'Usuário'}
                        className={styles.reviewAuthorAvatar}
                      />
                      <span>{review.user?.name || 'Usuário'}</span>
                    </Link>
                    <time dateTime={new Date(review.createdAt).toISOString()}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </time>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📝</div>
              <p>Nenhuma review publicada recentemente.</p>
              {isAuthenticated ? (
                <Link to="/criar/review" className={styles.createButton}>
                  Criar uma review
                </Link>
              ) : (
                <Link to="/login" className={styles.createButton}>
                  Faça login para criar reviews
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Call To Action Section */}
      <motion.section 
        className={styles.ctaSection}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className={styles.ctaContainer}>
          <div className={styles.ctaContent}>
            <div className={styles.ctaIconContainer}>
              <span className={styles.ctaIcon}>🎮</span>
            </div>
            <h2>Junte-se à Nossa Comunidade de Gamers</h2>
            <p>
              Entre para a maior comunidade de reviews de jogos do Brasil e compartilhe suas experiências.
              Mais de 15 mil gamers já fazem parte!
            </p>
            
            <div className={styles.ctaFeatures}>
              <div className={styles.ctaFeature}>
                <div className={styles.ctaFeatureIcon}>✓</div>
                <span>Reviews exclusivas</span>
              </div>
              <div className={styles.ctaFeature}>
                <div className={styles.ctaFeatureIcon}>✓</div>
                <span>Notificações personalizadas</span>
              </div>
              <div className={styles.ctaFeature}>
                <div className={styles.ctaFeatureIcon}>✓</div>
                <span>Comunidade ativa</span>
              </div>
            </div>
            
            <div className={styles.ctaButtons}>
              {!isAuthenticated ? (
                <>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/login/cadastro" className={styles.ctaPrimaryButton}>
                      Criar Conta Grátis
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/login" className={styles.ctaSecondaryButton}>
                      Já tenho uma conta
                    </Link>
                  </motion.div>
                </>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/criar/review" className={styles.ctaPrimaryButton}>
                    Criar Nova Review
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
          <div className={styles.ctaImageContainer}>
            <img 
              src="https://images.unsplash.com/photo-1554213352-5ffe6534af08?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=80" 
              alt="Comunidade de gamers" 
              className={styles.ctaImage}
              loading="lazy"
            />
          </div>
        </div>
      </motion.section>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </main>
  );
};

// Função para obter ícones de categoria
const getCategoryIcon = (categoria) => {
  const icons = {
    'Todos': '🎲',
    'Ação': '⚔️',
    'Aventura': '🗺️',
    'RPG': '🐉',
    'Simulação': '🎯',
    'Estratégia': '♟️',
    'Casual': '🎲',
    'Indie': '🎨',
    'Corrida': '🏎️',
    'Esportes': '⚽',
    'Terror': '👻',
    'Plataforma': '🦘',
    'Puzzle': '🧩',
    'FPS': '🎯',
    'TPS': '🎮',
    'MMORPG': '🌍',
    'Mundo Aberto': '🗺️',
    'Sobrevivência': '🏕️',
    'Hack and Slash': '⚔️',
    'Metroidvania': '🗝️',
    'Roguelike': '🎲'
  };
  return icons[categoria] || '🎮';
};

// Função para obter ícones de plataforma
const getPlatformIcon = (platform) => {
  const icons = {
    'PC': '💻',
    'PlayStation': '🎮',
    'PS5': '🎮',
    'PS4': '🎮',
    'Xbox': '🎮',
    'Xbox Series': '🎮',
    'Nintendo': '🎮',
    'Switch': '🎮',
    'Mobile': '📱'
  };
  return icons[platform] || '🎮';
};

// Componente Scroll to Top com animação
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <motion.button
      className={`${styles.scrollToTop} ${isVisible ? styles.visible : ''}`}
      onClick={scrollToTop}
      aria-label="Voltar ao topo"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.8
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <span aria-hidden="true">↑</span>
    </motion.button>
  );
};

export default Home;