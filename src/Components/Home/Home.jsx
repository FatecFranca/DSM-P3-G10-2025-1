import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import gamesService from "../../services/gamesService";
import styles from "./Home.module.css";

const Home = () => {
  const { authenticated, user } = useAuthContext();
  const [scrollY, setScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredGames, setFeaturedGames] = useState([]);
  const [loadingGames, setLoadingGames] = useState(true);
  // Efeito parallax no scroll
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Carregar jogos em destaque
  useEffect(() => {
    const loadFeaturedGames = async () => {
      try {
        console.log("🎮 Carregando jogos em destaque...");
        setLoadingGames(true);
        const result = await gamesService.getFeaturedGames();
        console.log("📊 Resultado da API:", result);

        if (result.success) {
          console.log("✅ Jogos carregados:", result.data);
          setFeaturedGames(result.data || []);
        } else {
          console.error("❌ Erro ao carregar jogos:", result.message);
          setFeaturedGames([]);
        }
      } catch (error) {
        console.error("💥 Erro ao carregar jogos em destaque:", error);
        setFeaturedGames([]);
      } finally {
        setLoadingGames(false);
      }
    };

    loadFeaturedGames();
  }, []);

  // Carousel automático para jogos em destaque
  useEffect(() => {
    if (featuredGames.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredGames.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [featuredGames.length]); // Dados dos gêneros populares (apenas ilustrativo)
  const topGenres = [
    { name: "RPG", icon: "⚔️", color: "#8b5cf6" },
    { name: "FPS", icon: "🔫", color: "#ef4444" },
    { name: "Estratégia", icon: "🧠", color: "#3b82f6" },
    { name: "Indie", icon: "🎨", color: "#f59e0b" },
    { name: "Ação", icon: "💥", color: "#10b981" },
    { name: "Simulação", icon: "🏗️", color: "#6366f1" },
  ];
  const stats = [
    { label: "Jogos Catalogados", value: "12,847", icon: "🎮" },
    { label: "Reviews Escritas", value: "45,291", icon: "📝" },
    { label: "Usuários Ativos", value: "28,456", icon: "👥" },
    { label: "Avaliações", value: "156,832", icon: "⭐" },
  ];

  return (
    <div className={styles.home}>
      {}
      <section
        className={styles.hero}
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      >
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
              A maior comunidade de gamers do Brasil.
              <br />
              Descubra, avalie e compartilhe suas experiências com os melhores
              jogos.
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
              <>
                <p className={styles.welcomeMessage}>
                  Bem-vindo de volta, <strong>{user?.name}!</strong>
                </p>
                <div className={styles.heroButtons}>
                  <Link to="/conta" className={styles.primaryButton}>
                    <span className={styles.buttonIcon}>👤</span>
                    Meu Perfil
                  </Link>
                  <Link to="/jogos" className={styles.secondaryButton}>
                    <span className={styles.buttonIcon}>🎮</span>
                    Explorar Jogos
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {}
        <div className={styles.floatingElements}>
          <div className={`${styles.floatingIcon} ${styles.float1}`}>🎯</div>
          <div className={`${styles.floatingIcon} ${styles.float2}`}>⭐</div>
          <div className={`${styles.floatingIcon} ${styles.float3}`}>🏆</div>
          <div className={`${styles.floatingIcon} ${styles.float4}`}>🎨</div>
        </div>
      </section>
      {}
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
      </section>{" "}
      {}
      <section className={styles.featured}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.titleIcon}>🌟</span>
            Jogos em Destaque
          </h2>

          {loadingGames ? (
            <div className={styles.loadingGames}>
              <div className={styles.loadingSpinner}>🎮</div>
              <p>Carregando jogos...</p>
            </div>
          ) : featuredGames.length > 0 ? (
            <div className={styles.carousel}>
              <div className={styles.carouselContainer}>
                {featuredGames.map((game, index) => (
                  <div
                    key={game.id}
                    className={`${styles.gameCard} ${
                      index === currentSlide ? styles.active : ""
                    }`}
                    style={{
                      transform: `translateX(${(index - currentSlide) * 100}%)`,
                    }}
                  >
                    {" "}
                    <div className={styles.gameImage}>
                      {game.coverUrl ? (
                        <img src={game.coverUrl} alt={game.title} />
                      ) : (
                        <div className={styles.gameImagePlaceholder}>🎮</div>
                      )}
                    </div>
                    <div className={styles.gameInfo}>
                      <div className={styles.gameGenre}>{game.genre}</div>
                      <h3 className={styles.gameTitle}>{game.title}</h3>
                      <p className={styles.gameDescription}>
                        {game.description}
                      </p>
                      <div className={styles.gameRating}>
                        <div className={styles.stars}>
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={
                                i < Math.floor(game.averageRating || 0)
                                  ? styles.starFilled
                                  : styles.starEmpty
                              }
                            >
                              ⭐
                            </span>
                          ))}
                        </div>
                        <span className={styles.ratingValue}>
                          {game.averageRating
                            ? game.averageRating.toFixed(1)
                            : "Sem avaliações"}
                        </span>
                      </div>{" "}
                      <Link
                        to={`/jogo/${game.id}`}
                        className={styles.gameButton}
                      >
                        Ver Detalhes →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.carouselDots}>
                {featuredGames.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.dot} ${
                      index === currentSlide ? styles.activeDot : ""
                    }`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.noGames}>
              <p>Nenhum jogo em destaque encontrado.</p>
            </div>
          )}
        </div>
      </section>{" "}
      {}
      <section className={styles.genres}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.titleIcon}>🎯</span>
            Gêneros Populares
          </h2>
          <div className={styles.genresGrid}>
            {topGenres.map((genre, index) => (
              <div
                key={index}
                className={styles.genreCard}
                style={{ "--genre-color": genre.color }}
              >
                <div className={styles.genreIcon}>{genre.icon}</div>
                <div className={styles.genreInfo}>
                  <h3 className={styles.genreName}>{genre.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>{" "}
      {}
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
              <p>
                Análises detalhadas feitas por gamers reais, com critérios
                objetivos e experiência genuína.
              </p>
              <div className={styles.featureStats}>+45k reviews</div>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>👥</div>
              <h3>Comunidade Ativa</h3>
              <p>
                Conecte-se com outros gamers, participe de discussões e
                compartilhe suas experiências.
              </p>
              <div className={styles.featureStats}>28k+ membros</div>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>🎮</div>
              <h3>Catálogo Completo</h3>
              <p>
                Mais de 12 mil jogos catalogados, desde indies até AAA, com
                informações detalhadas.
              </p>
              <div className={styles.featureStats}>12k+ jogos</div>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>📊</div>
              <h3>Análises Avançadas</h3>
              <p>
                Estatísticas detalhadas, comparações e insights sobre tendências
                do mercado gaming.
              </p>
              <div className={styles.featureStats}>IA integrada</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

