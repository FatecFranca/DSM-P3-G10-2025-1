import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuthContext } from './context/AuthContext';
import Home from './Components/Home';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Login from './Components/Login/Login';
import User from './Components/User/User';
import GamePage from './Components/Games/GamePage';
import Reviews from './Components/Reviews/Reviews';
// Corrigindo a importação do ToastContainer
import { ToastContainer } from 'react-toastify';
// Importando o CSS do react-toastify
import 'react-toastify/dist/ReactToastify.css';

// Componente de rota protegida
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthContext();
  
  if (loading) {
    return <div>Carregando...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <div>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login/*" element={<Login />} />
            <Route path="/conta/*" element={
              <ProtectedRoute>
                <User />
              </ProtectedRoute>
            } />
            <Route path="/jogo/:id" element={<GamePage />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/genero/:slug" element={<Reviews />} />
            <Route path="*" element={<div>Página não encontrada</div>} />
          </Routes>
          <Footer />
        </BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </AuthProvider>
  );
};

export default App;