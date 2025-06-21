import React, { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import UserProfile from './UserProfile';
import UserReviews from './UserReviews';
import UserFavorites from './UserFavorites';
import UserSettings from './UserSettings';
import styles from './User.module.css';

const User = () => {
  const { user, authenticated, loading } = useAuthContext();
  const [activeTab, setActiveTab] = useState('perfil');

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>⏳ Carregando...</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>
          <h2>🔒 Acesso Negado</h2>
          <p>Você precisa estar logado para acessar esta página.</p>
          <a href="/login" className={styles.loginLink}>
            Fazer Login
          </a>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'perfil':
        return <UserProfile />;
      case 'reviews':
        return <UserReviews />;
      case 'favoritos':
        return <UserFavorites />;
      case 'configuracoes':
        return <UserSettings />;
      default:
        return <UserProfile />;
    }
  };

  return (
    <div className={styles.userContainer}>
      <div className={styles.container}>
        {}
        <div className={styles.userHeader}>
          <h1>👤 Área do Usuário</h1>
          <p>Bem-vindo, {user?.name}!</p>
        </div>

        <div className={styles.tabsContainer}>
          <button 
            className={`${styles.tab} ${activeTab === 'perfil' ? styles.active : ''}`}
            onClick={() => setActiveTab('perfil')}
          >
            👤 Perfil
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'reviews' ? styles.active : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            ⭐ Minhas Reviews
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'favoritos' ? styles.active : ''}`}
            onClick={() => setActiveTab('favoritos')}
          >
            ❤️ Favoritos
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'configuracoes' ? styles.active : ''}`}
            onClick={() => setActiveTab('configuracoes')}
          >
            ⚙️ Configurações
          </button>
        </div>

        <div className={styles.mainContent}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default User;
