import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { ReviewProvider } from "./context/ReviewContext";
import { ToastProvider } from "./context/ToastContext";
import { ModalProvider } from "./context/ModalContext";
import Header from "./Components/Header/Header";
import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";
import User from "./Components/User/User";
import GameManager from "./Components/Games/GameManager";
import GamesList from "./Components/Games/GamesList";
import GamePage from "./Components/Games/GamePage";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import Footer from "./Components/Footer/Footer";
import Toast from "./Components/Toast/Toast";
import Modal from "./Components/Modal/Modal";

function App() {
  return (
    <AuthProvider>
      <ReviewProvider>
        <FavoritesProvider>
          <ToastProvider>
            <ModalProvider>
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
                    {" "}
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route
                        path="/login"
                        element={<Login initialMode="login" />}
                      />
                      <Route
                        path="/register"
                        element={<Login initialMode="register" />}
                      />{" "}
                      <Route
                        path="/cadastro"
                        element={<Login initialMode="register" />}
                      />
                      <Route path="/conta" element={<User />} />
                      <Route
                        path="/admin/jogos"
                        element={
                          <ProtectedRoute>
                            <GameManager />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="/jogo/:id" element={<GamePage />} />
                      <Route path="/jogos" element={<GamesList />} />
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
                                background:
                                  "linear-gradient(135deg, #ff4f59, #ff7f35)",
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
                      />{" "}
                    </Routes>
                  </main>{" "}
                  <Footer />
                  <Toast />
                  <Modal />
                </div>
              </Router>
            </ModalProvider>
          </ToastProvider>
        </FavoritesProvider>
      </ReviewProvider>
    </AuthProvider>
  );
}

export default App;
