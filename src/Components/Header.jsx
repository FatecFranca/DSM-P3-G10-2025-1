import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import styles from "./Header.module.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthContext();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
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
    const query = e.target.elements.search.value.trim();
    if (query) {
      navigate(`/jogos/buscar?q=${encodeURIComponent(query)}`);
      setIsMenuOpen(false);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          GameReviews
        </Link>
        
        <button 
          className={`${styles.menuButton} ${isMenuOpen ? styles.active : ''}`} 
          onClick={toggleMenu}
          aria-label="Menu"
          aria-expanded={isMenuOpen}
        >
          <span className={styles.menuIcon}></span>
        </button>
        
        <nav className={`${styles.nav} ${isMenuOpen ? styles.active : ''}`}>
          <ul className={styles.navList}>
            <li>
              <Link to="/jogos" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Jogos</Link>
            </li>
            <li>
              <Link to="/reviews" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Reviews</Link>
            </li>
            <li>
              <Link to="/generos" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Gêneros</Link>
            </li>
          </ul>
          
          <div className={styles.searchContainer}>
            <form onSubmit={handleSearch}>
              <input 
                type="search" 
                name="search"
                placeholder="Buscar jogos..." 
                className={styles.searchInput}
              />
              <button 
                type="submit" 
                className={styles.searchButton}
                aria-label="Buscar"
              >
                🔍
              </button>
            </form>
          </div>
          
          <div className={styles.authContainer}>
            {isAuthenticated ? (
              <div className={styles.userDropdown}>
                <button 
                  className={styles.userButton} 
                  onClick={toggleDropdown}
                  aria-haspopup="true" 
                  aria-expanded={isDropdownOpen}
                >
                  <span className={styles.userName}>
                    {user?.name?.split(' ')[0] || 'Usuário'}
                  </span>
                  <span className={styles.userAvatar}>
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </button>
                
                {isDropdownOpen && (
                  <div className={styles.dropdownContent}>
                    <div className={styles.dropdownHeader}>
                      <strong>{user?.name || 'Usuário'}</strong>
                      <small>{user?.email || 'usuário@exemplo.com'}</small>
                    </div>
                    <Link to="/conta" className={styles.dropdownLink} onClick={() => {setIsDropdownOpen(false); setIsMenuOpen(false);}}>
                      Meu Perfil
                    </Link>
                    <Link to="/conta/reviews" className={styles.dropdownLink} onClick={() => {setIsDropdownOpen(false); setIsMenuOpen(false);}}>
                      Minhas Reviews
                    </Link>
                    <Link to="/conta/favoritos" className={styles.dropdownLink} onClick={() => {setIsDropdownOpen(false); setIsMenuOpen(false);}}>
                      Jogos Favoritos
                    </Link>
                    <button onClick={handleLogout} className={styles.logoutButton}>
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.loginButtons}>
                <Link to="/login" className={styles.loginLink} onClick={() => setIsMenuOpen(false)}>
                  Entrar
                </Link>
                <Link to="/registro" className={styles.registerLink} onClick={() => setIsMenuOpen(false)}>
                  Registrar
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