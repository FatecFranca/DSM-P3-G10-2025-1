import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
  const [search, setSearch] = React.useState("");
  const [accountPage, setAccountPage] = React.useState(false);
  const location = useLocation();
  const handleSearch = (event) => {
    setSearch(event.target.value);
  };
  React.useEffect(() => {
    setAccountPage(location.pathname.startsWith("/login") || location.pathname.startsWith("/conta"));
  }, [location.pathname]);
  return (
    <header className={styles.header}>
      <nav className={`${styles.nav} container`}>
        <Link className={styles.logo} to="/">
          <h2 className="logo">GameReview</h2>
        </Link>
        {!accountPage && (
          <div className={styles.buscarWrapper}>
            <span className={styles.iconeBuscar}></span>
            <input
              className={styles.buscar}
              type="text"
              name="search"
              value={search}
              onChange={handleSearch}
            />
          </div>
        )}
        <ul className={styles.navigation}>
          <Link className={styles.login} to="/login">
            Login
          </Link>
          <Link className={styles.cadastro} to="/login/cadastro">
            Cadastro
          </Link>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
