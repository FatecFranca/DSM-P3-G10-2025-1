import React, { useState, useEffect } from "react";
import styles from "./Home.module.css";
import Detail from "./Detail";
import BannerCarousel from './BannerCarousel';
import { Link } from "react-router-dom";

const categorias = [
  "Ação", "Aventura", "RPG", "Simulação", "Estratégia",
  "Casual", "Indie", "Corrida", "Esportes", "Terror",
  "Plataforma", "Puzzle", "FPS", "TPS", "MMORPG",
  "Mundo Aberto", "Sobrevivência", "Hack and Slash",
  "Metroidvania", "Roguelike"
];

const jogosDestaque = [
  {
    id: 1,
    nome: "CyberStrike 2077",
    capa: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop",
    avaliacao: "9.2",
    descricao: "Um RPG futurista com elementos cyberpunk e combate estratégico em mundo aberto.",
    genero: ["RPG", "Cyberpunk", "Ação"]
  },
  {
    id: 2,
    nome: "Fantasy Realms",
    capa: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
    avaliacao: "8.7",
    descricao: "Aventure-se em um mundo mágico cheio de criaturas fantásticas e mistérios antigos.",
    genero: ["Aventura", "RPG", "Fantasia"]
  },
  {
    id: 3,
    nome: "Speed Horizon",
    capa: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=600&fit=crop",
    avaliacao: "9.0",
    descricao: "Corridas em alta velocidade com carros personalizáveis e física realista.",
    genero: ["Corrida", "Ação", "Arcade"]
  },
  {
    id: 4,
    nome: "Mystic Legends",
    capa: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=400&h=600&fit=crop",
    avaliacao: "8.9",
    descricao: "Um MMORPG épico com batalhas massivas, guilds e mundo persistente.",
    genero: ["MMORPG", "Fantasia", "Multiplayer"]
  },
  {
    id: 5,
    nome: "Urban Warfare",
    capa: "https://images.unsplash.com/photo-1586182987320-4f376d39d787?w=400&h=600&fit=crop",
    avaliacao: "8.5",
    descricao: "FPS tático com modos multiplayer competitivos e mecânicas realistas.",
    genero: ["FPS", "Ação", "Multiplayer"]
  },
  {
    id: 6,
    nome: "Indie Explorer",
    capa: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=600&fit=crop",
    avaliacao: "8.3",
    descricao: "Uma jornada indie única com arte pixel e trilha sonora cativante.",
    genero: ["Indie", "Aventura", "Puzzle"]
  }
];

const novosLancamentos = [
  {
    id: 1,
    nome: "Stellar Odyssey",
    capa: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=400&fit=crop",
    data: "15 Jul 2025",
    plataformas: ["PC", "PS5", "Xbox"],
    descricao: "Exploração espacial épica"
  },
  {
    id: 2,
    nome: "Dragon's Legacy",
    capa: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop",
    data: "22 Ago 2025",
    plataformas: ["PC", "Switch"],
    descricao: "RPG medieval com dragões"
  },
  {
    id: 3,
    nome: "Neon City",
    capa: "https://images.unsplash.com/photo-1493514789931-586cb221d7a7?w=300&h=400&fit=crop",
    data: "30 Set 2025",
    plataformas: ["PC", "PS5", "Xbox", "Switch"],
    descricao: "Cyberpunk ação futurista"
  },
  {
    id: 4,
    nome: "Survival Island",
    capa: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=400&fit=crop",
    data: "12 Out 2025",
    plataformas: ["PC", "Mobile"],
    descricao: "Sobrevivência em ilha deserta"
  }
];

