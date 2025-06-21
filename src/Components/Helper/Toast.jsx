import React, { useState, useEffect } from "react";
import styles from "./Toast.module.css";

const Toast = ({ message, type = "info", duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose && onClose(), 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`${styles.toast} ${styles[type]} ${
        !isVisible ? styles.fadeOut : ""
      }`}
    >
      <div className={styles.content}>
        <span className={styles.message}>{message}</span>
        <button
          className={styles.closeButton}
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose && onClose(), 300);
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;
