import axios from 'axios';

// Cliente API com timeout mais longo e tratamento de erro
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // Aumentar o tempo limite para diagnóstico
  timeout: 10000 
});

// Interceptor para adicionar o token nas requisições
api.interceptors.request.use(
  (config) => {
    console.log(`Fazendo requisição para: ${config.url}`);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Erro na configuração da requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => {
    console.log(`Resposta recebida de: ${response.config.url}`, response.status);
    return response;
  },
  (error) => {
    if (error.response) {
      // O servidor respondeu com um código de erro
      console.error(`Erro ${error.response.status} em ${error.config?.url}:`, error.response.data);
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('Sem resposta do servidor:', error.message);
    } else {
      // Erro na configuração da requisição
      console.error('Erro de requisição:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;