class GamesService {
  constructor() {
    this.baseURL = this.getBaseURL();
  }

  getBaseURL() {
    if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
    return window.location.hostname === 'localhost' 
      ? 'http://localhost:3001/api'
      : '/api';
  }

  // Buscar todos os jogos
  async getGames(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          queryParams.append(key, value);
        }
      });

      const response = await fetch(`${this.baseURL}/games?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };

    } catch (error) {
      console.error('Erro ao buscar jogos:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Buscar jogos em destaque
  async getFeaturedGames(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          queryParams.append(key, value);
        }
      });

      const response = await fetch(`${this.baseURL}/games/featured?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };

    } catch (error) {
      console.error('Erro ao buscar jogos em destaque:', error);
      return {
        success: false,
        message: error.message
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
        data: data
      };

    } catch (error) {
      console.error('Erro ao buscar jogo:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }
}

export default new GamesService();