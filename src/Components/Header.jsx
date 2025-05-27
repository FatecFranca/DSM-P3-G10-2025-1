import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <nav className={`${styles.nav} container`}>
        <Link className={styles.logo} to="/">
          <h2 className="logo">GameReview</h2>
        </Link>
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
