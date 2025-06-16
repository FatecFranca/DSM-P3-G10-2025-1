import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import styles from "./Header.module.css";

// Ícones (você pode usar uma biblioteca como react-icons ou importar SVGs)
const Icons = {
  Games: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 5v2"></path><path d="M9 5v6"></path><path d="M15 11v6"></path><path d="M9 17v2"></path><path d="M5 9h14"></path><path d="M5 15h14"></path>
    </svg>
  ),
  Reviews: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  ),
  Genres: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
  ),
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path>
    </svg>
  ),
  Profile: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className={styles.profileIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
  MyReviews: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className={styles.dropdownIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path><path d="M16 13H8"></path><path d="M16 17H8"></path><path d="M10 9H8"></path>
    </svg>
  ),
  Favorites: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className={styles.dropdownIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  ),
  Logout: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className={styles.dropdownIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  )
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { authenticated, user, logout } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  // Detectar scroll para mudar estilo do header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fechar menu quando mudar de página
  useEffect(() => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

  // Verificar se o link está ativo
  const isLinkActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isDropdownOpen) setIsDropdownOpen(false);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/jogos/buscar?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue("");
      setIsMenuOpen(false);
    }
  };

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const closeDropdown = () => {
      if (isDropdownOpen) setIsDropdownOpen(false);
    };

    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, [isDropdownOpen]);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo} aria-label="GameReviews - Página inicial">
          <span className={styles.logoIcon}>🎮</span>
          <span className={styles.logoText}>GameReviews</span>
        </Link>
        
        <button 
          className={`${styles.menuButton} ${isMenuOpen ? styles.active : ''}`} 
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isMenuOpen}
        >
          <span className={styles.menuIconBar}></span>
          <span className={styles.menuIconBar}></span>
          <span className={styles.menuIconBar}></span>
        </button>
        
        <nav 
          className={`${styles.nav} ${isMenuOpen ? styles.active : ''}`}
          aria-label="Menu principal"
        >
          <ul className={styles.navList}>
            <li>
              <Link 
                to="/jogos" 
                className={`${styles.navLink} ${isLinkActive('/jogos') ? styles.active : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Icons.Games />
                <span>Jogos</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/reviews" 
                className={`${styles.navLink} ${isLinkActive('/reviews') ? styles.active : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Icons.Reviews />
                <span>Reviews</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/generos" 
                className={`${styles.navLink} ${isLinkActive('/generos') ? styles.active : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Icons.Genres />
                <span>Gêneros</span>
              </Link>
            </li>
          </ul>
          
          <div className={styles.searchContainer}>
            <form onSubmit={handleSearch} role="search">
              <div className={styles.searchInputWrapper}>
                <input 
                  type="search" 
                  name="search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Buscar jogos, reviews..." 
                  className={styles.searchInput}
                  aria-label="Buscar no site"
                />
                <button 
                  type="submit" 
                  className={styles.searchButton}
                  aria-label="Buscar"
                  disabled={!searchValue.trim()}
                >
                  <Icons.Search />
                </button>
              </div>
            </form>
          </div>
          
          <div className={styles.authContainer}>
            {authenticated ? (
              <div className={styles.userDropdown} onClick={(e) => e.stopPropagation()}>
                <button 
                  className={`${styles.userButton} ${isDropdownOpen ? styles.active : ''}`}
                  onClick={toggleDropdown}
                  aria-haspopup="true" 
                  aria-expanded={isDropdownOpen}
                >
                  {user?.avatarUrl ? (
                    <img 
                      src={user.avatarUrl} 
                      alt={`Avatar de ${user.name}`} 
                      className={styles.userAvatar} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=FF4F59&color=fff`;
                      }}
                    />
                  ) : (
                    <div className={styles.userAvatarFallback}>
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className={styles.userName}>
                    {user?.name?.split(' ')[0] || 'Usuário'}
                  </span>
                  <span className={`${styles.dropdownArrow} ${isDropdownOpen ? styles.up : ''}`}></span>
                </button>
                
                {isDropdownOpen && (
                  <div 
                    className={styles.dropdownContent}
                    role="menu"
                  >
                    <div className={styles.dropdownHeader}>
                      <div className={styles.dropdownAvatar}>
                        {user?.avatarUrl ? (
                          <img 
                            src={user.avatarUrl} 
                            alt={`Avatar de ${user.name}`}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=FF4F59&color=fff`;
                            }}
                          />
                        ) : (
                          <div className={styles.avatarFallback}>
                            {user?.name?.charAt(0) || 'U'}
                          </div>
                        )}
                      </div>
                      <div className={styles.dropdownUserInfo}>
                        <strong className={styles.dropdownUserName}>
                          {user?.name || 'Usuário'}
                        </strong>
                        <span className={styles.dropdownUserEmail}>
                          {user?.email || 'usuário@exemplo.com'}
                        </span>
                      </div>
                    </div>
                    
                    <div className={styles.dropdownDivider}></div>
                    
                    <Link 
                      to="/conta" 
                      className={`${styles.dropdownLink} ${isLinkActive('/conta') && !isLinkActive('/conta/reviews') && !isLinkActive('/conta/favoritos') ? styles.active : ''}`} 
                      role="menuitem"
                    >
                      <Icons.Profile />
                      <span>Meu Perfil</span>
                    </Link>
                    <Link 
                      to="/conta/reviews" 
                      className={`${styles.dropdownLink} ${isLinkActive('/conta/reviews') ? styles.active : ''}`}
                      role="menuitem"
                    >
                      <Icons.MyReviews />
                      <span>Minhas Reviews</span>
                    </Link>
                    <Link 
                      to="/conta/favoritos" 
                      className={`${styles.dropdownLink} ${isLinkActive('/conta/favoritos') ? styles.active : ''}`}
                      role="menuitem"
                    >
                      <Icons.Favorites />
                      <span>Jogos Favoritos</span>
                    </Link>
                    
                    <div className={styles.dropdownDivider}></div>
                    
                    <button 
                      onClick={handleLogout} 
                      className={styles.logoutButton}
                      role="menuitem"
                    >
                      <Icons.Logout />
                      <span>Sair</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.loginButtons}>
                <Link to="/login" className={styles.loginLink}>
                  Entrar
                </Link>
                <Link to="/registro" className={styles.registerLink}>
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;