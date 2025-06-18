import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import UserIcon from "../User/UserIcon";
import styles from "./Header.module.css";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { authenticated, user, logout } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest(`.${styles.userSection}`)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isUserMenuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate("/");
  };

  const toggleUserMenu = (e) => {
    e.stopPropagation();
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const closeUserMenu = () => {
    setIsUserMenuOpen(false);
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>🎮</span>
          <span className={styles.logoText}>GameReviews</span>
        </Link>

        {/* Navegação */}
        <nav className={styles.nav}>
          <Link to="/jogos" className={styles.navLink}>
            <span className={styles.navIcon}>#</span>
            Jogos
          </Link>
          <Link to="/reviews" className={styles.navLink}>
            <span className={styles.navIcon}>📝</span>
            Reviews
          </Link>
          <Link to="/generos" className={styles.navLink}>
            <span className={styles.navIcon}>📊</span>
            Gêneros
          </Link>
        </nav>

        {/* Busca */}
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            placeholder="Buscar jogos, reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            <span className={styles.searchIcon}>🔍</span>
          </button>
        </form>

        {/* Área do usuário */}
        <div className={styles.userSection}>
          {authenticated ? (
            <div className={styles.userDropdown}>
              <button
                onClick={toggleUserMenu}
                className={styles.userButton}
                aria-expanded={isUserMenuOpen}
              >
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={`Avatar de ${user.name}`}
                    className={styles.userAvatar}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <UserIcon
                  initial={user?.name?.charAt(0)?.toUpperCase() || "U"}
                  size="small"
                  className={`${styles.userIcon} ${
                    user?.avatarUrl ? styles.hidden : ""
                  }`}
                />
                <span className={styles.dropdownArrow}>
                  {isUserMenuOpen ? "▲" : "▼"}
                </span>
              </button>

              {/* Menu dropdown */}
              {isUserMenuOpen && (
                <div className={styles.userMenu}>
                  <div className={styles.userMenuHeader}>
                    <div className={styles.userMenuAvatar}>
                      {user?.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={`Avatar de ${user.name}`}
                          className={styles.menuAvatar}
                        />
                      ) : (
                        <UserIcon
                          initial={user?.name?.charAt(0)?.toUpperCase() || "U"}
                          size="medium"
                        />
                      )}
                    </div>
                    <div className={styles.userMenuInfo}>
                      <h4 className={styles.userName}>
                        {user?.name || "Usuário"}
                      </h4>
                      <p className={styles.userEmail}>{user?.email}</p>
                    </div>
                  </div>

                  <div className={styles.userMenuDivider}></div>

                  <nav className={styles.userMenuNav}>
                    <Link
                      to="/conta"
                      className={styles.userMenuItem}
                      onClick={closeUserMenu}
                    >
                      <span className={styles.menuIcon}>👤</span>
                      <span>Meu Perfil</span>
                    </Link>
                    <Link
                      to="/conta/reviews"
                      className={styles.userMenuItem}
                      onClick={closeUserMenu}
                    >
                      <span className={styles.menuIcon}>📝</span>
                      <span>Minhas Reviews</span>
                    </Link>
                    <Link
                      to="/conta/favoritos"
                      className={styles.userMenuItem}
                      onClick={closeUserMenu}
                    >
                      <span className={styles.menuIcon}>❤️</span>
                      <span>Jogos Favoritos</span>
                    </Link>{" "}
                    <Link
                      to="/conta/configuracoes"
                      className={styles.userMenuItem}
                      onClick={closeUserMenu}
                    >
                      <span className={styles.menuIcon}>⚙️</span>
                      <span>Configurações</span>
                    </Link>
                    <Link
                      to="/admin/jogos"
                      className={styles.userMenuItem}
                      onClick={closeUserMenu}
                    >
                      <span className={styles.menuIcon}>🎮</span>
                      <span>Gerenciar Jogos</span>
                    </Link>
                  </nav>

                  <div className={styles.userMenuDivider}></div>

                  <button
                    onClick={handleLogout}
                    className={styles.logoutMenuItem}
                  >
                    <span className={styles.menuIcon}>🚪</span>
                    <span>Sair</span>
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
      </div>
    </header>
  );
};

export default Header;
