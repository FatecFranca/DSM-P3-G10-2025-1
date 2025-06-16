import React from 'react';
import styles from './Input.module.css';

const Input = ({ 
  label, 
  name, 
  type, 
  value, 
  onChange, 
  error, 
  onBlur,
  placeholder,
  required = false
}) => {
  return (
    <div className={styles.wrapper}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          className={styles.textarea}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          rows={4}
        />
      ) : (
        <input
          id={name}
          name={name}
          className={styles.input}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
        />
      )}
      
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default Input;