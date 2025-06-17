import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import styles from './Home.module.css';

const Home = () => {
  const { authenticated, user } = useAuthContext();
  const [scrollY, setScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Efeito parallax no scroll
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Carousel automático para jogos em destaque
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredGames.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Dados simulados para demonstração
  const featuredGames = [
    {
      id: 1,
      title: "Cyberpunk 2077",
      rating: 4.2,
      image: "🌃",
      genre: "RPG",
      description: "Uma aventura épica em Night City"
    },
    {
      id: 2,
      title: "The Witcher 3",
      rating: 4.8,
      image: "⚔️",
      genre: "RPG",
      description: "A mais épica aventura medieval"
    },
    {
      id: 3,
      title: "Red Dead Redemption 2",
      rating: 4.7,
      image: "🤠",
      genre: "Ação",
      description: "O velho oeste como nunca antes"
    }
  ];

  const topGenres = [
    { name: "RPG", count: 1420, icon: "⚔️", color: "#8b5cf6" },
    { name: "FPS", count: 980, icon: "🔫", color: "#ef4444" },
    { name: "Estratégia", count: 750, icon: "🧠", color: "#3b82f6" },
    { name: "Indie", count: 1200, icon: "🎨", color: "#f59e0b" },
    { name: "Ação", count: 1100, icon: "💥", color: "#10b981" },
    { name: "Simulação", count: 650, icon: "🏗️", color: "#6366f1" }
  ];

  const stats = [
    { label: "Jogos Catalogados", value: "12,847", icon: "🎮" },
    { label: "Reviews Escritas", value: "45,291", icon: "📝" },
    { label: "Usuários Ativos", value: "28,456", icon: "👥" },
    { label: "Avaliações", value: "156,832", icon: "⭐" }
  ];

  const recentReviews = [
    {
      id: 1,
      game: "Baldur's Gate 3",
      user: "GameMaster2023",
      rating: 5,
      excerpt: "Simplesmente o melhor RPG dos últimos anos...",
      avatar: "🧙‍♂️"
    },
    {
      id: 2,
      game: "Spider-Man 2",
      user: "WebSlinger",
      rating: 4,
      excerpt: "Ação incrível, mas poderia ter mais conteúdo...",
      avatar: "🕷️"
    },
    {
      id: 3,
      game: "Alan Wake 2",
      user: "HorrorFan",
      rating: 5,
      excerpt: "Terror psicológico no seu melhor...",
      avatar: "🔦"
    }
  ];

  return (
    <div className={styles.home}>
      {/* Hero Section com Parallax */}
      <section className={styles.hero} style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <div className={styles.heroAnimation}>
            <h1 className={styles.title}>
              <span className={styles.gameIcon}>🎮</span>
              <span className={styles.titleText}>
                Game<span className={styles.titleHighlight}>Reviews</span>
              </span>
            </h1>
            <p className={styles.subtitle}>
              A maior comunidade de gamers do Brasil.<br />
              Descubra, avalie e compartilhe suas experiências com os melhores jogos.
            </p>
            
            {!authenticated ? (
              <div className={styles.heroButtons}>
                <Link to="/register" className={styles.primaryButton}>
                  <span className={styles.buttonIcon}>🚀</span>
                  Começar Agora
                </Link>
                <Link to="/jogos" className={styles.secondaryButton}>
                  <span className={styles.buttonIcon}>🔍</span>
                  Explorar Jogos
                </Link>
              </div>
            ) : (
              <div className={styles.heroButtons}>
                <p className={styles.welcomeMessage}>
                  Bem-vindo de volta, <strong>{user?.name}!</strong>
                </p>
                <Link to="/conta" className={styles.primaryButton}>
                  <span className={styles.buttonIcon}>👤</span>
                  Meu Perfil
                </Link>
                <Link to="/jogos" className={styles.secondaryButton}>
                  <span className={styles.buttonIcon}>🎮</span>
                  Explorar Jogos
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className={styles.floatingElements}>
          <div className={`${styles.floatingIcon} ${styles.float1}`}>🎯</div>
          <div className={`${styles.floatingIcon} ${styles.float2}`}>⭐</div>
          <div className={`${styles.floatingIcon} ${styles.float3}`}>🏆</div>
          <div className={`${styles.floatingIcon} ${styles.float4}`}>🎨</div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.statCard}>
                <div className={styles.statIcon}>{stat.icon}</div>
                <div className={styles.statContent}>
                  <div className={styles.statValue}>{stat.value}</div>
                  <div className={styles.statLabel}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Games Carousel */}
      <section className={styles.featured}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.titleIcon}>🌟</span>
            Jogos em Destaque
          </h2>
          
          <div className={styles.carousel}>
            <div className={styles.carouselContainer}>
              {featuredGames.map((game, index) => (
                <div
                  key={game.id}
                  className={`${styles.gameCard} ${index === currentSlide ? styles.active : ''}`}
                  style={{ transform: `translateX(${(index - currentSlide) * 100}%)` }}
                >
                  <div className={styles.gameImage}>{game.image}</div>
                  <div className={styles.gameInfo}>
                    <div className={styles.gameGenre}>{game.genre}</div>
                    <h3 className={styles.gameTitle}>{game.title}</h3>
                    <p className={styles.gameDescription}>{game.description}</p>
                    <div className={styles.gameRating}>
                      <div className={styles.stars}>
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < Math.floor(game.rating) ? styles.starFilled : styles.starEmpty}>
                            ⭐
                          </span>
                        ))}
                      </div>
                      <span className={styles.ratingValue}>{game.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={styles.carouselDots}>
              {featuredGames.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Genres Section */}
      <section className={styles.genres}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.titleIcon}>🎯</span>
            Gêneros Populares
          </h2>
          
          <div className={styles.genresGrid}>
            {topGenres.map((genre, index) => (
              <Link
                key={index}
                to={`/genero/${genre.name.toLowerCase()}`}
                className={styles.genreCard}
                style={{ '--genre-color': genre.color }}
              >
                <div className={styles.genreIcon}>{genre.icon}</div>
                <div className={styles.genreInfo}>
                  <h3 className={styles.genreName}>{genre.name}</h3>
                  <p className={styles.genreCount}>{genre.count} jogos</p>
                </div>
                <div className={styles.genreArrow}>→</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Reviews */}
      <section className={styles.recentReviews}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.titleIcon}>📝</span>
            Reviews Recentes
          </h2>
          
          <div className={styles.reviewsGrid}>
            {recentReviews.map((review) => (
              <div key={review.id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewUser}>
                    <div className={styles.userAvatar}>{review.avatar}</div>
                    <div className={styles.userInfo}>
                      <div className={styles.userName}>{review.user}</div>
                      <div className={styles.reviewGame}>{review.game}</div>
                    </div>
                  </div>
                  <div className={styles.reviewRating}>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < review.rating ? styles.starFilled : styles.starEmpty}>
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
                <p className={styles.reviewExcerpt}>{review.excerpt}</p>
                <Link to={`/review/${review.id}`} className={styles.readMoreLink}>
                  Ler mais →
                </Link>
              </div>
            ))}
          </div>
          
          <div className={styles.sectionFooter}>
            <Link to="/reviews" className={styles.viewAllButton}>
              Ver Todas as Reviews
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.titleIcon}>✨</span>
            Por que escolher GameReviews?
          </h2>
          
          <div className={styles.featuresGrid}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🎯</div>
              <h3>Reviews Precisas</h3>
              <p>Análises detalhadas feitas por gamers reais, com critérios objetivos e experiência genuine.</p>
              <div className={styles.featureStats}>+45k reviews</div>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🏆</div>
              <h3>Rankings Atualizados</h3>
              <p>Descubra os jogos mais bem avaliados em tempo real, com rankings que refletem a opinião da comunidade.</p>
              <div className={styles.featureStats}>Atualizado diariamente</div>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>👥</div>
              <h3>Comunidade Ativa</h3>
              <p>Conecte-se com outros gamers, participe de discussões e compartilhe suas experiências.</p>
              <div className={styles.featureStats}>28k+ membros</div>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🎮</div>
              <h3>Catálogo Completo</h3>
              <p>Mais de 12 mil jogos catalogados, desde indies até AAA, com informações detalhadas.</p>
              <div className={styles.featureStats}>12k+ jogos</div>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🔔</div>
              <h3>Notificações Smart</h3>
              <p>Receba alertas sobre novos jogos, promoções e reviews dos seus gêneros favoritos.</p>
              <div className={styles.featureStats}>Personalizado</div>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>📊</div>
              <h3>Análises Avançadas</h3>
              <p>Estatísticas detalhadas, comparações e insights sobre tendências do mercado gaming.</p>
              <div className={styles.featureStats}>IA integrada</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              Pronto para descobrir seu próximo jogo favorito?
            </h2>
            <p className={styles.ctaSubtitle}>
              Junte-se a milhares de gamers e comece sua jornada hoje mesmo!
            </p>
            
            {!authenticated ? (
              <div className={styles.ctaButtons}>
                <Link to="/register" className={styles.ctaPrimary}>
                  Criar Conta Grátis
                </Link>
                <Link to="/login" className={styles.ctaSecondary}>
                  Já tenho conta
                </Link>
              </div>
            ) : (
              <div className={styles.ctaButtons}>
                <Link to="/conta/reviews" className={styles.ctaPrimary}>
                  Escrever Review
                </Link>
                <Link to="/jogos" className={styles.ctaSecondary}>
                  Explorar Jogos
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;