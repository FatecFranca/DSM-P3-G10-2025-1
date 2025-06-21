import React from 'react';
import styles from './UserIcon.module.css';

const UserIcon = ({ initial, size = 'medium', className = '', onClick }) => {
  const sizeClass = styles[size] || styles.medium;
  
  return (
    <div 
      className={`${styles.userIcon} ${sizeClass} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <span className={styles.initial}>
        {initial || '?'}
      </span>
    </div>
  );
};

export default UserIcon;
