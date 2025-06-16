import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Componentes principais
import Home from './Components/Home';
import Header from './Components/Header';
import Footer from './Components/Footer';

// Componentes de autenticação
import Login from './Components/Login/Login';
import FormCadastro from './Components/Login/FormCadastro';

// Componentes de jogos
import GamesList from './Components/Games/GamesList';
import GenresList from './Components/Genres/GenresList';

// Componentes de usuário

import UserAccount from './Components/User/UserAccount';

// Componentes de reviews
import Reviews from './Components/Reviews/Reviews';
import ReviewDetail from './Components/Reviews/ReviewDetail';
import CreateReview from './Components/Reviews/CreateReview';

const App = () => {
  return (
    <AuthProvider>
      <div className="app">
        <BrowserRouter>
          <Header />
          <main className="main-content">
            <Routes>
              {/* Rota principal */}
              <Route path="/" element={<Home />} />
              
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
              {/* Outras rotas */}
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
};

export default App;