import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import SideBar from './SideBar';
import UserProfile from './UserProfile';
import UserReviews from './UserReviews';
import UserFavorites from './UserFavorites';
import UserSettings from './UserSettings';
import GamePost from './GamePost';
import styles from './User.module.css';

const User = () => {
  const { authenticated, loading } = useAuthContext();

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Carregando...</p>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={styles.userContainer}>
      <div className={styles.container}>
        <SideBar />
        
        <main className={styles.mainContent}>
          <Routes>
            <Route path="/" element={<UserProfile />} />
            <Route path="/reviews" element={<UserReviews />} />
            <Route path="/favoritos" element={<UserFavorites />} />
            <Route path="/configuracoes" element={<UserSettings />} />
            <Route path="/criar" element={<GamePost />} />
            <Route path="*" element={<Navigate to="/conta" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default User;