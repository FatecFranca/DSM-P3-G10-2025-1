import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import reviewsService from '../../services/reviewsService';
import styles from './Reviews.module.css';

const Reviews = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { authenticated, user } = useAuthContext();
  
  // Estados principais
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para paginação
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalReviews: 0,
    limit: 12
  });

  // Estados para filtros
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    genre: searchParams.get('genre') || '',
    rating: searchParams.get('rating') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc'
  });

  // Estados para estatísticas
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    mostReviewedGenre: '',
    topReviewer: ''
  });

  // Buscar reviews da API
  const fetchReviews = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        limit: pagination.limit,
        ...filters
      };

      const result = await reviewsService.getReviews(params);
      
      if (result.success) {
        setReviews(result.data.reviews || []);
        setPagination({
          currentPage: result.data.currentPage || 1,
          totalPages: result.data.totalPages || 1,
          totalReviews: result.data.totalReviews || 0,
          limit: result.data.limit || 12
        });
      } else {
        throw new Error(result.message);
      }

    } catch (error) {
      console.error('Erro ao buscar reviews:', error);
      setError(error.message);
      
      // Fallback para dados simulados
      loadMockReviews(page);
    } finally {
      setLoading(false);
    }
  };

  // Buscar estatísticas
  const fetchStats = async () => {
    try {
      const result = await reviewsService.getStats();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      // Stats padrão
      setStats({
        totalReviews: 1247,
        averageRating: 4.2,
        mostReviewedGenre: 'RPG',
        topReviewer: 'GameMaster2023'
      });
    }
  };

  // Dados simulados para desenvolvimento
  const loadMockReviews = (page = 1) => {
    const mockReviews = [
      {
        id: 1,
        title: "Uma obra-prima do RPG moderno",
        rating: 5,
        content: "Baldur's Gate 3 é simplesmente excepcional. A liberdade de escolha, os diálogos profundos e a mecânica de combate baseada em D&D 5e criam uma experiência única...",
        createdAt: "2024-06-15T10:30:00Z",
        likes: 156,
        dislikes: 8,
        user: {
          id: 1,
          name: "GameMaster2023",
          avatarUrl: null
        },
        game: {
          id: 1,
          title: "Baldur's Gate 3",
          genre: "RPG",
          coverUrl: null
        },
        verified: true
      },
      {
        id: 2,
        title: "Diversão garantida nas ruas de Nova York",
        rating: 4,
        content: "O novo Spider-Man 2 entrega tudo que esperávamos: combos incríveis, história envolvente e a melhor mecânica de balanço já criada...",
        createdAt: "2024-06-14T15:45:00Z",
        likes: 89,
        dislikes: 12,
        user: {
          id: 2,
          name: "WebSlinger",
          avatarUrl: null
        },
        game: {
          id: 2,
          title: "Spider-Man 2",
          genre: "Ação",
          coverUrl: null
        },
        verified: false
      },
      {
        id: 3,
        title: "Terror psicológico perfeito",
        rating: 5,
        content: "Remedy conseguiu criar algo único com Alan Wake 2. A atmosfera sombria, a narrativa complexa e os elementos de survival horror se combinam perfeitamente...",
        createdAt: "2024-06-13T20:15:00Z",
        likes: 203,
        dislikes: 5,
        user: {
          id: 3,
          name: "HorrorFan",
          avatarUrl: null
        },
        game: {
          id: 3,
          title: "Alan Wake 2",
          genre: "Terror",
          coverUrl: null
        },
        verified: true
      }
    ];

    // Simular paginação
    const startIndex = (page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    const paginatedReviews = mockReviews.slice(startIndex, endIndex);

    setReviews(paginatedReviews);
    setPagination({
      currentPage: page,
      totalPages: Math.ceil(mockReviews.length / pagination.limit),
      totalReviews: mockReviews.length,
      limit: pagination.limit
    });
  };

  // Efeitos
  useEffect(() => {
    fetchReviews(1);
    fetchStats();
  }, [filters]);

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  // Handlers
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handlePageChange = (page) => {
    fetchReviews(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      genre: '',
      rating: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  // Funções auxiliares
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`${styles.star} ${index < rating ? styles.filled : styles.empty}`}
      >
        ⭐
      </span>
    ));
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getAvatarPlaceholder = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ff4f59&color=fff&size=40`;
  };

  const getGameImagePlaceholder = (title) => {
    return `https://via.placeholder.com/60x60/667eea/ffffff?text=${encodeURIComponent(title.charAt(0))}`;
  };

  if (loading && reviews.length === 0) {
    return (
      <div className={styles.reviewsPage}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Carregando reviews...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.reviewsPage}>
      {/* Header Section */}
      <section className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerContent}>
            <h1 className={styles.pageTitle}>
              <span className={styles.titleIcon}>📝</span>
              Reviews de Jogos
            </h1>
            <p className={styles.pageSubtitle}>
              Descubra as opiniões da comunidade sobre os melhores jogos
            </p>
          </div>

          {/* Stats */}
          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{stats.totalReviews.toLocaleString()}</span>
              <span className={styles.statLabel}>Reviews</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{stats.averageRating}</span>
              <span className={styles.statLabel}>Nota Média</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{stats.mostReviewedGenre}</span>
              <span className={styles.statLabel}>Gênero Popular</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className={styles.filtersSection}>
        <div className={styles.container}>
          <div className={styles.filtersContainer}>
            {/* Search Bar */}
            <div className={styles.searchForm}>
              <div className={styles.searchInputGroup}>
                <input
                  type="text"
                  placeholder="Buscar por jogo, autor ou palavras-chave..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange({ search: e.target.value })}
                  className={styles.searchInput}
                />
                <button type="button" className={styles.searchButton}>
                  <span className={styles.searchIcon}>🔍</span>
                </button>
              </div>
            </div>

            {/* Quick Filters */}
            <div className={styles.quickFilters}>
              <div className={styles.filtersRow}>
                <select
                  value={filters.genre}
                  onChange={(e) => handleFilterChange({ genre: e.target.value })}
                  className={styles.filterSelect}
                >
                  <option value="">Todos os Gêneros</option>
                  <option value="RPG">RPG</option>
                  <option value="Ação">Ação</option>
                  <option value="Aventura">Aventura</option>
                  <option value="Terror">Terror</option>
                  <option value="Estratégia">Estratégia</option>
                </select>

                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange({ rating: e.target.value })}
                  className={styles.filterSelect}
                >
                  <option value="">Todas as Notas</option>
                  <option value="5">5 Estrelas</option>
                  <option value="4">4+ Estrelas</option>
                  <option value="3">3+ Estrelas</option>
                </select>

                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    handleFilterChange({ sortBy, sortOrder });
                  }}
                  className={styles.filterSelect}
                >
                  <option value="createdAt-desc">Mais Recentes</option>
                  <option value="createdAt-asc">Mais Antigas</option>
                  <option value="rating-desc">Melhor Avaliadas</option>
                  <option value="likes-desc">Mais Curtidas</option>
                </select>

                {(filters.search || filters.genre || filters.rating) && (
                  <button onClick={handleClearFilters} className={styles.clearButton}>
                    ✕ Limpar
                  </button>
                )}
              </div>
            </div>

            {/* Results Count */}
            <div className={styles.resultsInfo}>
              <span className={styles.resultsCount}>
                {pagination.totalReviews.toLocaleString()} reviews encontradas
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className={styles.reviewsSection}>
        <div className={styles.container}>
          {error && (
            <div className={styles.errorMessage}>
              <span className={styles.errorIcon}>⚠️</span>
              {error}. Mostrando dados simulados.
            </div>
          )}

          {reviews.length === 0 && !loading ? (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>😔</div>
              <h3>Nenhuma review encontrada</h3>
              <p>Tente ajustar os filtros ou fazer uma nova busca</p>
              <button onClick={handleClearFilters} className={styles.clearButton}>
                Limpar Filtros
              </button>
            </div>
          ) : (
            <>
              <div className={styles.reviewsGrid}>
                {reviews.map((review) => (
                  <article key={review.id} className={styles.reviewCard}>
                    {/* Header do Card */}
                    <div className={styles.cardHeader}>
                      <div className={styles.gameInfo}>
                        <div className={styles.gameImage}>
                          {review.game.coverUrl ? (
                            <img 
                              src={review.game.coverUrl} 
                              alt={review.game.title}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div 
                            className={styles.gameImagePlaceholder}
                            style={{ display: review.game.coverUrl ? 'none' : 'flex' }}
                          >
                            🎮
                          </div>
                        </div>
                        <div className={styles.gameDetails}>
                          <h3 className={styles.gameTitle}>{review.game.title}</h3>
                          <span className={styles.gameGenre}>{review.game.genre}</span>
                        </div>
                      </div>
                      
                      <div className={styles.reviewRating}>
                        <div className={styles.stars}>
                          {renderStars(review.rating)}
                        </div>
                        <span className={styles.ratingValue}>{review.rating}/5</span>
                      </div>
                    </div>

                    {/* Conteúdo da Review */}
                    <div className={styles.reviewContent}>
                      <h4 className={styles.reviewTitle}>{review.title}</h4>
                      <p className={styles.reviewText}>
                        {truncateText(review.content)}
                      </p>
                    </div>

                    {/* Footer do Card */}
                    <div className={styles.cardFooter}>
                      <div className={styles.authorInfo}>
                        <div className={styles.authorAvatar}>
                          {review.user.avatarUrl ? (
                            <img 
                              src={review.user.avatarUrl} 
                              alt={review.user.name}
                              onError={(e) => {
                                e.target.src = getAvatarPlaceholder(review.user.name);
                              }}
                            />
                          ) : (
                            <img 
                              src={getAvatarPlaceholder(review.user.name)} 
                              alt={review.user.name}
                            />
                          )}
                        </div>
                        <div className={styles.authorDetails}>
                          <span className={styles.authorName}>
                            {review.user.name}
                            {review.verified && <span className={styles.verifiedBadge}>✓</span>}
                          </span>
                          <span className={styles.reviewDate}>{formatDate(review.createdAt)}</span>
                        </div>
                      </div>

                      <div className={styles.cardActions}>
                        <button
                          className={styles.reactionButton}
                          disabled={!authenticated}
                          title={authenticated ? 'Curtir' : 'Faça login para curtir'}
                        >
                          👍 {review.likes}
                        </button>
                        
                        <button
                          className={styles.reactionButton}
                          disabled={!authenticated}
                          title={authenticated ? 'Descurtir' : 'Faça login para descurtir'}
                        >
                          👎 {review.dislikes}
                        </button>
                        
                        <Link
                          to={`/review/${review.id}`}
                          className={styles.viewButton}
                        >
                          <span className={styles.buttonIcon}>👁️</span>
                          Ver mais
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className={styles.pageButton}
                  >
                    ← Anterior
                  </button>
                  
                  <div className={styles.pageNumbers}>
                    {[...Array(pagination.totalPages)].map((_, index) => {
                      const page = index + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`${styles.pageNumber} ${
                            page === pagination.currentPage ? styles.active : ''
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className={styles.pageButton}
                  >
                    Próximo →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Compartilhe sua opinião!</h2>
            <p className={styles.ctaSubtitle}>
              Ajude outros gamers escrevendo reviews dos seus jogos favoritos
            </p>
            <Link to="/criar/review" className={styles.ctaButton}>
              <span className={styles.buttonIcon}>✍️</span>
              Escrever Review
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reviews;