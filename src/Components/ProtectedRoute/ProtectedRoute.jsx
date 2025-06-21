import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import styles from "./ProtectedRoute.module.css";

const ProtectedRoute = ({ children }) => {
  const { authenticated, loading } = useAuthContext();

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <div className={styles.loadingContent}>
          <h3>Verificando autenticação...</h3>
          <p>Aguarde um momento</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
