import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext deve ser usado dentro de um AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000/api";

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setAuthenticated(true);
        }
      } catch (error) {
        console.error("Erro ao inicializar auth:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/users`);

      if (!response.ok) {
        throw new Error(`Erro ao acessar usuários: ${response.status}`);
      }

      const users = await response.json();

      const foundUser = users.find(
        (u) => u.email && u.email.toLowerCase() === email.toLowerCase()
      );

      if (!foundUser) {
        const availableEmails = users.map((u) => u.email).filter(Boolean);
        throw new Error(
          `Usuário não encontrado. Emails disponíveis: ${availableEmails.join(
            ", "
          )}`
        );
      }

      if (foundUser.password && foundUser.password !== password) {
        throw new Error("Senha incorreta");
      }

      const token = `token-${foundUser.id}-${Date.now()}`;

      const userData = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      setAuthenticated(true);

      return { success: true, data: { token, user: userData } };
    } catch (error) {
      console.error("❌ Erro no login:", error);
      return { success: false, message: error.message };
    }
  };
  const register = async (userData) => {
    try {
      const usersResponse = await fetch(`${API_URL}/users`);

      if (usersResponse.ok) {
        const users = await usersResponse.json();
        const existingUser = users.find(
          (u) =>
            u.email && u.email.toLowerCase() === userData.email.toLowerCase()
        );

        if (existingUser) {
          throw new Error("Este email já está cadastrado");
        }
      }

      const newUser = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        createdAt: new Date().toISOString(),
      };

      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Erro da API:", errorText);
        throw new Error(`Erro ao criar usuário: ${response.status}`);
      }

      const createdUser = await response.json();

      const token = `token-${createdUser.id}-${Date.now()}`;

      const userForStorage = {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userForStorage));

      setUser(userForStorage);
      setAuthenticated(true);

      return { success: true, data: { token, user: userForStorage } };
    } catch (error) {
      console.error("❌ Erro no registro:", error);
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setAuthenticated(false);
    console.log("👋 Logout realizado");
  };

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // Função para buscar usuários (útil para debug)
  const getUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`);
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      return [];
    }
  };

  const value = {
    user,
    authenticated,
    loading,
    login,
    register,
    logout,
    getToken,
    getUsers, // Adicionar para debug
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
