import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import gamesService from "../../services/gamesService";
import styles from "./Home.module.css";

const HomeGame = () => {
  const { authenticated, user } = useAuthContext();
  const [scrollY, setScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredGames, setFeaturedGames] = useState([]);
  const [loading, setLoading] = useState(true);

  // Efeito parallax no scroll
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Buscar jogos com maior rating
  useEffect(() => {
    const loadFeaturedGames = async () => {
      try {
        setLoading(true);
        console.log("Carregando jogos em destaque...");
        const response = await gamesService.getGames({ limit: 10 });
        console.log("Resposta da API:", response);
        if (response.success && response.data) {
          console.log("Jogos recebidos:", response.data.length);
          // Primeiro, tentar pegar jogos com averageRating
          let topRatedGames = response.data
            .filter((game) => game.averageRating && game.averageRating > 0)
            .sort((a, b) => b.averageRating - a.averageRating)
            .slice(0, 3);

          console.log("Jogos com rating:", topRatedGames.length);

          // Se não houver jogos com averageRating, pegar os primeiros 3 jogos
          if (topRatedGames.length === 0) {
            topRatedGames = response.data.slice(0, 3);
            console.log("Usando primeiros 3 jogos:", topRatedGames.length);
          }

          console.log("Jogos em destaque finais:", topRatedGames);
          setFeaturedGames(topRatedGames);
        }
      } catch (error) {
        console.error("Erro ao carregar jogos em destaque:", error);
        // Fallback para dados mock se houver erro
        setFeaturedGames([
          {
            id: 1,
            title: "Cyberpunk 2077",
            averageRating: 4.2,
            coverUrl: "🌃",
            genres: ["RPG"],
            description: "Uma aventura épica em Night City",
          },
          {
            id: 2,
            title: "The Witcher 3",
            averageRating: 4.8,
            coverUrl: "⚔️",
            genres: ["RPG"],
            description: "A mais épica aventura medieval",
          },
          {
            id: 3,
            title: "Red Dead Redemption 2",
            averageRating: 4.7,
            coverUrl: "🤠",
            genres: ["Ação"],
            description: "O velho oeste como nunca antes",
          },
        ]);
      } finally {
        setLoading(false);
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
  }, [featuredGames]);

  // Gêneros populares (apenas ilustrativo)
  const topGenres = [
    { name: "RPG", count: 1420, icon: "⚔️", color: "#8b5cf6" },
    { name: "FPS", count: 980, icon: "🔫", color: "#ef4444" },
    { name: "Estratégia", count: 750, icon: "🧠", color: "#3b82f6" },
    { name: "Indie", count: 1200, icon: "🎨", color: "#f59e0b" },
    { name: "Ação", count: 1100, icon: "💥", color: "#10b981" },
    { name: "Simulação", count: 650, icon: "🏗️", color: "#6366f1" },
  ];

  const stats = [
    { label: "Jogos Catalogados", value: "12,847", icon: "🎮" },
    { label: "Reviews Escritas", value: "45,291", icon: "📝" },
    { label: "Usuários Ativos", value: "28,456", icon: "👥" },
    { label: "Avaliações", value: "156,832", icon: "⭐" },
  ];

  return (
    <div className={styles.home}>
      {/* Hero Section com Parallax */}
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

          {loading ? (
            <div className={styles.loading}>
              <div className={styles.loadingSpinner}></div>
              <p>Carregando jogos em destaque...</p>
            </div>
          ) : (
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
                    <div className={styles.gameImage}>
                      {game.coverUrl || game.cover_url ? (
                        <img
                          src={game.coverUrl || game.cover_url}
                          alt={game.title}
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div className={styles.gameImageFallback}>🎮</div>
                    </div>
                    <div className={styles.gameInfo}>
                      <div className={styles.gameGenre}>
                        {game.genres ? game.genres[0] : game.genre || "Jogo"}
                      </div>
                      <h3 className={styles.gameTitle}>{game.title}</h3>
                      <p className={styles.gameDescription}>
                        {game.description || "Descubra este incrível jogo"}
                      </p>
                      <div className={styles.gameRating}>
                        <div className={styles.stars}>
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={
                                i <
                                Math.floor(
                                  game.averageRating || game.rating || 0
                                )
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
                            : game.rating || "Sem avaliação"}
                        </span>
                      </div>
                      <Link
                        to={`/jogo/${game.id}`}
                        className={styles.gameButton}
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Carousel Indicators */}
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
          )}
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
              <div
                key={index}
                className={styles.genreCard}
                style={{ "--genre-color": genre.color }}
              >
                <div className={styles.genreIcon}>{genre.icon}</div>
                <div className={styles.genreInfo}>
                  <h3 className={styles.genreName}>{genre.name}</h3>
                  <p className={styles.genreCount}>{genre.count} jogos</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Grid 2x2 */}
      <section className={styles.features}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.titleIcon}>✨</span>
            Por que escolher GameReviews?
          </h2>

          <div className={styles.featuresGrid}>
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
              <div className={styles.featureIcon}>⭐</div>
              <h3>Sistema de Avaliação</h3>
              <p>
                Sistema inteligente de notas e rankings para descobrir os
                melhores jogos.
              </p>
              <div className={styles.featureStats}>Algoritmo próprio</div>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>📈</div>
              <h3>Estatísticas Detalhadas</h3>
              <p>
                Acompanhe tendências, descobertas e análises do mundo dos games.
              </p>
              <div className={styles.featureStats}>Dados em tempo real</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeGame;
