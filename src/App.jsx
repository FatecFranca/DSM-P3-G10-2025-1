import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Componentes principais
import Home from './Components/Home';
import Header from './Components/Header';
import Footer from './Components/Footer';
import ErrorBoundary from './Components/Helper/ErrorBoundary';

// Componentes de autenticação
import Login from './Components/Login/Login';
import FormCadastro from './Components/Login/FormCadastro';

// Componentes de jogos
import GamesList from './Components/Games/GamesList';
import GenresList from './Components/Genres/GenresList';

// Componentes de reviews
import Reviews from './Components/Reviews/Reviews';
import ReviewDetail from './Components/Reviews/ReviewDetail';
import CreateReview from './Components/Reviews/CreateReview';

// Componentes de usuário
import UserAccount from './Components/User/UserAccount';

const App = () => {
  const [appLoading, setAppLoading] = useState(true);
  
  // Verificação inicial da aplicação
  useEffect(() => {
    // Simula algum carregamento inicial
    setTimeout(() => {
      setAppLoading(false);
    }, 500);
  }, []);

  if (appLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Carregando aplicação...</div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="app">
          <BrowserRouter>
            <Header />
            <main className="main-content">
              <ErrorBoundary>
                <Routes>
                  {/* Rota principal */}
                  <Route path="/" element={
                    <ErrorBoundary fallback={<div>Erro ao carregar a Home</div>}>
                      <Home />
                    </ErrorBoundary>
                  } />
                  
                  {/* Rotas de autenticação */}
                  <Route path="/login" element={<Login initialMode="login" />} />
                  <Route path="/registro" element={<FormCadastro />} />
                  
                  {/* Rotas de jogos */}
                  <Route path="/jogos" element={<GamesList />} />
                  <Route path="/generos" element={<GenresList />} />
                  
                  {/* Rotas de reviews */}
                  <Route path="/reviews" element={<Reviews />} />
                  <Route path="/review/:id" element={<ReviewDetail />} />
                  <Route path="/criar/review" element={<CreateReview />} />
                  
                  {/* Rotas de usuário */}
                  <Route path="/conta" element={<UserAccount />} />
                  
                  {/* Rota para página não encontrada */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </ErrorBoundary>
            </main>
            <Footer />
          </BrowserRouter>
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;