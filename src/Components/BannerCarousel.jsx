import React, { useEffect, useState, useRef, useCallback } from 'react';
import styles from './BannerCarousel.module.css';

const banners = [
  {
    id: 1,
    titulo: "CyberStrike 2077",
    subtitulo: "O futuro chegou",
    descricao: "Explore um mundo cyberpunk cheio de possibilidades",
    imagem: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=600&fit=crop",
    link: "/jogo/1",
    categoria: "RPG",
    avaliacao: "9.2"
  },
  {
    id: 2,
    titulo: "Fantasy Realms",
    subtitulo: "Aventura épica te espera",
    descricao: "Desbrave territórios místicos e criaturas lendárias",
    imagem: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=600&fit=crop",
    link: "/jogo/2",
    categoria: "Aventura",
    avaliacao: "8.7"
  },
  {
    id: 3,
    titulo: "Urban Warfare",
    subtitulo: "Ação sem limites",
    descricao: "FPS tático com gráficos de última geração",
    imagem: "https://images.unsplash.com/photo-1586182987320-4f376d39d787?w=1200&h=600&fit=crop",
    link: "/jogo/5",
    categoria: "FPS",
    avaliacao: "8.5"
  }
];

const BannerCarousel = () => {
  const [indiceAtivo, setIndiceAtivo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const startX = useRef(null);
  const intervalRef = useRef(null);

  // Preload das imagens
  useEffect(() => {
    const preloadImages = async () => {
      const promises = banners.map(banner => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = banner.imagem;
        });
      });

      try {
        await Promise.all(promises);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao carregar imagens:', error);
        setIsLoading(false);
      }
    };

    preloadImages();
  }, []);

  // Auto-play do carousel
  useEffect(() => {
    if (isPlaying && !isLoading) {
      intervalRef.current = setInterval(() => {
        setIndiceAtivo(prev => (prev + 1) % banners.length);
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, isLoading]);

  const irParaSlide = useCallback((index) => {
    setIndiceAtivo(index);
  }, []);

  const proximoSlide = useCallback(() => {
    setIndiceAtivo(prev => (prev + 1) % banners.length);
  }, []);

  const slideAnterior = useCallback(() => {
    setIndiceAtivo(prev => (prev - 1 + banners.length) % banners.length);
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  // Touch handlers para mobile
  const handleTouchStart = useCallback((e) => {
    startX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (!startX.current) return;

    const endX = e.changedTouches[0].clientX;
    const delta = startX.current - endX;
    const threshold = 50;

    if (Math.abs(delta) > threshold) {
      if (delta > 0) {
        proximoSlide();
      } else {
        slideAnterior();
      }
    }

    startX.current = null;
  }, [proximoSlide, slideAnterior]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeydown = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          slideAnterior();
          break;
        case 'ArrowRight':
          proximoSlide();
          break;
        case ' ':
          e.preventDefault();
          togglePlayPause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [slideAnterior, proximoSlide, togglePlayPause]);

  if (isLoading) {
    return (
      <div className={styles.carouselLoading}>
        <div className={styles.loadingSpinner}></div>
        <p>Carregando banners...</p>
      </div>
    );
  }

  return (
    <section className={styles.carousel} aria-label="Banner carousel">
      <div className={styles.carouselContainer}>
        {}
        <div
          className={styles.slidesContainer}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`${styles.slide} ${index === indiceAtivo ? styles.ativo : ''}`}
              style={{
                transform: `translateX(${(index - indiceAtivo) * 100}%)`,
              }}
            >
              <div className={styles.slideBackground}>
                <img
                  src={banner.imagem}
                  alt={banner.titulo}
                  className={styles.slideImage}
                  loading={index === 0 ? "eager" : "lazy"}
                />
                <div className={styles.slideOverlay}></div>
              </div>

              <div className={styles.slideContent}>
                <div className={styles.slideInfo}>
                  <div className={styles.slideBadges}>
                    <span className={styles.categoriaBadge}>
                      {banner.categoria}
                    </span>
                    <span className={styles.avaliacaoBadge}>
                      ⭐ {banner.avaliacao}
                    </span>
                  </div>
                  
                  <h2 className={styles.slideTitulo}>{banner.titulo}</h2>
                  <h3 className={styles.slideSubtitulo}>{banner.subtitulo}</h3>
                  <p className={styles.slideDescricao}>{banner.descricao}</p>
                  
                  <div className={styles.slideActions}>
                    <a 
                      href={banner.link} 
                      className={styles.btnPrimary}
                      aria-label={`Ver detalhes de ${banner.titulo}`}
                    >
                      <span className={styles.btnIcon}>🎮</span>
                      Ver Detalhes
                    </a>
                    <button 
                      className={styles.btnSecondary}
                      aria-label={`Adicionar ${banner.titulo} à wishlist`}
                    >
                      <span className={styles.btnIcon}>❤️</span>
                      Wishlist
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {}
        <button
          className={`${styles.navButton} ${styles.navPrev}`}
          onClick={slideAnterior}
          aria-label="Slide anterior"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>

        <button
          className={`${styles.navButton} ${styles.navNext}`}
          onClick={proximoSlide}
          aria-label="Próximo slide"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>

        {}
        <button
          className={styles.playPauseButton}
          onClick={togglePlayPause}
          aria-label={isPlaying ? "Pausar slideshow" : "Iniciar slideshow"}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>
      </div>

      {}
      <div className={styles.indicadores} role="tablist">
        {banners.map((banner, index) => (
          <button
            key={banner.id}
            className={`${styles.indicador} ${index === indiceAtivo ? styles.ativo : ''}`}
            onClick={() => irParaSlide(index)}
            role="tab"
            aria-selected={index === indiceAtivo}
            aria-label={`Ir para banner ${index + 1}: ${banner.titulo}`}
          >
            <div className={styles.indicadorProgress}>
              <div 
                className={styles.indicadorFill}
                style={{
                  animationDuration: index === indiceAtivo && isPlaying ? '5s' : '0s'
                }}
              ></div>
            </div>
          </button>
        ))}
      </div>

      {}
      <div className={styles.slideCounter}>
        <span>{indiceAtivo + 1}</span>
        <span className={styles.separator}>/</span>
        <span>{banners.length}</span>
      </div>
    </section>
  );
};

export default BannerCarousel;
