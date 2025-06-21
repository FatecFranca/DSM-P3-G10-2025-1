import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import UserIcon from "../User/UserIcon";
import gamesService from "../../services/gamesService";
import styles from "./Header.module.css";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileSearchSuggestions, setMobileSearchSuggestions] = useState([]);
  const [showMobileSuggestions, setShowMobileSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const searchInputRef = useRef(null);
  const mobileSearchInputRef = useRef(null);
  const { authenticated, user, logout } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // Fechar menu mobile ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileMenuOpen &&
        !event.target.closest(`.${styles.mobileMenu}`) &&
        !event.target.closest(`.${styles.mobileMenuButton}`)
      ) {
        setIsMobileMenuOpen(false);
      }
      if (
        isUserDropdownOpen &&
        !event.target.closest(`.${styles.userDropdown}`)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobileMenuOpen, isUserDropdownOpen]);

  // Prevenir scroll quando menu mobile estiver aberto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Função para buscar jogos em tempo real
  const searchGames = async (query) => {
    if (!query.trim() || query.length < 2) {
      return [];
    }

    try {
      setIsSearching(true);
      const result = await gamesService.getGames();

      if (result.success && result.data) {
        const filteredGames = result.data
          .filter(
            (game) =>
              game.title?.toLowerCase().includes(query.toLowerCase()) ||
              game.titulo?.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 5); // Mostrar apenas 5 sugestões

        return filteredGames;
      }
      return [];
    } catch (error) {
      console.error("Erro ao buscar jogos:", error);
      return [];
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce para busca (evitar muitas requisições)
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        const suggestions = await searchGames(searchQuery);
        setSearchSuggestions(suggestions);
        setShowSuggestions(true);
      } else {
        setSearchSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Debounce para busca mobile
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (mobileSearchQuery.length >= 2) {
        const suggestions = await searchGames(mobileSearchQuery);
        setMobileSearchSuggestions(suggestions);
        setShowMobileSuggestions(true);
      } else {
        setMobileSearchSuggestions([]);
        setShowMobileSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [mobileSearchQuery]);

  // Fechar sugestões ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
      if (
        mobileSearchInputRef.current &&
        !mobileSearchInputRef.current.contains(event.target)
      ) {
        setShowMobileSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = (gameId) => {
    navigate(`/jogo/${gameId}`);
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const handleMobileSuggestionClick = (gameId) => {
    navigate(`/jogo/${gameId}`);
    setMobileSearchQuery("");
    setShowMobileSuggestions(false);
    setIsMobileMenuOpen(false);
  };
  const handleMobileSearch = (e) => {
    e.preventDefault();
    if (mobileSearchQuery.trim()) {
      navigate(`/jogos?search=${encodeURIComponent(mobileSearchQuery.trim())}`);
      setMobileSearchQuery("");
      setShowMobileSuggestions(false);
      setIsMobileMenuOpen(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jogos?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSuggestions(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsMobileMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <>
      <header
        className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}
      >
        <div className={styles.container}>
          {" "}
          {/* Logo */}
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>🎮</span>
            <span className={styles.logoText}>GameReviews</span>
          </Link>
          {/* Navegação Desktop */}
          <nav className={styles.nav}>
            <ul className={styles.navList}>
              <li>
                <Link to="/" className={styles.navLink}>
                  Início
                </Link>
              </li>
              <li>
                <Link to="/jogos" className={styles.navLink}>
                  Jogos
                </Link>
              </li>{" "}
              {authenticated && (
                <li>
                  <Link to="/admin/jogos" className={styles.navLink}>
                    Postar Jogos
                  </Link>
                </li>
              )}
            </ul>
          </nav>{" "}
          {/* Busca Desktop */}
          <div className={styles.searchContainer} ref={searchInputRef}>
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <input
                type="text"
                placeholder="Buscar jogos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(searchSuggestions.length > 0)}
                className={styles.searchInput}
              />
              <button type="submit" className={styles.searchButton}>
                🔍
              </button>
            </form>

            {/* Sugestões Desktop */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className={styles.suggestions}>
                {searchSuggestions.map((game) => (
                  <div
                    key={game.id}
                    className={styles.suggestionItem}
                    onClick={() => handleSuggestionClick(game.id)}
                  >
                    <div className={styles.suggestionImage}>
                      <img
                        src={
                          game.coverUrl ||
                          game.cover_url ||
                          game.imageUrl ||
                          game.image_url
                        }
                        alt={game.title || game.titulo}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <div className={styles.suggestionImageFallback}>🎮</div>
                    </div>
                    <div className={styles.suggestionContent}>
                      <h4>{game.title || game.titulo}</h4>
                      {game.averageRating && (
                        <span className={styles.suggestionRating}>
                          ★ {game.averageRating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {isSearching && (
                  <div className={styles.suggestionItem}>
                    <div className={styles.searchingIndicator}>
                      <span>Buscando...</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>{" "}
          {/* Área do usuário Desktop */}
          <div className={styles.userSection}>
            {authenticated ? (
              <div className={styles.userDropdown}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className={styles.userButton}
                >
                  <UserIcon
                    initial={user?.name?.charAt(0)?.toUpperCase() || "U"}
                    size="medium"
                  />
                  <span>{user?.name}</span>
                  <span className={styles.dropdownArrow}>▼</span>
                </button>

                {isUserDropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    <Link
                      to="/conta"
                      className={styles.dropdownItem}
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      👤 Meu Perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={styles.dropdownItem}
                    >
                      🚪 Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.authButtons}>
                <Link to="/login" className={styles.loginButton}>
                  Entrar
                </Link>
                <Link to="/register" className={styles.registerButton}>
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
          {/* Botão do Menu Mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={styles.mobileMenuButton}
            aria-label="Menu"
          >
            <span className={styles.hamburger}></span>{" "}
            <span className={styles.hamburger}></span>
            <span className={styles.hamburger}></span>
          </button>
        </div>
      </header>
      {/* Overlay do menu mobile - FORA do header */}
      {isMobileMenuOpen && (
        <div
          className={`${styles.mobileMenuOverlay} ${styles.open}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}{" "}
      {/* Menu mobile - FORA do header */}
      <div
        className={`${styles.mobileMenu} ${
          isMobileMenuOpen ? styles.open : ""
        }`}
      >
        <button
          className={styles.mobileMenuClose}
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Fechar menu"
        >
          ✕
        </button>{" "}
        {/* Busca mobile */}
        <div
          className={styles.mobileSearchContainer}
          ref={mobileSearchInputRef}
        >
          <form
            onSubmit={handleMobileSearch}
            className={styles.mobileSearchForm}
          >
            <input
              type="text"
              placeholder="Buscar jogos..."
              value={mobileSearchQuery}
              onChange={(e) => setMobileSearchQuery(e.target.value)}
              onFocus={() =>
                setShowMobileSuggestions(mobileSearchSuggestions.length > 0)
              }
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              🔍
            </button>
          </form>

          {/* Sugestões Mobile */}
          {showMobileSuggestions && mobileSearchSuggestions.length > 0 && (
            <div className={styles.mobileSuggestions}>
              {mobileSearchSuggestions.map((game) => (
                <div
                  key={game.id}
                  className={styles.suggestionItem}
                  onClick={() => handleMobileSuggestionClick(game.id)}
                >
                  <div className={styles.suggestionImage}>
                    <img
                      src={
                        game.coverUrl ||
                        game.cover_url ||
                        game.imageUrl ||
                        game.image_url
                      }
                      alt={game.title || game.titulo}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div className={styles.suggestionImageFallback}>🎮</div>
                  </div>
                  <div className={styles.suggestionContent}>
                    <h4>{game.title || game.titulo}</h4>
                    {game.averageRating && (
                      <span className={styles.suggestionRating}>
                        ★ {game.averageRating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {isSearching && (
                <div className={styles.suggestionItem}>
                  <div className={styles.searchingIndicator}>
                    <span>Buscando...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Navegação mobile */}
        <ul className={styles.mobileNavList}>
          <li>
            <Link
              to="/"
              className={styles.mobileNavLink}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>🏠</span>
              Início
            </Link>
          </li>
          <li>
            <Link
              to="/jogos"
              className={styles.mobileNavLink}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>🎮</span>
              Jogos
            </Link>
          </li>
          {authenticated && (
            <li>
              <Link
                to="/admin/jogos"
                className={styles.mobileNavLink}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>⚙️</span>
                Postar Jogos
              </Link>
            </li>
          )}
        </ul>
        {/* Seção do usuário mobile */}
        <div className={styles.mobileUserSection}>
          {authenticated ? (
            <div className={styles.mobileUserInfo}>
              <div className={styles.mobileUserProfile}>
                <UserIcon
                  initial={user?.name?.charAt(0)?.toUpperCase() || "U"}
                  size="medium"
                />
                <div>
                  <p className={styles.mobileUserName}>{user?.name}</p>
                  <p className={styles.mobileUserEmail}>{user?.email}</p>
                </div>
              </div>
              <Link
                to="/conta"
                className={styles.mobileNavLink}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>👤</span>
                Meu Perfil
              </Link>
              <Link
                to="/conta/reviews"
                className={styles.mobileNavLink}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>📝</span>
                Minhas Reviews
              </Link>
              <button onClick={handleLogout} className={styles.mobileNavLink}>
                <span>🚪</span>
                Sair
              </button>
            </div>
          ) : (
            <div className={styles.mobileAuthButtons}>
              <Link
                to="/login"
                className={styles.mobileLoginButton}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Entrar
              </Link>
              <Link
                to="/register"
                className={styles.mobileRegisterButton}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Cadastrar
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
