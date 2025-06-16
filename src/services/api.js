import axios from 'axios';

// Cria uma instância do axios com a configuração base
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Ajuste se necessário para outro ambiente
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para incluir o token de autorização em cada requisição
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gameReviews_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros comuns
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Se o erro for 401 (não autorizado), pode redirecionar para login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('gameReviews_token');
      localStorage.removeItem('gameReviews_user');
      // Se estiver usando React Router, poderia redirecionar para login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;