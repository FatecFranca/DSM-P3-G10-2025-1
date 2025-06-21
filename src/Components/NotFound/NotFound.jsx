// src/Components/NotFound/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.errorCode}>404</div>
        <h1 className={styles.title}>Página não encontrada</h1>
        <p className={styles.description}>
          Ops! A página que você está procurando não existe ou foi movida.
        </p>
        <div className={styles.actions}>
          <Link to="/" className={styles.homeButton}>
            🏠 Voltar para Home
          </Link>
          <Link to="/jogos" className={styles.gamesButton}>
            🎮 Ver Jogos
          </Link>
        </div>
        <div className={styles.gameController}>🎮</div>
      </div>
    </div>
  );
};

export default NotFound;
