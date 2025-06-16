import axios from 'axios';

// Configuração da API com depuração aprimorada
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Ajuste para a URL correta do seu back-end
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000 // 10 segundos de timeout
});

// Interceptador para adicionar o token JWT nas requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptador para facilitar o debug de erros
api.interceptors.response.use(
  (response) => {
    return response;
  }, 
  (error) => {
    // Log detalhado do erro
    if (error.response) {
      // O servidor respondeu com um status de erro
      console.error('Erro na resposta da API:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('Sem resposta do servidor:', error.request);
    } else {
      // Erro na configuração da requisição
      console.error('Erro na configuração da requisição:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;