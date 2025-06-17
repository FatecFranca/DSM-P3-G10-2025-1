import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import UserProfile from './UserProfile';
import UserReviews from './UserReviews';
import UserFavorites from './UserFavorites';
import UserSettings from './UserSettings';
import styles from './UserAccount.module.css';

const UserAccount = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const { user, authenticated, logout } = useAuthContext();
  const navigate = useNavigate();

  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (!authenticated) {
      navigate('/login');
    }
  }, [authenticated, navigate]);

  if (!user) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Carregando dados do usuário...</p>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'profile', label: 'Meu Perfil', icon: '👤' },
    { id: 'reviews', label: 'Minhas Reviews', icon: '📝' },
    { id: 'favorites', label: 'Jogos Favoritos', icon: '❤️' },
    { id: 'settings', label: 'Configurações', icon: '⚙️' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <UserProfile user={user} />;
      case 'reviews':
        return <UserReviews userId={user.id} />;
      case 'favorites':
        return <UserFavorites userId={user.id} />;
      case 'settings':
        return <UserSettings user={user} />;
      default:
        return <UserProfile user={user} />;
    }
  };

  return (
    <div className={styles.userAccountContainer}>
      <div className={styles.container}>
        {/* Header da conta */}
        <div className={styles.accountHeader}>
          <div className={styles.userInfo}>
            <div className={styles.avatarContainer}>
              {user.avatarUrl ? (
                <img 
                  src={user.avatarUrl} 
                  alt={`Avatar de ${user.name}`}
                  className={styles.userAvatar}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=FF4F59&color=fff&size=120`;
                  }}
                />
              ) : (
                <div className={styles.avatarFallback}>
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div className={styles.userDetails}>
              <h1 className={styles.userName}>{user.name}</h1>
              <p className={styles.userEmail}>{user.email}</p>
              {user.bio && <p className={styles.userBio}>{user.bio}</p>}
              <div className={styles.userStats}>
                <span className={styles.stat}>
                  <strong>12</strong> Reviews
                </span>
                <span className={styles.stat}>
                  <strong>8</strong> Favoritos
                </span>
                <span className={styles.stat}>
                  Membro desde <strong>{new Date(user.createdAt).getFullYear()}</strong>
                </span>
              </div>
            </div>
          </div>
          
          <button 
            className={styles.logoutButton}
            onClick={handleLogout}
            title="Sair da conta"
          >
            <span className={styles.logoutIcon}>🚪</span>
            Sair
          </button>
        </div>

        {/* Navegação por abas */}
        <nav className={styles.tabNavigation}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Conteúdo da aba ativa */}
        <div className={styles.tabContent}>
          {loading ? (
            <div className={styles.tabLoading}>
              <div className={styles.spinner}></div>
              <p>Carregando...</p>
            </div>
          ) : (
            renderTabContent()
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAccount;