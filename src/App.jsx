import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./Components/Header/Header";
import Home from "./Components/Home/Home"; // CORRIGIDO: adicionar /Home
import Login from "./Components/Login/Login";
import User from "./Components/User/User";
import Reviews from "./Components/Reviews/Reviews"; // NOVO: Importar Reviews
import GameManager from "./Components/Games/GameManager"; // NOVO: Importar GameManager
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import Footer from "./Components/Footer/Footer";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div
          className="App"
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Header />
          <main style={{ paddingTop: "70px", flex: "1" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login initialMode="login" />} />
              <Route
                path="/register"
                element={<Login initialMode="register" />}
              />
              <Route
                path="/cadastro"
                element={<Login initialMode="register" />}
              />
              <Route
                path="/conta/*"
                element={
                  <ProtectedRoute>
                    <User />
                  </ProtectedRoute>
                }
              />

              {/* NOVO: Rota para gerenciar jogos (protegida) */}
              <Route
                path="/admin/jogos"
                element={
                  <ProtectedRoute>
                    <GameManager />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/jogos"
                element={
                  <div
                    style={{
                      padding: "4rem 2rem",
                      textAlign: "center",
                      minHeight: "60vh",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <h1
                      style={{
                        color: "#ff4f59",
                        marginBottom: "1rem",
                        fontSize: "3rem",
                      }}
                    >
                      🎮
                    </h1>
                    <h2>Catálogo de Jogos</h2>
                    <p style={{ color: "#666" }}>Em desenvolvimento...</p>
                  </div>
                }
              />

              {/* ATUALIZADO: Rota Reviews com componente real */}
              <Route path="/reviews" element={<Reviews />} />

              <Route
                path="/generos"
                element={
                  <div
                    style={{
                      padding: "4rem 2rem",
                      textAlign: "center",
                      minHeight: "60vh",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <h1
                      style={{
                        color: "#ff4f59",
                        marginBottom: "1rem",
                        fontSize: "3rem",
                      }}
                    >
                      📊
                    </h1>
                    <h2>Gêneros de Jogos</h2>
                    <p style={{ color: "#666" }}>Em desenvolvimento...</p>
                  </div>
                }
              />

              <Route
                path="*"
                element={
                  <div
                    style={{
                      padding: "4rem 2rem",
                      textAlign: "center",
                      minHeight: "60vh",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <h1
                      style={{
                        fontSize: "4rem",
                        color: "#ff4f59",
                        marginBottom: "1rem",
                      }}
                    >
                      404
                    </h1>
                    <h2>Página não encontrada</h2>
                    <a
                      href="/"
                      style={{
                        background: "linear-gradient(135deg, #ff4f59, #ff7f35)",
                        color: "white",
                        textDecoration: "none",
                        padding: "1rem 2rem",
                        borderRadius: "8px",
                        fontWeight: "500",
                      }}
                    >
                      Voltar ao início
                    </a>
                  </div>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
