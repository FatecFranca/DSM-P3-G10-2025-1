import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import UserIcon from './UserIcon';
import styles from './SideBar.module.css';

const SideBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    {
      path: '/conta',
      icon: '👤',
      label: 'Meu Perfil',
      description: 'Informações pessoais'
    },
    {
      path: '/conta/reviews',
      icon: '📝',
      label: 'Minhas Reviews',
      description: 'Reviews publicadas'
    },
    {
      path: '/conta/favoritos',
      icon: '❤️',
      label: 'Favoritos',
      description: 'Jogos favoritos'
    },
    {
      path: '/conta/configuracoes',
      icon: '⚙️',
      label: 'Configurações',
      description: 'Preferências da conta'
    },
    {
      path: '/conta/criar',
      icon: '➕',
      label: 'Criar Post',
      description: 'Adicionar novo jogo'
    }
  ];

  return (
    <>
      {/* Botão de toggle para mobile */}
      <button 
        className={styles.mobileToggle}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Abrir menu"
      >
        <span className={styles.hamburger}>
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      {/* Overlay para mobile */}
      {isMenuOpen && (
        <div 
          className={styles.overlay}
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <nav className={`${styles.sidebar} ${isMenuOpen ? styles.open : ''}`}>
        {/* Header do usuário */}
        <div className={styles.userHeader}>
          <div className={styles.avatarContainer}>
            {user?.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt={`Avatar de ${user.name}`}
                className={styles.userAvatar}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <UserIcon 
                initial={user?.name?.charAt(0)?.toUpperCase() || 'U'} 
                className={styles.userIcon}
              />
            )}
          </div>
          
          <div className={styles.userInfo}>
            <h3 className={styles.userName}>{user?.name || 'Usuário'}</h3>
            <p className={styles.userEmail}>{user?.email}</p>
          </div>
        </div>

        {/* Menu de navegação */}
        <div className={styles.navigation}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/conta'}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <div className={styles.navContent}>
                <span className={styles.navLabel}>{item.label}</span>
                <span className={styles.navDescription}>{item.description}</span>
              </div>
              <span className={styles.navArrow}>›</span>
            </NavLink>
          ))}
        </div>

        {/* Botão de logout */}
        <div className={styles.sidebarFooter}>
          <button 
            onClick={handleLogout}
            className={styles.logoutButton}
          >
            <span className={styles.logoutIcon}>🚪</span>
            <span>Sair da Conta</span>
          </button>
        </div>

        {/* Estatísticas rápidas */}
        <div className={styles.quickStats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>12</span>
            <span className={styles.statLabel}>Reviews</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>8</span>
            <span className={styles.statLabel}>Favoritos</span>
          </div>
        </div>
      </nav>
    </>
  );
};

export default SideBar;