import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  
  // Controla o efeito de scroll no header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Fecha o menu quando a rota muda
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location]);
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Implementar lógica de busca
    console.log(`Buscando por: ${searchQuery}`);
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <Link className={styles.logoLink} to="/" aria-label="GameReviews - Página Inicial">
          <div className={styles.logoIcon}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path 
                d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                fill="currentColor"
                fillOpacity="0.1"
              />
              <circle 
                cx="12" 
                cy="12" 
                r="3" 
                stroke="currentColor" 
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
          <h1 className={styles.logoText}>GameReviews</h1>
        </Link>
        
        <div className={styles.navbarActions}>
          <button 
            className={styles.searchToggle} 
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Buscar no site"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          
          <button 
            className={`${styles.mobileMenuBtn} ${menuOpen ? styles.open : ''}`} 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
          >
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
            <span className={styles.hamburgerLine}></span>
          </button>
        </div>
        
        <div className={`${styles.navWrapper} ${menuOpen ? styles.active : ''}`}>
          <nav className={styles.mainNav}>
            <ul className={styles.navLinks}>
              <li className={location.pathname === "/" ? styles.active : ""}>
                <Link to="/">Home</Link>
              </li>
              <li className={location.pathname.includes("/reviews") ? styles.active : ""}>
                <Link to="/reviews">Reviews</Link>
              </li>
              <li className={location.pathname.includes("/noticias") ? styles.active : ""}>
                <Link to="/noticias">Notícias</Link>
              </li>
              <li className={location.pathname.includes("/top-games") ? styles.active : ""}>
                <Link to="/top-games">Top Games</Link>
              </li>
              <li className={location.pathname.includes("/lancamentos") ? styles.active : ""}>
                <Link to="/lancamentos">Lançamentos</Link>
              </li>
              <li className={styles.dropdown}>
                <button className={styles.dropdownToggle}>
                  Categorias
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <ul className={styles.dropdownMenu}>
                  <li><Link to="/categoria/acao">Ação & Aventura</Link></li>
                  <li><Link to="/categoria/rpg">RPG & MMO</Link></li>
                  <li><Link to="/categoria/fps">FPS & Shooter</Link></li>
                  <li><Link to="/categoria/estrategia">Estratégia</Link></li>
                  <li><Link to="/categoria/indie">Indie Games</Link></li>
                </ul>
              </li>
            </ul>
          </nav>
          
          <div className={styles.authButtons}>
            <Link className={styles.loginBtn} to="/login">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Login
            </Link>
            <Link className={styles.signupBtn} to="/login/cadastro">
              Cadastrar
            </Link>
          </div>
        </div>
        
        <div className={`${styles.searchOverlay} ${searchOpen ? styles.active : ''}`}>
          <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              placeholder="Buscar jogos, notícias, reviews..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus={searchOpen}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <button 
              type="button" 
              className={styles.closeSearch}
              onClick={() => setSearchOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;
