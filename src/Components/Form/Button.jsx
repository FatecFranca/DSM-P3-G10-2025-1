import React from 'react';
import styles from './Button.module.css';

const Button = ({ 
  children, 
  type = 'button', 
  disabled = false, 
  variant = 'primary',
  onClick,
  className = '',
  ...props 
}) => {
  const buttonClass = `${styles.button} ${styles[variant]} ${className}`;
  
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={buttonClass}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;