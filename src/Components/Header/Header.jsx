import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import UserIcon from "../User/UserIcon";
import styles from "./Header.module.css";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
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
  const handleMobileSearch = (e) => {
    e.preventDefault();
    if (mobileSearchQuery.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(mobileSearchQuery.trim())}`);
      setMobileSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
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
              <li>
                <Link to="/reviews" className={styles.navLink}>
                  Reviews
                </Link>
              </li>
              {authenticated && (
                <li>
                  <Link to="/admin/jogos" className={styles.navLink}>
                    Admin Jogos
                  </Link>
                </li>
              )}
            </ul>
          </nav>
          {/* Busca Desktop */}
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              type="text"
              placeholder="Buscar jogos, reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              🔍
            </button>
          </form>{" "}
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
                    <Link
                      to="/conta/reviews"
                      className={styles.dropdownItem}
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      📝 Minhas Reviews
                    </Link>
                    {user?.role === "admin" && (
                      <Link
                        to="/admin/jogos"
                        className={styles.dropdownItem}
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        ⚙️ Admin Jogos
                      </Link>
                    )}
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
        </button>

        {/* Busca mobile */}
        <form onSubmit={handleMobileSearch} className={styles.mobileSearchForm}>
          <input
            type="text"
            placeholder="Buscar jogos, reviews..."
            value={mobileSearchQuery}
            onChange={(e) => setMobileSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            🔍
          </button>
        </form>

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
          <li>
            <Link
              to="/reviews"
              className={styles.mobileNavLink}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>📝</span>
              Reviews{" "}
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
                Admin Jogos
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
