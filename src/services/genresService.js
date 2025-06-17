class GenresService {
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

  // Buscar todos os gêneros
  async getGenres(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          queryParams.append(key, value);
        }
      });

      const response = await fetch(`${this.baseURL}/genres?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };

    } catch (error) {
      console.error('Erro ao buscar gêneros:', error);
      // Fallback para gêneros padrão
      return {
        success: false,
        message: error.message,
        data: [
          'Ação', 'RPG', 'Estratégia', 'FPS', 'Aventura', 
          'Simulação', 'Terror', 'Indie', 'Corrida', 'Esporte'
        ]
      };
    }
  }

  // Buscar gêneros populares
  async getPopularGenres(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          queryParams.append(key, value);
        }
      });

      const response = await fetch(`${this.baseURL}/genres/popular?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };

    } catch (error) {
      console.error('Erro ao buscar gêneros populares:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Buscar gênero por ID
  async getGenre(id) {
    try {
      const response = await fetch(`${this.baseURL}/genres/${id}`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };

    } catch (error) {
      console.error('Erro ao buscar gênero:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }
}

export default new GenresService();