const Home = () => {
  const [mostrarMais, setMostrarMais] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simular loading inicial
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const categoriasVisiveis = mostrarMais ? categorias : categorias.slice(0, 10);
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Carregando GameReviews...</p>
      </div>
    );
  }
  
  return (
    <main className={styles.page}>
      {/* Hero Section com Carousel */}
      <section className={styles.heroSection}>
        <BannerCarousel />
      </section>

      {/* Welcome Section */}
      <section className={styles.welcomeSection}>
        <div className={styles.container}>
          <div className={styles.welcomeContent}>
            <h1 className={styles.mainTitle}>
              Bem-vindo ao <span className={styles.brandName}>GameReviews</span>
            </h1>
            <p className={styles.slogan}>
              Descubra, avalie e compartilhe sua paixão pelos jogos. 
              Sua opinião importa na nossa comunidade gamer!
            </p>
            <div className={styles.ctaButtons}>
              <Link to="/reviews" className={styles.ctaPrimary}>
                <span>🎮</span> Explorar Reviews
              </Link>
              <Link to="/games" className={styles.ctaSecondary}>
                <span>🏆</span> Top Games 2025
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.container}>
          <div className={styles.statsContainer}>
            <div className={styles.statItem}>
              <h3>2.5K+</h3>
              <p>Reviews Publicadas</p>
            </div>
            <div className={styles.statItem}>
              <h3>1.2K+</h3>
              <p>Jogos Analisados</p>
            </div>
            <div className={styles.statItem}>
              <h3>15K+</h3>
              <p>Gamers Ativos</p>
            </div>
            <div className={styles.statItem}>
              <h3>95%</h3>
              <p>Satisfação</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className={`${styles.section} ${styles.categorias}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Explorar por Categoria</h2>
            <p className={styles.sectionSubtitle}>Encontre jogos do seu gênero favorito</p>
          </div>
          <div className={styles.categoriasContainer}>
            <div className={styles.gridCategorias}>
              {categoriasVisiveis.map((categoria, index) => (
                <Link
                  key={index}
                  to={`/genero/${categoria.toLowerCase().replace(/\s+/g, '-')}`}
                  className={styles.categoriaItem}
                >
                  <div className={styles.categoriaIcon}>
                    {getCategoryIcon(categoria)}
                  </div>
                  <span>{categoria}</span>
                </Link>
              ))}
            </div>
            {categorias.length > 10 && (
              <div className={styles.mostrarMaisContainer}>
                <button 
                  className={styles.mostrarMais} 
                  onClick={() => setMostrarMais(!mostrarMais)}
                >
                  {mostrarMais ? '▲ Mostrar menos' : '▼ Mostrar mais'}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Jogos em Destaque */}
      <section className={`${styles.section} ${styles.destaquesSection}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Jogos em Destaque</h2>
            <p className={styles.sectionSubtitle}>Os melhores jogos avaliados pela nossa comunidade</p>
          </div>
          <div className={styles.gridJogos}>
            {jogosDestaque.map((jogo) => (
              <article key={jogo.id} className={styles.jogoCard}>
                <Link to={`/jogo/${jogo.id}`} className={styles.cardLink}>
                  <div className={styles.cardImageWrapper}>
                    <img 
                      src={jogo.capa} 
                      alt={`Capa do jogo ${jogo.nome}`} 
                      className={styles.cardImage}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/400x600/1a1a1a/ffffff?text=${encodeURIComponent(jogo.nome)}`;
                      }}
                    />
                    <div className={styles.avaliacaoTag}>
                      <span className={styles.starIcon}>⭐</span>
                      <span>{jogo.avaliacao}</span>
                    </div>
                    <div className={styles.cardOverlay}>
                      <div className={styles.playButton}>
                        <span>▶</span>
                      </div>
                      <span className={styles.viewDetails}>Ver Detalhes</span>
                    </div>
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{jogo.nome}</h3>
                    <p className={styles.cardDesc}>{jogo.descricao}</p>
                    <div className={styles.cardGenres}>
                      {jogo.genero.map((gen, i) => (
                        <span key={i} className={styles.genreTag}>{gen}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
          <div className={styles.sectionFooter}>
            <Link to="/reviews" className={styles.viewMoreBtn}>
              Ver Todas as Reviews
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Lançamentos */}
      <section className={`${styles.section} ${styles.lancamentosSection}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Próximos Lançamentos</h2>
            <p className={styles.sectionSubtitle}>Fique por dentro dos jogos que estão chegando</p>
          </div>
          <div className={styles.gridLancamentos}>
            {novosLancamentos.map((jogo) => (
              <article key={jogo.id} className={styles.lancamentoCard}>
                <div className={styles.lancCardImage}>
                  <img 
                    src={jogo.capa} 
                    alt={`Capa do jogo ${jogo.nome}`}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/300x400/228b22/ffffff?text=${encodeURIComponent(jogo.nome)}`;
                    }}
                  />
                  <div className={styles.dataLancamento}>
                    <span className={styles.dataIcon}>📅</span>
                    {jogo.data}
                  </div>
                </div>
                <div className={styles.lancCardContent}>
                  <h3>{jogo.nome}</h3>
                  <p className={styles.lancDesc}>{jogo.descricao}</p>
                  <div className={styles.plataformas}>
                    {jogo.plataformas.map((plat, i) => (
                      <span key={i} className={styles.plataformaTag}>
                        {getPlatformIcon(plat)} {plat}
                      </span>
                    ))}
                  </div>
                  <div className={styles.cardActions}>
                    <button className={styles.wishlistBtn}>
                      ❤️ Wishlist
                    </button>
                    <button className={styles.notifyBtn}>
                      🔔 Notificar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    
      {/* Newsletter/CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <div className={styles.ctaIcon}>🎮</div>
            <h2>Junte-se à Nossa Comunidade</h2>
            <p>
              Mais de 15 mil gamers já fazem parte da maior comunidade de reviews do Brasil. 
              Cadastre-se e tenha acesso a conteúdo exclusivo!
            </p>
            <div className={styles.ctaFeatures}>
              <div className={styles.feature}>
                <span>✅</span> Reviews exclusivas
              </div>
              <div className={styles.feature}>
                <span>✅</span> Notificações de lançamentos
              </div>
              <div className={styles.feature}>
                <span>✅</span> Comunidade ativa
              </div>
            </div>
            <div className={styles.ctaButtons}>
              <Link to="/login/cadastro" className={styles.ctaRegister}>
                🚀 Começar Agora
              </Link>
              <Link to="/login" className={styles.ctaLogin}>
                Já sou membro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </main>
  );
};

// Função para obter ícones de categoria
const getCategoryIcon = (categoria) => {
  const icons = {
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
    'PS5': '🎮',
    'Xbox': '🎮',
    'Switch': '🎮',
    'Mobile': '📱'
  };
  return icons[platform] || '🎮';
};

// Componente Scroll to Top
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
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
    <button
      className={`${styles.scrollToTop} ${isVisible ? styles.visible : ''}`}
      onClick={scrollToTop}
      aria-label="Voltar ao topo"
    >
      ↑
    </button>
  );
};

export default Home;