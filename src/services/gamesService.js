class GamesService {
  constructor() {
    this.baseURL = this.getBaseURL();
  }

  getBaseURL() {
    if (
      typeof process !== "undefined" &&
      process.env &&
      process.env.REACT_APP_API_URL
    ) {
      return process.env.REACT_APP_API_URL;
    }
    return window.location.hostname === "localhost"
      ? "http://localhost:5000/api"
      : "/api";
  }
  // Buscar todos os jogos
  async getGames(params = {}) {
    try {
      const queryParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          queryParams.append(key, value);
        }
      });

      const response = await fetch(`${this.baseURL}/games?${queryParams}`);

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Debug: verificar o formato dos dados recebidos
      console.log("Dados recebidos do backend:", data);

      // Garantir que sempre retornamos um array
      const gamesArray = Array.isArray(data)
        ? data
        : data.games && Array.isArray(data.games)
        ? data.games
        : data.data && Array.isArray(data.data)
        ? data.data
        : [];

      return {
        success: true,
        data: gamesArray,
      };
    } catch (error) {
      console.error("Erro ao buscar jogos:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Buscar jogos em destaque
  async getFeaturedGames(params = {}) {
    try {
      const queryParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          queryParams.append(key, value);
        }
      });

      const response = await fetch(
        `${this.baseURL}/games/featured?${queryParams}`
      );

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Erro ao buscar jogos em destaque:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Buscar jogo por ID
  async getGame(id) {
    try {
      const response = await fetch(`${this.baseURL}/games/${id}`);

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Erro ao buscar jogo:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Criar novo jogo
  async createGame(gameData) {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${this.baseURL}/games`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(gameData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Erro ao criar jogo:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Atualizar jogo
  async updateGame(id, gameData) {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${this.baseURL}/games/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(gameData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Erro ao atualizar jogo:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Deletar jogo
  async deleteGame(id) {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${this.baseURL}/games/${id}`, {
        method: "DELETE",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ${response.status}`);
      }

      return {
        success: true,
        message: "Jogo deletado com sucesso",
      };
    } catch (error) {
      console.error("Erro ao deletar jogo:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }
}

export default new GamesService();
